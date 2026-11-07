import { DataExporter } from '@/lib/export/dataExporter';

describe('DataExporter (#7)', () => {
  const exporter = new DataExporter();
  const baseRange = {
    start: new Date('2026-11-01T00:00:00Z'),
    end: new Date('2026-11-10T00:00:00Z'),
  };

  it('exports CSV, CoinTracker tax CSV, JSON, and PDF formats', async () => {
    const data = await exporter.fetchData({
      format: 'tax',
      dataType: 'transactions',
      dateRange: baseRange,
    });
    expect(data).toHaveLength(2);

    const taxCsv = exporter.formatData(data, 'tax');
    expect(taxCsv).toContain(
      'Date,Received Quantity,Received Currency,Sent Quantity,Sent Currency,Fee Amount,Fee Currency,Tag',
    );
    expect(taxCsv).toContain('2026-11-03T12:00:00Z,1000,XLM,120,USDC,0.01,XLM,Trade');

    const jsonStr = exporter.formatData(data, 'json');
    expect(JSON.parse(jsonStr)).toHaveLength(2);

    const pdfStr = exporter.formatData(data, 'pdf', 'tax');
    expect(pdfStr).toContain('%PDF-1.4');

    const blob = await exporter.export({
      format: 'csv',
      dataType: 'transactions',
      dateRange: baseRange,
      filters: { assets: ['XLM'] },
    });
    expect(blob.size).toBeGreaterThan(20);
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
