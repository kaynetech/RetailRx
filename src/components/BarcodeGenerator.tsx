import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Barcode } from 'lucide-react';

export default function BarcodeGenerator() {
  const [loading, setLoading] = useState(false);

  const generateBarcodes = async () => {
    setLoading(true);
    try {
      const { data: items } = await supabase
        .from('inventory')
        .select('id, sku')
        .is('barcode', null);

      if (items && items.length > 0) {
        for (const item of items) {
          const barcode = `${item.sku}${Math.floor(Math.random() * 10000)}`;
          await supabase
            .from('inventory')
            .update({ barcode })
            .eq('id', item.id);
        }
        toast.success(`Generated barcodes for ${items.length} items`);
      } else {
        toast.info('All items already have barcodes');
      }
    } catch (error) {
      toast.error('Failed to generate barcodes');
    }
    setLoading(false);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Barcode Generator</h3>
          <p className="text-sm text-gray-600">Generate barcodes for inventory items</p>
        </div>
        <Button onClick={generateBarcodes} disabled={loading}>
          <Barcode className="mr-2 h-4 w-4" />
          {loading ? 'Generating...' : 'Generate Barcodes'}
        </Button>
      </div>
    </Card>
  );
}
