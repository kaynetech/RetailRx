import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Clock, Package } from 'lucide-react';
import { toast } from 'sonner';

export default function PrescriptionVerification() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);

  useEffect(() => {
    fetchPrescriptions();
  }, [filterStatus]);

  const fetchPrescriptions = async () => {
    setLoading(true);
    let query = supabase.from('prescription_verification').select('*').order('created_at', { ascending: false });
    
    if (filterStatus !== 'all') {
      query = query.eq('status', filterStatus);
    }

    const { data, error } = await query;
    if (error) {
      toast.error('Failed to fetch prescriptions');
    } else {
      setPrescriptions(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string, stage: string, notes?: string) => {
    const updates: any = { status, verification_stage: stage, updated_at: new Date().toISOString() };
    if (status === 'verified') updates.verified_at = new Date().toISOString();
    if (status === 'dispensed') updates.dispensed_at = new Date().toISOString();
    if (notes) updates.verification_notes = notes;

    const { error } = await supabase.from('prescription_verification').update(updates).eq('id', id);
    if (error) {
      toast.error('Failed to update prescription');
    } else {
      toast.success('Prescription updated successfully');
      fetchPrescriptions();
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = { pending: 'secondary', verified: 'default', rejected: 'destructive', dispensed: 'outline' };
    return <Badge variant={variants[status] || 'secondary'}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Prescription Verification</h1>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="dispensed">Dispensed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {prescriptions.map((rx) => (
          <Card key={rx.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{rx.patient_name}</h3>
                    {getStatusBadge(rx.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">Medication: {rx.medication_name} - {rx.dosage}</p>
                  <p className="text-sm">Prescriber: {rx.prescriber_name}</p>
                  <p className="text-sm">Quantity: {rx.quantity} | Refills: {rx.refills}</p>
                </div>
                <div className="flex gap-2">
                  {rx.status === 'pending' && (
                    <>
                      <Button size="sm" onClick={() => updateStatus(rx.id, 'verified', 'final_check')}>
                        <CheckCircle className="w-4 h-4 mr-1" /> Verify
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => updateStatus(rx.id, 'rejected', 'initial', 'Rejected')}>
                        <XCircle className="w-4 h-4 mr-1" /> Reject
                      </Button>
                    </>
                  )}
                  {rx.status === 'verified' && (
                    <Button size="sm" onClick={() => updateStatus(rx.id, 'dispensed', 'dispensed')}>
                      <Package className="w-4 h-4 mr-1" /> Dispense
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}