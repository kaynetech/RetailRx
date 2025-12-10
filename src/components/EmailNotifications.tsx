import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Bell, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationPreferences {
  low_stock_alerts: boolean;
  daily_sales_report: boolean;
  expiring_items_alert: boolean;
  email: string;
}

export function EmailNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [prefs, setPrefs] = useState<NotificationPreferences>({
    low_stock_alerts: true,
    daily_sales_report: true,
    expiring_items_alert: true,
    email: user?.email || ''
  });

  useEffect(() => {
    fetchPreferences();
  }, [user]);

  const fetchPreferences = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setPrefs({
        low_stock_alerts: data.low_stock_alerts,
        daily_sales_report: data.daily_sales_report,
        expiring_items_alert: data.expiring_items_alert,
        email: data.email
      });
    }
  };

  const savePreferences = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id: user.id,
        ...prefs
      });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Notification preferences saved' });
    }
  };

  const sendTestEmail = async () => {
    const { data, error } = await supabase.functions.invoke('send-email-notification', {
      body: {
        to: prefs.email,
        subject: 'Test Notification - RetailRx',
        body: 'This is a test email notification from your RetailRx pharmacy management system.',
        notificationType: 'test',
        userId: user?.id
      }
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Test email sent successfully' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Email Address</Label>
          <Input
            type="email"
            value={prefs.email}
            onChange={(e) => setPrefs({ ...prefs, email: e.target.value })}
            className="mt-2"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Low Stock Alerts</Label>
              <p className="text-sm text-gray-500">Get notified when items are running low</p>
            </div>
            <Switch
              checked={prefs.low_stock_alerts}
              onCheckedChange={(checked) => setPrefs({ ...prefs, low_stock_alerts: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Daily Sales Report</Label>
              <p className="text-sm text-gray-500">Receive daily sales summary</p>
            </div>
            <Switch
              checked={prefs.daily_sales_report}
              onCheckedChange={(checked) => setPrefs({ ...prefs, daily_sales_report: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Expiring Items Alert</Label>
              <p className="text-sm text-gray-500">Get alerts for items nearing expiry</p>
            </div>
            <Switch
              checked={prefs.expiring_items_alert}
              onCheckedChange={(checked) => setPrefs({ ...prefs, expiring_items_alert: checked })}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={savePreferences}>Save Preferences</Button>
          <Button variant="outline" onClick={sendTestEmail}>
            <Send className="h-4 w-4 mr-2" />
            Send Test Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
