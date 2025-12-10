import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  address: string;
}

interface LocationSelectorProps {
  value: string;
  onChange: (locationId: string) => void;
}

export function LocationSelector({ value, onChange }: LocationSelectorProps) {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    const { data } = await supabase
      .from('locations')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (data) setLocations(data);
  };

  return (
    <div className="flex items-center gap-2">
      <MapPin className="h-5 w-5 text-gray-500" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          {locations.map((loc) => (
            <SelectItem key={loc.id} value={loc.id}>
              {loc.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
