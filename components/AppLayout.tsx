'use client';

import { useState } from 'react';
import Link from 'next/link';

const navItems = [
  { label: 'Dashboard', href: '/', icon: '📊' },
  { label: 'Inventory', href: '/inventory', icon: '📦' },
  { label: 'POS', href: '/pos', icon: '🛒' },
  { label: 'Suppliers', href: '/suppliers', icon: '🚚' },
  { label: 'Reports', href: '/reports', icon: '📑' },
];

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
          className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-gradient-to-b from-teal-600 to-teal-800 px-6 py-8 text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full lg:shadow-none'
          }`}
          aria-label="Primary"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-teal-100">RetailRx</p>
              <h1 className="text-2xl font-semibold">Control Center</h1>
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
          <nav className="mt-10 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              >
                <span aria-hidden="true" className="text-lg">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl bg-white/10 p-4">
            <p className="text-xs uppercase tracking-wide text-teal-100">Pharmacist</p>
            <p className="text-lg font-semibold">Dr. Ayanna Cruz</p>
            <p className="text-sm text-teal-50">Downtown Care Pharmacy</p>
          </div>
        </aside>

        <div className="flex w-full flex-col lg:ml-72">
          <header className="sticky top-0 z-30 flex flex-col gap-3 bg-white/80 px-6 py-5 backdrop-blur-md lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-teal-700">Tuesday, 9:41 AM</p>
              <h2 className="text-2xl font-semibold text-slate-900">Retail & Pharmacy Overview</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                Notifications
              </button>
              <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white">
                  AC
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

