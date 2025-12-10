import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { InventoryTable } from './InventoryTable';
import { POSInterface } from './POSInterface';
import Analytics from './Analytics';
import { Suppliers } from './Suppliers';
import ExpiringItems from './ExpiringItems';
import { BarcodeHelp } from './BarcodeHelp';
import { UserManagement } from './UserManagement';
import { SalesAnalytics } from './SalesAnalytics';
import { SeedDataButton } from './SeedDataButton';
import { LocationManagement } from './LocationManagement';
import { InventoryForecasting } from './InventoryForecasting';
import { EmailNotifications } from './EmailNotifications';
import PurchaseOrders from './PurchaseOrders';
import CustomerManagement from './CustomerManagement';
import AutomatedAlerts from './AutomatedAlerts';
import PrescriptionRefills from './PrescriptionRefills';
import ReportingDashboard from './ReportingDashboard';
import BatchProcessing from './BatchProcessing';
import BarcodeScanner from './BarcodeScanner';
import InsuranceManagement from './InsuranceManagement';
import { InventoryTransfer } from './InventoryTransfer';
import { EPrescribing } from './EPrescribing';
import { LoyaltyProgram } from './LoyaltyProgram';
import ComplianceTracking from './ComplianceTracking';
import DrugInteractionChecker from './DrugInteractionChecker';
import AutomatedReorder from './AutomatedReorder';
import PrescriptionAuditTrail from './PrescriptionAuditTrail';
import SupplierAnalytics from './SupplierAnalytics';
import PatientMedicationHistory from './PatientMedicationHistory';
import PrescriptionVerification from './PrescriptionVerification';
import CustomerPrescriptionPortal from './CustomerPrescriptionPortal';
import AutomatedExpirationMonitor from './AutomatedExpirationMonitor';
import MedicationInventory from './MedicationInventory';
import EnhancedCustomerPortal from './EnhancedCustomerPortal';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';





