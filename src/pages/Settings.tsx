import React from 'react';
import { Settings as SettingsIcon, Info, Database, Shield, Download } from 'lucide-react';
import LicenseInfo from '../components/LicenseInfo';
import BackupManager from '../components/BackupManager';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <SettingsIcon className="h-8 w-8 text-gray-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
      </div>

      {/* Información de Licencia */}
      <LicenseInfo />

      {/* Gestión de Backups */}
      <BackupManager />

      {/* Información del Sistema */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <Info className="h-6 w-6 text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Información del Sistema</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Aplicación</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Nombre:</span>
                <span className="text-gray-900">SuperMarket ERP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Versión:</span>
                <span className="text-gray-900">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo:</span>
                <span className="text-gray-900">Aplicación de Escritorio</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Características</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-gray-900">Sistema de Licencias</span>
              </div>
              <div className="flex items-center">
                <Database className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-gray-900">Base de Datos Local</span>
              </div>
              <div className="flex items-center">
                <SettingsIcon className="h-4 w-4 text-purple-500 mr-2" />
                <span className="text-gray-900">Configuración Persistente</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Configuraciones Adicionales */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuraciones</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Respaldo Automático</h4>
              <p className="text-sm text-gray-600">Los backups automáticos están gestionados arriba</p>
            </div>
            <div className="flex items-center text-green-600">
              <Database className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Ver arriba</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Notificaciones</h4>
              <p className="text-sm text-gray-600">Recibir notificaciones del sistema</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Modo Oscuro</h4>
              <p className="text-sm text-gray-600">Cambiar a tema oscuro</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;