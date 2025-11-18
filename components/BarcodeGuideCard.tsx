'use client';

export function BarcodeGuideCard() {
  return (
    <section className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-white p-6 shadow-sm">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-orange-500">POS helper</p>
          <h3 className="text-lg font-semibold text-slate-900">Barcode Scan Checklist</h3>
        </div>
        <span
          className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-600"
          aria-label="Alert level"
        >
          Live
        </span>
      </header>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-700">
        <li>Ensure scanner laser is aligned with SKU barcode.</li>
        <li>Wait for confirmation beep, then verify product on POS.</li>
        <li>For controlled meds, capture pharmacist PIN within 60 seconds.</li>
        <li>Bag refrigerated inventory immediately after checkout.</li>
      </ol>
      <p className="mt-4 text-xs text-slate-500">
        Tip: Replace the placeholder barcode workflow with your SOP to keep staff compliant.
      </p>
    </section>
  );
}

