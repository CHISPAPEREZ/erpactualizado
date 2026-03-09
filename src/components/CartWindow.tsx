import React from 'react';
import { ShoppingCart, Trash2, Plus, Minus, Package } from 'lucide-react';
import { useSalesStore } from '../store/salesStore';

interface CartWindowProps {
  onCheckout?: () => void;
}

const CartWindow: React.FC<CartWindowProps> = ({ onCheckout }) => {
  const { 
    currentSale, 
    removeFromCurrentSale, 
    updateQuantity, 
    clearCurrentSale 
  } = useSalesStore();

  const subtotal = currentSale.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.21;
  const total = subtotal + tax;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCurrentSale(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCurrentSale(productId);
    showNotification('Producto eliminado del carrito', 'success');
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

  return (
    <div className="flex flex-col h-full">
      {/* Header del carrito */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ShoppingCart className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="font-semibold text-gray-900">
              Carrito ({currentSale.length} productos)
            </h3>
          </div>
          {currentSale.length > 0 && (
            <button
              onClick={clearCurrentSale}
              className="text-red-600 hover:text-red-800 text-sm font-medium hover:bg-red-50 px-2 py-1 rounded transition-colors"
              title="Vaciar carrito"
            >
              Limpiar Todo
            </button>
          )}
        </div>
        
        {/* Resumen rápido */}
        {currentSale.length > 0 && (
          <div className="mt-2 text-sm text-gray-600">
            <span className="font-medium text-green-600">
              Total: ${total.toFixed(2)}
            </span>
            <span className="mx-2">•</span>
            <span>
              {currentSale.reduce((sum, item) => sum + item.quantity, 0)} unidades
            </span>
          </div>
        )}
      </div>

      {/* Lista de productos en el carrito */}
      <div className="flex-1 overflow-y-auto">
        {currentSale.length > 0 ? (
          <div className="p-3 space-y-3">
            {currentSale.map((item, index) => (
              <div 
                key={item.productId} 
                className={`bg-white border rounded-lg p-3 transition-all duration-300 ${
                  index === currentSale.length - 1 
                    ? 'border-green-300 bg-green-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 mr-3">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                      {item.productName}
                    </h4>
                    <p className="text-xs text-gray-500 mb-2 font-mono">
                      Código: {item.barcode}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-600">
                        ${item.price.toFixed(2)} c/u
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        Total: ${item.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    {/* Controles de cantidad */}
                    <div className="flex items-center bg-gray-100 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        className="p-1 hover:bg-gray-200 rounded-l-lg transition-colors"
                        title="Disminuir cantidad"
                      >
                        <Minus className="h-3 w-3 text-gray-600" />
                      </button>
                      <span className="px-3 py-1 text-sm font-semibold text-gray-900 min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 rounded-r-lg transition-colors"
                        title="Aumentar cantidad"
                      >
                        <Plus className="h-3 w-3 text-gray-600" />
                      </button>
                    </div>
                    
                    {/* Botón eliminar */}
                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      title="Eliminar producto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {/* Indicador de producto recién agregado */}
                {index === currentSale.length - 1 && (
                  <div className="mt-2 text-xs text-green-600 font-medium flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Recién agregado
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">
                Carrito Vacío
              </h3>
              <p className="text-gray-400 text-sm">
                Los productos agregados aparecerán aquí
              </p>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">
                  💡 <strong>Tip:</strong> Usa F3 para abrir la búsqueda de productos
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer con totales y botón de checkout */}
      {currentSale.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">IVA (21%):</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2">
              <span>TOTAL:</span>
              <span className="text-green-600">${total.toFixed(2)}</span>
            </div>
          </div>
          
          <button
            onClick={onCheckout}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            PROCESAR PAGO
          </button>
          
          <div className="mt-2 text-center">
            <p className="text-xs text-gray-500">
              Presiona <kbd className="px-1 py-0.5 bg-gray-200 rounded font-mono">Enter</kbd> para procesar pago
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartWindow;