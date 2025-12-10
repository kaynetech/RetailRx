import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PurchaseOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
    fetchSuppliers();
    fetchInventory();
    fetchLocations();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('purchase_orders')
      .select('*, suppliers(name), locations(name)')
      .order('created_at', { ascending: false });
    if (!error && data) setOrders(data);
  };

  const fetchSuppliers = async () => {
    const { data } = await supabase.from('suppliers').select('*');
    if (data) setSuppliers(data);
  };

  const fetchInventory = async () => {
    const { data } = await supabase.from('inventory').select('*');
    if (data) setInventory(data);
  };

  const fetchLocations = async () => {
    const { data } = await supabase.from('locations').select('*');
    if (data) setLocations(data);
  };

  const createPO = async () => {
    if (!selectedSupplier || orderItems.length === 0) {
      toast({ title: 'Error', description: 'Select supplier and add items', variant: 'destructive' });
      return;
    }

    const poNumber = `PO-${Date.now()}`;
    const totalAmount = orderItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

    const { data: po, error } = await supabase
      .from('purchase_orders')
      .insert({
        po_number: poNumber,
        supplier_id: selectedSupplier,
        location_id: selectedLocation || null,
        total_amount: totalAmount,
        status: 'pending'
      })
      .select()
      .single();

    if (error || !po) {
      toast({ title: 'Error', description: 'Failed to create PO', variant: 'destructive' });
      return;
    }

    const items = orderItems.map(item => ({
      po_id: po.id,
      inventory_id: item.inventory_id,
      quantity: item.quantity,
      unit_price: item.unit_price
    }));

    await supabase.from('purchase_order_items').insert(items);
    toast({ title: 'Success', description: 'Purchase order created' });
    setIsDialogOpen(false);
    setOrderItems([]);
    fetchOrders();
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('purchase_orders').update({ status }).eq('id', id);
    fetchOrders();
    toast({ title: 'Updated', description: `Order status changed to ${status}` });
  };

  const getStatusBadge = (status: string) => {
    const colors: any = {
      draft: 'secondary',
      pending: 'default',
      approved: 'default',
      ordered: 'default',
      received: 'default',
      cancelled: 'destructive'
    };
    return <Badge variant={colors[status] || 'default'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Purchase Orders</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />New PO</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Purchase Order</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Location (Optional)" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(l => (
                    <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={createPO}>Create Order</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle><Package className="inline mr-2" />All Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map(order => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.po_number}</TableCell>
                  <TableCell>{order.suppliers?.name}</TableCell>
                  <TableCell>{order.locations?.name || 'N/A'}</TableCell>
                  <TableCell>${order.total_amount?.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <Button size="sm" onClick={() => updateStatus(order.id, 'approved')}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {order.status === 'approved' && (
                        <Button size="sm" onClick={() => updateStatus(order.id, 'received')}>
                          Receive
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}