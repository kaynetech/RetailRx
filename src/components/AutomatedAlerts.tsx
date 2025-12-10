import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, AlertTriangle, CheckCircle, Mail, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AutomatedAlerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, unread: 0, critical: 0, high: 0 });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    const { data, error } = await supabase
      .from('automated_alerts')
      .select('*, inventory(name, sku)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setAlerts(data);
      setStats({
        total: data.length,
        unread: data.filter(a => !a.is_read).length,
        critical: data.filter(a => a.severity === 'critical' && !a.is_resolved).length,
        high: data.filter(a => a.severity === 'high' && !a.is_resolved).length
      });
    }
  };

  const generateAlerts = async () => {
    setLoading(true);
    try {
      // Check for low stock items
      const { data: inventory } = await supabase
        .from('inventory')
        .select('*')
        .lt('quantity', 10);

      if (inventory) {
        for (const item of inventory) {
          const severity = item.quantity === 0 ? 'critical' : item.quantity < 5 ? 'high' : 'medium';
          const alertType = item.quantity === 0 ? 'out_of_stock' : 'low_stock';
          
          await supabase.from('automated_alerts').insert({
            alert_type: alertType,
            inventory_id: item.id,
            location_id: item.location_id,
            message: `${item.name} is ${item.quantity === 0 ? 'out of stock' : 'low on stock'} (${item.quantity} units)`,
            severity
          });
        }
      }

      // Check for expiring items
      const { data: expiring } = await supabase
        .from('inventory')
        .select('*')
        .not('expiry_date', 'is', null)
        .lte('expiry_date', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());

      if (expiring) {
        for (const item of expiring) {
          const daysUntilExpiry = Math.floor((new Date(item.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          const severity = daysUntilExpiry <= 7 ? 'critical' : daysUntilExpiry <= 14 ? 'high' : 'medium';
          
          await supabase.from('automated_alerts').insert({
            alert_type: daysUntilExpiry < 0 ? 'expired' : 'expiring_soon',
            inventory_id: item.id,
            location_id: item.location_id,
            message: `${item.name} ${daysUntilExpiry < 0 ? 'has expired' : `expires in ${daysUntilExpiry} days`}`,
            severity
          });
        }
      }

      toast({ title: 'Success', description: 'Alerts generated successfully' });
      fetchAlerts();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to generate alerts', variant: 'destructive' });
    }
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    await supabase.from('automated_alerts').update({ is_read: true }).eq('id', id);
    fetchAlerts();
  };

  const resolveAlert = async (id: string) => {
    await supabase.from('automated_alerts').update({ 
      is_resolved: true, 
      resolved_at: new Date().toISOString() 
    }).eq('id', id);
    fetchAlerts();
    toast({ title: 'Alert Resolved', description: 'Alert marked as resolved' });
  };

  const sendEmailAlert = async (alert: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-email-notification', {
        body: {
          to: 'admin@retailrx.com',
          subject: `Alert: ${alert.alert_type}`,
          message: alert.message,
          severity: alert.severity
        }
      });

      if (error) throw error;

      await supabase.from('automated_alerts').update({ email_sent: true }).eq('id', alert.id);
      toast({ title: 'Email Sent', description: 'Alert notification sent via email' });
      fetchAlerts();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to send email', variant: 'destructive' });
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants: any = {
      critical: 'destructive',
      high: 'destructive',
      medium: 'default',
      low: 'secondary'
    };
    return <Badge variant={variants[severity]}>{severity.toUpperCase()}</Badge>;
  };

  const getAlertIcon = (type: string) => {
    return <AlertTriangle className="h-4 w-4" />;
  };

  const filterAlerts = (filter: string) => {
    if (filter === 'all') return alerts;
    if (filter === 'unread') return alerts.filter(a => !a.is_read);
    if (filter === 'critical') return alerts.filter(a => a.severity === 'critical' && !a.is_resolved);
    return alerts;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Automated Alerts</h2>
        <Button onClick={generateAlerts} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Generate Alerts
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.unread}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.high}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle><Bell className="inline mr-2" />Alert Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Alerts</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="critical">Critical</TabsTrigger>
            </TabsList>
            {['all', 'unread', 'critical'].map(filter => (
              <TabsContent key={filter} value={filter}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterAlerts(filter).map(alert => (
                      <TableRow key={alert.id} className={!alert.is_read ? 'bg-blue-50' : ''}>
                        <TableCell>{getAlertIcon(alert.alert_type)} {alert.alert_type}</TableCell>
                        <TableCell>{alert.message}</TableCell>
                        <TableCell>{alert.inventory?.name || 'N/A'}</TableCell>
                        <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                        <TableCell>{new Date(alert.created_at).toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {!alert.is_read && (
                              <Button size="sm" variant="outline" onClick={() => markAsRead(alert.id)}>
                                Mark Read
                              </Button>
                            )}
                            {!alert.is_resolved && (
                              <Button size="sm" onClick={() => resolveAlert(alert.id)}>
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            {!alert.email_sent && (
                              <Button size="sm" variant="outline" onClick={() => sendEmailAlert(alert)}>
                                <Mail className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}