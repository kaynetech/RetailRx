import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Package, Calendar } from 'lucide-react';
import { StockAlert } from '@/contexts/AppContext';

export const LowStockAlerts = () => {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);

  useEffect(() => {
    fetchAlerts();
    const subscription = supabase
      .channel('alerts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stock_alerts' }, fetchAlerts)
      .subscribe();
    return () => { subscription.unsubscribe(); };
  }, []);

  const fetchAlerts = async () => {
    const { data } = await supabase
      .from('stock_alerts')
      .select('*, inventory(name)')
      .eq('resolved', false)
      .order('created_at', { ascending: false });
    setAlerts(data || []);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Stock Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active alerts</p>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                {alert.alert_type === 'low_stock' && <Package className="h-5 w-5 text-orange-500 mt-0.5" />}
                {alert.alert_type === 'expiring_soon' && <Calendar className="h-5 w-5 text-red-500 mt-0.5" />}
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <Badge variant={getSeverityColor(alert.severity)} className="mt-1">{alert.severity}</Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
