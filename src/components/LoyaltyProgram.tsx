import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Gift, Plus, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LoyaltyAccount {
  id: string;
  customer_id: string;
  points_balance: number;
  tier: string;
  member_since: string;
  customers: { name: string; email: string };
}

export function LoyaltyProgram() {
  const [accounts, setAccounts] = useState<LoyaltyAccount[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [formData, setFormData] = useState({ customer_id: '' });
  const [transactionData, setTransactionData] = useState({ transaction_type: 'earn', points: 0, description: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchAccounts();
    fetchCustomers();
  }, []);

  const fetchAccounts = async () => {
    const { data } = await supabase.from('loyalty_accounts')
      .select('*, customers(name, email)')
      .order('points_balance', { ascending: false });
    if (data) setAccounts(data);
  };

  const fetchCustomers = async () => {
    const { data } = await supabase.from('customers').select('*');
    if (data) setCustomers(data);
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('loyalty_accounts').insert([formData]);
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Loyalty account created' });
      setIsOpen(false);
      setFormData({ customer_id: '' });
      fetchAccounts();
    }
  };

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    const pointsChange = transactionData.transaction_type === 'redeem' ? -Math.abs(transactionData.points) : Math.abs(transactionData.points);
    
    const { error: txError } = await supabase.from('loyalty_transactions')
      .insert([{ account_id: selectedAccount, ...transactionData, points: pointsChange }]);
    
    if (!txError) {
      const { data: account } = await supabase.from('loyalty_accounts')
        .select('points_balance')
        .eq('id', selectedAccount)
        .single();
      
      const newBalance = (account?.points_balance || 0) + pointsChange;
      let newTier = 'bronze';
      if (newBalance >= 10000) newTier = 'platinum';
      else if (newBalance >= 5000) newTier = 'gold';
      else if (newBalance >= 2000) newTier = 'silver';
      
      await supabase.from('loyalty_accounts')
        .update({ points_balance: newBalance, tier: newTier, last_activity: new Date().toISOString() })
        .eq('id', selectedAccount);
      
      toast({ title: 'Success', description: 'Transaction recorded' });
      setIsTransactionOpen(false);
      setTransactionData({ transaction_type: 'earn', points: 0, description: '' });
      fetchAccounts();
    }
  };

  const getTierBadge = (tier: string) => {
    const colors: any = { bronze: 'secondary', silver: 'secondary', gold: 'default', platinum: 'default' };
    return <Badge variant={colors[tier]}>{tier.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Loyalty Rewards Program
          </CardTitle>
          <div className="space-x-2">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />New Account</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Create Loyalty Account</DialogTitle></DialogHeader>
                <form onSubmit={handleCreateAccount} className="space-y-4">
                  <div>
                    <Label>Customer</Label>
                    <Select value={formData.customer_id} onValueChange={(v) => setFormData({...formData, customer_id: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit">Create Account</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Member Since</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.customers?.name}</TableCell>
                  <TableCell>{account.customers?.email}</TableCell>
                  <TableCell className="font-bold">{account.points_balance}</TableCell>
                  <TableCell>{getTierBadge(account.tier)}</TableCell>
                  <TableCell>{new Date(account.member_since).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => { setSelectedAccount(account.id); setIsTransactionOpen(true); }}>
                      <Award className="h-4 w-4 mr-1" />Transaction
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isTransactionOpen} onOpenChange={setIsTransactionOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Record Transaction</DialogTitle></DialogHeader>
          <form onSubmit={handleTransaction} className="space-y-4">
            <div>
              <Label>Type</Label>
              <Select value={transactionData.transaction_type} onValueChange={(v) => setTransactionData({...transactionData, transaction_type: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="earn">Earn Points</SelectItem>
                  <SelectItem value="redeem">Redeem Points</SelectItem>
                  <SelectItem value="bonus">Bonus Points</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Points</Label>
              <Input type="number" value={transactionData.points} onChange={(e) => setTransactionData({...transactionData, points: parseInt(e.target.value)})} required />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={transactionData.description} onChange={(e) => setTransactionData({...transactionData, description: e.target.value})} />
            </div>
            <Button type="submit">Record Transaction</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
