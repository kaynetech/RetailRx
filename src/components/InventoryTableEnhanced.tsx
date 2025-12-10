import React, { useState } from 'react';
import { Product } from '../data/inventory';
import { inventoryData } from '../data/inventory';
import { otcProducts, supplements } from '../data/moreInventory';
import { BarcodeScanModal } from './BarcodeScanModal';
import { BarcodeGenerator } from './BarcodeGenerator';
import { Button } from './ui/button';
import { Camera, Tag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

export const InventoryTableEnhanced: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([...inventoryData, ...otcProducts, ...supplements]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [barcodeModalOpen, setBarcodeModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.barcode.includes(searchTerm);
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleProductFound = (product: Product) => {
    setSearchTerm(product.barcode);
  };

  const updateQuantity = (id: string, change: number) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, quantity: Math.max(0, p.quantity + change) } : p
    ));
  };

  const showBarcode = (product: Product) => {
    setSelectedProduct(product);
    setBarcodeModalOpen(true);
  };

  return (
    <div>
      <BarcodeScanModal
        open={scanModalOpen}
        onClose={() => setScanModalOpen(false)}
        onProductFound={handleProductFound}
        products={products}
      />

      <Dialog open={barcodeModalOpen} onOpenChange={setBarcodeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Product Barcode Label</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <BarcodeGenerator
              value={selectedProduct.barcode}
              productName={selectedProduct.name}
              price={selectedProduct.price}
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-gray-800">Inventory Management</h2>
          <Button onClick={() => setScanModalOpen(true)} className="bg-teal-600 hover:bg-teal-700">
            <Camera className="h-4 w-4 mr-2" />
            Scan Product
          </Button>
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by name or barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Categories</option>
            <option value="prescription">Prescription</option>
            <option value="otc">OTC</option>
            <option value="supplement">Supplements</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-teal-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, idx) => (
                <tr key={product.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.barcode}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-teal-100 text-teal-700">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">{product.quantity}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => updateQuantity(product.id, -1)} className="px-2 py-1 bg-red-100 rounded">-</button>
                      <button onClick={() => updateQuantity(product.id, 1)} className="px-2 py-1 bg-green-100 rounded">+</button>
                      <Button size="sm" variant="outline" onClick={() => showBarcode(product)}>
                        <Tag className="h-3 w-3" />
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
