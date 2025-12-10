import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Camera, Keyboard, Printer, Tag, Scan } from 'lucide-react';

export function BarcodeHelp() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Barcode System Guide</h2>
        <p className="text-gray-600">Learn how to use barcode scanning and label generation</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-teal-600" />
              Camera Scanning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Use your device camera to scan barcodes:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Click "Scan Barcode" button in POS or Inventory</li>
              <li>Allow camera permissions when prompted</li>
              <li>Position barcode within the green frame</li>
              <li>Hold steady until detected</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5 text-teal-600" />
              USB Scanner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Connect a USB barcode scanner for fast scanning:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Plug in your USB barcode scanner</li>
              <li>Open scan modal or focus search field</li>
              <li>Scan any product barcode</li>
              <li>Product automatically added/found</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-teal-600" />
              Generate Labels
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Create printable barcode labels for products:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Go to Inventory Management</li>
              <li>Click tag icon next to any product</li>
              <li>Preview the barcode label</li>
              <li>Print or download as image</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5 text-teal-600" />
              POS Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Use barcodes in Point of Sale:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Scan products to add to cart instantly</li>
              <li>Type barcode in search field</li>
              <li>Works with camera or USB scanner</li>
              <li>Speeds up checkout process</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-teal-50 border-teal-200">
        <CardHeader>
          <CardTitle className="text-teal-800">Supported Barcode Formats</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">
            The system supports standard retail barcodes including EAN-13, UPC-A, and CODE128. 
            All products in the inventory have unique 13-digit barcodes for easy identification.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
