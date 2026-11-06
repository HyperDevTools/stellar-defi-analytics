export interface ExportConfig {
  format: 'csv' | 'json' | 'pdf' | 'tax';
  dataType: 'transactions' | 'portfolio' | 'pnl' | 'fees' | 'rewards';
  dateRange: {
    start: Date;
    end: Date;
  };
  filters?: {
    assets?: string[];
    protocols?: string[];
    minAmount?: number;
  };
  template?: 'tax' | 'performance' | 'annual' | 'custom';
}

export interface ExportableTransaction {
  date: string;
  receivedQuantity: number;
  receivedCurrency: string;
  sentQuantity: number;
  sentCurrency: string;
  feeAmount: number;
  feeCurrency: string;
  tag: string;
  protocol?: string;
}

function escapeCsvCell(value: unknown): string {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export class DataExporter {
  private records: ExportableTransaction[];

  constructor(records?: ExportableTransaction[]) {
    this.records = records ?? [
      {
        date: '2026-11-03T12:00:00Z',
        receivedQuantity: 1000,
        receivedCurrency: 'XLM',
        sentQuantity: 120,
        sentCurrency: 'USDC',
        feeAmount: 0.01,
        feeCurrency: 'XLM',
        tag: 'Trade',
        protocol: 'Aquarius',
      },
      {
        date: '2026-11-04T15:30:00Z',
        receivedQuantity: 45,
        receivedCurrency: 'AQUA',
        sentQuantity: 0,
        sentCurrency: '',
        feeAmount: 0.005,
        feeCurrency: 'XLM',
        tag: 'Reward',
        protocol: 'Aquarius',
      },
    ];
  }

  async export(config: ExportConfig): Promise<Blob> {
    const data = await this.fetchData(config);
    const formatted = this.formatData(data, config.format, config.template);
    return this.createBlob(formatted, config.format);
  }

  async fetchData(config: ExportConfig): Promise<ExportableTransaction[]> {
    const startMs = config.dateRange.start.getTime();
    const endMs = config.dateRange.end.getTime();

    return this.records.filter((r) => {
      const ts = new Date(r.date).getTime();
      if (ts < startMs || ts > endMs) return false;
      if (config.filters?.assets && config.filters.assets.length > 0) {
        const set = new Set(config.filters.assets.map((a) => a.toUpperCase()));
        if (!set.has(r.receivedCurrency.toUpperCase()) && !set.has(r.sentCurrency.toUpperCase())) {
          return false;
        }
      }
      if (config.filters?.protocols && config.filters.protocols.length > 0 && r.protocol) {
        const pset = new Set(config.filters.protocols.map((p) => p.toLowerCase()));
        if (!pset.has(r.protocol.toLowerCase())) return false;
      }
      if (config.filters?.minAmount !== undefined) {
        if (Math.max(r.receivedQuantity, r.sentQuantity) < config.filters.minAmount) {
          return false;
        }
      }
      return true;
    });
  }

  formatData(
    data: ExportableTransaction[],
    format: ExportConfig['format'],
    template?: ExportConfig['template'],
  ): string {
    switch (format) {
      case 'csv':
        return this.toCsv(data);
      case 'json':
        return this.toJson(data);
      case 'pdf':
        return this.toPdf(data, template);
      case 'tax':
        return this.toTaxFormat(data);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  toCsv(data: ExportableTransaction[]): string {
    const headers = [
      'Date',
      'Received Quantity',
      'Received Currency',
      'Sent Quantity',
      'Sent Currency',
      'Fee Amount',
      'Fee Currency',
      'Tag',
      'Protocol',
    ];
    const rows = data.map((r) =>
      [
        r.date,
        r.receivedQuantity,
        r.receivedCurrency,
        r.sentQuantity,
        r.sentCurrency,
        r.feeAmount,
        r.feeCurrency,
        r.tag,
        r.protocol ?? '',
      ]
        .map(escapeCsvCell)
        .join(','),
    );
    return [headers.join(','), ...rows].join('\n');
  }

  toTaxFormat(data: ExportableTransaction[]): string {
    const headers = [
      'Date',
      'Received Quantity',
      'Received Currency',
      'Sent Quantity',
      'Sent Currency',
      'Fee Amount',
      'Fee Currency',
      'Tag',
    ];
    const rows = data.map((r) =>
      [
        r.date,
        r.receivedQuantity,
        r.receivedCurrency,
        r.sentQuantity,
        r.sentCurrency,
        r.feeAmount,
        r.feeCurrency,
        r.tag,
      ]
        .map(escapeCsvCell)
        .join(','),
    );
    return [headers.join(','), ...rows].join('\n');
  }

  toJson(data: ExportableTransaction[]): string {
    return JSON.stringify(data, null, 2);
  }

  toPdf(data: ExportableTransaction[], template = 'performance'): string {
    return `%PDF-1.4\n% Stellar DeFi Analytics Report (template=${template}, rows=${data.length})\n${this.toCsv(data)}\n%%EOF`;
  }

  private createBlob(formatted: string, format: ExportConfig['format']): Blob {
    const mimeMap: Record<ExportConfig['format'], string> = {
      csv: 'text/csv;charset=utf-8;',
      tax: 'text/csv;charset=utf-8;',
      json: 'application/json;charset=utf-8;',
      pdf: 'application/pdf',
    };
    return new Blob([formatted], { type: mimeMap[format] });
  }
}
