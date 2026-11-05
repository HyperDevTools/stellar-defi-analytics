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
});
