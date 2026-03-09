import { supabase } from '../lib/supabase';

export interface BackupData {
  timestamp: string;
  version: string;
  data: {
    products: any[];
    users: any[];
    sales: any[];
    suppliers: any[];
    communications: any[];
    orders: any[];
  };
  metadata: {
    totalProducts: number;
    totalUsers: number;
    totalSales: number;
    totalSuppliers: number;
    backupSize: string;
  };
}

class BackupService {
  private static instance: BackupService;
  private backupInterval: NodeJS.Timeout | null = null;
  private isAutoBackupEnabled = true;

  static getInstance(): BackupService {
    if (!BackupService.instance) {
      BackupService.instance = new BackupService();
    }
    return BackupService.instance;
  }

  // Inicializar backups automáticos
  initializeAutoBackup() {
    if (this.isAutoBackupEnabled) {
      // Backup cada 6 horas (21600000 ms)
      this.backupInterval = setInterval(() => {
        this.createAutoBackup();
      }, 21600000);

      // Backup inicial después de 5 minutos
      setTimeout(() => {
        this.createAutoBackup();
      }, 300000);
    }
  }

  // Detener backups automáticos
  stopAutoBackup() {
    if (this.backupInterval) {
      clearInterval(this.backupInterval);
      this.backupInterval = null;
    }
  }

  // Habilitar/deshabilitar backup automático
  setAutoBackupEnabled(enabled: boolean) {
    this.isAutoBackupEnabled = enabled;
    if (enabled) {
      this.initializeAutoBackup();
    } else {
      this.stopAutoBackup();
    }
    localStorage.setItem('autoBackupEnabled', enabled.toString());
  }

  // Verificar si el backup automático está habilitado
  isAutoBackupEnabledCheck(): boolean {
    const stored = localStorage.getItem('autoBackupEnabled');
    return stored !== null ? stored === 'true' : true;
  }

  // Obtener todos los datos para backup
  private async getAllData(): Promise<BackupData['data']> {
    try {
      const [
        { data: products },
        { data: users },
        { data: sales },
        { data: suppliers },
        { data: communications },
        { data: orders }
      ] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('users').select('*'),
        supabase.from('sales').select('*'),
        supabase.from('suppliers').select('*'),
        supabase.from('communications').select('*'),
        supabase.from('orders').select('*')
      ]);

