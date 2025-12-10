import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { FileText, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';

export default function InsuranceManagement() {
  const { user } = useAuth();
  const [claims, setClaims] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: '',
    prescription_id: '',
    insurance_provider: '',
    policy_number: '',
    claim_amount: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [claimsRes, customersRes, prescriptionsRes] = await Promise.all([
      supabase.from('insurance_claims').select('*, customers(name), customer_prescriptions(medication_name)').order('created_at', { ascending: false }),
      supabase.from('customers').select('*'),
      supabase.from('customer_prescriptions').select('*')
    ]);

    setClaims(claimsRes.data || []);
    setCustomers(customersRes.data || []);
    setPrescriptions(prescriptionsRes.data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const claimNumber = `CLM-${Date.now()}`;
      await supabase.from('insurance_claims').insert({
        ...formData,
        claim_number: claimNumber,
        claim_amount: parseFloat(formData.claim_amount),
        created_by: user?.id
      });

      toast.success('Insurance claim submitted');
      setShowDialog(false);
      setFormData({ customer_id: '', prescription_id: '', insurance_provider: '', policy_number: '', claim_amount: '' });
      loadData();
    } catch (error) {
      toast.error('Failed to submit claim');
    }
    setLoading(false);
  };

  const updateClaimStatus = async (id: string, status: string, approvedAmount?: number) => {
    try {
      await supabase.from('insurance_claims').update({
        status,
        approved_amount: approvedAmount,
        processed_date: new Date().toISOString()
      }).eq('id', id);

      toast.success(`Claim ${status}`);
      loadData();
    } catch (error) {
      toast.error('Failed to update claim');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      pending: { variant: 'secondary', icon: Clock },
      approved: { variant: 'default', icon: CheckCircle },
      rejected: { variant: 'destructive', icon: XCircle }
    };
    const { variant, icon: Icon } = variants[status] || variants.pending;
    return <Badge variant={variant} className="flex items-center gap-1"><Icon className="h-3 w-3" />{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Insurance Management</h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button><FileText className="mr-2 h-4 w-4" />New Claim</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Insurance Claim</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Customer</Label>
                <Select value={formData.customer_id} onValueChange={(v) => setFormData({...formData, customer_id: v})}>
                  <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                  <SelectContent>
                    {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Prescription</Label>
                <Select value={formData.prescription_id} onValueChange={(v) => setFormData({...formData, prescription_id: v})}>
                  <SelectTrigger><SelectValue placeholder="Select prescription" /></SelectTrigger>
                  <SelectContent>
                    {prescriptions.map(p => <SelectItem key={p.id} value={p.id}>{p.medication_name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Insurance Provider</Label>
                <Input value={formData.insurance_provider} onChange={(e) => setFormData({...formData, insurance_provider: e.target.value})} required />
              </div>
              <div>
                <Label>Policy Number</Label>
                <Input value={formData.policy_number} onChange={(e) => setFormData({...formData, policy_number: e.target.value})} required />
              </div>
              <div>
                <Label>Claim Amount</Label>
                <Input type="number" step="0.01" value={formData.claim_amount} onChange={(e) => setFormData({...formData, claim_amount: e.target.value})} required />
              </div>
              <Button type="submit" disabled={loading} className="w-full">Submit Claim</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Claim #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {claims.map((claim) => (
              <TableRow key={claim.id}>
                <TableCell className="font-mono">{claim.claim_number}</TableCell>
                <TableCell>{claim.customers?.name}</TableCell>
                <TableCell>{claim.insurance_provider}</TableCell>
                <TableCell>${claim.claim_amount}</TableCell>
                <TableCell>{getStatusBadge(claim.status)}</TableCell>
                <TableCell>
                  {claim.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateClaimStatus(claim.id, 'approved', claim.claim_amount)}>Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => updateClaimStatus(claim.id, 'rejected')}>Reject</Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
