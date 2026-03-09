import React, { useState, useEffect } from 'react';
import { Plus, Scan, Trash2, ShoppingCart, CreditCard, Banknote, Smartphone, Search, Printer, Package, FileText, Receipt, Minus, X } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useSalesStore } from '../store/salesStore';
import { useAuthStore } from '../store/authStore';
import BarcodeScanner from '../components/BarcodeScanner';
import QuickProductModal from '../components/QuickProductModal';
import TicketPrintModal from '../components/TicketPrintModal';

const Sales: React.FC = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [showQuickProduct, setShowQuickProduct] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [lastSaleId, setLastSaleId] = useState<string>('');
  const [selectedTicketType, setSelectedTicketType] = useState<'A' | 'B' | 'C' | 'common'>('B');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { products, getProductByBarcode, updateStock } = useProductStore();
  const { 
    currentSale, 
    addToCurrentSale, 
    removeFromCurrentSale, 
    updateQuantity, 
    completeSale,
    clearCurrentSale,
    getSaleById 
  } = useSalesStore();
  const { user } = useAuthStore();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const subtotal = currentSale.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.21;
  const total = subtotal + tax;
  const cashAmount = parseFloat(cashReceived) || 0;
  const change = cashAmount - total;

  // Efecto para manejar teclas globales
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Si estamos en el modal de pago, Enter confirma el pago
      if (event.key === 'Enter' && showPaymentModal) {
        event.preventDefault();
        if (selectedPaymentMethod !== 'cash' || change >= 0) {
          handlePaymentComplete();
        }
        return;
      }
      
      // Si hay búsqueda activa y productos filtrados, Enter agrega el producto seleccionado
      if (event.key === 'Enter' && searchTerm && filteredProducts.length > 0 && !showScanner && !showPrintModal && !showQuickProduct && !showPaymentModal) {
        event.preventDefault();
        if (filteredProducts[selectedIndex]) {
          handleAddProduct(filteredProducts[selectedIndex]);
        }
        return;
      }
      
      // Si no hay búsqueda activa y hay productos en el carrito, Enter procesa el pago
      if (event.key === 'Enter' && !searchTerm && currentSale.length > 0 && !showScanner && !showPrintModal && !showQuickProduct && !showPaymentModal) {
        event.preventDefault();
        setShowPaymentModal(true);
        return;
      }

      if (event.key === 'F2' && !showScanner && !showPrintModal && !showQuickProduct && !showPaymentModal) {
        event.preventDefault();
        setShowScanner(true);
      }

      if (event.key === 'F4' && !showScanner && !showPrintModal && !showQuickProduct && !showPaymentModal) {
        event.preventDefault();
        setShowQuickProduct(true);
      }

      if (!showScanner && !showPrintModal && !showQuickProduct && !showPaymentModal) {
        if (event.key === '1') setSelectedTicketType('A');
        if (event.key === '2') setSelectedTicketType('B');
        if (event.key === '3') setSelectedTicketType('C');
        if (event.key === '4') setSelectedTicketType('common');
      }

      if (event.key === 'Escape') {
        if (showScanner) setShowScanner(false);
        if (showPrintModal) setShowPrintModal(false);
        if (showQuickProduct) setShowQuickProduct(false);
        if (showPaymentModal) setShowPaymentModal(false);
      }

      // Navegación en búsqueda
      if (searchTerm && filteredProducts.length > 0) {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          setSelectedIndex(prev => prev < filteredProducts.length - 1 ? prev + 1 : prev);
        }
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showScanner, showPrintModal, showQuickProduct, showPaymentModal, currentSale.length, searchTerm, filteredProducts, selectedIndex, selectedPaymentMethod, change]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm]);

  const handleBarcodeScanned = (barcode: string) => {
    const product = getProductByBarcode(barcode);
    if (product) {
      if (product.stock > 0) {
        addToCurrentSale({
          productId: product.id,
          productName: product.name,
          barcode: product.barcode,
          quantity: 1,
          price: product.price,
          total: product.price
        });
        
        showNotification(`✓ ${product.name} agregado`, 'success');
      } else {
        showNotification('❌ Producto sin stock disponible', 'error');
      }
    } else {
      showNotification('❌ Producto no encontrado', 'error');
    }
    setShowScanner(false);
  };

  const handleAddProduct = (product: any) => {
    if (product.stock > 0) {
      addToCurrentSale({
        productId: product.id,
        productName: product.name,
        barcode: product.barcode,
        quantity: 1,
        price: product.price,
        total: product.price
      });
      
      showNotification(`✓ ${product.name} agregado`, 'success');
      setSearchTerm('');
    } else {
      showNotification('❌ Producto sin stock disponible', 'error');
    }
  };

  const handleQuickProductAdd = (productData: {
    name: string;
    category: string;
    price: number;
    quantity: number;
  }) => {
    const tempId = `temp-${Date.now()}`;
    const tempBarcode = `TEMP-${Date.now()}`;
    
    addToCurrentSale({
      productId: tempId,
      productName: `${productData.name} (${productData.category})`,
      barcode: tempBarcode,
      quantity: productData.quantity,
      price: productData.price,
      total: productData.price * productData.quantity
    });
    
    showNotification(`✓ ${productData.name} agregado (${productData.quantity}x)`, 'success');
  };

  const handlePaymentComplete = () => {
    if (currentSale.length === 0) return;

    if (selectedPaymentMethod === 'cash' && cashAmount < total) {
      showNotification('❌ El monto recibido es insuficiente', 'error');
      return;
    }

    const saleId = completeSale(selectedPaymentMethod, user!.id, user!.name);
    setLastSaleId(saleId);
    
    currentSale.forEach(item => {
      if (!item.productId.startsWith('temp-')) {
        updateStock(item.productId, -item.quantity);
      }
    });

    setShowPaymentModal(false);
    setShowPrintModal(true);
    
    setCashReceived('');
    setSelectedPaymentMethod('cash');
    
    showNotification('🎉 ¡Venta completada exitosamente!', 'success');
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

  const getTicketTypeLabel = (type: 'A' | 'B' | 'C' | 'common') => {
    switch (type) {
      case 'A': return 'Factura A';
      case 'B': return 'Factura B';
      case 'C': return 'Factura C';
      case 'common': return 'Ticket Común';
    }
  };

  return (
    <div className="h-screen flex bg-gray-50 relative">
      {/* Panel Izquierdo - Búsqueda y Productos */}
      <div className="w-1/2 flex flex-col border-r border-gray-300">
        {/* Header de Búsqueda */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Search className="h-5 w-5 mr-2 text-blue-600" />
              Búsqueda de Productos
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowScanner(true)}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                title="Escáner (F2)"
              >
                <Scan className="h-4 w-4 mr-1" />
                F2
              </button>
              <button
                onClick={() => setShowQuickProduct(true)}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                title="Producto Sin Código (F4)"
              >
                <Plus className="h-4 w-4 mr-1" />
                F4
              </button>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar productos por nombre, código o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          
          <div className="mt-2 text-xs text-gray-600 flex justify-between">
            <span>{searchTerm ? `${filteredProducts.length} resultados` : `${products.length} productos`}</span>
            <span>↑↓ Navegar • Enter Agregar</span>
          </div>
        </div>

        {/* Lista de Productos */}
        <div className="flex-1 overflow-y-auto bg-white">
          {searchTerm && filteredProducts.length > 0 ? (
            <div className="p-2">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`p-3 rounded-lg border transition-all duration-200 mb-2 cursor-pointer ${
                    index === selectedIndex
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleAddProduct(product)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 mr-3">
                      <div className="flex items-center mb-1">
                        <Package className="h-4 w-4 text-gray-400 mr-2" />
                        <h4 className="font-semibold text-gray-900 text-sm truncate">
                          {product.name}
                        </h4>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {product.category}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">
                          {product.barcode}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-green-600">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.stock === 0 
                            ? 'bg-red-100 text-red-800'
                            : product.stock <= product.minStock
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          Stock: {product.stock}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddProduct(product);
                      }}
                      disabled={product.stock === 0}
                      className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
                        product.stock === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : searchTerm ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-400 text-sm">
                  Intenta con otro término de búsqueda
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">
                  Buscar Productos
                </h3>
                <p className="text-gray-400 text-sm">
                  Escribe para buscar productos
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Panel Derecho - Carrito y Controles */}
      <div className="w-1/2 flex flex-col">
        {/* Header del Carrito */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2 text-green-600" />
              Carrito ({currentSale.length} productos)
            </h2>
            {currentSale.length > 0 && (
              <button
                onClick={clearCurrentSale}
                className="text-red-600 hover:text-red-800 text-sm font-medium hover:bg-red-50 px-2 py-1 rounded transition-colors"
              >
                Limpiar Todo
              </button>
            )}
          </div>
          
          {/* Selector de Tipo de Ticket */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { id: 'A' as const, name: 'Factura A', color: 'blue' },
              { id: 'B' as const, name: 'Factura B', color: 'purple' },
              { id: 'C' as const, name: 'Factura C', color: 'red' },
              { id: 'common' as const, name: 'Ticket', color: 'green' }
            ].map((ticket, index) => (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicketType(ticket.id)}
                className={`p-2 rounded-lg text-xs font-medium transition-all ${
                  selectedTicketType === ticket.id
                    ? `bg-${ticket.color}-600 text-white shadow-md`
                    : `bg-${ticket.color}-100 text-${ticket.color}-800 hover:bg-${ticket.color}-200`
                }`}
              >
                <div className="font-bold">{index + 1}</div>
                <div>{ticket.name}</div>
              </button>
            ))}
          </div>
          
          {currentSale.length > 0 && (
            <div className="text-sm text-gray-600">
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

        {/* Lista del Carrito */}
        <div className="flex-1 overflow-y-auto bg-white">
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
                      <div className="flex items-center bg-gray-100 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 hover:bg-gray-200 rounded-l-lg transition-colors"
                        >
                          <Minus className="h-3 w-3 text-gray-600" />
                        </button>
                        <span className="px-3 py-1 text-sm font-semibold text-gray-900 min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 hover:bg-gray-200 rounded-r-lg transition-colors"
                        >
                          <Plus className="h-3 w-3 text-gray-600" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeFromCurrentSale(item.productId)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
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
              </div>
            </div>
          )}
        </div>

        {/* Footer con Totales y Pago */}
        {currentSale.length > 0 && (
          <div className="bg-white border-t border-gray-200 p-4">
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
              onClick={() => setShowPaymentModal(true)}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              PROCESAR PAGO (Enter)
            </button>
            
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-500">
                Tipo: {getTicketTypeLabel(selectedTicketType)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Scanner Modal */}
      {showScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScanned}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Quick Product Modal */}
      {showQuickProduct && (
        <QuickProductModal
          onAddProduct={handleQuickProductAdd}
          onClose={() => setShowQuickProduct(false)}
        />
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-sm w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Procesar Pago</h3>
              <div className="text-2xl font-bold text-green-600 mb-1">
                ${total.toFixed(2)}
              </div>
              <p className="text-sm text-gray-600">
                {currentSale.length} productos • {currentSale.reduce((sum, item) => sum + item.quantity, 0)} unidades
              </p>
              <p className="text-sm text-blue-600 mt-1">
                Se imprimirá: {getTicketTypeLabel(selectedTicketType)}
              </p>
            </div>

            {/* Métodos de pago */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Método de Pago</h4>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedPaymentMethod('cash')}
                  className={`w-full flex items-center p-3 border rounded-lg transition-all ${
                    selectedPaymentMethod === 'cash' 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Banknote className="h-4 w-4 mr-3" />
                  <span className="font-medium">Efectivo</span>
                  {selectedPaymentMethod === 'cash' && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </button>
                
                <button
                  onClick={() => setSelectedPaymentMethod('card')}
                  className={`w-full flex items-center p-3 border rounded-lg transition-all ${
                    selectedPaymentMethod === 'card' 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <CreditCard className="h-4 w-4 mr-3" />
                  <span className="font-medium">Tarjeta</span>
                  {selectedPaymentMethod === 'card' && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </button>
                
                <button
                  onClick={() => setSelectedPaymentMethod('transfer')}
                  className={`w-full flex items-center p-3 border rounded-lg transition-all ${
                    selectedPaymentMethod === 'transfer' 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Smartphone className="h-4 w-4 mr-3" />
                  <span className="font-medium">Transferencia</span>
                  {selectedPaymentMethod === 'transfer' && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </button>
              </div>
            </div>

            {/* Detalles específicos para efectivo */}
            {selectedPaymentMethod === 'cash' && (
              <div className="mb-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monto Recibido
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base font-semibold"
                    placeholder="0.00"
                    autoFocus
                  />
                </div>
                
                {cashAmount > 0 && (
                  <div className={`p-2 rounded border ${
                    change >= 0 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-red-300 bg-red-50'
                  }`}>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-gray-700 text-sm">
                        {change >= 0 ? 'Vuelto:' : 'Faltante:'}
                      </span>
                      <span className={`text-base font-bold ${
                        change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ${Math.abs(change).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handlePaymentComplete}
                disabled={selectedPaymentMethod === 'cash' && change < 0}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                Confirmar Pago (Enter)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Modal */}
      {showPrintModal && lastSaleId && (
        <TicketPrintModal
          sale={getSaleById(lastSaleId)!}
          ticketType={selectedTicketType}
          onClose={() => {
            setShowPrintModal(false);
            clearCurrentSale();
          }}
        />
      )}
    </div>
  );
};

export default Sales;