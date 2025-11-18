'use client';

export function BarcodeGuideCard() {
  return (
    <section className="rounded-2xl bg-[#0f7b70] p-6 text-white shadow-sm">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-white/70">Barcode System</p>
          <h3 className="text-lg font-semibold">Scan products with camera or USB scanner</h3>
        </div>
        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Live</span>
      </header>
      <ul className="mt-4 space-y-2 text-sm text-white/90">
        <li>✔ Camera & USB scanner support</li>
        <li>✔ Generate & print barcode labels</li>
        <li>✔ Instant product lookup in POS</li>
      </ul>
      <button
        type="button"
        className="mt-5 w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0f7b70] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
      >
        View Barcode Guide
      </button>
    </section>
  );
}

