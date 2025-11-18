'use client';

const weeklySales = [
  { day: 'Mon', value: 3200 },
  { day: 'Tue', value: 3800 },
  { day: 'Wed', value: 4100 },
  { day: 'Thu', value: 3650 },
  { day: 'Fri', value: 4800 },
  { day: 'Sat', value: 5200 },
  { day: 'Sun', value: 2900 },
];

const topProducts = [
  { name: 'HydraCold Relief', value: '92 dispensed' },
  { name: 'Wellness Multivitamin', value: '74 sold' },
  { name: 'Organic Oat Milk', value: '61 sold' },
  { name: 'Glucose Test Strips', value: '55 dispensed' },
];

export function AnalyticsPanel() {
  const maxValue = Math.max(...weeklySales.map((entry) => entry.value));

  return (
    <section className="grid gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:grid-cols-2">
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-400">Trends</p>
        <h3 className="text-lg font-semibold text-slate-900">Weekly Sales Mix</h3>
        <svg viewBox="0 0 300 160" className="mt-4 w-full">
          <defs>
            <linearGradient id="salesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0D9488" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0D9488" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <polyline
            fill="none"
            stroke="#0D9488"
            strokeWidth="4"
            strokeLinecap="round"
            points={weeklySales
              .map((entry, index) => {
                const x = (index / (weeklySales.length - 1)) * 300;
                const y = 160 - (entry.value / maxValue) * 140 - 10;
                return `${x},${y}`;
              })
              .join(' ')}
          />
          <polygon
            fill="url(#salesGradient)"
            opacity="0.3"
            points={(() => {
              const points = weeklySales.map((entry, index) => {
                const x = (index / (weeklySales.length - 1)) * 300;
                const y = 160 - (entry.value / maxValue) * 140 - 10;
                return `${x},${y}`;
              });
              return ['0,160', ...points, '300,160'].join(' ');
            })()}
          />
          {weeklySales.map((entry, index) => {
            const x = (index / (weeklySales.length - 1)) * 300;
            const y = 160 - (entry.value / maxValue) * 140 - 10;
            return (
              <g key={entry.day}>
                <circle cx={x} cy={y} r="4" fill="#F97316" />
                <text
                  x={x}
                  y={y - 8}
                  textAnchor="middle"
                  className="fill-slate-500 text-[10px]"
                >
                  ${entry.value / 1000}k
                </text>
                <text
                  x={x}
                  y={150}
                  textAnchor="middle"
                  className="fill-slate-500 text-[10px]"
                >
                  {entry.day}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="rounded-2xl bg-slate-50 p-4">
        <p className="text-xs uppercase tracking-widest text-slate-400">Top movers</p>
        <h4 className="text-lg font-semibold text-slate-900">Product Spotlight</h4>
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          {topProducts.map((product) => (
            <li key={product.name} className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm">
              <span className="font-medium">{product.name}</span>
              <span className="text-xs font-semibold text-teal-600">{product.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

