'use client';

type CardMetric = {
  label: string;
  value: string;
  subtitle: string;
  trend?: string;
  accent?: 'teal' | 'coral';
};

const metrics: CardMetric[] = [
  {
    label: "Today's Sales",
    value: '$18,420',
    subtitle: '312 prescriptions • 148 grocery orders',
    trend: '+12.4% vs. last week',
    accent: 'teal',
  },
  {
    label: 'Low Stock Items',
    value: '27',
    subtitle: 'Critical: 6 • Warning: 21',
    trend: 'Restock suggested today',
    accent: 'coral',
  },
  {
    label: 'Expiring Soon',
    value: '14 SKUs',
    subtitle: 'Next 45 days',
    trend: 'Flag for supplier returns',
  },
];

export function DashboardCards() {
  return (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-label="Key metrics cards">
      {metrics.map((metric) => (
        <article
          key={metric.label}
          className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">{metric.label}</p>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                metric.accent === 'teal'
                  ? 'bg-teal-50 text-teal-700'
                  : metric.accent === 'coral'
                  ? 'bg-orange-50 text-orange-600'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {metric.trend}
            </span>
          </div>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{metric.value}</p>
          <p className="mt-2 text-sm text-slate-500">{metric.subtitle}</p>
        </article>
      ))}
    </section>
  );
}

