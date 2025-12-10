import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Package, Clock, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function SupplierAnalytics() {
  const [performance, setPerformance] = useState<any[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    const { data, error } = await supabase
      .from('supplier_performance')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPerformance(data);
    }
    setLoading(false);
  };

  const suppliers = [...new Set(performance.map(p => p.supplier_name))];
  
  const filteredData = selectedSupplier === 'all' 
    ? performance 
    : performance.filter(p => p.supplier_name === selectedSupplier);

  const avgDeliveryTime = filteredData.length > 0
    ? (filteredData.reduce((sum, p) => sum + (p.delivery_time_days || 0), 0) / filteredData.length).toFixed(1)
    : 0;

  const onTimeRate = filteredData.length > 0
    ? ((filteredData.filter(p => p.on_time).length / filteredData.length) * 100).toFixed(1)
    : 0;

  const avgQuality = filteredData.length > 0
    ? (filteredData.reduce((sum, p) => sum + (p.quality_rating || 0), 0) / filteredData.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Supplier Performance Analytics</h1>
        <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select supplier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Suppliers</SelectItem>
            {suppliers.map(supplier => (
              <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDeliveryTime} days</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onTimeRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Quality Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgQuality}/5</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredData.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Delivery Time</TableHead>
                <TableHead>On Time</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.supplier_name}</TableCell>
                  <TableCell>{record.order_id}</TableCell>
                  <TableCell>{record.delivery_time_days} days</TableCell>
                  <TableCell>
                    <Badge variant={record.on_time ? 'default' : 'destructive'}>
                      {record.on_time ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      {record.quality_rating}
                    </div>
                  </TableCell>
                  <TableCell>${record.order_amount?.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}