import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  quantity: number;
  unit: string;
  cost_price: number;
  selling_price: number;
  supplier?: string;
  expiry_date?: string;
  barcode?: string;
  reorder_level?: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  products?: string[];
  payment_terms?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Sale {
  id: string;
  transaction_number: string;
  items: any[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  payment_method: string;
  cashier_id?: string;
  cashier_name?: string;
  customer_name?: string;
  customer_phone?: string;
  notes?: string;
  status?: string;
  created_at: string;
}

export interface StockAlert {
  id: string;
  inventory_id: string;
  alert_type: string;
  message: string;
  severity: string;
  is_read: boolean;
  created_at: string;
}


interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  inventory: InventoryItem[];
  suppliers: Supplier[];
  sales: Sale[];
  loading: boolean;
  selectedLocation: string;
  setSelectedLocation: (locationId: string) => void;
  fetchInventory: () => Promise<void>;
  fetchSuppliers: () => Promise<void>;
  fetchSales: () => Promise<void>;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => Promise<void>;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => Promise<void>;
  deleteInventoryItem: (id: string) => Promise<void>;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => Promise<void>;
  updateSupplier: (id: string, updates: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
  addSale: (sale: Omit<Sale, 'id' | 'created_at'>) => Promise<void>;
}


const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');


  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase.from('inventory').select('*').order('name');
      if (error) throw error;
      setInventory(data || []);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const fetchSuppliers = async () => {
    try {
      const { data, error } = await supabase.from('suppliers').select('*').order('name');
      if (error) throw error;
      setSuppliers(data || []);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const fetchSales = async () => {
    try {
      const { data, error } = await supabase.from('sales_transactions').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setSales(data || []);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };


  const addInventoryItem = async (item: Omit<InventoryItem, 'id'>) => {
    try {
      const { error } = await supabase.from('inventory').insert([item]);
      if (error) throw error;
      await fetchInventory();
      toast({ title: 'Success', description: 'Item added successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      const { error } = await supabase.from('inventory').update(updates).eq('id', id);
      if (error) throw error;
      await fetchInventory();
      toast({ title: 'Success', description: 'Item updated successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const deleteInventoryItem = async (id: string) => {
    try {
      const { error } = await supabase.from('inventory').delete().eq('id', id);
      if (error) throw error;
      await fetchInventory();
      toast({ title: 'Success', description: 'Item deleted successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const addSupplier = async (supplier: Omit<Supplier, 'id'>) => {
    try {
      const { error } = await supabase.from('suppliers').insert([supplier]);
      if (error) throw error;
      await fetchSuppliers();
      toast({ title: 'Success', description: 'Supplier added successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const updateSupplier = async (id: string, updates: Partial<Supplier>) => {
    try {
      const { error } = await supabase.from('suppliers').update(updates).eq('id', id);
      if (error) throw error;
      await fetchSuppliers();
      toast({ title: 'Success', description: 'Supplier updated successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      const { error } = await supabase.from('suppliers').delete().eq('id', id);
      if (error) throw error;
      await fetchSuppliers();
      toast({ title: 'Success', description: 'Supplier deleted successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const addSale = async (sale: Omit<Sale, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase.from('sales_transactions').insert([sale]);
      if (error) throw error;
      await fetchSales();
      toast({ title: 'Success', description: 'Sale recorded successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };


  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchInventory(), fetchSuppliers(), fetchSales()]);
      setLoading(false);
    };
    loadData();

    // Real-time subscriptions
    const inventorySubscription = supabase
      .channel('inventory-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, () => {
        fetchInventory();
      })
      .subscribe();

    const salesSubscription = supabase
      .channel('sales-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sales_transactions' }, () => {
        fetchSales();
      })
      .subscribe();


    return () => {
      inventorySubscription.unsubscribe();
      salesSubscription.unsubscribe();
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        inventory,
        suppliers,
        sales,
        loading,
        selectedLocation,
        setSelectedLocation,
        fetchInventory,
        fetchSuppliers,
        fetchSales,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addSale,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

