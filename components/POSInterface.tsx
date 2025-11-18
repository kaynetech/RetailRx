'use client';

import { useMemo, useState } from 'react';
import type { InventoryItem } from '@/data/sampleInventory';

type POSInterfaceProps = {
  products: InventoryItem[];
};

type CartItem = InventoryItem & { quantityInCart: number };

export function POSInterface({ products }: POSInterfaceProps) {
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<Record<string, CartItem>>({});

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [products, search]);

  const addToCart = (product: InventoryItem) => {
    setCart((prev) => {
      const existing = prev[product.id];
      const qty = existing ? existing.quantityInCart + 1 : 1;
      return {
        ...prev,
        [product.id]: { ...product, quantityInCart: qty },
      };
    });
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      const current = prev[id];
      if (!current) return prev;
      const nextQty = current.quantityInCart + delta;
      if (nextQty <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: { ...current, quantityInCart: nextQty } };
    });
  };

  const cartItems = Object.values(cart);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantityInCart,
    0,
  );

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">Retail POS</p>
          <h3 className="text-lg font-semibold text-slate-900">Checkout Queue</h3>
        </div>
        <label className="flex w-full items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus-within:border-teal-400 md:w-64">
          <span aria-hidden className="text-slate-400">
            🔍
          </span>
          <input
            type="search"
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            placeholder="Scan or search product"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search for products to add to cart"
          />
        </label>
      </header>

      <div className="mt-4 grid gap-4 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-3" aria-label="Available products">
          {filteredProducts.slice(0, 8).map((product) => (
            <article
              key={product.id}
              className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4"
            >
              <div>
                <p className="text-sm font-semibold">{product.name}</p>
                <p className="text-xs text-slate-500">{product.sku}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-900">${product.price.toFixed(2)}</span>
                <button
                  type="button"
                  className="rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  onClick={() => addToCart(product)}
                  aria-label={`Add ${product.name} to cart`}
                >
                  Add
                </button>
              </div>
            </article>
          ))}
          {filteredProducts.length === 0 && (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
              No products match your search. Try another term.
            </p>
          )}
        </div>

        <aside
          className="rounded-2xl bg-slate-900 p-5 text-white"
          aria-label="Cart drawer"
        >
          <h4 className="text-lg font-semibold">Current Cart</h4>
          <div className="mt-4 space-y-4">
            {cartItems.length === 0 && (
              <p className="text-sm text-slate-200">Cart is empty. Add items to begin checkout.</p>
            )}
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl bg-slate-800/70 px-3 py-2">
                <div>
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-slate-300">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-1 text-slate-50">
                  <button
                    type="button"
                    className="rounded-full bg-slate-700 px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                    onClick={() => updateCartQuantity(item.id, -1)}
                    aria-label={`Remove one ${item.name}`}
                  >
                    −
                  </button>
                  <span className="px-2 text-sm font-semibold">{item.quantityInCart}</span>
                  <button
                    type="button"
                    className="rounded-full bg-teal-500 px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    onClick={() => updateCartQuantity(item.id, 1)}
                    aria-label={`Add one more ${item.name}`}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-slate-800/80 p-4">
            <div className="flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-semibold">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="mt-2 text-xs text-slate-400">Tax & insurance calculated at tender.</div>
          </div>
          <button
            type="button"
            className="mt-4 w-full rounded-full bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow transition hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            disabled={cartItems.length === 0}
          >
            Checkout (stub)
          </button>
        </aside>
      </div>
    </section>
  );
}

