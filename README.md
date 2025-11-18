# RetailRx UI Scaffold

1. Copy the `components`, `data`, `pages`, `styles`, `public/images/products`, `next.config.js`, and `vercel.json` entries into an existing Next.js (13+) project using the `/pages` router.
2. Ensure Tailwind CSS is configured; import `styles/theme.css` inside `pages/_app.tsx` or the global stylesheet.
3. Run `npm install` (or `pnpm install`) to make sure React, Next.js, and Tailwind dependencies are present.
4. Launch the dev server with `npm run dev` and visit `http://localhost:3000` to explore the RetailRx dashboard.
5. When ready, deploy with `npx vercel` or connect the repo to Vercel; the provided `vercel.json` applies sensible headers and disables telemetry.

Customize mock data inside `data/sampleInventory.ts` and replace image placeholders at `public/images/products/product-01.jpg` through `product-15.jpg` with your catalog photos before going live.

