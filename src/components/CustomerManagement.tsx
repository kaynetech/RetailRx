import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Pill, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    address: '',
    insurance_provider: '',
    insurance_id: '',
    allergies: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setCustomers(data);
  };

  const fetchPrescriptions = async (customerId: string) => {
    const { data } = await supabase
      .from('customer_prescriptions')
      .select('*, inventory(name)')
      .eq('customer_id', customerId);
    if (data) setPrescriptions(data);
  };

  const createCustomer = async () => {
    if (!formData.first_name || !formData.last_name) {
      toast({ title: 'Error', description: 'Name is required', variant: 'destructive' });
      return;
    }

    const customerNumber = `C-${Date.now()}`;
    const { error } = await supabase.from('customers').insert({
      customer_number: customerNumber,
      ...formData
    });

    if (error) {
      toast({ title: 'Error', description: 'Failed to create customer', variant: 'destructive' });
      return;
    }

    toast({ title: 'Success', description: 'Customer created successfully' });
    setIsDialogOpen(false);
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      address: '',
      insurance_provider: '',
      insurance_id: '',
      allergies: ''
    });
    fetchCustomers();
  };

  const viewCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    fetchPrescriptions(customer.id);
  };

  const filteredCustomers = customers.filter(c =>
    c.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.customer_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Customer Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />New Customer</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name *</Label>
                  <Input value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
                </div>
                <div>
                  <Label>Last Name *</Label>
                  <Input value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input type="date" value={formData.date_of_birth} onChange={e => setFormData({...formData, date_of_birth: e.target.value})} />
              </div>
              <div>
                <Label>Address</Label>
                <Textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Insurance Provider</Label>
                  <Input value={formData.insurance_provider} onChange={e => setFormData({...formData, insurance_provider: e.target.value})} />
                </div>
                <div>
                  <Label>Insurance ID</Label>
                  <Input value={formData.insurance_id} onChange={e => setFormData({...formData, insurance_id: e.target.value})} />
                </div>
              </div>
              <div>
                <Label>Allergies</Label>
                <Textarea value={formData.allergies} onChange={e => setFormData({...formData, allergies: e.target.value})} />
              </div>
              <Button onClick={createCustomer} className="w-full">Create Customer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle><Users className="inline mr-2" />Customer Directory</CardTitle>
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="mt-4"
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer #</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Insurance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map(customer => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.customer_number}</TableCell>
                  <TableCell>{customer.first_name} {customer.last_name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {customer.phone && <div className="text-sm flex items-center"><Phone className="h-3 w-3 mr-1" />{customer.phone}</div>}
                      {customer.email && <div className="text-sm flex items-center"><Mail className="h-3 w-3 mr-1" />{customer.email}</div>}
                    </div>
                  </TableCell>
                  <TableCell>{customer.insurance_provider || 'N/A'}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => viewCustomer(customer)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedCustomer && (
        <Card>
          <CardHeader>
            <CardTitle><Pill className="inline mr-2" />Prescriptions for {selectedCustomer.first_name} {selectedCustomer.last_name}</CardTitle>
          </CardHeader>
          <CardContent>
            {prescriptions.length === 0 ? (
              <p className="text-muted-foreground">No prescriptions found</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rx #</TableHead>
                    <TableHead>Medication</TableHead>
                    <TableHead>Prescriber</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Refills</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prescriptions.map(rx => (
                    <TableRow key={rx.id}>
                      <TableCell>{rx.prescription_number}</TableCell>
                      <TableCell>{rx.inventory?.name}</TableCell>
                      <TableCell>{rx.prescriber_name}</TableCell>
                      <TableCell><Badge>{rx.status}</Badge></TableCell>
                      <TableCell>{rx.refills_remaining}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}