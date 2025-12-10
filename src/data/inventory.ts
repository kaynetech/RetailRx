export interface Product {
  id: string;
  name: string;
  category: 'prescription' | 'otc' | 'supplement' | 'retail';
  quantity: number;
  reorderPoint: number;
  price: number;
  cost: number;
  batchNumber: string;
  expiryDate: string;
  supplier: string;
  barcode: string;
  image: string;
}

export const inventoryData: Product[] = [
  { id: 'P001', name: 'Amoxicillin 500mg', category: 'prescription', quantity: 245, reorderPoint: 100, price: 12.99, cost: 6.50, batchNumber: 'BT2024-001', expiryDate: '2025-08-15', supplier: 'PharmaCorp', barcode: '8901234567890', image: 'https://d64gsuwffb70l.cloudfront.net/69130514ea29171d130c09d6_1762854292353_2eadb3e7.webp' },
  { id: 'P002', name: 'Lisinopril 10mg', category: 'prescription', quantity: 180, reorderPoint: 80, price: 15.50, cost: 7.75, batchNumber: 'BT2024-002', expiryDate: '2025-12-20', supplier: 'PharmaCorp', barcode: '8901234567891', image: 'https://d64gsuwffb70l.cloudfront.net/69130514ea29171d130c09d6_1762854294083_8adec686.webp' },
  { id: 'P003', name: 'Metformin 850mg', category: 'prescription', quantity: 65, reorderPoint: 100, price: 18.99, cost: 9.50, batchNumber: 'BT2024-003', expiryDate: '2025-03-10', supplier: 'MediSupply', barcode: '8901234567892', image: 'https://d64gsuwffb70l.cloudfront.net/69130514ea29171d130c09d6_1762854295794_3670ea20.webp' },
  { id: 'P004', name: 'Atorvastatin 20mg', category: 'prescription', quantity: 320, reorderPoint: 150, price: 22.50, cost: 11.25, batchNumber: 'BT2024-004', expiryDate: '2026-01-05', supplier: 'PharmaCorp', barcode: '8901234567893', image: 'https://d64gsuwffb70l.cloudfront.net/69130514ea29171d130c09d6_1762854297510_c9d56eb1.webp' },
  { id: 'P005', name: 'Omeprazole 40mg', category: 'prescription', quantity: 42, reorderPoint: 75, price: 14.75, cost: 7.40, batchNumber: 'BT2024-005', expiryDate: '2025-02-28', supplier: 'MediSupply', barcode: '8901234567894', image: 'https://d64gsuwffb70l.cloudfront.net/69130514ea29171d130c09d6_1762854299219_1696701c.webp' },
  { id: 'P006', name: 'Levothyroxine 100mcg', category: 'prescription', quantity: 210, reorderPoint: 90, price: 16.99, cost: 8.50, batchNumber: 'BT2024-006', expiryDate: '2025-11-15', supplier: 'PharmaCorp', barcode: '8901234567895', image: 'https://d64gsuwffb70l.cloudfront.net/69130514ea29171d130c09d6_1762854301338_63205c05.webp' }
];
