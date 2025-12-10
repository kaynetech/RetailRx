import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, FileText, Clock } from 'lucide-react';

export default function PrescriptionAuditTrail() {
  const [auditRecords, setAuditRecords] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditRecords();
  }, []);

  const fetchAuditRecords = async () => {
    const { data, error } = await supabase
      .from('prescription_audit_trail')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setAuditRecords(data);
    }
    setLoading(false);
  };

  const filteredRecords = auditRecords.filter(record =>
    record.action_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.performed_by_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.action_description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActionBadge = (action: string) => {
    const colors: any = {
      created: 'bg-green-500',
      updated: 'bg-blue-500',
      dispensed: 'bg-purple-500',
      cancelled: 'bg-red-500',
      verified: 'bg-teal-500'
    };
    return colors[action.toLowerCase()] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Prescription Audit Trail</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditRecords.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search audit records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prescription ID</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Performed By</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-mono text-xs">{record.prescription_id?.slice(0, 8)}...</TableCell>
                  <TableCell>
                    <Badge className={getActionBadge(record.action_type)}>
                      {record.action_type}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.action_description}</TableCell>
                  <TableCell>{record.performed_by_name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(record.created_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}