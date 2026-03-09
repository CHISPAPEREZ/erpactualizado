import React, { useState } from 'react';
import { CreditCard, Banknote, Smartphone, Calculator, DollarSign } from 'lucide-react';
import { useSalesStore } from '../store/salesStore';

interface PaymentWindowProps {
  onPaymentComplete?: (paymentMethod: 'cash' | 'card' | 'transfer') => void;
  onCancel?: () => void;
}

const PaymentWindow: React.FC<PaymentWindowProps> = ({ 
  onPaymentComplete, 
  onCancel 
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { currentSale } = useSalesStore();

  const subtotal = currentSale.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.21;
  const total = subtotal + tax;
  const cashAmount = parseFloat(cashReceived) || 0;
  const change = cashAmount - total;

  const handlePayment = async () => {
    if (paymentMethod === 'cash' && cashAmount < total) {
      showNotification('❌ El monto recibido es insuficiente', 'error');
      return;
    }

    setIsProcessing(true);
    
    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (onPaymentComplete) {
      onPaymentComplete(paymentMethod);
    }
    
    setIsProcessing(false);
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-0`;
    notification.innerHTML = `
      <div class="flex items-center">
        <div class="font-semibold">${message}</div>
      </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  };

  const getPaymentMethodIcon = (method: 'cash' | 'card' | 'transfer') => {
    switch (method) {
      case 'cash': return <Banknote className="h-5 w-5" />;
      case 'card': return <CreditCard className="h-5 w-5" />;
      case 'transfer': return <Smartphone className="h-5 w-5" />;
    }
  };

  const getPaymentMethodLabel = (method: 'cash' | 'card' | 'transfer') => {
    switch (method) {
      case 'cash': return 'Efectivo';
      case 'card': return 'Tarjeta';
      case 'transfer': return 'Transferencia';
    }
  };

  const quickCashAmounts = [
    total,
    Math.ceil(total / 10) * 10,
    Math.ceil(total / 50) * 50,
    Math.ceil(total / 100) * 100
  ].filter((amount, index, arr) => arr.indexOf(amount) === index);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Procesar Pago</h3>
          </div>
          <div className="text-3xl font-bold text-green-600 mb-1">
            ${total.toFixed(2)}
          </div>
          <p className="text-sm text-gray-600">
            {currentSale.length} productos • {currentSale.reduce((sum, item) => sum + item.quantity, 0)} unidades
          </p>
        </div>
      </div>

      {/* Desglose de totales */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">IVA (21%):</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2">
            <span>TOTAL A PAGAR:</span>
            <span className="text-green-600">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Métodos de pago */}
      <div className="p-4 border-b border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Método de Pago</h4>
        <div className="space-y-2">
          {(['cash', 'card', 'transfer'] as const).map((method) => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method)}
              className={`w-full flex items-center p-3 border rounded-lg transition-all ${
                paymentMethod === method 
                  ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <div className={`p-2 rounded-lg mr-3 ${
                paymentMethod === method ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {getPaymentMethodIcon(method)}
              </div>
              <span className="font-medium">{getPaymentMethodLabel(method)}</span>
              {paymentMethod === method && (
                <div className="ml-auto w-3 h-3 bg-blue-600 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Detalles específicos del método de pago */}
      <div className="flex-1 p-4">
        {paymentMethod === 'cash' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monto Recibido
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="number"
                  step="0.01"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
                  placeholder="0.00"
                  autoFocus
                />
              </div>
            </div>

            {/* Botones de monto rápido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montos Rápidos
              </label>
              <div className="grid grid-cols-2 gap-2">
                {quickCashAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setCashReceived(amount.toFixed(2))}
                    className="p-2 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-sm font-medium"
                  >
                    ${amount.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>

            {/* Cálculo de vuelto */}
            {cashAmount > 0 && (
              <div className={`p-3 rounded-lg border ${
                change >= 0 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-red-300 bg-red-50'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">
                    {change >= 0 ? 'Vuelto:' : 'Faltante:'}
                  </span>
                  <span className={`text-lg font-bold ${
                    change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${Math.abs(change).toFixed(2)}
                  </span>
                </div>
                {change < 0 && (
                  <p className="text-xs text-red-600 mt-1">
                    El monto recibido es insuficiente
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {paymentMethod === 'card' && (
          <div className="text-center py-8">
            <CreditCard className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Pago con Tarjeta
            </h4>
            <p className="text-gray-600 text-sm mb-4">
              Inserte o acerque la tarjeta al lector
            </p>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                💳 <strong>Monto:</strong> ${total.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {paymentMethod === 'transfer' && (
          <div className="text-center py-8">
            <Smartphone className="h-16 w-16 text-purple-600 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Transferencia Bancaria
            </h4>
            <p className="text-gray-600 text-sm mb-4">
              Muestre el código QR al cliente
            </p>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-purple-800 text-sm">
                📱 <strong>Monto:</strong> ${total.toFixed(2)}
              </p>
              <p className="text-purple-600 text-xs mt-1">
                CBU: 0000003100010000000001
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handlePayment}
            disabled={isProcessing || (paymentMethod === 'cash' && change < 0)}
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Procesando...
              </>
            ) : (
              <>
                <Calculator className="h-4 w-4 mr-2" />
                Confirmar Pago
              </>
            )}
          </button>
        </div>
        
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500">
            Presiona <kbd className="px-1 py-0.5 bg-gray-200 rounded font-mono">Enter</kbd> para confirmar
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentWindow;