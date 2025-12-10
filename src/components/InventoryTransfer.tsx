import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Truck, Plus, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Transfer {
  id: string;
  item_id: string;
  from_location_id: string;
  to_location_id: string;
  quantity: number;
  status: string;
  notes: string;
  created_at: string;
  inventory: { name: string };
  from_location: { name: string };
  to_location: { name: string };
}

export function InventoryTransfer() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ item_id: '', from_location_id: '', to_location_id: '', quantity: 0, notes: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchTransfers();
    fetchLocations();
    fetchItems();
  }, []);

  const fetchTransfers = async () => {
    const { data } = await supabase.from('inventory_transfers')
      .select('*, inventory(name), from_location:locations!from_location_id(name), to_location:locations!to_location_id(name)')
      .order('created_at', { ascending: false });
    if (data) setTransfers(data);
  };

  const fetchLocations = async () => {
    const { data } = await supabase.from('locations').select('*');
    if (data) setLocations(data);
  };

  const fetchItems = async () => {
    const { data } = await supabase.from('inventory').select('id, name, stock');
    if (data) setItems(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: user } = await supabase.auth.getUser();
    const { error } = await supabase.from('inventory_transfers').insert([{ ...formData, initiated_by: user.user?.id }]);
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Transfer initiated' });
      setIsOpen(false);
      fetchTransfers();
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('inventory_transfers')
      .update({ status, completed_at: status === 'completed' ? new Date().toISOString() : null })
      .eq('id', id);
    
    if (!error) {
      toast({ title: 'Success', description: `Transfer ${status}` });
      fetchTransfers();
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: any = { pending: 'secondary', in_transit: 'default', completed: 'default', cancelled: 'destructive' };
    return <Badge variant={colors[status]}>{status}</Badge>;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Inventory Transfers
        </CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />New Transfer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Transfer</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Item</Label>
                <Select value={formData.item_id} onValueChange={(v) => setFormData({...formData, item_id: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {items.map(item => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>From Location</Label>
                <Select value={formData.from_location_id} onValueChange={(v) => setFormData({...formData, from_location_id: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {locations.map(loc => <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>To Location</Label>
                <Select value={formData.to_location_id} onValueChange={(v) => setFormData({...formData, to_location_id: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {locations.map(loc => <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quantity</Label>
                <Input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})} required />
              </div>
              <div>
                <Label>Notes</Label>
                <Input value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
              </div>
              <Button type="submit">Create Transfer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transfers.map((transfer) => (
              <TableRow key={transfer.id}>
                <TableCell>{transfer.inventory?.name}</TableCell>
                <TableCell>{transfer.from_location?.name}</TableCell>
                <TableCell>{transfer.to_location?.name}</TableCell>
                <TableCell>{transfer.quantity}</TableCell>
                <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                <TableCell className="space-x-2">
                  {transfer.status === 'pending' && (
                    <Button size="sm" onClick={() => updateStatus(transfer.id, 'in_transit')}>Ship</Button>
                  )}
                  {transfer.status === 'in_transit' && (
                    <Button size="sm" onClick={() => updateStatus(transfer.id, 'completed')}><CheckCircle className="h-4 w-4" /></Button>
                  )}
                  {transfer.status !== 'completed' && transfer.status !== 'cancelled' && (
                    <Button size="sm" variant="destructive" onClick={() => updateStatus(transfer.id, 'cancelled')}><XCircle className="h-4 w-4" /></Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
