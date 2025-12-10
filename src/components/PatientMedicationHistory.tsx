import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Pill, Calendar } from 'lucide-react';

export default function PatientMedicationHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    patient_name: '',
    medication_name: '',
    dosage: '',
    frequency: '',
    quantity: '',
    prescriber_name: '',
    start_date: '',
    notes: ''
  });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from('patient_medication_history')
      .select('*')
      .order('dispensed_date', { ascending: false });

    if (!error && data) {
      setHistory(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('patient_medication_history')
      .insert([{
        ...formData,
        quantity: parseInt(formData.quantity),
        dispensed_date: new Date().toISOString()
      }]);

    if (!error) {
      setOpen(false);
      fetchHistory();
      setFormData({
        patient_name: '',
        medication_name: '',
        dosage: '',
        frequency: '',
        quantity: '',
        prescriber_name: '',
        start_date: '',
        notes: ''
      });
    }
  };

  const filteredHistory = history.filter(record =>
    record.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.medication_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = history.filter(h => h.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Patient Medication History</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Add Record</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Medication Record</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Patient Name</Label>
                  <Input value={formData.patient_name} onChange={(e) => setFormData({...formData, patient_name: e.target.value})} required />
                </div>
                <div>
                  <Label>Medication Name</Label>
                  <Input value={formData.medication_name} onChange={(e) => setFormData({...formData, medication_name: e.target.value})} required />
                </div>
                <div>
                  <Label>Dosage</Label>
                  <Input value={formData.dosage} onChange={(e) => setFormData({...formData, dosage: e.target.value})} required />
                </div>
                <div>
                  <Label>Frequency</Label>
                  <Input value={formData.frequency} onChange={(e) => setFormData({...formData, frequency: e.target.value})} required />
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} required />
                </div>
                <div>
                  <Label>Prescriber</Label>
                  <Input value={formData.prescriber_name} onChange={(e) => setFormData({...formData, prescriber_name: e.target.value})} required />
                </div>
                <div>
                  <Label>Start Date</Label>
                  <Input type="date" value={formData.start_date} onChange={(e) => setFormData({...formData, start_date: e.target.value})} required />
                </div>
                <div>
                  <Label>Notes</Label>
                  <Input value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
                </div>
              </div>
              <Button type="submit" className="w-full">Add Record</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Medications</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{history.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient or medication..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Medication</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Prescriber</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dispensed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.patient_name}</TableCell>
                  <TableCell>{record.medication_name}</TableCell>
                  <TableCell>{record.dosage}</TableCell>
                  <TableCell>{record.frequency}</TableCell>
                  <TableCell>{record.prescriber_name}</TableCell>
                  <TableCell>
                    <Badge variant={record.status === 'active' ? 'default' : 'secondary'}>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {record.dispensed_date ? new Date(record.dispensed_date).toLocaleDateString() : '-'}
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