import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function PrescriptionRefills() {
  const [refills, setRefills] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchRefills();
    fetchCustomers();
  }, [filter]);

  const fetchRefills = async () => {
    setLoading(true);
    let query = supabase.from('prescription_refills').select(`
      *,
      customer:customers(first_name, last_name),
      prescription:customer_prescriptions(medication_name, dosage)
    `).order('requested_date', { ascending: false });
    
    if (filter !== 'all') query = query.eq('status', filter);
    const { data, error } = await query;
    if (!error && data) setRefills(data);
    setLoading(false);
  };

  const fetchCustomers = async () => {
    const { data } = await supabase.from('customers').select('*').order('last_name');
    if (data) setCustomers(data);
  };

  const fetchPrescriptions = async (customerId: string) => {
    const { data } = await supabase.from('customer_prescriptions')
      .select('*').eq('customer_id', customerId).eq('status', 'active');
    if (data) setPrescriptions(data);
  };

  const createRefill = async () => {
    if (!selectedCustomer || !selectedPrescription) {
      toast.error('Please select customer and prescription');
      return;
    }
    const { error } = await supabase.from('prescription_refills').insert({
      customer_id: selectedCustomer,
      prescription_id: selectedPrescription,
      refill_number: 1,
      notes
    });
    if (error) toast.error('Failed to create refill');
    else {
      toast.success('Refill request created');
      fetchRefills();
      setSelectedCustomer('');
      setSelectedPrescription('');
      setNotes('');
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const updates: any = { status, updated_at: new Date().toISOString() };
    if (status === 'filled') updates.filled_date = new Date().toISOString();
    const { error } = await supabase.from('prescription_refills').update(updates).eq('id', id);
    if (error) toast.error('Failed to update status');
    else {
      toast.success('Status updated');
      fetchRefills();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Prescription Refills</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button><RefreshCw className="mr-2 h-4 w-4" />New Refill Request</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Refill Request</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Customer</Label>
                <Select value={selectedCustomer} onValueChange={(v) => { setSelectedCustomer(v); fetchPrescriptions(v); }}>
                  <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                  <SelectContent>
                    {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.first_name} {c.last_name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Prescription</Label>
                <Select value={selectedPrescription} onValueChange={setSelectedPrescription}>
                  <SelectTrigger><SelectValue placeholder="Select prescription" /></SelectTrigger>
                  <SelectContent>
                    {prescriptions.map(p => <SelectItem key={p.id} value={p.id}>{p.medication_name} - {p.dosage}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
              <Button onClick={createRefill} className="w-full">Create Request</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2">
        {['all', 'pending', 'approved', 'filled', 'cancelled'].map(s => (
          <Button key={s} variant={filter === s ? 'default' : 'outline'} onClick={() => setFilter(s)}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Refill Requests</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Medication</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {refills.map(r => (
                <TableRow key={r.id}>
                  <TableCell>{r.customer?.first_name} {r.customer?.last_name}</TableCell>
                  <TableCell>{r.prescription?.medication_name}</TableCell>
                  <TableCell>{new Date(r.requested_date).toLocaleDateString()}</TableCell>
                  <TableCell><Badge>{r.status}</Badge></TableCell>
                  <TableCell className="space-x-2">
                    {r.status === 'pending' && (
                      <Button size="sm" onClick={() => updateStatus(r.id, 'approved')}>Approve</Button>
                    )}
                    {r.status === 'approved' && (
                      <Button size="sm" onClick={() => updateStatus(r.id, 'filled')}>Fill</Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => updateStatus(r.id, 'cancelled')}>Cancel</Button>
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
