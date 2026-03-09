import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  LogOut,
  Store,
  Settings,
  Menu,
  X,
  UserCheck,
  Info
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Ventas', href: '/sales', icon: ShoppingCart },
    { name: 'Inventario', href: '/inventory', icon: Package },
    { name: 'CRM', href: '/crm', icon: UserCheck },
    { name: 'Usuarios', href: '/users', icon: Users, adminOnly: true },
    { name: 'Reportes', href: '/reports', icon: BarChart3 },
    { name: 'Información', href: '/info', icon: Info },
    { name: 'Configuración', href: '/settings', icon: Settings, adminOnly: true }
  ];

  const filteredNavigation = navigation.filter(
    item => !item.adminOnly || user?.role === 'admin'
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
        onMouseEnter={() => setSidebarCollapsed(false)}
        onMouseLeave={() => setSidebarCollapsed(true)}
      >
        {/* Header del Sidebar */}
        <div className="flex h-16 items-center justify-center border-b border-gray-200 px-4">
          {!sidebarCollapsed ? (
            <>
              <Store className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">SuperMarket ERP</span>
            </>
          ) : (
            <Store className="h-8 w-8 text-blue-600" />
          )}
        </div>
        
        {/* Navigation */}
        <nav className="mt-8 px-2">
          <ul className="space-y-2">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    title={sidebarCollapsed ? item.name : ''}
                  >
                    <item.icon className={`h-5 w-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
                    {!sidebarCollapsed && (
                      <span className="transition-opacity duration-200">{item.name}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User info and logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          {!sidebarCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header Principal */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center">
                <Store className="h-8 w-8 text-blue-600 mr-3" />
                SuperMarket ERP
              </h1>
              <p className="text-sm text-gray-500 mt-1">Sistema de Gestión Integral</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;