import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EPrescription {
  id: string;
  prescription_number: string;
  patient_name: string;
  prescriber_name: string;
  medication_name: string;
  dosage: string;
  quantity: number;
  refills_allowed: number;
  status: string;
  received_at: string;
}

export function EPrescribing() {
  const [prescriptions, setPrescriptions] = useState<EPrescription[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    prescription_number: '',
    patient_name: '',
    patient_dob: '',
    prescriber_name: '',
    prescriber_npi: '',
    medication_name: '',
    dosage: '',
    quantity: 0,
    refills_allowed: 0,
    instructions: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    const { data } = await supabase.from('e_prescriptions')
      .select('*')
      .order('received_at', { ascending: false });
    if (data) setPrescriptions(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('e_prescriptions').insert([formData]);
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'E-prescription received' });
      setIsOpen(false);
      setFormData({
        prescription_number: '',
        patient_name: '',
        patient_dob: '',
        prescriber_name: '',
        prescriber_npi: '',
        medication_name: '',
        dosage: '',
        quantity: 0,
        refills_allowed: 0,
        instructions: ''
      });
      fetchPrescriptions();
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const { data: user } = await supabase.auth.getUser();
    const updates: any = { status };
    if (status === 'filled') {
      updates.filled_by = user.user?.id;
      updates.filled_at = new Date().toISOString();
    }
    
    const { error } = await supabase.from('e_prescriptions').update(updates).eq('id', id);
    
    if (!error) {
      toast({ title: 'Success', description: `Prescription ${status}` });
      fetchPrescriptions();
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: any = { 
      received: 'secondary', 
      verified: 'default', 
      filled: 'default', 
      dispensed: 'default', 
      cancelled: 'destructive' 
    };
    return <Badge variant={colors[status]}>{status}</Badge>;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          E-Prescribing
        </CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Receive E-Prescription</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Receive E-Prescription</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Prescription Number</Label>
                  <Input value={formData.prescription_number} onChange={(e) => setFormData({...formData, prescription_number: e.target.value})} required />
                </div>
                <div>
                  <Label>Patient Name</Label>
                  <Input value={formData.patient_name} onChange={(e) => setFormData({...formData, patient_name: e.target.value})} required />
                </div>
                <div>
                  <Label>Patient DOB</Label>
                  <Input type="date" value={formData.patient_dob} onChange={(e) => setFormData({...formData, patient_dob: e.target.value})} />
                </div>
                <div>
                  <Label>Prescriber Name</Label>
                  <Input value={formData.prescriber_name} onChange={(e) => setFormData({...formData, prescriber_name: e.target.value})} required />
                </div>
                <div>
                  <Label>Prescriber NPI</Label>
                  <Input value={formData.prescriber_npi} onChange={(e) => setFormData({...formData, prescriber_npi: e.target.value})} />
                </div>
                <div>
                  <Label>Medication</Label>
                  <Input value={formData.medication_name} onChange={(e) => setFormData({...formData, medication_name: e.target.value})} required />
                </div>
                <div>
                  <Label>Dosage</Label>
                  <Input value={formData.dosage} onChange={(e) => setFormData({...formData, dosage: e.target.value})} required />
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})} required />
                </div>
                <div>
                  <Label>Refills Allowed</Label>
                  <Input type="number" value={formData.refills_allowed} onChange={(e) => setFormData({...formData, refills_allowed: parseInt(e.target.value)})} />
                </div>
              </div>
              <div>
                <Label>Instructions</Label>
                <Textarea value={formData.instructions} onChange={(e) => setFormData({...formData, instructions: e.target.value})} />
              </div>
              <Button type="submit">Receive Prescription</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rx#</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Medication</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Prescriber</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prescriptions.map((rx) => (
              <TableRow key={rx.id}>
                <TableCell className="font-medium">{rx.prescription_number}</TableCell>
                <TableCell>{rx.patient_name}</TableCell>
                <TableCell>{rx.medication_name}</TableCell>
                <TableCell>{rx.dosage}</TableCell>
                <TableCell>{rx.quantity}</TableCell>
                <TableCell>{rx.prescriber_name}</TableCell>
                <TableCell>{getStatusBadge(rx.status)}</TableCell>
                <TableCell className="space-x-2">
                  {rx.status === 'received' && (
                    <Button size="sm" onClick={() => updateStatus(rx.id, 'verified')}>Verify</Button>
                  )}
                  {rx.status === 'verified' && (
                    <Button size="sm" onClick={() => updateStatus(rx.id, 'filled')}>Fill</Button>
                  )}
                  {rx.status === 'filled' && (
                    <Button size="sm" onClick={() => updateStatus(rx.id, 'dispensed')}><CheckCircle className="h-4 w-4" /></Button>
                  )}
                  {rx.status !== 'dispensed' && rx.status !== 'cancelled' && (
                    <Button size="sm" variant="destructive" onClick={() => updateStatus(rx.id, 'cancelled')}><XCircle className="h-4 w-4" /></Button>
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
