import React from 'react';
import { MetricCard } from './MetricCard';
import { useAppContext } from '@/contexts/AppContext';
import { Package, ShoppingCart, FileText, BarChart } from 'lucide-react';

interface DashboardProps {
  setActiveView?: (view: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveView }) => {
  const { inventory, sales, loading } = useAppContext();

  const lowStock = inventory.filter(p => p.quantity < (p.reorder_level || 10));
  const expiringSoon = inventory.filter(p => {
    if (!p.expiry_date) return false;
    const daysUntilExpiry = Math.floor((new Date(p.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry < 90 && daysUntilExpiry > 0;
  });

  const todaySales = sales
    .filter(s => new Date(s.created_at).toDateString() === new Date().toDateString())
    .reduce((sum, s) => sum + Number(s.total_amount), 0);

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
    </div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-600 mt-1">Real-time pharmacy operations monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Today's Sales"
          value={`$${todaySales.toLocaleString()}`}
          subtitle={`${sales.filter(s => new Date(s.created_at).toDateString() === new Date().toDateString()).length} transactions`}
          bgColor="bg-teal-600"
          textColor="text-white"
          icon="💰"
        />
        <MetricCard
          title="Low Stock Alerts"
          value={lowStock.length}
          subtitle={`${lowStock.length} items need reordering`}
          bgColor="bg-orange-500"
          textColor="text-white"
          icon="⚠️"
        />
        <MetricCard
          title="Expiring Soon"
          value={expiringSoon.length}
          subtitle="Items expiring within 90 days"
          bgColor="bg-red-500"
          textColor="text-white"
          icon="⏰"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setActiveView?.('inventory')} className="bg-teal-50 hover:bg-teal-100 text-teal-700 p-4 rounded-lg transition flex flex-col items-center">
              <Package className="w-8 h-8 mb-2" />
              <div className="font-medium">Add Product</div>
            </button>
            <button onClick={() => setActiveView?.('pos')} className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-lg transition flex flex-col items-center">
              <ShoppingCart className="w-8 h-8 mb-2" />
              <div className="font-medium">New Sale</div>
            </button>
            <button onClick={() => setActiveView?.('suppliers')} className="bg-purple-50 hover:bg-purple-100 text-purple-700 p-4 rounded-lg transition flex flex-col items-center">
              <FileText className="w-8 h-8 mb-2" />
              <div className="font-medium">Suppliers</div>
            </button>
            <button onClick={() => setActiveView?.('analytics')} className="bg-amber-50 hover:bg-amber-100 text-amber-700 p-4 rounded-lg transition flex flex-col items-center">
              <BarChart className="w-8 h-8 mb-2" />
              <div className="font-medium">View Reports</div>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-lg shadow-md p-6 text-white">
          <h3 className="text-xl font-semibold mb-3">Barcode System</h3>
          <p className="text-teal-100 mb-4 text-sm">
            Scan products with camera or USB scanner, generate printable labels
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-teal-200">✓</span>
              <span>Camera & USB scanner support</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-teal-200">✓</span>
              <span>Generate & print barcode labels</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-teal-200">✓</span>
              <span>Instant product lookup in POS</span>
            </div>
          </div>
          <button 
            onClick={() => setActiveView?.('barcode-help')}
            className="mt-4 bg-white text-teal-700 px-4 py-2 rounded-lg font-medium hover:bg-teal-50 transition w-full"
          >
            View Barcode Guide
          </button>
        </div>
      </div>
    </div>
  );
};
