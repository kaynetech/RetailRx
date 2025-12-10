import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from 'lucide-react';

export const SeedDataButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const seedData = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      // Get sample data structure
      const { data: sampleData } = await supabase.functions.invoke('seed-data', {
        body: {}
      });

      if (!sampleData?.data) throw new Error('Failed to get sample data');

      // Insert suppliers
      const { data: suppliers, error: suppError } = await supabase
        .from('suppliers')
        .insert(sampleData.data.suppliers)
        .select();

      if (suppError) throw suppError;

      // Map supplier IDs and insert inventory
      const inventoryWithSuppliers = sampleData.data.inventory.map((item: any, idx: number) => ({
        ...item,
        supplier_id: suppliers?.[item.supplier_id - 1]?.id || suppliers?.[0]?.id
      }));

      const { error: invError } = await supabase
        .from('inventory')
        .insert(inventoryWithSuppliers);

      if (invError) throw invError;

      setMessage('✓ Sample data seeded successfully!');
      setTimeout(() => window.location.reload(), 2000);
    } catch (error: any) {
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-semibold mb-2 flex items-center gap-2">
        <Database className="w-5 h-5" />
        Seed Sample Data
      </h3>
      <p className="text-sm text-gray-600 mb-3">
        Populate database with sample inventory and suppliers
      </p>
      <button
        onClick={seedData}
        disabled={loading}
        className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 disabled:opacity-50 w-full"
      >
        {loading ? 'Seeding...' : 'Seed Data'}
      </button>
      {message && (
        <p className={`text-sm mt-2 ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
};