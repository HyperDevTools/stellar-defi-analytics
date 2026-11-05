export type AlertType = 'price' | 'percent_change' | 'liquidity' | 'portfolio' | 'volume';
export type AlertComparison = 'above' | 'below';

export interface AlertRule {
  id: string;
  name: string;
  type: AlertType;
  target: string;
  comparison: AlertComparison;
  threshold: number;
  cooldownMs: number;
  enabled: boolean;
  recurring: boolean;
  lastTriggeredAt?: number;
}

export interface TriggeredAlertEvent {
  alertId: string;
  alertName: string;
  type: AlertType;
  target: string;
  observedValue: number;
  threshold: number;
  timestamp: number;
}

export class AlertEngine {
  private alerts: Map<string, AlertRule> = new Map();
  private history: TriggeredAlertEvent[] = [];

  async addAlert(alert: AlertRule): Promise<void> {
    this.alerts.set(alert.id, { ...alert });
  }

  async removeAlert(id: string): Promise<boolean> {
    return this.alerts.delete(id);
  }

  getAlerts(): AlertRule[] {
    return Array.from(this.alerts.values());
  }

  getHistory(): TriggeredAlertEvent[] {
    return [...this.history];
  }

  evaluate(target: string, type: AlertType, observedValue: number, now = Date.now()): TriggeredAlertEvent[] {
    const fired: TriggeredAlertEvent[] = [];

    this.alerts.forEach((rule, id) => {
      if (!rule.enabled || rule.target !== target || rule.type !== type) {
        return;
      }

      if (rule.lastTriggeredAt !== undefined && now - rule.lastTriggeredAt < rule.cooldownMs) {
        return;
      }

      const conditionMet =
        rule.comparison === 'above'
          ? observedValue >= rule.threshold
          : observedValue <= rule.threshold;

      if (conditionMet) {
        const event: TriggeredAlertEvent = {
          alertId: rule.id,
          alertName: rule.name,
          type: rule.type,
          target: rule.target,
          observedValue,
          threshold: rule.threshold,
          timestamp: now,
        };
        rule.lastTriggeredAt = now;
        if (!rule.recurring) {
          rule.enabled = false;
        }
        this.alerts.set(id, rule);

        this.history.unshift(event);
        if (this.history.length > 100) {
          this.history.pop();
        }
        fired.push(event);
      }
    });

    return fired;
  }
}
