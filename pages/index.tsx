import Head from 'next/head';
import { AppLayout } from '@/components/AppLayout';
import { DashboardCards } from '@/components/DashboardCards';
import { QuickActions } from '@/components/QuickActions';
import { BarcodeGuideCard } from '@/components/BarcodeGuideCard';
import { InventoryTable } from '@/components/InventoryTable';
import { POSInterface } from '@/components/POSInterface';
import { AnalyticsPanel } from '@/components/AnalyticsPanel';
import { sampleInventory } from '@/data/sampleInventory';

export default function HomePage() {
  return (
    <AppLayout>
      <Head>
        <title>RetailRx Dashboard</title>
        <meta name="description" content="Retail & pharmacy management overview" />
      </Head>
      <div className="space-y-6">
        <DashboardCards />
        <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
          <QuickActions />
          <BarcodeGuideCard />
        </div>
        <InventoryTable items={sampleInventory} />
        <POSInterface products={sampleInventory} />
        <AnalyticsPanel />
      </div>
    </AppLayout>
  );
}