      return {
        products: products || [],
        users: users || [],
        sales: sales || [],
        suppliers: suppliers || [],
        communications: communications || [],
        orders: orders || []
      };
    } catch (error) {
      console.error('Error obteniendo datos para backup:', error);
      
      // Fallback a datos locales si Supabase falla
      return {
        products: JSON.parse(localStorage.getItem('products-storage') || '{"state":{"products":[]}}').state.products,
        users: JSON.parse(localStorage.getItem('users-storage') || '{"state":{"users":[]}}').state.users,
        sales: JSON.parse(localStorage.getItem('sales-storage') || '{"state":{"sales":[]}}').state.sales,
        suppliers: JSON.parse(localStorage.getItem('supplier-storage') || '{"state":{"suppliers":[]}}').state.suppliers,
        communications: JSON.parse(localStorage.getItem('supplier-storage') || '{"state":{"communications":[]}}').state.communications,
        orders: JSON.parse(localStorage.getItem('supplier-storage') || '{"state":{"orders":[]}}').state.orders
      };
    }
  }

  // Crear backup manual
  async createManualBackup(): Promise<{ success: boolean; message: string; backup?: BackupData }> {
    try {
      const data = await this.getAllData();
      const backup = this.createBackupObject(data, 'manual');
      
      await this.saveBackup(backup);
      
      return {
        success: true,
        message: 'Backup creado exitosamente',
        backup
      };
    } catch (error) {
      console.error('Error creando backup manual:', error);
      return {
        success: false,
        message: 'Error al crear el backup: ' + (error as Error).message
      };
    }
  }

  // Crear backup automático
  private async createAutoBackup() {
    try {
      const data = await this.getAllData();
      const backup = this.createBackupObject(data, 'auto');
      
      await this.saveBackup(backup);
      console.log('Backup automático creado:', new Date().toLocaleString());
    } catch (error) {
      console.error('Error en backup automático:', error);
    }
  }

  // Crear objeto de backup
  private createBackupObject(data: BackupData['data'], type: 'manual' | 'auto'): BackupData {
    const timestamp = new Date().toISOString();
    const backupData = JSON.stringify(data);
    const sizeInBytes = new Blob([backupData]).size;
    const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);

    return {
      timestamp,
      version: '1.0.0',
      data,
      metadata: {
        totalProducts: data.products.length,
        totalUsers: data.users.length,
        totalSales: data.sales.length,
        totalSuppliers: data.suppliers.length,
        backupSize: `${sizeInMB} MB`
      }
    };
  }

  // Guardar backup
  private async saveBackup(backup: BackupData) {
    const backupKey = `backup_${backup.timestamp}`;
    
    // Guardar en localStorage
    localStorage.setItem(backupKey, JSON.stringify(backup));
    
    // Mantener solo los últimos 10 backups
    this.cleanOldBackups();
    
    // Actualizar lista de backups
    this.updateBackupsList(backupKey);
  }

  // Limpiar backups antiguos
  private cleanOldBackups() {
    const backupKeys = Object.keys(localStorage).filter(key => key.startsWith('backup_'));
    
    if (backupKeys.length > 10) {
      // Ordenar por fecha (más antiguos primero)
      backupKeys.sort();
      
      // Eliminar los más antiguos
      const toDelete = backupKeys.slice(0, backupKeys.length - 10);
      toDelete.forEach(key => localStorage.removeItem(key));
    }
  }

  // Actualizar lista de backups
  private updateBackupsList(newBackupKey: string) {
    const backupsList = this.getBackupsList();
    backupsList.unshift(newBackupKey);
    
    // Mantener solo los últimos 10
    const trimmedList = backupsList.slice(0, 10);
    localStorage.setItem('backups_list', JSON.stringify(trimmedList));
  }

  // Obtener lista de backups
  getBackupsList(): string[] {
    const stored = localStorage.getItem('backups_list');
    return stored ? JSON.parse(stored) : [];
  }

  // Obtener backup específico
  getBackup(backupKey: string): BackupData | null {
    const stored = localStorage.getItem(backupKey);
    return stored ? JSON.parse(stored) : null;
  }

  // Descargar backup como archivo
  downloadBackup(backup: BackupData) {
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `supermarket_backup_${backup.timestamp.split('T')[0]}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  // Restaurar desde backup
  async restoreFromBackup(backup: BackupData): Promise<{ success: boolean; message: string }> {
    try {
      // Confirmar con el usuario
      const confirmed = confirm(
        `¿Estás seguro de que quieres restaurar el backup del ${new Date(backup.timestamp).toLocaleString()}?\n\n` +
        `Esto reemplazará todos los datos actuales:\n` +
        `- ${backup.metadata.totalProducts} productos\n` +
        `- ${backup.metadata.totalUsers} usuarios\n` +
        `- ${backup.metadata.totalSales} ventas\n` +
        `- ${backup.metadata.totalSuppliers} proveedores\n\n` +
        `Esta acción no se puede deshacer.`
      );

      if (!confirmed) {
        return { success: false, message: 'Restauración cancelada por el usuario' };
      }

      // Restaurar en Supabase
      await this.restoreToSupabase(backup.data);
      
      // Restaurar en localStorage
      this.restoreToLocalStorage(backup.data);
      
      return {
        success: true,
        message: 'Backup restaurado exitosamente. La página se recargará.'
      };
    } catch (error) {
      console.error('Error restaurando backup:', error);
      return {
        success: false,
        message: 'Error al restaurar el backup: ' + (error as Error).message
      };
    }
  }

  // Restaurar en Supabase
  private async restoreToSupabase(data: BackupData['data']) {
    try {
      // Limpiar tablas existentes y restaurar datos
      await Promise.all([
        supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('suppliers').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('communications').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      ]);

      // Insertar datos restaurados
      if (data.products.length > 0) {
        await supabase.from('products').insert(data.products);
      }
      if (data.suppliers.length > 0) {
        await supabase.from('suppliers').insert(data.suppliers);
      }
      if (data.communications.length > 0) {
        await supabase.from('communications').insert(data.communications);
      }
      if (data.orders.length > 0) {
        await supabase.from('orders').insert(data.orders);
      }
    } catch (error) {
      console.warn('Error restaurando en Supabase, usando solo localStorage:', error);
    }
  }

  // Restaurar en localStorage
  private restoreToLocalStorage(data: BackupData['data']) {
    // Restaurar stores de Zustand
    const stores = [
      { key: 'products-storage', data: { state: { products: data.products }, version: 0 } },
      { key: 'users-storage', data: { state: { users: data.users }, version: 0 } },
      { key: 'sales-storage', data: { state: { sales: data.sales, currentSale: [] }, version: 0 } },
      { key: 'supplier-storage', data: { 
        state: { 
          suppliers: data.suppliers, 
          communications: data.communications, 
          orders: data.orders 
        }, 
        version: 0 
      } }
    ];

    stores.forEach(store => {
      localStorage.setItem(store.key, JSON.stringify(store.data));
    });
  }

  // Eliminar backup
  deleteBackup(backupKey: string) {
    localStorage.removeItem(backupKey);
    
    // Actualizar lista
    const backupsList = this.getBackupsList().filter(key => key !== backupKey);
    localStorage.setItem('backups_list', JSON.stringify(backupsList));
  }

  // Obtener estadísticas de backups
  getBackupStats() {
    const backupsList = this.getBackupsList();
    const totalBackups = backupsList.length;
    
    let totalSize = 0;
    let lastBackupDate = null;
    
    backupsList.forEach(key => {
      const backup = this.getBackup(key);
      if (backup) {
        const sizeInMB = parseFloat(backup.metadata.backupSize.replace(' MB', ''));
        totalSize += sizeInMB;
        
        if (!lastBackupDate || new Date(backup.timestamp) > new Date(lastBackupDate)) {
          lastBackupDate = backup.timestamp;
        }
      }
    });

    return {
      totalBackups,
      totalSize: `${totalSize.toFixed(2)} MB`,
      lastBackupDate: lastBackupDate ? new Date(lastBackupDate).toLocaleString() : 'Nunca',
      isAutoEnabled: this.isAutoBackupEnabledCheck()
    };
  }
}

export default BackupService.getInstance();