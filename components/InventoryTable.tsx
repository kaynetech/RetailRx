'use client';

import { useMemo, useState } from 'react';
import type { InventoryItem } from '@/data/sampleInventory';

type InventoryTableProps = {
  items: InventoryItem[];
};

export function InventoryTable({ items }: InventoryTableProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [quantities, setQuantities] = useState<Record<string, number>>(
    () => Object.fromEntries(items.map((item) => [item.id, item.quantity])),
  );

  const categories = useMemo(() => Array.from(new Set(items.map((item) => item.category))), [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || item.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, category]);

  const adjustQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const next = Math.max(0, (prev[id] ?? 0) + delta);
      return { ...prev, [id]: next };
    });
  };

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm" aria-label="Inventory table">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">Inventory</p>
          <h3 className="text-lg font-semibold text-slate-900">Pharmacy & Market Stock</h3>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
          <label className="flex flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus-within:border-teal-400">
            <span className="text-slate-400" aria-hidden>
              🔍
            </span>
            <input
              type="search"
              placeholder="Search by name or SKU"
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search inventory"
            />
          </label>
          <select
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filter by category"
          >
            <option value="all">All categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-widest text-slate-500">
              <th className="py-3 pr-4">Product</th>
              <th className="py-3 pr-4">SKU</th>
              <th className="py-3 pr-4">Category</th>
              <th className="py-3 pr-4 text-right">Price</th>
              <th className="py-3 pr-4 text-right">Quantity</th>
              <th className="py-3 pr-4 text-right">Expiry</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.map((item) => {
              const isLow = quantities[item.id] < 10;
              const expiringSoon =
                new Date(item.expiryDate).getTime() - Date.now() < 1000 * 60 * 60 * 24 * 45;

              return (
                <tr key={item.id} className="align-middle text-slate-700">
                  <td className="py-3 pr-4 font-medium">{item.name}</td>
                  <td className="py-3 pr-4 text-slate-500">{item.sku}</td>
                  <td className="py-3 pr-4 text-slate-500">{item.category}</td>
                  <td className="py-3 pr-4 text-right font-semibold">${item.price.toFixed(2)}</td>
                  <td className="py-3 pr-4 text-right">
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2 py-1 text-sm">
                      <button
                        type="button"
                        aria-label={`Decrease quantity for ${item.name}`}
                        className="rounded-full px-2 py-1 text-slate-500 hover:text-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                        onClick={() => adjustQuantity(item.id, -1)}
                      >
                        −
                      </button>
                      <span className={isLow ? 'font-semibold text-orange-600' : 'font-semibold'}>
                        {quantities[item.id]}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase quantity for ${item.name}`}
                        className="rounded-full px-2 py-1 text-slate-500 hover:text-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                        onClick={() => adjustQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        expiringSoon ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {new Date(item.expiryDate).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Inventory synced hourly. Replace placeholder data in <code>data/sampleInventory.ts</code> with your ERP feed.
      </p>
    </section>
  );
}

