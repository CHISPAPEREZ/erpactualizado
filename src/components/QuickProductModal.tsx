import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Package, DollarSign, Hash, Tag } from 'lucide-react';

interface QuickProductModalProps {
  onAddProduct: (product: {
    name: string;
    category: string;
    price: number;
    quantity: number;
  }) => void;
  onClose: () => void;
}

const QuickProductModal: React.FC<QuickProductModalProps> = ({ onAddProduct, onClose }) => {
  const [productName, setProductName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('varios');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  
  const nameInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { id: 'verduleria', name: 'Verdulería', color: 'bg-green-100 text-green-800', icon: '🥬' },
    { id: 'panaderia', name: 'Panadería', color: 'bg-yellow-100 text-yellow-800', icon: '🍞' },
    { id: 'fiambreria', name: 'Fiambrería', color: 'bg-red-100 text-red-800', icon: '🧀' },
    { id: 'libreria', name: 'Librería', color: 'bg-blue-100 text-blue-800', icon: '📚' },
    { id: 'carniceria', name: 'Carnicería', color: 'bg-red-100 text-red-800', icon: '🥩' },
    { id: 'varios', name: 'Varios', color: 'bg-gray-100 text-gray-800', icon: '📦' }
  ];

  useEffect(() => {
    // Auto-focus en el campo de nombre
    nameInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Enter para agregar producto
      if (event.key === 'Enter' && productName && price) {
        event.preventDefault();
        handleAddProduct();
      }
      
      // Escape para cerrar
      if (event.key === 'Escape') {
        onClose();
      }

      // Números 1-6 para seleccionar categoría rápidamente
      const categoryIndex = parseInt(event.key) - 1;
      if (categoryIndex >= 0 && categoryIndex < categories.length) {
        setSelectedCategory(categories[categoryIndex].id);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [productName, price, onClose]);

  const handleAddProduct = () => {
    if (!productName.trim() || !price) return;

    onAddProduct({
      name: productName.trim(),
      category: selectedCategory,
      price: parseFloat(price),
      quantity: parseInt(quantity) || 1
    });

    // Limpiar formulario para siguiente producto
    setProductName('');
    setPrice('');
    setQuantity('1');
    nameInputRef.current?.focus();
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Producto Sin Código</h3>
              <p className="text-sm text-gray-600">Agregar producto rápidamente</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Nombre del producto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Package className="h-4 w-4 inline mr-1" />
              Nombre del Producto
            </label>
            <input
              ref={nameInputRef}
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="Ej: Manzanas rojas, Pan francés..."
              required
            />
          </div>

          {/* Categorías */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="h-4 w-4 inline mr-1" />
              Categoría (1-6 para selección rápida)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`p-3 border rounded-lg transition-all text-left ${
                    selectedCategory === category.id
                      ? 'border-blue-500 bg-blue-50 shadow-md transform scale-105'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{category.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{category.name}</div>
                      <div className="text-xs text-gray-500">({index + 1})</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Precio y Cantidad */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Precio Unitario
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="0.00"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="h-4 w-4 inline mr-1" />
                Cantidad
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
          </div>

          {/* Resumen */}
          {productName && price && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-900">{productName}</h4>
                  <div className="flex items-center mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${selectedCategoryData?.color}`}>
                      {selectedCategoryData?.icon} {selectedCategoryData?.name}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-blue-700">
                    ${parseFloat(price || '0').toFixed(2)} × {quantity}
                  </div>
                  <div className="text-lg font-bold text-blue-900">
                    ${(parseFloat(price || '0') * parseInt(quantity || '1')).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar (Esc)
          </button>
          <button
            onClick={handleAddProduct}
            disabled={!productName.trim() || !price}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Agregar (Enter)
          </button>
        </div>

        {/* Ayuda de teclado */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600 space-y-1">
            <p><kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs font-mono">1-6</kbd> Seleccionar categoría</p>
            <p><kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs font-mono">Enter</kbd> Agregar producto</p>
            <p><kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs font-mono">Esc</kbd> Cerrar ventana</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickProductModal;