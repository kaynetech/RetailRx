import React, { useMemo } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Calendar } from 'lucide-react';

export const SalesAnalytics: React.FC = () => {
  const { inventory, sales, loading } = useAppContext();

  const analytics = useMemo(() => {
    const today = new Date();
    const last30Days = sales.filter(s => {
      const saleDate = new Date(s.created_at);
      const diffDays = Math.floor((today.getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
    });

    const totalRevenue = last30Days.reduce((sum, s) => sum + Number(s.total_amount), 0);
    const avgTransaction = last30Days.length > 0 ? totalRevenue / last30Days.length : 0;
    
    // Daily sales for last 7 days
    const dailySales = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const daySales = sales.filter(s => 
        new Date(s.created_at).toDateString() === date.toDateString()
      );
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        sales: daySales.reduce((sum, s) => sum + Number(s.total_amount), 0),
        count: daySales.length
      };
    });

    const maxDailySales = Math.max(...dailySales.map(d => d.sales), 1);

    // Top selling products
    const productSales: Record<string, { name: string; revenue: number; quantity: number }> = {};
    last30Days.forEach(sale => {
      const items = typeof sale.items === 'string' ? JSON.parse(sale.items) : sale.items;
      items.forEach((item: any) => {
        if (!productSales[item.id]) {
          productSales[item.id] = { name: item.name, revenue: 0, quantity: 0 };
        }
        productSales[item.id].revenue += item.price * item.quantity;
        productSales[item.id].quantity += item.quantity;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return { totalRevenue, avgTransaction, dailySales, maxDailySales, topProducts, last30Days };
  }, [sales, inventory]);

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Sales Analytics</h2>
        <p className="text-gray-600 mt-1">Last 30 days performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-6 rounded-lg shadow-md text-white">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-teal-100 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold">${analytics.totalRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow-md text-white">
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <p className="text-blue-100 text-sm">Transactions</p>
          <p className="text-3xl font-bold">{analytics.last30Days.length}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg shadow-md text-white">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8" />
          </div>
          <p className="text-purple-100 text-sm">Avg Transaction</p>
          <p className="text-3xl font-bold">${analytics.avgTransaction.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-lg shadow-md text-white">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8" />
          </div>
          <p className="text-amber-100 text-sm">Products</p>
          <p className="text-3xl font-bold">{inventory.length}</p>
        </div>
      </div>

      {/* Daily Sales Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Daily Sales (Last 7 Days)</h3>
        <div className="flex items-end justify-between h-64 gap-3">
          {analytics.dailySales.map((day, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-lg hover:from-teal-700 hover:to-teal-500 transition cursor-pointer relative group"
                style={{ height: `${(day.sales / analytics.maxDailySales) * 100}%`, minHeight: '8px' }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  ${day.sales.toFixed(0)}
                </div>
              </div>
              <p className="text-sm font-medium mt-2">{day.day}</p>
              <p className="text-xs text-gray-500">{day.count} sales</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Top Selling Products</h3>
        <div className="space-y-3">
          {analytics.topProducts.map((product, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold">
                  {idx + 1}
                </div>
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.quantity} units sold</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-teal-600">${product.revenue.toFixed(2)}</p>
                <p className="text-xs text-gray-500">revenue</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};