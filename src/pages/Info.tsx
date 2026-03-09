import React from 'react';
import { 
  Info as InfoIcon, 
  Keyboard, 
  Monitor, 
  Zap, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3,
  Settings,
  UserCheck,
  Scan,
  Plus,
  CreditCard,
  Receipt,
  Shield,
  Database,
  Globe,
  Store
} from 'lucide-react';

const Info: React.FC = () => {
  const keyboardShortcuts = [
    {
      category: 'Ventas',
      shortcuts: [
        { key: 'F2', description: 'Abrir escáner de códigos de barras', icon: Scan },
        { key: 'F4', description: 'Agregar producto sin código', icon: Plus },
        { key: 'Enter', description: 'Procesar pago (con productos en carrito)', icon: CreditCard },
        { key: '1-4', description: 'Seleccionar tipo de ticket/factura', icon: Receipt },
        { key: '↑↓', description: 'Navegar en lista de productos', icon: Keyboard },
        { key: 'Esc', description: 'Cerrar modales y ventanas', icon: Keyboard }
      ]
    },
    {
      category: 'Navegación',
      shortcuts: [
        { key: 'Mouse', description: 'Hover en sidebar para expandir menú', icon: Monitor }
      ]
    }
  ];

  const features = [
    {
      title: 'Sistema de Ventas',
      description: 'Punto de venta completo con escáner de códigos, múltiples métodos de pago y tipos de comprobantes',
      icon: ShoppingCart,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Gestión de Inventario',
      description: 'Control de stock, alertas de productos bajos, gestión de proveedores y categorías',
      icon: Package,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'CRM de Proveedores',
      description: 'Gestión completa de proveedores con comunicaciones y redes sociales integradas',
      icon: UserCheck,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Gestión de Usuarios',
      description: 'Sistema de roles (Admin, Gerente, Cajero) con permisos diferenciados',
      icon: Users,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      title: 'Reportes y Análisis',
      description: 'Reportes de ventas, productos más vendidos, alertas de inventario y métricas',
      icon: BarChart3,
      color: 'bg-red-100 text-red-600'
    },
    {
      title: 'Sistema de Licencias',
      description: 'Activación por serial vinculada al hardware con seriales de demostración',
      icon: Shield,
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];

  const technicalSpecs = [
    {
      category: 'Frontend',
      items: [
        'React 18 con TypeScript',
        'Tailwind CSS para estilos',
        'Zustand para gestión de estado',
        'React Router para navegación',
        'Lucide React para iconografía'
      ]
    },
    {
      category: 'Desktop',
      items: [
        'Electron para aplicación de escritorio',
        'Electron Builder para empaquetado',
        'Electron Store para persistencia',
        'Sistema de licencias integrado'
      ]
    },
    {
      category: 'Funcionalidades',
      items: [
        'Scanner de códigos de barras (html5-qrcode)',
        'Impresión de tickets térmicos',
        'Múltiples tipos de comprobantes',
        'Gestión offline completa',
        'Interfaz responsive'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center">
        <InfoIcon className="h-8 w-8 text-blue-600 mr-3" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Información del Sistema</h1>
          <p className="text-gray-600 mt-1">Guía completa de funcionalidades y atajos de teclado</p>
        </div>
      </div>

      {/* Atajos de Teclado */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Keyboard className="h-6 w-6 text-purple-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Atajos de Teclado</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {keyboardShortcuts.map((category) => (
            <div key={category.category}>
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                {category.category}
              </h3>
              <div className="space-y-3">
                {category.shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <shortcut.icon className="h-4 w-4 text-gray-500 mr-3" />
                      <span className="text-sm text-gray-700">{shortcut.description}</span>
                    </div>
                    <kbd className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm font-mono font-semibold text-gray-800 shadow-sm">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Características Principales */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Package className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Características Principales</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className={`p-2 rounded-lg ${feature.color} mr-3`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Especificaciones Técnicas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Monitor className="h-6 w-6 text-green-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Especificaciones Técnicas</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {technicalSpecs.map((spec, index) => (
            <div key={index}>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Database className="h-4 w-4 text-blue-500 mr-2" />
                {spec.category}
              </h3>
              <ul className="space-y-2">
                {spec.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-sm text-gray-600 flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Información del Software */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Settings className="h-6 w-6 text-gray-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Información del Software</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Detalles de la Aplicación</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Nombre:</span>
                <span className="text-sm text-gray-900">SuperMarket ERP</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Versión:</span>
                <span className="text-sm text-gray-900">1.0.0</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Tipo:</span>
                <span className="text-sm text-gray-900">Aplicación de Escritorio</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Plataforma:</span>
                <span className="text-sm text-gray-900">Electron + React</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Capacidades del Sistema</h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <Shield className="h-4 w-4 text-green-500 mr-3" />
                <span className="text-sm text-gray-900">Sistema de Licencias Seguro</span>
              </div>
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <Database className="h-4 w-4 text-blue-500 mr-3" />
                <span className="text-sm text-gray-900">Base de Datos Local</span>
              </div>
              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <Scan className="h-4 w-4 text-purple-500 mr-3" />
                <span className="text-sm text-gray-900">Scanner de Códigos Integrado</span>
              </div>
              <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                <Receipt className="h-4 w-4 text-orange-500 mr-3" />
                <span className="text-sm text-gray-900">Impresión de Tickets Térmicos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credenciales de Demostración */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-center mb-4">
          <Shield className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Credenciales de Demostración</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-800 mb-3">🔐 Acceso al Sistema</h3>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="space-y-2 text-sm">
                <div><strong>Email:</strong> admin@supermarket.com</div>
                <div><strong>Contraseña:</strong> admin123</div>
                <div><strong>Rol:</strong> Administrador</div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-3">🔑 Seriales de Licencia</h3>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="space-y-2 text-xs font-mono">
                <div>SMERP-ADMIN-12345-DEMO1</div>
                <div>SMERP-TRIAL-54321-DEMO2</div>
                <div>SMERP-FULL1-ABCDE-FGHIJ</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 border-t border-gray-200">
        <div className="flex items-center justify-center mb-2">
          <Store className="h-6 w-6 text-blue-600 mr-2" />
          <span className="text-lg font-bold text-gray-900">SuperMarket ERP</span>
        </div>
        <p className="text-sm text-gray-600">
          Sistema completo de gestión para supermercados y tiendas de mercaderías
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Desarrollado con React, TypeScript y Electron
        </p>
      </div>
    </div>
  );
};

export default Info;