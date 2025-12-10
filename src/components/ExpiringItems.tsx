import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ExpiringItems() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState('all');
  const [stats, setStats] = useState({ critical: 0, warning: 0, info: 0 });

  useEffect(() => {
    fetchAlerts();
  }, [filterLevel]);

  const fetchAlerts = async () => {
    setLoading(true);
    let query = supabase.from('expiration_alerts').select('*').eq('status', 'active').order('expiration_date', { ascending: true });
    
    if (filterLevel !== 'all') {
      query = query.eq('alert_level', filterLevel);
    }

    const { data, error } = await query;
    if (error) {
      toast.error('Failed to fetch expiration alerts');
    } else {
      setAlerts(data || []);
      calculateStats(data || []);
    }
    setLoading(false);
  };

  const calculateStats = (data: any[]) => {
    const critical = data.filter(a => a.alert_level === 'critical').length;
    const warning = data.filter(a => a.alert_level === 'warning').length;
    const info = data.filter(a => a.alert_level === 'info').length;
    setStats({ critical, warning, info });
  };

  const resolveAlert = async (id: string, action: string) => {
    const { error } = await supabase.from('expiration_alerts').update({
      status: 'resolved',
      action_taken: action,
      resolved_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }).eq('id', id);

    if (error) {
      toast.error('Failed to resolve alert');
    } else {
      toast.success('Alert resolved successfully');
      fetchAlerts();
    }
  };

  const getAlertBadge = (level: string) => {
    const colors: any = { critical: 'destructive', warning: 'default', info: 'secondary' };
    return <Badge variant={colors[level]}>{level.toUpperCase()}</Badge>;
  };

  const getDaysColor = (days: number) => {
    if (days <= 7) return 'text-red-600';
    if (days <= 30) return 'text-orange-600';
    return 'text-yellow-600';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Expiring Items</h1>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{stats.critical}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Warning</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">{stats.warning}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Info</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{stats.info}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <Select value={filterLevel} onValueChange={setFilterLevel}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="info">Info</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {alerts.map((alert) => (
          <Card key={alert.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    <h3 className="font-semibold">{alert.item_name}</h3>
                    {getAlertBadge(alert.alert_level)}
                  </div>
                  <p className="text-sm">SKU: {alert.sku} | Batch: {alert.batch_number}</p>
                  <p className="text-sm">Quantity: {alert.quantity} | Location: {alert.location}</p>
                  <p className={`text-sm font-semibold ${getDaysColor(alert.days_until_expiration)}`}>
                    Expires: {alert.expiration_date} ({alert.days_until_expiration} days)
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => resolveAlert(alert.id, 'Returned to supplier')}>
                    <CheckCircle className="w-4 h-4 mr-1" /> Return
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => resolveAlert(alert.id, 'Disposed')}>
                    <Trash2 className="w-4 h-4 mr-1" /> Dispose
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}