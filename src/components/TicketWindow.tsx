import React, { useState } from 'react';
import { Receipt, FileText, Building, User, Info } from 'lucide-react';

interface TicketWindowProps {
  selectedType: 'A' | 'B' | 'C' | 'common';
  onTypeChange: (type: 'A' | 'B' | 'C' | 'common') => void;
}

const TicketWindow: React.FC<TicketWindowProps> = ({ 
  selectedType, 
  onTypeChange 
}) => {
  const [showInfo, setShowInfo] = useState(false);

  const ticketTypes = [
    {
      id: 'A' as const,
      name: 'Factura A',
      description: 'Responsable Inscripto',
      icon: Building,
      color: 'blue',
      details: {
        customer: 'Empresas y Responsables Inscriptos',
        iva: 'IVA discriminado (sin incluir en precio)',
        fiscal: 'Válido como comprobante fiscal',
        requirements: 'Requiere CUIT del cliente'
      }
    },
    {
      id: 'B' as const,
      name: 'Factura B',
      description: 'Consumidor Final',
      icon: User,
      color: 'purple',
      details: {
        customer: 'Consumidores Finales',
        iva: 'IVA incluido en el precio',
        fiscal: 'Válido como comprobante fiscal',
        requirements: 'No requiere datos adicionales'
      }
    },
    {
      id: 'C' as const,
      name: 'Factura C',
      description: 'Exento de IVA',
      icon: FileText,
      color: 'red',
      details: {
        customer: 'Exentos de IVA',
        iva: 'Sin IVA',
        fiscal: 'Válido como comprobante fiscal',
        requirements: 'Requiere certificado de exención'
      }
    },
    {
      id: 'common' as const,
      name: 'Ticket Común',
      description: 'Sin validez fiscal',
      icon: Receipt,
      color: 'green',
      details: {
        customer: 'Cualquier cliente',
        iva: 'IVA incluido (no discriminado)',
        fiscal: 'NO válido como comprobante fiscal',
        requirements: 'Sin requisitos especiales'
      }
    }
  ];

  const getColorClasses = (color: string, isSelected: boolean) => {
    const baseClasses = 'transition-all duration-200 transform hover:scale-105';
    
    if (isSelected) {
      switch (color) {
        case 'blue': return `${baseClasses} bg-blue-600 text-white border-blue-600 shadow-lg scale-110`;
        case 'purple': return `${baseClasses} bg-purple-600 text-white border-purple-600 shadow-lg scale-110`;
        case 'red': return `${baseClasses} bg-red-600 text-white border-red-600 shadow-lg scale-110`;
        case 'green': return `${baseClasses} bg-green-600 text-white border-green-600 shadow-lg scale-110`;
      }
    } else {
      switch (color) {
        case 'blue': return `${baseClasses} bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200`;
        case 'purple': return `${baseClasses} bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200`;
        case 'red': return `${baseClasses} bg-red-100 text-red-800 border-red-300 hover:bg-red-200`;
        case 'green': return `${baseClasses} bg-green-100 text-green-800 border-green-300 hover:bg-green-200`;
      }
    }
    return baseClasses;
  };

  const selectedTicket = ticketTypes.find(t => t.id === selectedType);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Receipt className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-semibold text-gray-900">Tipo de Comprobante</h3>
          </div>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Información sobre tipos de comprobante"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mt-1">
          Selecciona el tipo de comprobante a emitir
        </p>
      </div>

      {/* Información expandible */}
      {showInfo && (
        <div className="p-4 bg-yellow-50 border-b border-yellow-200">
          <div className="text-sm space-y-2">
            <h4 className="font-medium text-yellow-800">ℹ️ Información sobre Comprobantes</h4>
            <ul className="text-yellow-700 space-y-1 text-xs">
              <li><strong>Factura A:</strong> Para empresas con CUIT, IVA discriminado</li>
              <li><strong>Factura B:</strong> Para consumidores finales, IVA incluido</li>
              <li><strong>Factura C:</strong> Para exentos de IVA</li>
              <li><strong>Ticket Común:</strong> Sin validez fiscal, uso interno</li>
            </ul>
          </div>
        </div>
      )}

      {/* Selector de tipos */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 gap-3">
          {ticketTypes.map((ticket, index) => {
            const Icon = ticket.icon;
            const isSelected = selectedType === ticket.id;
            
            return (
              <button
                key={ticket.id}
                onClick={() => onTypeChange(ticket.id)}
                className={`p-4 border-2 rounded-lg text-left ${getColorClasses(ticket.color, isSelected)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-3 ${
                      isSelected 
                        ? 'bg-white bg-opacity-20' 
                        : 'bg-current bg-opacity-20'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{ticket.name}</h4>
                      <p className={`text-xs ${
                        isSelected ? 'text-white text-opacity-90' : 'opacity-75'
                      }`}>
                        {ticket.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      isSelected 
                        ? 'bg-white bg-opacity-20 text-white' 
                        : 'bg-current bg-opacity-20'
                    }`}>
                      {index + 1}
                    </span>
                    {isSelected && (
                      <div className="ml-2 w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detalles del tipo seleccionado */}
      {selectedTicket && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <selectedTicket.icon className="h-4 w-4 mr-2" />
            {selectedTicket.name} - Detalles
          </h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Cliente:</span>
              <span className="font-medium text-gray-900">{selectedTicket.details.customer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">IVA:</span>
              <span className="font-medium text-gray-900">{selectedTicket.details.iva}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Validez Fiscal:</span>
              <span className={`font-medium ${
                selectedTicket.details.fiscal.includes('NO') 
                  ? 'text-red-600' 
                  : 'text-green-600'
              }`}>
                {selectedTicket.details.fiscal}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-300">
              <span className="text-gray-600 text-xs">Requisitos:</span>
              <p className="text-xs text-gray-900 mt-1">{selectedTicket.details.requirements}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer con atajos de teclado */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-2">Atajos de Teclado</p>
          <div className="flex justify-center space-x-4 text-xs">
            <span className="flex items-center">
              <kbd className="px-1 py-0.5 bg-gray-200 rounded font-mono mr-1">1</kbd>
              Factura A
            </span>
            <span className="flex items-center">
              <kbd className="px-1 py-0.5 bg-gray-200 rounded font-mono mr-1">2</kbd>
              Factura B
            </span>
            <span className="flex items-center">
              <kbd className="px-1 py-0.5 bg-gray-200 rounded font-mono mr-1">3</kbd>
              Factura C
            </span>
            <span className="flex items-center">
              <kbd className="px-1 py-0.5 bg-gray-200 rounded font-mono mr-1">4</kbd>
              Ticket
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketWindow;