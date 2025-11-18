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
    value: '$15,847.5',
    subtitle: '+12.5% from yesterday',
    trend: '💰',
    accent: 'teal',
  },
  {
    label: 'Low Stock Alerts',
    value: '3',
    subtitle: '3 items need reordering',
    trend: '⚠️',
    accent: 'coral',
  },
  {
    label: 'Expiring Soon',
    value: '8',
    subtitle: '8 items expiring within 90 days',
    trend: '⏰',
  },
];

export function DashboardCards() {
  return (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-label="Dashboard summary cards">
      {metrics.map((metric) => (
        <article
          key={metric.label}
          className={`rounded-2xl p-5 text-white shadow ${metric.accent === 'teal' ? 'bg-[#0c9186]' : metric.accent === 'coral' ? 'bg-[#f97316]' : 'bg-[#ef4444]'}`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{metric.label}</p>
            <span className="text-2xl" aria-hidden>
              {metric.trend}
            </span>
          </div>
          <p className="mt-4 text-3xl font-semibold">{metric.value}</p>
          <p className="mt-2 text-sm text-white/80">{metric.subtitle}</p>
        </article>
      ))}
    </section>
  );
}

