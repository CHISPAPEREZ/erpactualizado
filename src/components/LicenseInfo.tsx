import React, { useState, useEffect } from 'react';
import { Shield, Key, Monitor, Calendar, RotateCcw } from 'lucide-react';

interface LicenseData {
  serial: string;
  machineHash: string;
  valid: boolean;
  activatedAt: string;
}

const LicenseInfo: React.FC = () => {
  const [licenseData, setLicenseData] = useState<LicenseData | null>(null);
  const [machineInfo, setMachineInfo] = useState<any>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    loadLicenseInfo();
  }, []);

  const loadLicenseInfo = async () => {
    try {
      // @ts-ignore - electronAPI está disponible en el contexto de Electron
      if (window.electronAPI) {
        const [license, machine] = await Promise.all([
          // @ts-ignore
          window.electronAPI.getLicenseInfo(),
          // @ts-ignore
          window.electronAPI.getMachineInfo()
        ]);
        setLicenseData(license);
        setMachineInfo(machine);
      }
    } catch (error) {
      console.error('Error loading license info:', error);
    }
  };

  const handleResetLicense = async () => {
    try {
      // @ts-ignore
      if (window.electronAPI) {
        // @ts-ignore
        await window.electronAPI.resetLicense();
      }
    } catch (error) {
      console.error('Error resetting license:', error);
    }
  };

  const formatSerial = (serial: string) => {
    return serial.replace(/(.{5})/g, '$1-').slice(0, -1);
  };

  const getSerialType = (serial: string) => {
    if (serial.includes('ADMIN')) return { type: 'Administrador', color: 'text-red-600 bg-red-100' };
    if (serial.includes('TRIAL')) return { type: 'Prueba', color: 'text-yellow-600 bg-yellow-100' };
    if (serial.includes('FULL')) return { type: 'Completa', color: 'text-green-600 bg-green-100' };
    return { type: 'Estándar', color: 'text-blue-600 bg-blue-100' };
  };

  if (!licenseData || !machineInfo) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <Shield className="h-6 w-6 text-gray-400 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Información de Licencia</h3>
        </div>
        <p className="text-gray-500 mt-2">Cargando información de licencia...</p>
      </div>
    );
  }

  const serialInfo = getSerialType(licenseData.serial);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Shield className="h-6 w-6 text-green-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Información de Licencia</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${serialInfo.color}`}>
          Licencia {serialInfo.type}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start">
            <Key className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Clave de Licencia</p>
              <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded mt-1">
                {formatSerial(licenseData.serial)}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Monitor className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">ID de Máquina</p>
              <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded mt-1">
                {machineInfo.machineId}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Fecha de Activación</p>
              <p className="text-sm text-gray-900">
                {new Date(licenseData.activatedAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Shield className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Estado</p>
              <p className="text-sm text-green-600 font-medium">Licencia Válida y Activa</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Versión del Software</p>
            <p className="text-sm text-gray-900">SuperMarket ERP v{machineInfo.version}</p>
          </div>
          
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Resetear Licencia
          </button>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ¿Resetear Licencia?
            </h3>
            <p className="text-gray-600 mb-6">
              Esta acción eliminará la licencia actual y requerirá una nueva activación. 
              La aplicación se reiniciará automáticamente.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleResetLicense}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Resetear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LicenseInfo;