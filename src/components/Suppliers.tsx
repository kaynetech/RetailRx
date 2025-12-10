import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export const Suppliers: React.FC = () => {
  const { suppliers, loading, addSupplier, updateSupplier, deleteSupplier } = useAppContext();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: '', contact_person: '', email: '', phone: '', address: ''
  });

  const handleAdd = async () => {
    await addSupplier(newSupplier);
    setIsAddOpen(false);
    setNewSupplier({ name: '', contact_person: '', email: '', phone: '', address: '' });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
    </div>;
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Supplier Management</h2>
          <p className="text-gray-600 mt-1">Manage your pharmacy suppliers and purchase orders</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="w-4 h-4 mr-2" /> Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Supplier Name</Label>
                <Input value={newSupplier.name} onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})} />
              </div>
              <div>
                <Label>Contact Person</Label>
                <Input value={newSupplier.contact_person} onChange={(e) => setNewSupplier({...newSupplier, contact_person: e.target.value})} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={newSupplier.email} onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={newSupplier.phone} onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})} />
              </div>
              <div>
                <Label>Address</Label>
                <Input value={newSupplier.address} onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})} />
              </div>
              <Button onClick={handleAdd} className="w-full bg-teal-600 hover:bg-teal-700">Add Supplier</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-teal-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Supplier</th>
                <th className="px-6 py-3 text-left">Contact Person</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Phone</th>
                <th className="px-6 py-3 text-left">Address</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier, idx) => (
                <tr key={supplier.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{supplier.name}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{supplier.contact_person || 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-700">{supplier.email || 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-700">{supplier.phone || 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{supplier.address || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => deleteSupplier(supplier.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
