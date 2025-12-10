import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Play, Pause, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function AutomatedExpirationMonitor() {
  const [monitoring, setMonitoring] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, critical: 0, warning: 0, resolved: 0 });
  const [autoNotify, setAutoNotify] = useState(true);
  const [lastScan, setLastScan] = useState<string>('');

  useEffect(() => {
    fetchAlerts();
    const interval = monitoring ? setInterval(runMonitoring, 60000) : null;
    return () => { if (interval) clearInterval(interval); };
  }, [monitoring]);

  const fetchAlerts = async () => {
    const { data } = await supabase.from('expiration_alerts').select('*').order('created_at', { ascending: false }).limit(20);
    setAlerts(data || []);
    calculateStats(data || []);
  };

  const calculateStats = (data: any[]) => {
    setStats({
      total: data.length,
      critical: data.filter(a => a.alert_level === 'critical' && a.status === 'active').length,
      warning: data.filter(a => a.alert_level === 'warning' && a.status === 'active').length,
      resolved: data.filter(a => a.status === 'resolved').length
    });
  };

  const runMonitoring = async () => {
    setLastScan(new Date().toLocaleString());
    const { data: inventory } = await supabase.from('inventory').select('*');
    
    if (inventory) {
      for (const item of inventory) {
        if (item.expiry_date) {
          const days = Math.floor((new Date(item.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          let alertLevel = 'info';
          if (days <= 7) alertLevel = 'critical';
          else if (days <= 30) alertLevel = 'warning';

          if (days <= 90) {
            await supabase.from('expiration_alerts').upsert({
              item_name: item.name,
              sku: item.barcode || item.id,
              batch_number: `BATCH-${item.id.slice(0, 8)}`,
              quantity: item.quantity,
              expiration_date: item.expiry_date,
              days_until_expiration: days,
              alert_level: alertLevel,
              location: 'Main Warehouse',
              status: 'active'
            }, { onConflict: 'sku,batch_number' });
          }
        }
      }
      fetchAlerts();
      if (autoNotify) toast.success('Monitoring scan completed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Automated Expiration Monitor</h1>
        <Button onClick={() => setMonitoring(!monitoring)} variant={monitoring ? 'destructive' : 'default'}>
          {monitoring ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {monitoring ? 'Stop' : 'Start'} Monitoring
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm">Total Alerts</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{stats.total}</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm">Critical</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-red-600">{stats.critical}</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm">Warning</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-orange-600">{stats.warning}</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm">Resolved</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-green-600">{stats.resolved}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Monitor Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Auto Notifications</Label>
            <Switch checked={autoNotify} onCheckedChange={setAutoNotify} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Status</Label>
            <Badge variant={monitoring ? 'default' : 'secondary'}>{monitoring ? 'Active' : 'Inactive'}</Badge>
          </div>
          {lastScan && <p className="text-sm text-muted-foreground">Last Scan: {lastScan}</p>}
          <Button onClick={runMonitoring} className="w-full"><Bell className="w-4 h-4 mr-2" />Run Manual Scan</Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Recent Alerts</h2>
        {alerts.slice(0, 10).map(alert => (
          <Card key={alert.id}>
            <CardContent className="pt-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                {alert.status === 'resolved' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertTriangle className="w-5 h-5 text-orange-600" />}
                <div>
                  <p className="font-semibold">{alert.item_name}</p>
                  <p className="text-sm text-muted-foreground">Expires: {alert.expiration_date} ({alert.days_until_expiration} days)</p>
                </div>
              </div>
              <Badge variant={alert.alert_level === 'critical' ? 'destructive' : 'default'}>{alert.alert_level}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}