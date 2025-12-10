import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, AlertTriangle, Calendar } from 'lucide-react';

interface ForecastItem {
  id: string;
  name: string;
  current_quantity: number;
  avg_daily_usage: number;
  days_until_stockout: number;
  predicted_stockout_date: string;
  severity: 'critical' | 'warning' | 'normal';
}

export function InventoryForecasting() {
  const [forecasts, setForecasts] = useState<ForecastItem[]>([]);

  useEffect(() => {
    calculateForecasts();
  }, []);

  const calculateForecasts = async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: sales } = await supabase
      .from('sales_transactions')
      .select('item_id, quantity, created_at')
      .gte('created_at', thirtyDaysAgo.toISOString());

    const { data: inventory } = await supabase
      .from('inventory')
      .select('id, name, quantity');

    if (!sales || !inventory) return;

    const usageByItem = sales.reduce((acc: any, sale) => {
      if (!acc[sale.item_id]) acc[sale.item_id] = 0;
      acc[sale.item_id] += sale.quantity;
      return acc;
    }, {});

    const forecasted = inventory.map((item) => {
      const totalUsage = usageByItem[item.id] || 0;
      const avgDailyUsage = totalUsage / 30;
      const daysUntilStockout = avgDailyUsage > 0 ? Math.floor(item.quantity / avgDailyUsage) : 999;
      
      const predictedDate = new Date();
      predictedDate.setDate(predictedDate.getDate() + daysUntilStockout);

      return {
        id: item.id,
        name: item.name,
        current_quantity: item.quantity,
        avg_daily_usage: Math.round(avgDailyUsage * 10) / 10,
        days_until_stockout: daysUntilStockout,
        predicted_stockout_date: predictedDate.toLocaleDateString(),
        severity: daysUntilStockout < 7 ? 'critical' : daysUntilStockout < 14 ? 'warning' : 'normal'
      };
    }).filter(f => f.days_until_stockout < 30 && f.avg_daily_usage > 0)
      .sort((a, b) => a.days_until_stockout - b.days_until_stockout);

    setForecasts(forecasted);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5" />
          Inventory Forecasting
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Avg Daily Usage</TableHead>
              <TableHead>Days Until Stockout</TableHead>
              <TableHead>Predicted Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forecasts.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.current_quantity}</TableCell>
                <TableCell>{item.avg_daily_usage}</TableCell>
                <TableCell>
                  <Badge variant={item.severity === 'critical' ? 'destructive' : 'secondary'}>
                    {item.days_until_stockout} days
                  </Badge>
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  {item.predicted_stockout_date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
