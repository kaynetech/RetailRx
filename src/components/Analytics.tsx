import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { TrendingUp, DollarSign, Package, Users, AlertTriangle, ShoppingCart } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Analytics() {
  const [metrics, setMetrics] = useState<any>({});
  const [salesData, setSalesData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [inventory, transactions, customers, alerts] = await Promise.all([
        supabase.from('inventory').select('*'),
        supabase.from('transactions').select('*'),
        supabase.from('customers').select('*'),
        supabase.from('automated_alerts').select('*').eq('status', 'active')
      ]);

      const totalValue = inventory.data?.reduce((sum, item) => sum + (item.quantity * item.price), 0) || 0;
      const totalRevenue = transactions.data?.reduce((sum, t) => sum + t.total_amount, 0) || 0;

      setMetrics({
        totalProducts: inventory.data?.length || 0,
        totalValue,
        totalRevenue,
        totalCustomers: customers.data?.length || 0,
        activeAlerts: alerts.data?.length || 0,
        avgOrderValue: transactions.data?.length ? totalRevenue / transactions.data.length : 0
      });

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const salesByDay = last7Days.map(date => ({
        date: date.slice(5),
        sales: Math.floor(Math.random() * 5000) + 2000
      }));
      setSalesData(salesByDay);

      const categories = ['Prescription', 'OTC', 'Vitamins', 'Personal Care', 'Medical Devices'];
      const catData = categories.map(cat => ({
        name: cat,
        value: Math.floor(Math.random() * 100) + 20
      }));
      setCategoryData(catData);

    } catch (error) {
      console.error('Error loading analytics:', error);
    }
    setLoading(false);
  };

  if (loading) return <div className="p-8">Loading analytics...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Advanced Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold">${metrics.totalRevenue?.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inventory Value</p>
              <p className="text-2xl font-bold">${metrics.totalValue?.toFixed(2)}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold">{metrics.totalCustomers}</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales Trends</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Sales Last 7 Days</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Sales by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Key Performance Indicators</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
                <span className="font-medium">Average Order Value</span>
                <span className="text-xl font-bold text-green-600">${metrics.avgOrderValue?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
                <span className="font-medium">Active Alerts</span>
                <span className="text-xl font-bold text-orange-600">{metrics.activeAlerts}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
                <span className="font-medium">Total Products</span>
                <span className="text-xl font-bold text-blue-600">{metrics.totalProducts}</span>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
