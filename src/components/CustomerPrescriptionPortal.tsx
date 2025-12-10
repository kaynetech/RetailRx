import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Pill, Calendar, RefreshCw, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerPrescriptionPortal() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('customer_prescriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch prescriptions');
    } else {
      setPrescriptions(data || []);
    }
    setLoading(false);
  };

  const requestRefill = async (id: string) => {
    const prescription = prescriptions.find(p => p.id === id);
    if (prescription.refills_remaining <= 0) {
      toast.error('No refills remaining. Please contact your prescriber.');
      return;
    }

    const { error } = await supabase
      .from('customer_prescriptions')
      .update({
        refills_remaining: prescription.refills_remaining - 1,
        last_fill_date: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      toast.error('Failed to request refill');
    } else {
      toast.success('Refill requested successfully');
      fetchPrescriptions();
    }
  };

  const filteredPrescriptions = prescriptions.filter(p =>
    p.medication_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants: any = { active: 'default', expired: 'secondary', cancelled: 'destructive', completed: 'outline' };
    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Prescription Portal</h1>
        <Input
          placeholder="Search prescriptions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-4">
        {filteredPrescriptions.map((rx) => (
          <Card key={rx.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Pill className="w-5 h-5" />
                    <h3 className="font-semibold text-lg">{rx.medication_name}</h3>
                    {getStatusBadge(rx.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">Dosage: {rx.dosage}</p>
                  <p className="text-sm">Patient: {rx.customer_name}</p>
                  <p className="text-sm">Prescriber: {rx.prescriber_name}</p>
                  <p className="text-sm">Quantity: {rx.quantity} | Refills: {rx.refills_remaining}</p>
                  <p className="text-sm">Rx #: {rx.prescription_number}</p>
                  {rx.next_refill_date && (
                    <p className="text-sm flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Next Refill: {rx.next_refill_date}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {rx.status === 'active' && rx.refills_remaining > 0 && (
                    <Button size="sm" onClick={() => requestRefill(rx.id)}>
                      <RefreshCw className="w-4 h-4 mr-1" /> Request Refill
                    </Button>
                  )}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => setSelectedPrescription(rx)}>
                        <FileText className="w-4 h-4 mr-1" /> Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Prescription Details</DialogTitle>
                      </DialogHeader>
                      {selectedPrescription && (
                        <div className="space-y-3">
                          <div><strong>Medication:</strong> {selectedPrescription.medication_name}</div>
                          <div><strong>Dosage:</strong> {selectedPrescription.dosage}</div>
                          <div><strong>Instructions:</strong> {selectedPrescription.instructions || 'N/A'}</div>
                          <div><strong>Fill Date:</strong> {selectedPrescription.fill_date}</div>
                          <div><strong>Last Fill:</strong> {selectedPrescription.last_fill_date || 'N/A'}</div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}