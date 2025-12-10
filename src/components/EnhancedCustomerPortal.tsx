import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Bell, MessageSquare, FileText, Clock, User } from 'lucide-react';
import { toast } from 'sonner';

export default function EnhancedCustomerPortal() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newAppointment, setNewAppointment] = useState({ date: '', time: '', reason: '' });
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: rxData } = await supabase.from('customer_prescriptions').select('*').order('created_at', { ascending: false });
    setPrescriptions(rxData || []);
  };

  const bookAppointment = () => {
    if (!newAppointment.date || !newAppointment.time) {
      toast.error('Please fill all fields');
      return;
    }
    const appointment = { ...newAppointment, id: Date.now(), status: 'pending' };
    setAppointments([...appointments, appointment]);
    toast.success('Appointment requested successfully');
    setNewAppointment({ date: '', time: '', reason: '' });
  };

  const setMedicationReminder = (rxId: string, rxName: string) => {
    const reminder = { id: Date.now(), rxId, rxName, time: '09:00', frequency: 'Daily', active: true };
    setReminders([...reminders, reminder]);
    toast.success('Reminder set successfully');
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const message = { id: Date.now(), text: newMessage, sender: 'customer', timestamp: new Date().toLocaleString() };
    setMessages([...messages, message]);
    toast.success('Message sent to pharmacy');
    setNewMessage('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Customer Self-Service Portal</h1>

      <Tabs defaultValue="prescriptions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="prescriptions" className="space-y-4">
          {prescriptions.map(rx => (
            <Card key={rx.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{rx.medication_name}</h3>
                    <p className="text-sm">Dosage: {rx.dosage}</p>
                    <p className="text-sm">Refills: {rx.refills_remaining}</p>
                    <Badge>{rx.status}</Badge>
                  </div>
                  <Button size="sm" onClick={() => setMedicationReminder(rx.id, rx.medication_name)}>
                    <Bell className="w-4 h-4 mr-1" /> Set Reminder
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Book Consultation</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Date</Label><Input type="date" value={newAppointment.date} onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})} /></div>
              <div><Label>Time</Label><Input type="time" value={newAppointment.time} onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})} /></div>
              <div><Label>Reason</Label><Textarea value={newAppointment.reason} onChange={(e) => setNewAppointment({...newAppointment, reason: e.target.value})} /></div>
              <Button onClick={bookAppointment} className="w-full"><Calendar className="w-4 h-4 mr-2" />Book Appointment</Button>
            </CardContent>
          </Card>
          {appointments.map(apt => (
            <Card key={apt.id}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-center">
                  <div><p className="font-semibold">{apt.date} at {apt.time}</p><p className="text-sm text-muted-foreground">{apt.reason}</p></div>
                  <Badge>{apt.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="reminders" className="space-y-4">
          {reminders.map(reminder => (
            <Card key={reminder.id}>
              <CardContent className="pt-4 flex justify-between items-center">
                <div><p className="font-semibold">{reminder.rxName}</p><p className="text-sm text-muted-foreground">{reminder.frequency} at {reminder.time}</p></div>
                <Badge variant={reminder.active ? 'default' : 'secondary'}>{reminder.active ? 'Active' : 'Inactive'}</Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardContent className="pt-4 space-y-4">
              <Textarea placeholder="Type your message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
              <Button onClick={sendMessage} className="w-full"><MessageSquare className="w-4 h-4 mr-2" />Send Message</Button>
            </CardContent>
          </Card>
          {messages.map(msg => (
            <Card key={msg.id}>
              <CardContent className="pt-4">
                <div className="flex gap-2"><User className="w-5 h-5" /><div className="flex-1"><p className="text-sm">{msg.text}</p><p className="text-xs text-muted-foreground">{msg.timestamp}</p></div></div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}