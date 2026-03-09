import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Upload, 
  Trash2, 
  Clock, 
  Database, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Settings,
  RefreshCw,
  Calendar,
  HardDrive,
  FileText
} from 'lucide-react';
import BackupService, { BackupData } from '../utils/backupService';

const BackupManager: React.FC = () => {
  const [backups, setBackups] = useState<{ key: string; data: BackupData }[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isAutoBackupEnabled, setIsAutoBackupEnabled] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    loadBackups();
    loadStats();
    setIsAutoBackupEnabled(BackupService.isAutoBackupEnabledCheck());
  }, []);

  const loadBackups = () => {
    const backupKeys = BackupService.getBackupsList();
    const backupData = backupKeys.map(key => ({
      key,
      data: BackupService.getBackup(key)!
    })).filter(backup => backup.data);
    
    setBackups(backupData);
  };

  const loadStats = () => {
    const backupStats = BackupService.getBackupStats();
    setStats(backupStats);
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    try {
      const result = await BackupService.createManualBackup();
      if (result.success) {
        showNotification('✅ Backup creado exitosamente', 'success');
        loadBackups();
        loadStats();
      } else {
        showNotification(`❌ Error: ${result.message}`, 'error');
      }
    } catch (error) {
      showNotification('❌ Error inesperado al crear backup', 'error');
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleDownloadBackup = (backup: BackupData) => {
    BackupService.downloadBackup(backup);
    showNotification('📥 Backup descargado', 'success');
  };

  const handleRestoreBackup = async (backup: BackupData) => {
    const result = await BackupService.restoreFromBackup(backup);
    if (result.success) {
      showNotification('✅ Backup restaurado. Recargando página...', 'success');
      setTimeout(() => window.location.reload(), 2000);
    } else {
      showNotification(`❌ ${result.message}`, 'error');
    }
  };

  const handleDeleteBackup = (backupKey: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este backup?')) {
      BackupService.deleteBackup(backupKey);
      loadBackups();
      loadStats();
      showNotification('🗑️ Backup eliminado', 'info');
    }
  };

  const handleToggleAutoBackup = () => {
    const newState = !isAutoBackupEnabled;
    BackupService.setAutoBackupEnabled(newState);
    setIsAutoBackupEnabled(newState);
    
    if (newState) {
      BackupService.initializeAutoBackup();
      showNotification('🔄 Backup automático activado', 'success');
    } else {
      BackupService.stopAutoBackup();
      showNotification('⏸️ Backup automático desactivado', 'info');
    }
    
    loadStats();
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBackupTypeIcon = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
    
    // Si fue creado en los últimos 10 minutos, probablemente es manual
    return diffMinutes < 10 ? '👤' : '🤖';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Database className="h-6 w-6 text-blue-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Gestión de Backups</h3>
            <p className="text-sm text-gray-600">Respaldos automáticos y manuales del sistema</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={loadBackups}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title="Actualizar lista"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          
          <button
            onClick={handleCreateBackup}
            disabled={isCreatingBackup}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingBackup ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Creando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Crear Backup
              </>
            )}
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Backups</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalBackups}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <HardDrive className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Espacio Usado</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalSize}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Último Backup</p>
                <p className="text-sm font-bold text-gray-900">{stats.lastBackupDate}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stats.isAutoEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Settings className={`h-5 w-5 ${stats.isAutoEnabled ? 'text-green-600' : 'text-gray-600'}`} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Auto Backup</p>
                <p className={`text-sm font-bold ${stats.isAutoEnabled ? 'text-green-600' : 'text-gray-600'}`}>
                  {stats.isAutoEnabled ? 'Activado' : 'Desactivado'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configuración de Backup Automático */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Backup Automático</h4>
              <p className="text-sm text-gray-600">
                {isAutoBackupEnabled 
                  ? 'Se crean backups automáticamente cada 6 horas' 
                  : 'Los backups automáticos están desactivados'
                }
              </p>
            </div>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isAutoBackupEnabled}
              onChange={handleToggleAutoBackup}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Lista de Backups */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="font-medium text-gray-900">Backups Disponibles</h4>
          <p className="text-sm text-gray-600">Gestiona tus respaldos del sistema</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {backups.length > 0 ? (
            backups.map(({ key, data }) => (
              <div key={key} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-lg">{getBackupTypeIcon(data.timestamp)}</span>
                    </div>
                    
                    <div>
                      <div className="flex items-center">
                        <h5 className="font-medium text-gray-900 mr-2">
                          Backup {formatDate(data.timestamp)}
                        </h5>
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          v{data.version}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span>📦 {data.metadata.totalProducts} productos</span>
                        <span>👥 {data.metadata.totalUsers} usuarios</span>
                        <span>🛒 {data.metadata.totalSales} ventas</span>
                        <span>🏢 {data.metadata.totalSuppliers} proveedores</span>
                        <span>💾 {data.metadata.backupSize}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDownloadBackup(data)}
                      className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Descargar backup"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Descargar
                    </button>
                    
                    <button
                      onClick={() => handleRestoreBackup(data)}
                      className="flex items-center px-3 py-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                      title="Restaurar backup"
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Restaurar
                    </button>
                    
                    <button
                      onClick={() => handleDeleteBackup(key)}
                      className="flex items-center px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar backup"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <Database className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">No hay backups disponibles</h3>
              <p className="text-gray-400 mb-4">Crea tu primer backup para proteger tus datos</p>
              <button
                onClick={handleCreateBackup}
                disabled={isCreatingBackup}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
              >
                <Download className="h-4 w-4 mr-2" />
                Crear Primer Backup
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Información de Seguridad */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800 mb-1">Información Importante</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Los backups se almacenan localmente en tu navegador</li>
              <li>• Descarga backups regularmente para mayor seguridad</li>
              <li>• La restauración reemplazará todos los datos actuales</li>
              <li>• Los backups automáticos se crean cada 6 horas</li>
              <li>• Se mantienen máximo 10 backups (los más antiguos se eliminan)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Notificaciones */}
      {notification && (
        <div
          className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white font-medium animate-fade-in z-50 ${
            notification.type === 'success'
              ? 'bg-green-500'
              : notification.type === 'error'
              ? 'bg-red-500'
              : 'bg-blue-500'
          }`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default BackupManager;