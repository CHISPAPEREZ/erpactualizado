import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, Camera, Zap } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState<string>('');

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'barcode-scanner',
      {
        fps: 10,
        qrbox: { width: 280, height: 280 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: true,
        defaultZoomValueIfSupported: 2
      },
      false
    );

    scanner.render(
      (decodedText) => {
        // Evitar escaneos duplicados rápidos
        if (decodedText !== lastScanned) {
          setLastScanned(decodedText);
          
          // Mostrar feedback visual inmediato
          const scannerElement = document.getElementById('barcode-scanner');
          if (scannerElement) {
            scannerElement.style.border = '3px solid #10B981';
            scannerElement.style.borderRadius = '8px';
          }
          
          // Vibración si está disponible
          if (navigator.vibrate) {
            navigator.vibrate(100);
          }
          
          // Llamar al callback después de un breve delay para mostrar el feedback
          setTimeout(() => {
            onScan(decodedText);
            scanner.clear();
          }, 300);
        }
      },
      (error) => {
        // Solo mostrar errores importantes, no todos los intentos de escaneo
        if (error.includes('NotFoundException') === false) {
          console.warn('Scanner error:', error);
        }
      }
    );

    scannerRef.current = scanner;
    setIsScanning(true);

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [onScan, lastScanned]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Camera className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Escanear Código</h3>
              <p className="text-sm text-gray-600">Apunta hacia el código de barras</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="relative">
          <div id="barcode-scanner" className="w-full rounded-lg overflow-hidden"></div>
          
          {/* Overlay de ayuda */}
          <div className="absolute top-4 left-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-lg text-center">
            <div className="flex items-center justify-center mb-2">
              <Zap className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Detección Automática</span>
            </div>
            <p className="text-xs opacity-90">
              El producto se agregará automáticamente al detectar el código
            </p>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span>Escaneando...</span>
            </div>
          </div>
          
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              💡 <strong>Consejo:</strong> Mantén el código de barras centrado y bien iluminado para una detección más rápida
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;