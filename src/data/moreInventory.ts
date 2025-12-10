import { Product } from './inventory';

export const otcProducts: Product[] = [
  { id: 'O001', name: 'Ibuprofen 400mg', category: 'otc', quantity: 450, reorderPoint: 200, price: 8.99, cost: 4.50, batchNumber: 'OTC2024-001', expiryDate: '2026-05-20', supplier: 'HealthPlus', barcode: '8901234567896', image: 'https://d64gsuwffb70l.cloudfront.net/69130514ea29171d130c09d6_1762854309852_3765178d.webp' },
  { id: 'O002', name: 'Acetaminophen 500mg', category: 'otc', quantity: 380, reorderPoint: 180, price: 7.50, cost: 3.75, batchNumber: 'OTC2024-002', expiryDate: '2026-07-10', supplier: 'HealthPlus', barcode: '8901234567897', image: 'https://d64gsuwffb70l.cloudfront.net/69130514ea29171d130c09d6_1762854311730_7389c172.webp' },
  { id: 'O003', name: 'Antihistamine Tablets', category: 'otc', quantity: 28, reorderPoint: 50, price: 9.99, cost: 5.00, batchNumber: 'OTC2024-003', expiryDate: '2025-04-15', supplier: 'MediSupply', barcode: '8901234567898', image: 'https://d64gsuwffb70l.cloudfront.net/69130514ea29171d130c09d6_1762854313607_72f00c0e.webp' },
  { id: 'O004', name: 'Cough Syrup 200ml', category: 'otc', quantity: 155, reorderPoint: 75, price: 11.50, cost: 5.75, batchNumber: 'OTC2024-004', expiryDate: '2025-09-30', supplier: 'HealthPlus', barcode: '8901234567899', image: 'https://d64gsuwffb70l.cloudfront.net/69130514ea29171d130c09d6_1762854315738_d541b078.webp' }
];

export const supplements: Product[] = [
  { id: 'S001', name: 'Vitamin D3 5000IU', category: 'supplement', quantity: 520, reorderPoint: 250, price: 14.99, cost: 7.50, batchNumber: 'SUP2024-001', expiryDate: '2026-12-31', supplier: 'VitaHealth', barcode: '8901234567900', image: 'https://d64gsuwffb70l.cloudfront.net/69130514ea29171d130c09d6_1762854302809_124fbbb0.webp' },
  { id: 'S002', name: 'Omega-3 Fish Oil', category: 'supplement', quantity: 340, reorderPoint: 150, price: 19.99, cost: 10.00, batchNumber: 'SUP2024-002', expiryDate: '2026-08-15', supplier: 'VitaHealth', barcode: '8901234567901', image: 'https://d64gsuwffb70l.cloudfront.net/69130514ea29171d130c09d6_1762854305065_a799f743.webp' },
  { id: 'S003', name: 'Multivitamin Complex', category: 'supplement', quantity: 290, reorderPoint: 120, price: 16.50, cost: 8.25, batchNumber: 'SUP2024-003', expiryDate: '2026-10-20', supplier: 'VitaHealth', barcode: '8901234567902', image: 'https://d64gsuwffb70l.cloudfront.net/69130514ea29171d130c09d6_1762854307420_145e3150.webp' },
  { id: 'S004', name: 'Calcium + Magnesium', category: 'supplement', quantity: 410, reorderPoint: 180, price: 13.99, cost: 7.00, batchNumber: 'SUP2024-004', expiryDate: '2027-01-10', supplier: 'VitaHealth', barcode: '8901234567903', image: 'https://d64gsuwffb70l.cloudfront.net/69130514ea29171d130c09d6_1762854309109_bc1e2781.webp' }
];
