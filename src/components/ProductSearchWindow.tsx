import React, { useState, useRef, useEffect } from 'react';
import { Search, Package, Plus, Scan } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useSalesStore } from '../store/salesStore';

interface ProductSearchWindowProps {
  onProductAdd?: (product: any) => void;
  onScannerOpen?: () => void;
}

const ProductSearchWindow: React.FC<ProductSearchWindowProps> = ({ 
  onProductAdd, 
  onScannerOpen 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { products } = useProductStore();
  const { addToCurrentSale } = useSalesStore();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // Auto-focus en el input cuando se monta el componente
    searchInputRef.current?.focus();
  }, []);

  useEffect(() => {
    // Reset selected index when search changes
    setSelectedIndex(0);
  }, [searchTerm]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!searchInputRef.current?.matches(':focus')) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredProducts.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredProducts[selectedIndex]) {
            handleAddProduct(filteredProducts[selectedIndex]);
          }
          break;
        case 'Escape':
          setSearchTerm('');
          setSelectedIndex(0);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [filteredProducts, selectedIndex]);

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
      
      // Notificación visual
      showNotification(`✓ ${product.name} agregado`, 'success');
      
      // Limpiar búsqueda
      setSearchTerm('');
      setSelectedIndex(0);
      
      // Callback opcional
      if (onProductAdd) {
        onProductAdd(product);
      }
    } else {
      showNotification('❌ Producto sin stock disponible', 'error');
    }
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

  const getStockColor = (stock: number, minStock: number) => {
    if (stock === 0) return 'text-red-600 bg-red-100';
    if (stock <= minStock) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Bebidas': 'bg-blue-100 text-blue-800',
      'Panadería': 'bg-yellow-100 text-yellow-800',
      'Verdulería': 'bg-green-100 text-green-800',
      'Fiambrería': 'bg-red-100 text-red-800',
      'Librería': 'bg-purple-100 text-purple-800',
      'Carnicería': 'bg-red-100 text-red-800',
      'Varios': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Barra de búsqueda */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Buscar productos por nombre, código o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium"
          />
          {onScannerOpen && (
            <button
              onClick={onScannerOpen}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Abrir Escáner (F2)"
            >
              <Scan className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* Estadísticas de búsqueda */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
          <span>
            {searchTerm ? `${filteredProducts.length} resultados` : `${products.length} productos disponibles`}
          </span>
          <span className="text-blue-600">
            ↑↓ Navegar • Enter Agregar • Esc Limpiar
          </span>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="flex-1 overflow-y-auto">
        {filteredProducts.length > 0 ? (
          <div className="p-2">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className={`p-3 rounded-lg border transition-all duration-200 mb-2 cursor-pointer ${
                  index === selectedIndex
                    ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleAddProduct(product)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 mr-3">
                    <div className="flex items-center mb-1">
                      <Package className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <h4 className="font-semibold text-gray-900 text-sm truncate">
                        {product.name}
                      </h4>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(product.category)}`}>
                        {product.category}
                      </span>
                      <span className="text-xs text-gray-500 font-mono">
                        {product.barcode}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-bold text-green-600">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500">
                          Costo: ${product.cost.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStockColor(product.stock, product.minStock)}`}>
                          Stock: {product.stock}
                        </span>
                        {product.stock <= product.minStock && product.stock > 0 && (
                          <span className="text-xs text-yellow-600 font-medium">
                            ⚠️ Bajo
                          </span>
                        )}
                        {product.stock === 0 && (
                          <span className="text-xs text-red-600 font-medium">
                            ❌ Agotado
                          </span>
                        )}
                      </div>
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
                        : index === selectedIndex
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white'
                    }`}
                    title={product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
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
              <p className="text-blue-600 text-xs mt-2">
                Búsqueda: "{searchTerm}"
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
                Escribe para buscar productos por nombre, código o categoría
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer con información */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Total productos: {products.length}</span>
            <span>En stock: {products.filter(p => p.stock > 0).length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs font-mono">F2</kbd>
            <span>Escáner</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSearchWindow;