import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2, Plus } from 'lucide-react';

export const InventoryTable: React.FC = () => {
  const { inventory, loading, updateInventoryItem, deleteInventoryItem, addInventoryItem } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editItem, setEditItem] = useState<any>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '', category: '', quantity: 0, price: 0, supplier: '', barcode: '', reorder_level: 10
  });

  const categories = Array.from(new Set(inventory.map(i => i.category)));

  const filteredProducts = inventory.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.barcode && p.barcode.includes(searchTerm));
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getExpiryColor = (expiryDate?: string) => {
    if (!expiryDate) return 'text-gray-400';
    const days = Math.floor((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'text-red-700 font-semibold';
    if (days < 30) return 'text-red-600 font-semibold';
    if (days < 90) return 'text-orange-500 font-semibold';
    return 'text-gray-700';
  };

  const handleAdd = async () => {
    await addInventoryItem(newItem);
    setIsAddOpen(false);
    setNewItem({ name: '', category: '', quantity: 0, price: 0, supplier: '', barcode: '', reorder_level: 10 });
  };

  const handleUpdate = async (id: string, updates: any) => {
    await updateInventoryItem(id, updates);
    setEditItem(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
    </div>;
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Inventory Management</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} />
              </div>
              <div>
                <Label>Category</Label>
                <Input value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Quantity</Label>
                  <Input type="number" value={newItem.quantity} onChange={(e) => setNewItem({...newItem, quantity: Number(e.target.value)})} />
                </div>
                <div>
                  <Label>Price</Label>
                  <Input type="number" step="0.01" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})} />
                </div>
              </div>
              <div>
                <Label>Barcode</Label>
                <Input value={newItem.barcode} onChange={(e) => setNewItem({...newItem, barcode: e.target.value})} />
              </div>
              <div>
                <Label>Supplier</Label>
                <Input value={newItem.supplier} onChange={(e) => setNewItem({...newItem, supplier: e.target.value})} />
              </div>
              <Button onClick={handleAdd} className="w-full bg-teal-600 hover:bg-teal-700">Add Product</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 mb-4">
        <Input
          type="text"
          placeholder="Search by name or barcode..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-teal-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Expiry</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, idx) => (
                <tr key={product.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.barcode}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-teal-100 text-teal-700">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={product.quantity < (product.reorder_level || 10) ? 'text-red-600 font-semibold' : 'text-gray-700'}>
                      {product.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">${product.price}</td>
                  <td className={`px-4 py-3 ${getExpiryColor(product.expiry_date)}`}>
                    {product.expiry_date || 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => updateInventoryItem(product.id, { quantity: product.quantity + 1 })}>+</Button>
                      <Button size="sm" variant="outline" onClick={() => updateInventoryItem(product.id, { quantity: Math.max(0, product.quantity - 1) })}>-</Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteInventoryItem(product.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
