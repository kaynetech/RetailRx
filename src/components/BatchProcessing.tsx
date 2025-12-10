import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Play, CheckCircle, XCircle, Clock, Package } from 'lucide-react';

export default function BatchProcessing() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [operationType, setOperationType] = useState('price_update');
  const [filterCategory, setFilterCategory] = useState('');
  const [priceAdjustment, setPriceAdjustment] = useState('');
  const [stockAdjustment, setStockAdjustment] = useState('');
  const [adjustmentType, setAdjustmentType] = useState('percentage');

  useEffect(() => {
    fetchBatches();
    const interval = setInterval(fetchBatches, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchBatches = async () => {
    const { data } = await supabase.from('batch_operations')
      .select('*').order('created_at', { ascending: false }).limit(20);
    if (data) setBatches(data);
  };

  const createBatchOperation = async () => {
    if (operationType === 'price_update' && !priceAdjustment) {
      toast.error('Please enter price adjustment');
      return;
    }
    if (operationType === 'stock_adjustment' && !stockAdjustment) {
      toast.error('Please enter stock adjustment');
      return;
    }

    setLoading(true);
    const filters: any = {};
    if (filterCategory) filters.category = filterCategory;

    const changes: any = {};
    if (operationType === 'price_update') {
      changes.adjustment = parseFloat(priceAdjustment);
      changes.type = adjustmentType;
    }
    if (operationType === 'stock_adjustment') {
      changes.adjustment = parseInt(stockAdjustment);
    }

    const { data: batch, error } = await supabase.from('batch_operations').insert({
      operation_type: operationType,
      filters,
      changes,
      status: 'pending'
    }).select().single();

    if (error) {
      toast.error('Failed to create batch operation');
      setLoading(false);
      return;
    }

    // Get items to process
    let query = supabase.from('inventory').select('id');
    if (filterCategory) query = query.eq('category', filterCategory);
    const { data: items } = await query;

    if (items && items.length > 0) {
      await supabase.from('batch_operations').update({
        total_items: items.length,
        status: 'processing'
      }).eq('id', batch.id);

      // Create batch items
      const batchItems = items.map(item => ({
        batch_id: batch.id,
        item_id: item.id,
        status: 'pending'
      }));
      await supabase.from('batch_operation_items').insert(batchItems);

      // Process batch
      processBatch(batch.id, items, changes);
    }

    toast.success('Batch operation started');
    setLoading(false);
    fetchBatches();
  };

  const processBatch = async (batchId: string, items: any[], changes: any) => {
    let processed = 0;
    let failed = 0;

    for (const item of items) {
      try {
        if (operationType === 'price_update') {
          const { data: current } = await supabase.from('inventory')
            .select('price').eq('id', item.id).single();
          if (current) {
            const newPrice = changes.type === 'percentage'
              ? current.price * (1 + changes.adjustment / 100)
              : current.price + changes.adjustment;
            await supabase.from('inventory').update({ price: newPrice }).eq('id', item.id);
          }
        } else if (operationType === 'stock_adjustment') {
          const { data: current } = await supabase.from('inventory')
            .select('quantity').eq('id', item.id).single();
          if (current) {
            await supabase.from('inventory').update({
              quantity: current.quantity + changes.adjustment
            }).eq('id', item.id);
          }
        }
        await supabase.from('batch_operation_items').update({ status: 'success' })
          .eq('batch_id', batchId).eq('item_id', item.id);
        processed++;
      } catch (err) {
        await supabase.from('batch_operation_items').update({
          status: 'failed',
          error_message: String(err)
        }).eq('batch_id', batchId).eq('item_id', item.id);
        failed++;
      }
    }

    await supabase.from('batch_operations').update({
      status: 'completed',
      processed_items: processed,
      failed_items: failed,
      completed_at: new Date().toISOString()
    }).eq('id', batchId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'processing': return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Batch Processing</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button><Play className="mr-2 h-4 w-4" />New Batch Operation</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Batch Operation</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Operation Type</Label>
                <Select value={operationType} onValueChange={setOperationType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price_update">Price Update</SelectItem>
                    <SelectItem value="stock_adjustment">Stock Adjustment</SelectItem>
                    <SelectItem value="expiry_check">Expiry Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Filter by Category (Optional)</Label>
                <Input value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} placeholder="e.g., Antibiotics" />
              </div>
              {operationType === 'price_update' && (
                <>
                  <div>
                    <Label>Adjustment Type</Label>
                    <Select value={adjustmentType} onValueChange={setAdjustmentType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Price Adjustment</Label>
                    <Input type="number" value={priceAdjustment} onChange={(e) => setPriceAdjustment(e.target.value)} 
                      placeholder={adjustmentType === 'percentage' ? '10 (for 10%)' : '5.00'} />
                  </div>
                </>
              )}
              {operationType === 'stock_adjustment' && (
                <div>
                  <Label>Stock Adjustment</Label>
                  <Input type="number" value={stockAdjustment} onChange={(e) => setStockAdjustment(e.target.value)} placeholder="e.g., -10 or +20" />
                </div>
              )}
              <Button onClick={createBatchOperation} disabled={loading} className="w-full">
                {loading ? 'Creating...' : 'Start Batch Operation'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle>Batch Operations History</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Completed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map(batch => (
                <TableRow key={batch.id}>
                  <TableCell className="capitalize">{batch.operation_type.replace('_', ' ')}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(batch.status)}
                      <Badge>{batch.status}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Progress value={(batch.processed_items / batch.total_items) * 100} />
                      <span className="text-xs text-muted-foreground">
                        {batch.processed_items}/{batch.total_items} items
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(batch.created_at).toLocaleString()}</TableCell>
                  <TableCell>{batch.completed_at ? new Date(batch.completed_at).toLocaleString() : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
