'use client';

const actions = [
  { label: 'Add Product', icon: '+', color: 'bg-[#e9fbf6]' },
  { label: 'New Sale', icon: '🛒', color: 'bg-[#eef4ff]' },
  { label: 'Purchase Order', icon: '📄', color: 'bg-[#f4ecff]' },
  { label: 'View Reports', icon: '📊', color: 'bg-[#fff6e5]' },
];

export function QuickActions() {
  return (
    <section
      className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
      aria-label="Quick actions"
    >
      <header className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">Workflow shortcuts</p>
          <h3 className="text-lg font-semibold">Quick Actions</h3>
        </div>
        <span className="text-xs font-medium text-teal-600">Live synced</span>
      </header>
      <div className="grid gap-3 md:grid-cols-2">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            className={`flex items-center gap-3 rounded-2xl p-4 text-left text-slate-700 transition hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${action.color}`}
          >
            <span aria-hidden className="text-xl font-semibold text-slate-800">{action.icon}</span>
            <p className="text-sm font-semibold text-slate-900">{action.label}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

