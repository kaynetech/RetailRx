import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileDown, TrendingUp, Package, DollarSign, Users } from 'lucide-react';
import { toast } from 'sonner';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function ReportingDashboard() {
  const [reportType, setReportType] = useState('sales');
  const [timeRange, setTimeRange] = useState('30');
  const [salesData, setSalesData] = useState<any[]>([]);
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({ totalSales: 0, totalItems: 0, totalCustomers: 0, avgOrderValue: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReportData();
  }, [reportType, timeRange]);

  const fetchReportData = async () => {
    setLoading(true);
    const daysAgo = parseInt(timeRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    if (reportType === 'sales') {
      const { data } = await supabase.from('transactions')
        .select('*').gte('created_at', startDate.toISOString());
      if (data) {
        const dailySales = data.reduce((acc: any, t: any) => {
          const date = new Date(t.created_at).toLocaleDateString();
          acc[date] = (acc[date] || 0) + t.total_amount;
          return acc;
        }, {});
        setSalesData(Object.entries(dailySales).map(([date, amount]) => ({ date, amount })));
        setMetrics(prev => ({ ...prev, totalSales: data.reduce((sum, t) => sum + t.total_amount, 0) }));
      }
    } else if (reportType === 'inventory') {
      const { data } = await supabase.from('inventory').select('*');
      if (data) {
        const byCategory = data.reduce((acc: any, item: any) => {
          acc[item.category] = (acc[item.category] || 0) + item.quantity;
          return acc;
        }, {});
        setCategoryData(Object.entries(byCategory).map(([name, value]) => ({ name, value })));
        setMetrics(prev => ({ ...prev, totalItems: data.reduce((sum, i) => sum + i.quantity, 0) }));
      }
    } else if (reportType === 'customers') {
      const { data } = await supabase.from('customers').select('*');
      if (data) setMetrics(prev => ({ ...prev, totalCustomers: data.length }));
    }
    setLoading(false);
  };

  const exportReport = () => {
    const csvContent = salesData.map(d => `${d.date},${d.amount}`).join('\n');
    const blob = new Blob([`Date,Amount\n${csvContent}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_report_${new Date().toISOString()}.csv`;
    a.click();
    toast.success('Report exported');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reporting Dashboard</h1>
        <Button onClick={exportReport}><FileDown className="mr-2 h-4 w-4" />Export Report</Button>
      </div>

      <div className="flex gap-4">
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sales">Sales Report</SelectItem>
            <SelectItem value="inventory">Inventory Report</SelectItem>
            <SelectItem value="customers">Customer Report</SelectItem>
          </SelectContent>
        </Select>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 Days</SelectItem>
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="90">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.totalSales.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalCustomers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Order</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.avgOrderValue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {reportType === 'sales' && salesData.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Sales Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {reportType === 'inventory' && categoryData.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Inventory by Category</CardTitle></CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
