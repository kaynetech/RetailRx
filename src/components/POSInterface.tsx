import React, { useState } from 'react';
import { useAppContext, InventoryItem } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import BarcodeScanModal from './BarcodeScanModal';

import { Button } from './ui/button';
import { Camera } from 'lucide-react';

interface CartItem extends InventoryItem {
  cartQuantity: number;
}

export const POSInterface: React.FC = () => {
  const { inventory, addSale, updateInventoryItem } = useAppContext();
  const { user, userProfile } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');


  const handleProductFound = (product: InventoryItem) => {
    addToCart(product);
  };

  const addToCart = (product: InventoryItem) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, cartQuantity: item.cartQuantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, cartQuantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, cartQuantity: quantity } : item
      ));
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.selling_price * item.cartQuantity), 0);
  const tax = total * 0.08;
  const grandTotal = total + tax;

  const handleCheckout = async () => {
    if (cart.length > 0) {
      const transactionNumber = `TXN-${Date.now()}`;
      
      // Record sale
      await addSale({
        transaction_number: transactionNumber,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.cartQuantity,
          price: item.selling_price,
          total: item.selling_price * item.cartQuantity
        })),
        subtotal: total,
        tax: tax,
        discount: 0,
        total: grandTotal,
        payment_method: paymentMethod,
        cashier_id: user?.id,
        cashier_name: userProfile?.full_name || user?.email || 'Unknown',
        status: 'completed'
      });


      // Update inventory quantities
      for (const item of cart) {
        await updateInventoryItem(item.id, {
          quantity: item.quantity - item.cartQuantity
        });
      }

      setCart([]);
      setSearchTerm('');
    }
  };

  const filteredProducts = inventory.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.barcode && p.barcode.includes(searchTerm))
  );

  return (
    <>
      <BarcodeScanModal
        open={scanModalOpen}
        onClose={() => setScanModalOpen(false)}
        onProductFound={handleProductFound}
        products={inventory}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-800">Point of Sale</h2>
            <Button onClick={() => setScanModalOpen(true)} className="bg-teal-600 hover:bg-teal-700">
              <Camera className="h-4 w-4 mr-2" />
              Scan Barcode
            </Button>
          </div>
          <input
            type="text"
            placeholder="Search products or scan barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-teal-500"
          />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
          {filteredProducts.slice(0, 12).map(product => (
            <div
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer transition"
            >
              <div className="w-full h-32 bg-gradient-to-br from-teal-100 to-teal-200 rounded mb-2 flex items-center justify-center">
                <span className="text-teal-700 font-semibold text-xs text-center px-2">{product.name}</span>
              </div>
              <h3 className="font-semibold text-sm text-gray-800 mb-1">{product.name}</h3>
              <p className="text-teal-600 font-bold">${product.selling_price}</p>
              <p className="text-xs text-gray-500">Stock: {product.quantity}</p>
            </div>

          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg h-fit">
        <h3 className="text-xl font-bold mb-4">Current Sale</h3>
        <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center border-b pb-2">
              <div className="flex-1">
                <p className="font-medium text-sm">{item.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => updateCartQuantity(item.id, item.cartQuantity - 1)}
                    className="px-2 py-1 bg-gray-200 rounded text-xs"
                  >-</button>
                  <span className="text-sm">{item.cartQuantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item.id, item.cartQuantity + 1)}
                    className="px-2 py-1 bg-gray-200 rounded text-xs"
                  >+</button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">${(item.selling_price * item.cartQuantity).toFixed(2)}</p>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 text-xs hover:underline"
                >Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Payment Method</label>
          <select 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="mobile">Mobile Payment</option>
          </select>
        </div>
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-semibold">${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (8%):</span>
            <span className="font-semibold">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold border-t pt-2">
            <span>Total:</span>
            <span className="text-teal-600">${grandTotal.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition mt-4"
          >
            Complete Sale
          </button>
        </div>
      </div>
      </div>
    </>
  );
};
