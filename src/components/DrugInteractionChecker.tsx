import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { AlertTriangle, Search, Plus, Shield } from 'lucide-react';

export default function DrugInteractionChecker() {
  const [interactions, setInteractions] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);
  const [checkResults, setCheckResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    drug1_name: '',
    drug2_name: '',
    severity: 'moderate',
    description: '',
    recommendation: ''
  });

  useEffect(() => {
    fetchInteractions();
    fetchInventory();
  }, []);

  const fetchInteractions = async () => {
    const { data } = await supabase
      .from('drug_interactions')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setInteractions(data);
  };

  const fetchInventory = async () => {
    const { data } = await supabase.from('inventory').select('id, name').eq('category', 'Prescription');
    if (data) setInventory(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('drug_interactions').insert([formData]);
    if (error) {
      toast.error('Failed to add interaction');
    } else {
      toast.success('Drug interaction added');
      setIsOpen(false);
      fetchInteractions();
      setFormData({ drug1_name: '', drug2_name: '', severity: 'moderate', description: '', recommendation: '' });
    }
  };

  const checkInteractions = () => {
    if (selectedDrugs.length < 2) {
      toast.error('Select at least 2 drugs to check');
      return;
    }

    const results: any[] = [];
    for (let i = 0; i < selectedDrugs.length; i++) {
      for (let j = i + 1; j < selectedDrugs.length; j++) {
        const interaction = interactions.find(
          int => (int.drug1_name === selectedDrugs[i] && int.drug2_name === selectedDrugs[j]) ||
                 (int.drug1_name === selectedDrugs[j] && int.drug2_name === selectedDrugs[i])
        );
        if (interaction) results.push(interaction);
      }
    }

    setCheckResults(results);
    if (results.length === 0) {
      toast.success('No known interactions found');
    } else {
      toast.warning(`Found ${results.length} interaction(s)`);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe': return 'bg-red-100 text-red-800 border-red-300';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'mild': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Drug Interaction Checker</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Interaction</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Drug Interaction</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Drug 1</Label>
                <Input value={formData.drug1_name} onChange={(e) => setFormData({...formData, drug1_name: e.target.value})} required />
              </div>
              <div>
                <Label>Drug 2</Label>
                <Input value={formData.drug2_name} onChange={(e) => setFormData({...formData, drug2_name: e.target.value})} required />
              </div>
              <div>
                <Label>Severity</Label>
                <Select value={formData.severity} onValueChange={(v) => setFormData({...formData, severity: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
              </div>
              <div>
                <Label>Recommendation</Label>
                <Textarea value={formData.recommendation} onChange={(e) => setFormData({...formData, recommendation: e.target.value})} />
              </div>
              <Button type="submit" className="w-full">Add Interaction</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Check Drug Interactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Select Drugs to Check</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {inventory.map((drug) => (
                <div key={drug.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={drug.id}
                    checked={selectedDrugs.includes(drug.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDrugs([...selectedDrugs, drug.name]);
                      } else {
                        setSelectedDrugs(selectedDrugs.filter(d => d !== drug.name));
                      }
                    }}
                    className="rounded"
                  />
                  <label htmlFor={drug.id} className="text-sm">{drug.name}</label>
                </div>
              ))}
            </div>
          </div>
          <Button onClick={checkInteractions} className="w-full">
            <Search className="h-4 w-4 mr-2" />Check Interactions
          </Button>

          {checkResults.length > 0 && (
            <div className="space-y-3 mt-4">
              <h3 className="font-semibold">Interaction Results:</h3>
              {checkResults.map((result, idx) => (
                <Alert key={idx} className={getSeverityColor(result.severity)}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="flex items-center gap-2">
                    {result.drug1_name} + {result.drug2_name}
                    <Badge variant="outline">{result.severity}</Badge>
                  </AlertTitle>
                  <AlertDescription>
                    <p className="mt-2">{result.description}</p>
                    {result.recommendation && (
                      <p className="mt-2 font-semibold">Recommendation: {result.recommendation}</p>
                    )}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Known Drug Interactions ({interactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {interactions.map((interaction) => (
              <div key={interaction.id} className={`p-3 rounded-lg border ${getSeverityColor(interaction.severity)}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{interaction.drug1_name} + {interaction.drug2_name}</div>
                    <div className="text-sm mt-1">{interaction.description}</div>
                  </div>
                  <Badge variant="outline">{interaction.severity}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
