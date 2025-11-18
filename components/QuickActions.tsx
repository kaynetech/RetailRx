'use client';

const actions = [
  { label: 'Add Product', description: 'Register medication or grocery SKU', icon: '➕' },
  { label: 'New Sale', description: 'Launch POS workflow', icon: '💳' },
  { label: 'Purchase Order', description: 'Notify distributor for restock', icon: '📦' },
  { label: 'View Reports', description: 'Export revenue & compliance logs', icon: '📈' },
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
            className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:border-teal-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            <span aria-hidden className="text-2xl" role="img">
              {action.icon}
            </span>
            <span>
              <p className="text-sm font-semibold text-slate-900">{action.label}</p>
              <p className="text-xs text-slate-500">{action.description}</p>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

