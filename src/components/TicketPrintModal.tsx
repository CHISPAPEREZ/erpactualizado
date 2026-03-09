import React from 'react';
import { X, Printer, Download, Store } from 'lucide-react';
import { Sale } from '../types';

interface TicketPrintModalProps {
  sale: Sale;
  ticketType: 'A' | 'B' | 'C' | 'common';
  onClose: () => void;
}

const TicketPrintModal: React.FC<TicketPrintModalProps> = ({ sale, ticketType, onClose }) => {
  const getTicketTypeLabel = (type: 'A' | 'B' | 'C' | 'common') => {
    switch (type) {
      case 'A': return 'Factura A';
      case 'B': return 'Factura B';
      case 'C': return 'Factura C';
      case 'common': return 'Ticket Común';
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cash': return 'Efectivo';
      case 'card': return 'Tarjeta';
      case 'transfer': return 'Transferencia';
      default: return method;
    }
  };

  const handlePrint = () => {
    const now = new Date();
    const ticketNumber = `0001-${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`;
    
    const printContent = `
      <div style="font-family: 'Courier New', monospace; width: 300px; margin: 0 auto; padding: 10px; font-size: 12px; line-height: 1.2;">
        <div style="text-align: center; margin-bottom: 15px;">
          <div style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">SUPERMARKET ERP</div>
          <div style="font-size: 10px; margin-bottom: 3px;">Dirección: Av. Ejemplo 1234, CABA</div>
          <div style="font-size: 10px; margin-bottom: 3px;">Tel: (011) 1234-5678</div>
          <div style="font-size: 10px; margin-bottom: 10px;">Email: info@supermarket.com</div>
          
          <div style="border: 3px solid #000; padding: 10px; margin: 15px 0; background-color: #fff;">
            <div style="font-size: 18px; font-weight: bold; letter-spacing: 2px;">${getTicketTypeLabel(ticketType).toUpperCase()}</div>
            <div style="font-size: 12px; margin-top: 5px;">Nro. ${ticketNumber}</div>
          </div>
        </div>

        <div style="border-bottom: 1px dashed #000; padding-bottom: 8px; margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between;">
            <span>Fecha:</span>
            <span>${now.toLocaleDateString('es-AR')}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Hora:</span>
            <span>${now.toLocaleTimeString('es-AR')}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Cajero:</span>
            <span>${sale.cashierName}</span>
          </div>
        </div>

        <div style="border-bottom: 2px solid #000; padding-bottom: 5px; margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11px;">
            <span style="width: 35%;">DESCRIPCIÓN</span>
            <span style="width: 15%; text-align: center;">CANT</span>
            <span style="width: 20%; text-align: right;">P.UNIT</span>
            <span style="width: 20%; text-align: right;">IMPORTE</span>
          </div>
        </div>

        <div style="margin-bottom: 15px;">
          ${sale.items.map((item) => {
            const isTemp = item.productId.startsWith('temp-');
            const displayCode = isTemp ? item.barcode.replace('TEMP-', 'D') : item.barcode;
            
            return `
              <div style="margin-bottom: 8px; border-bottom: 1px dotted #ccc; padding-bottom: 5px;">
                <div style="font-size: 9px; color: #666; margin-bottom: 2px;">${displayCode}</div>
                <div style="display: flex; justify-content: space-between; font-size: 10px;">
                  <span style="width: 35%; overflow: hidden; text-overflow: ellipsis;">${item.productName}</span>
                  <span style="width: 15%; text-align: center;">${item.quantity}</span>
                  <span style="width: 20%; text-align: right;">$${item.price.toFixed(2)}</span>
                  <span style="width: 20%; text-align: right; font-weight: bold;">$${item.total.toFixed(2)}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div style="border-top: 2px solid #000; padding-top: 10px; margin-top: 15px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span>Subtotal:</span>
            <span>$${sale.subtotal.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span>IVA (21%):</span>
            <span>$${sale.tax.toFixed(2)}</span>
          </div>
          
          <div style="border-top: 2px solid #000; margin: 8px 0; padding-top: 8px;">
            <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold;">
              <span>TOTAL:</span>
              <span>$${sale.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div style="margin: 15px 0; text-align: center; border: 1px solid #000; padding: 8px;">
          <div style="font-weight: bold; font-size: 12px;">
            FORMA DE PAGO: ${getPaymentMethodLabel(sale.paymentMethod).toUpperCase()}
          </div>
        </div>

        <div style="border-top: 2px solid #000; padding-top: 15px; margin-top: 20px; text-align: center; font-size: 10px;">
          <div style="font-weight: bold; margin-bottom: 8px; font-size: 12px;">
            ¡MUCHAS GRACIAS POR SU COMPRA!
          </div>
          <div style="margin-bottom: 5px;">Conserve este comprobante</div>
          <div style="margin-bottom: 15px;">Para cambios presentar dentro de 30 días</div>
          
          <div style="border-top: 1px dashed #000; padding-top: 10px; margin-top: 15px;">
            <div style="font-weight: bold;">SuperMarket ERP v1.0.0</div>
            <div style="font-size: 9px; color: #666;">Sistema de Facturación</div>
          </div>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Ticket ${ticketType} - ${ticketNumber}</title>
            <style>
              @page {
                size: 80mm auto;
                margin: 0;
              }
              body { 
                margin: 0; 
                padding: 0;
                font-family: 'Courier New', monospace;
              }
              @media print {
                body { 
                  margin: 0;
                  -webkit-print-color-adjust: exact;
                  color-adjust: exact;
                }
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      };
    }
  };

  const now = new Date();
  const ticketNumber = `0001-${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 max-h-screen overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <Store className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">¡Venta Completada!</h3>
              <p className="text-sm text-gray-600">ID: {sale.id.slice(-8)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Ticket Preview */}
        <div className="p-4 max-h-96 overflow-y-auto bg-gray-50">
          <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-dashed border-gray-300" style={{ fontFamily: 'Courier New, monospace', fontSize: '12px', lineHeight: '1.2', width: '280px', margin: '0 auto' }}>
            {/* Header del ticket */}
            <div className="text-center mb-4">
              <div className="font-bold text-sm mb-1">SUPERMARKET ERP</div>
              <div className="text-xs text-gray-600 mb-1">Av. Ejemplo 1234, CABA</div>
              <div className="text-xs text-gray-600 mb-1">Tel: (011) 1234-5678</div>
              <div className="text-xs text-gray-600 mb-3">info@supermarket.com</div>
              
              <div className="border-2 border-black p-2 my-3 bg-gray-100">
                <div className="font-bold text-sm">{getTicketTypeLabel(ticketType).toUpperCase()}</div>
                <div className="text-xs">Nro. {ticketNumber}</div>
              </div>
            </div>

            {/* Información de la venta */}
            <div className="border-b border-dashed border-gray-400 pb-2 mb-2 text-xs">
              <div className="flex justify-between">
                <span>Fecha:</span>
                <span>{now.toLocaleDateString('es-AR')}</span>
              </div>
              <div className="flex justify-between">
                <span>Hora:</span>
                <span>{now.toLocaleTimeString('es-AR')}</span>
              </div>
              <div className="flex justify-between">
                <span>Cajero:</span>
                <span>{sale.cashierName}</span>
              </div>
            </div>

            {/* Headers de productos */}
            <div className="border-b-2 border-black pb-1 mb-2">
              <div className="flex justify-between font-bold text-xs">
                <span style={{ width: '35%' }}>DESCRIPCIÓN</span>
                <span style={{ width: '15%', textAlign: 'center' }}>CANT</span>
                <span style={{ width: '20%', textAlign: 'right' }}>P.UNIT</span>
                <span style={{ width: '20%', textAlign: 'right' }}>IMPORTE</span>
              </div>
            </div>

            {/* Lista de productos */}
            <div className="mb-4">
              {sale.items.map((item, index) => {
                const isTemp = item.productId.startsWith('temp-');
                const displayCode = isTemp ? item.barcode.replace('TEMP-', 'D') : item.barcode;
                
                return (
                  <div key={index} className="mb-2 border-b border-dotted border-gray-300 pb-1">
                    <div className="text-xs text-gray-500 mb-1">{displayCode}</div>
                    <div className="flex justify-between text-xs">
                      <span style={{ width: '35%' }} className="truncate">{item.productName}</span>
                      <span style={{ width: '15%', textAlign: 'center' }}>{item.quantity}</span>
                      <span style={{ width: '20%', textAlign: 'right' }}>${item.price.toFixed(2)}</span>
                      <span style={{ width: '20%', textAlign: 'right' }} className="font-bold">${item.total.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Totales */}
            <div className="border-t-2 border-black pt-2 mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span>Subtotal:</span>
                <span>${sale.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs mb-1">
                <span>IVA (21%):</span>
                <span>${sale.tax.toFixed(2)}</span>
              </div>
              
              <div className="border-t-2 border-black mt-2 pt-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>TOTAL:</span>
                  <span>${sale.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Método de pago */}
            <div className="my-3 text-center border border-black p-2">
              <div className="font-bold text-xs">
                FORMA DE PAGO: {getPaymentMethodLabel(sale.paymentMethod).toUpperCase()}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t-2 border-black pt-3 mt-4 text-center text-xs">
              <div className="font-bold mb-2 text-sm">
                ¡MUCHAS GRACIAS POR SU COMPRA!
              </div>
              <div className="mb-1">Conserve este comprobante</div>
              <div className="mb-3">Para cambios presentar dentro de 30 días</div>
              
              <div className="border-t border-dashed border-gray-400 pt-2 mt-3">
                <div className="font-bold">SuperMarket ERP v1.0.0</div>
                <div className="text-xs text-gray-500">Sistema de Facturación</div>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-3">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              <Printer className="h-5 w-5 mr-2" />
              Imprimir Ticket
            </button>
            
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Continuar
            </button>
          </div>
          
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500">
              💡 El ticket se imprimirá en formato térmico (80mm)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPrintModal;