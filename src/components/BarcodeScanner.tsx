import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Scan, Camera, Keyboard, Package } from 'lucide-react';
import BarcodeScanModal from './BarcodeScanModal';

export default function BarcodeScanner() {
  const { user } = useAuth();
  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanHistory, setScanHistory] = useState<any[]>([]);
  const [showCamera, setShowCamera] = useState(false);

  const handleScan = async (scannedCode: string) => {
    setLoading(true);
    try {
      const { data: product } = await supabase
        .from('inventory')
        .select('*')
        .eq('barcode', scannedCode)
        .single();

      if (product) {
        await supabase.from('barcode_scans').insert({
          barcode: scannedCode,
          product_id: product.id,
          scan_type: 'lookup',
          scanned_by: user?.id
        });

        setScanHistory(prev => [{ ...product, scanned_at: new Date() }, ...prev]);
        toast.success(`Found: ${product.name}`);
      } else {
        toast.error('Product not found');
      }
    } catch (error) {
      toast.error('Scan failed');
    }
    setLoading(false);
    setBarcode('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Barcode Scanner</h2>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={() => setShowCamera(true)} className="flex-1">
              <Camera className="mr-2 h-4 w-4" />
              Scan with Camera
            </Button>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Or enter barcode manually..."
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleScan(barcode)}
            />
            <Button onClick={() => handleScan(barcode)} disabled={!barcode || loading}>
              <Keyboard className="mr-2 h-4 w-4" />
              Submit
            </Button>
          </div>
        </div>
      </Card>

      {scanHistory.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Scans</h3>
          <div className="space-y-3">
            {scanHistory.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                  </div>
                </div>
                <Badge>{item.quantity} in stock</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {showCamera && <BarcodeScanModal onClose={() => setShowCamera(false)} onScan={handleScan} />}
    </div>
  );
}
