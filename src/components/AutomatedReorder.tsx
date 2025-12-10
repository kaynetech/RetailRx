import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { RefreshCw, Plus, TrendingDown, Package } from 'lucide-react';

export default function AutomatedReorder() {
  const [rules, setRules] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    inventory_id: '',
    reorder_point: '',
    reorder_quantity: '',
    auto_reorder: true,
    supplier_id: ''
  });

  useEffect(() => {
    fetchRules();
    fetchHistory();
    fetchInventory();
    fetchSuppliers();
  }, []);

  const fetchRules = async () => {
    const { data } = await supabase
      .from('reorder_rules')
      .select('*, inventory(name, quantity, unit)')
      .order('created_at', { ascending: false });
    if (data) setRules(data);
  };

  const fetchHistory = async () => {
    const { data } = await supabase
      .from('reorder_history')
      .select('*, inventory(name)')
      .order('created_at', { ascending: false })
      .limit(20);
    if (data) setHistory(data);
  };

  const fetchInventory = async () => {
    const { data } = await supabase.from('inventory').select('id, name, quantity, unit');
    if (data) setInventory(data);
  };

  const fetchSuppliers = async () => {
    const { data } = await supabase.from('suppliers').select('id, name');
    if (data) setSuppliers(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('reorder_rules').insert([{
      ...formData,
      reorder_point: parseInt(formData.reorder_point),
      reorder_quantity: parseInt(formData.reorder_quantity)
    }]);
    
    if (error) {
      toast.error('Failed to create reorder rule');
    } else {
      toast.success('Reorder rule created');
      setIsOpen(false);
      fetchRules();
      setFormData({ inventory_id: '', reorder_point: '', reorder_quantity: '', auto_reorder: true, supplier_id: '' });
    }
  };

  const toggleAutoReorder = async (id: string, currentValue: boolean) => {
    const { error } = await supabase
      .from('reorder_rules')
      .update({ auto_reorder: !currentValue })
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to update rule');
    } else {
      toast.success('Auto-reorder updated');
      fetchRules();
    }
  };

  const checkAndReorder = async () => {
    let reordersCreated = 0;
    
    for (const rule of rules) {
      if (rule.auto_reorder && rule.inventory && rule.inventory.quantity <= rule.reorder_point) {
        const { error } = await supabase.from('reorder_history').insert([{
          inventory_id: rule.inventory_id,
          quantity: rule.reorder_quantity,
          status: 'pending',
          po_number: `PO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }]);
        
        if (!error) reordersCreated++;
      }
    }
    
    if (reordersCreated > 0) {
      toast.success(`Created ${reordersCreated} reorder(s)`);
      fetchHistory();
    } else {
      toast.info('No items need reordering');
    }
  };

  const updateReorderStatus = async (id: string, status: string) => {
    const updates: any = { status };
    if (status === 'completed') updates.completed_at = new Date().toISOString();
    
    const { error } = await supabase.from('reorder_history').update(updates).eq('id', id);
    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success('Status updated');
      fetchHistory();
    }
  };

  const lowStockItems = rules.filter(r => r.inventory && r.inventory.quantity <= r.reorder_point);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Automated Reorder System</h1>
        <div className="flex gap-2">
          <Button onClick={checkAndReorder} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />Check & Reorder
          </Button>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Add Rule</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Reorder Rule</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Item</Label>
                  <Select value={formData.inventory_id} onValueChange={(v) => setFormData({...formData, inventory_id: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select item" />
                    </SelectTrigger>
                    <SelectContent>
                      {inventory.map(item => (
                        <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Reorder Point</Label>
                  <Input type="number" value={formData.reorder_point} onChange={(e) => setFormData({...formData, reorder_point: e.target.value})} required />
                </div>
                <div>
                  <Label>Reorder Quantity</Label>
                  <Input type="number" value={formData.reorder_quantity} onChange={(e) => setFormData({...formData, reorder_quantity: e.target.value})} required />
                </div>
                <div>
                  <Label>Supplier</Label>
                  <Select value={formData.supplier_id} onValueChange={(v) => setFormData({...formData, supplier_id: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map(sup => (
                        <SelectItem key={sup.id} value={sup.id}>{sup.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch checked={formData.auto_reorder} onCheckedChange={(v) => setFormData({...formData, auto_reorder: v})} />
                  <Label>Enable Auto-Reorder</Label>
                </div>
                <Button type="submit" className="w-full">Create Rule</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rules.filter(r => r.auto_reorder).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{history.filter(h => h.status === 'pending').length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reorder Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Reorder Point</TableHead>
                <TableHead>Reorder Qty</TableHead>
                <TableHead>Auto-Reorder</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.inventory?.name || 'N/A'}</TableCell>
                  <TableCell>{rule.inventory?.quantity || 0} {rule.inventory?.unit}</TableCell>
                  <TableCell>{rule.reorder_point}</TableCell>
                  <TableCell>{rule.reorder_quantity}</TableCell>
                  <TableCell>
                    <Switch checked={rule.auto_reorder} onCheckedChange={() => toggleAutoReorder(rule.id, rule.auto_reorder)} />
                  </TableCell>
                  <TableCell>
                    {rule.inventory && rule.inventory.quantity <= rule.reorder_point ? (
                      <Badge variant="destructive"><TrendingDown className="h-3 w-3 mr-1" />Low Stock</Badge>
                    ) : (
                      <Badge variant="outline">OK</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reorder History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-mono text-sm">{record.po_number}</TableCell>
                  <TableCell>{record.inventory?.name || 'N/A'}</TableCell>
                  <TableCell>{record.quantity}</TableCell>
                  <TableCell>
                    <Badge variant={record.status === 'completed' ? 'default' : 'secondary'}>{record.status}</Badge>
                  </TableCell>
                  <TableCell>{new Date(record.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Select value={record.status} onValueChange={(v) => updateReorderStatus(record.id, v)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="ordered">Ordered</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
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
