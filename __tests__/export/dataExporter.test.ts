import { expect } from '@jest/globals';
import { DataExporter, type ExportConfig } from '@/lib/export/dataExporter';

const config: ExportConfig = {
  format: 'json',
  dataType: 'transactions',
  dateRange: {
    start: new Date('2026-11-01T00:00:00Z'),
    end: new Date('2026-11-10T00:00:00Z'),
  },
};

describe('DataExporter', () => {
  it('exports no synthetic records when no transactions were supplied', async () => {
    const exporter = new DataExporter();
    const data = await exporter.fetchData(config);
    expect(data).toEqual([]);
    expect(exporter.toJson(data)).toBe('[]');
    expect(exporter.toCsv(data).split('\n')).toHaveLength(1);
    expect(exporter.toTaxFormat(data)).toBe(
      'Date,Received Quantity,Received Currency,Sent Quantity,Sent Currency,Fee Amount,Fee Currency,Tag',
    );
  });

  it('formats caller-supplied records and applies the configured filters', async () => {
    const exporter = new DataExporter([
      {
        date: '2026-11-03T12:00:00Z',
        receivedQuantity: 12,
        receivedCurrency: 'XLM',
        sentQuantity: 2,
        sentCurrency: 'USDC',
        feeAmount: 0.01,
        feeCurrency: 'XLM',
        tag: 'Trade',
        protocol: 'Aquarius',
      },
    ]);
    const data = await exporter.fetchData({ ...config, filters: { assets: ['xlm'] } });
    expect(data).toHaveLength(1);
    expect(exporter.toTaxFormat(data)).toContain('2026-11-03T12:00:00Z,12,XLM,2,USDC,0.01,XLM,Trade');
    expect(JSON.parse(exporter.toJson(data))).toEqual(data);
    await expect(exporter.fetchData({ ...config, filters: { assets: ['AQUA'] } })).resolves.toEqual([]);
  });

  it('rejects PDF export with a clear error', async () => {
    await expect(new DataExporter().export({ ...config, format: 'pdf' })).rejects.toThrow(
      /PDF export is unavailable/,
    );
  });

  it('neutralizes spreadsheet formulas in both CSV formats without modifying JSON or numbers', () => {
    const transaction = {
      date: '2026-11-03T12:00:00Z',
      receivedQuantity: -12,
      receivedCurrency: '=HYPERLINK("https://example.com", "click")',
      sentQuantity: 5,
      sentCurrency: '\t+SUM(1,2)',
      feeAmount: -0.01,
      feeCurrency: ' @cmd',
      tag: '-1+2',
      protocol: 'normal,quoted "value"',
    };

    for (const format of ['csv', 'tax'] as const) {
      const row = exporter.formatData([transaction], format).split('\n')[1];
      expect(row).toContain('-12');
      expect(row).toContain('-0.01');
      expect(row).toContain('"\'=HYPERLINK(""https://example.com"", ""click"")"');
      expect(row).toContain('"\'\t+SUM(1,2)"');
      expect(row).toContain("' @cmd");
      expect(row).toContain("'-1+2");
      expect(row.includes("'-12")).toEqual(false);
    }
    expect(JSON.parse(exporter.formatData([transaction], 'json'))[0]).toEqual(transaction);
  });

  it('preserves ordinary CSV text and quotes control-character formula prefixes', () => {
    const record = {
      date: '2026-11-03T12:00:00Z',
      receivedQuantity: 1,
      receivedCurrency: 'XLM',
      sentQuantity: 2,
      sentCurrency: 'USDC',
      feeAmount: 0,
      feeCurrency: 'XLM',
      tag: '\t=1',
      protocol: 'regular,\nwith "quotes"',
    };

    const csv = exporter.toCsv([record]);
    expect(csv).toContain('"\'\t=1"');
    expect(csv).toContain('"regular,\nwith ""quotes"""');
    expect(exporter.toTaxFormat([record])).toContain('"\'\t=1"');
  });
});
