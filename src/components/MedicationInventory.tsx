import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Pill, AlertCircle, Package, TrendingUp, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function MedicationInventory() {
  const { inventory, updateInventoryItem } = useAppContext();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedMed, setSelectedMed] = useState<any>(null);
  const [stats, setStats] = useState({ total: 0, lowStock: 0, expiring: 0, linked: 0 });

  useEffect(() => {
    fetchPrescriptions();
    calculateStats();
  }, [inventory]);

  const fetchPrescriptions = async () => {
    const { data } = await supabase.from('prescription_verification').select('*').eq('status', 'verified');
    setPrescriptions(data || []);
  };

  const calculateStats = () => {
    const lowStock = inventory.filter(i => i.quantity < (i.reorder_level || 10)).length;
    const expiring = inventory.filter(i => {
      if (!i.expiry_date) return false;
      const days = Math.floor((new Date(i.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return days <= 30;
    }).length;
    setStats({ total: inventory.length, lowStock, expiring, linked: prescriptions.length });
  };

  const filteredMeds = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getPrescriptionCount = (medName: string) => {
    return prescriptions.filter(p => p.medication_name.toLowerCase().includes(medName.toLowerCase())).length;
  };

  const linkToPrescription = async (inventoryId: string, medName: string) => {
    const count = getPrescriptionCount(medName);
    toast.success(`${count} active prescriptions found for ${medName}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Medication Inventory Integration</h1>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm">Total Medications</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{stats.total}</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm">Low Stock</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-red-600">{stats.lowStock}</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm">Expiring Soon</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-orange-600">{stats.expiring}</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm">Linked Prescriptions</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-green-600">{stats.linked}</p></CardContent></Card>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input placeholder="Search medications..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Prescription">Prescription</SelectItem>
            <SelectItem value="OTC">OTC</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredMeds.map(med => {
          const rxCount = getPrescriptionCount(med.name);
          const isLowStock = med.quantity < (med.reorder_level || 10);
          return (
            <Card key={med.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Pill className="w-5 h-5" />
                      <h3 className="font-semibold text-lg">{med.name}</h3>
                      {isLowStock && <Badge variant="destructive">Low Stock</Badge>}
                      {rxCount > 0 && <Badge variant="default">{rxCount} Rx</Badge>}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div><span className="text-muted-foreground">Stock:</span> <span className="font-semibold">{med.quantity}</span></div>
                      <div><span className="text-muted-foreground">Price:</span> <span className="font-semibold">${med.price}</span></div>
                      <div><span className="text-muted-foreground">Expiry:</span> <span className="font-semibold">{med.expiry_date || 'N/A'}</span></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => linkToPrescription(med.id, med.name)}>
                      <Package className="w-4 h-4 mr-1" /> View Rx
                    </Button>
                    <Button size="sm" onClick={() => updateInventoryItem(med.id, { quantity: med.quantity + 10 })}>
                      <TrendingUp className="w-4 h-4 mr-1" /> Restock
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}