export default function AppLayout() {
  const [activeView, setActiveView] = useState('dashboard');
  const { profile } = useAuth();

  const hasAccess = (requiredRoles: string[]) => {
    return profile && requiredRoles.includes(profile.role);
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard setActiveView={setActiveView} />;
      
      case 'inventory':
        if (!hasAccess(['admin', 'pharmacist'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to access inventory management.
              </AlertDescription>
            </Alert>
          );
        }
        return <InventoryTable />;
      
      case 'pos':
        return <POSInterface />;
      
      case 'analytics':
        if (!hasAccess(['admin', 'pharmacist'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to access analytics.
              </AlertDescription>
            </Alert>
          );
        }
        return <SalesAnalytics />;
      
      case 'seed-data':
        if (!hasAccess(['admin'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                Only administrators can seed data.
              </AlertDescription>
            </Alert>
          );
        }
        return (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Database Management</h2>
            <SeedDataButton />
          </div>
        );

      
      case 'suppliers':
        if (!hasAccess(['admin'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                Only administrators can access supplier management.
              </AlertDescription>
            </Alert>
          );
        }
        return <Suppliers />;
      
      case 'expiring':
        if (!hasAccess(['admin', 'pharmacist'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to access expiring items.
              </AlertDescription>
            </Alert>
          );
        }
        return <ExpiringItems />;
      
      case 'barcode-help':
        return <BarcodeHelp />;
      
      case 'users':
        if (!hasAccess(['admin'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                Only administrators can access user management.
              </AlertDescription>
            </Alert>
          );
        }
        return <UserManagement />;
      
      case 'locations':
        if (!hasAccess(['admin'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                Only administrators can access location management.
              </AlertDescription>
            </Alert>
          );
        }
        return <LocationManagement />;
      
      case 'forecasting':
        if (!hasAccess(['admin', 'pharmacist'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to access forecasting.
              </AlertDescription>
            </Alert>
          );
        }
        return <InventoryForecasting />;
      
      case 'notifications':
        return <EmailNotifications />;
      
      case 'purchase-orders':
        if (!hasAccess(['admin', 'pharmacist'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to access purchase orders.
              </AlertDescription>
            </Alert>
          );
        }
        return <PurchaseOrders />;
      
      case 'customers':
        if (!hasAccess(['admin', 'pharmacist', 'cashier'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to access customer management.
              </AlertDescription>
            </Alert>
          );
        }
        return <CustomerManagement />;
      
      case 'alerts':
        if (!hasAccess(['admin', 'pharmacist'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to access automated alerts.
              </AlertDescription>
            </Alert>
          );
        }
        return <AutomatedAlerts />;
      
      case 'refills':
        if (!hasAccess(['admin', 'pharmacist'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to access prescription refills.
              </AlertDescription>
            </Alert>
          );
        }
        return <PrescriptionRefills />;
      
      case 'reports':
        if (!hasAccess(['admin', 'pharmacist'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to access reports.
              </AlertDescription>
            </Alert>
          );
        }
        return <ReportingDashboard />;
      
      case 'batch':
        if (!hasAccess(['admin', 'pharmacist'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to access batch processing.
              </AlertDescription>
            </Alert>
          );
        }
        return <BatchProcessing />;
      
      case 'barcode-scanner':
        if (!hasAccess(['admin', 'pharmacist', 'cashier'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to access barcode scanner.
              </AlertDescription>
            </Alert>
          );
        }
        return <BarcodeScanner />;
      
      case 'advanced-analytics':
        if (!hasAccess(['admin', 'pharmacist'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to access advanced analytics.
              </AlertDescription>
            </Alert>
          );
        }
        return <Analytics />;
      
      case 'insurance':
        if (!hasAccess(['admin', 'pharmacist'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to access insurance management.
              </AlertDescription>
            </Alert>
          );
        }
        return <InsuranceManagement />;
      
      case 'inventory-transfer':
        if (!hasAccess(['admin', 'pharmacist'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to access inventory transfers.
              </AlertDescription>
            </Alert>
          );
        }
        return <InventoryTransfer />;
      
      case 'e-prescribing':
        if (!hasAccess(['admin', 'pharmacist'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to access e-prescribing.
              </AlertDescription>
            </Alert>
          );
        }
        return <EPrescribing />;
      
      case 'loyalty':
        if (!hasAccess(['admin', 'pharmacist', 'cashier'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to access loyalty program.
              </AlertDescription>
            </Alert>
          );
        }
        return <LoyaltyProgram />;

      
      case 'compliance':
        if (!hasAccess(['admin', 'pharmacist'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to access compliance tracking.
              </AlertDescription>
            </Alert>
          );
        }
        return <ComplianceTracking />;
      
      case 'drug-interactions':
        if (!hasAccess(['admin', 'pharmacist'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to access drug interaction checker.
              </AlertDescription>
            </Alert>
          );
        }
        return <DrugInteractionChecker />;
      
      case 'automated-reorder':
        if (!hasAccess(['admin', 'pharmacist'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to access automated reorder.
              </AlertDescription>
            </Alert>
          );
        }
        return <AutomatedReorder />;
      
      case 'prescription-audit':
        if (!hasAccess(['admin', 'pharmacist'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to access prescription audit trail.
              </AlertDescription>
            </Alert>
          );
        }
        return <PrescriptionAuditTrail />;
      
      case 'supplier-analytics':
        if (!hasAccess(['admin', 'pharmacist'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to access supplier analytics.
              </AlertDescription>
            </Alert>
          );
        }
        return <SupplierAnalytics />;
      
      case 'patient-history':
        if (!hasAccess(['admin', 'pharmacist'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to access patient medication history.
              </AlertDescription>
            </Alert>
          );
        }
        return <PatientMedicationHistory />;
      
      case 'prescription-verification':
        if (!hasAccess(['admin', 'pharmacist'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to access prescription verification.
              </AlertDescription>
            </Alert>
          );
        }
        return <PrescriptionVerification />;
      
      case 'customer-portal':
        if (!hasAccess(['admin', 'pharmacist', 'cashier'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to access customer prescription portal.
              </AlertDescription>
            </Alert>
          );
        }
        return <CustomerPrescriptionPortal />;
      
      case 'medication-inventory':
        if (!hasAccess(['admin', 'pharmacist'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to access medication inventory.
              </AlertDescription>
            </Alert>
          );
        }
        return <MedicationInventory />;
      
      case 'expiration-monitor':
        if (!hasAccess(['admin', 'pharmacist'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to access expiration monitor.
              </AlertDescription>
            </Alert>
          );
        }
        return <AutomatedExpirationMonitor />;
      
      case 'enhanced-portal':
        if (!hasAccess(['admin', 'pharmacist', 'cashier'])) {
          return (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to access enhanced customer portal.
              </AlertDescription>
            </Alert>
          );
        }
        return <EnhancedCustomerPortal />;
      
      default:
        return <Dashboard setActiveView={setActiveView} />;
    }









  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 ml-64">
        <main className="p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

