import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Package, 
  CreditCard, 
  TrendingUp, 
  Building2, 
  Clock, 
  Barcode,
  User,
  LogOut,
  Database,
  MapPin,
  TrendingDown,
  Mail,
  ShoppingCart,
  Users,
  Bell,
  RefreshCw,
  FileText,
  Layers,
  Scan,
  BarChart3,
  Shield,
  Truck,
  FileCheck,
  Gift,
  ClipboardCheck,
  Pill,
  PackageCheck,
  History,
  LineChart,
  Calendar,
  CheckSquare,
  AlertCircle,
  FileSearch,
  Activity,
  Boxes,
  UserCog
} from 'lucide-react';






import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'pharmacist', 'cashier'] },
    { id: 'inventory', label: 'Inventory', icon: Package, roles: ['admin', 'pharmacist'] },
    { id: 'medication-inventory', label: 'Medication Inventory', icon: Boxes, roles: ['admin', 'pharmacist'] },
    { id: 'pos', label: 'Point of Sale', icon: CreditCard, roles: ['admin', 'pharmacist', 'cashier'] },
    { id: 'barcode-scanner', label: 'Barcode Scanner', icon: Scan, roles: ['admin', 'pharmacist', 'cashier'] },
    { id: 'customers', label: 'Customers', icon: Users, roles: ['admin', 'pharmacist', 'cashier'] },
    { id: 'refills', label: 'Prescription Refills', icon: RefreshCw, roles: ['admin', 'pharmacist'] },
    { id: 'e-prescribing', label: 'E-Prescribing', icon: FileCheck, roles: ['admin', 'pharmacist'] },
    { id: 'prescription-verification', label: 'Prescription Verification', icon: CheckSquare, roles: ['admin', 'pharmacist'] },
    { id: 'prescription-audit', label: 'Prescription Audit', icon: History, roles: ['admin', 'pharmacist'] },
    { id: 'patient-history', label: 'Patient Medication', icon: Calendar, roles: ['admin', 'pharmacist'] },
    { id: 'customer-portal', label: 'Customer Portal', icon: FileSearch, roles: ['admin', 'pharmacist', 'cashier'] },
    { id: 'enhanced-portal', label: 'Self-Service Portal', icon: UserCog, roles: ['admin', 'pharmacist', 'cashier'] },
    { id: 'insurance', label: 'Insurance Claims', icon: Shield, roles: ['admin', 'pharmacist'] },
    { id: 'loyalty', label: 'Loyalty Program', icon: Gift, roles: ['admin', 'pharmacist', 'cashier'] },
    { id: 'compliance', label: 'Compliance Tracking', icon: ClipboardCheck, roles: ['admin', 'pharmacist'] },
    { id: 'drug-interactions', label: 'Drug Interactions', icon: Pill, roles: ['admin', 'pharmacist'] },
    { id: 'automated-reorder', label: 'Automated Reorder', icon: PackageCheck, roles: ['admin', 'pharmacist'] },
    { id: 'purchase-orders', label: 'Purchase Orders', icon: ShoppingCart, roles: ['admin', 'pharmacist'] },
    { id: 'advanced-analytics', label: 'Advanced Analytics', icon: BarChart3, roles: ['admin', 'pharmacist'] },
    { id: 'analytics', label: 'Sales Analytics', icon: TrendingUp, roles: ['admin', 'pharmacist'] },
    { id: 'reports', label: 'Reports', icon: FileText, roles: ['admin', 'pharmacist'] },
    { id: 'forecasting', label: 'Forecasting', icon: TrendingDown, roles: ['admin', 'pharmacist'] },
    { id: 'alerts', label: 'Automated Alerts', icon: Bell, roles: ['admin', 'pharmacist'] },
    { id: 'batch', label: 'Batch Processing', icon: Layers, roles: ['admin', 'pharmacist'] },
    { id: 'suppliers', label: 'Suppliers', icon: Building2, roles: ['admin'] },
    { id: 'supplier-analytics', label: 'Supplier Analytics', icon: LineChart, roles: ['admin', 'pharmacist'] },
    { id: 'locations', label: 'Locations', icon: MapPin, roles: ['admin'] },
    { id: 'inventory-transfer', label: 'Inventory Transfer', icon: Truck, roles: ['admin', 'pharmacist'] },
    { id: 'expiring', label: 'Expiring Items', icon: Clock, roles: ['admin', 'pharmacist'] },
    { id: 'expiration-monitor', label: 'Expiration Monitor', icon: Activity, roles: ['admin', 'pharmacist'] },
    { id: 'notifications', label: 'Notifications', icon: Mail, roles: ['admin', 'pharmacist', 'cashier'] },
    { id: 'users', label: 'User Management', icon: User, roles: ['admin'] },
    { id: 'seed-data', label: 'Seed Data', icon: Database, roles: ['admin'] },
    { id: 'barcode-help', label: 'Barcode Guide', icon: Barcode, roles: ['admin', 'pharmacist', 'cashier'] }
  ];







  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const filteredMenuItems = menuItems.filter(item => 
    profile && item.roles.includes(profile.role)
  );

  return (
    <div className="w-64 bg-gradient-to-b from-teal-700 to-teal-900 text-white h-screen fixed left-0 top-0 shadow-xl flex flex-col">
      <div className="p-6 border-b border-teal-600">
        <h1 className="text-2xl font-bold">RetailRx</h1>
        <p className="text-teal-200 text-sm mt-1">Pharmacy Management</p>
      </div>
      <nav className="mt-6 flex-1 overflow-y-auto">
        {filteredMenuItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full text-left px-6 py-3 flex items-center space-x-3 transition-colors ${
                activeView === item.id 
                  ? 'bg-teal-600 border-l-4 border-white' 
                  : 'hover:bg-teal-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-teal-600">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar>
            <AvatarFallback className="bg-teal-600">
              {profile?.full_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile?.full_name || 'User'}</p>
            <p className="text-xs text-teal-200 capitalize">{profile?.role}</p>
          </div>
        </div>
        <Button
          onClick={() => navigate('/profile')}
          variant="outline"
          size="sm"
          className="w-full mb-2 text-teal-900 hover:bg-teal-100"
        >
          <User className="w-4 h-4 mr-2" />
          Profile
        </Button>
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="w-full text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

