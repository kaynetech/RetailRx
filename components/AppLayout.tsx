'use client';

import { useState } from 'react';
import Link from 'next/link';

const navItems = [
  { label: 'Dashboard', href: '/', icon: 'grid' },
  { label: 'Inventory', href: '/inventory', icon: 'boxes' },
  { label: 'Point of Sale', href: '/pos', icon: 'cart' },
  { label: 'Analytics', href: '/analytics', icon: 'chart' },
  { label: 'Suppliers', href: '/suppliers', icon: 'truck' },
  { label: 'Expiring Items', href: '/expiring', icon: 'alarm' },
  { label: 'Barcode Guide', href: '/barcode', icon: 'tag' },
];

const iconMap: Record<string, JSX.Element> = {
  grid: (
    <span className="inline-block h-4 w-4 rounded-sm border border-white/60" aria-hidden />
  ),
  boxes: (
    <span className="inline-block h-4 w-4 rounded-sm border border-white/60 border-t-0 border-r-0" aria-hidden />
  ),
  cart: (
    <span className="inline-block h-4 w-4 rounded-full border border-white/60" aria-hidden />
  ),
  chart: (
    <span className="inline-flex h-4 w-4 items-end gap-0.5" aria-hidden>
      <span className="h-2 w-1 rounded bg-white/70" />
      <span className="h-3 w-1 rounded bg-white/80" />
      <span className="h-4 w-1 rounded bg-white" />
    </span>
  ),
  truck: (
    <span className="inline-block h-4 w-6 rounded bg-white/20" aria-hidden />
  ),
  alarm: (
    <span className="inline-block h-4 w-4 rounded-full border border-white/60" aria-hidden />
  ),
  tag: (
    <span className="inline-block h-4 w-4 rotate-45 rounded bg-white/30" aria-hidden />
  ),
};

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="lg:hidden">
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={sidebarOpen}
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="m-4 inline-flex items-center rounded-full border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
        >
          {sidebarOpen ? 'Close Menu' : 'Open Menu'}
        </button>
      </div>

      <div className="relative flex">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-[#0d5e55] px-6 py-8 text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full lg:shadow-none'
          }`}
          aria-label="Primary"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">RetailRx</p>
              <h1 className="text-xl font-semibold">Pharmacy Management</h1>
            </div>
            <button
              type="button"
              className="rounded-full bg-white/20 p-2 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>
          <nav className="mt-10 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                {iconMap[item.icon]}
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl bg-white/10 p-4">
            <p className="text-xs uppercase tracking-wide text-white/70">Active user</p>
            <p className="text-lg font-semibold">Ayanna Cruz</p>
            <p className="text-sm text-white/80">Downtown Pharmacy</p>
          </div>
        </aside>

        <div className="flex w-full flex-col lg:ml-72">
          <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-500">Pharmacy & Supermarket Operations</p>
              <h2 className="text-3xl font-semibold text-slate-900">RetailRx Management System</h2>
              <p className="text-sm text-slate-500">Real-time pharmacy operations monitoring</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-full bg-teal-600 px-5 py-2 text-sm font-semibold text-white shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                New Order
              </button>
              <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white">
                  A
                </span>
                Ayanna
              </div>
            </div>
          </header>
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

