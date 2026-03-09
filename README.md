# SuperMarket ERP - Sistema de Gestión para Supermercados

## 🏪 Descripción

SuperMarket ERP es una aplicación de escritorio completa para la gestión de supermercados y tiendas de mercaderías. Incluye funcionalidades de punto de venta, gestión de inventario, usuarios, reportes y un sistema de licencias por serial.

## ✨ Características Principales

### 🔐 Sistema de Licencias
- **Activación por Serial**: Cada instalación requiere una clave de licencia única
- **Vinculación a Máquina**: Las licencias están vinculadas al hardware específico
- **Seriales de Demostración**: Incluye seriales de prueba para testing
- **Gestión de Licencias**: Panel de administración para ver y resetear licencias

### 🛒 Punto de Venta (POS)
- **Scanner de Códigos de Barras**: Integración con cámaras para escanear productos
- **Múltiples Métodos de Pago**: Efectivo, tarjeta, transferencia
- **Cálculo Automático**: IVA, descuentos, totales
- **Interfaz Intuitiva**: Diseño optimizado para uso rápido

### 📦 Gestión de Inventario
- **Control de Stock**: Seguimiento en tiempo real del inventario
- **Alertas de Stock Bajo**: Notificaciones automáticas
- **Scanner para Nuevos Productos**: Escanear códigos al agregar productos
- **Gestión de Ingresos**: Control de mercadería que ingresa al inventario
- **Categorización**: Organización por categorías y proveedores

### 👥 Gestión de Usuarios
- **Roles y Permisos**: Administrador, Gerente, Cajero
- **Control de Acceso**: Funcionalidades según el rol del usuario
- **Gestión Completa**: Crear, editar, activar/desactivar usuarios

### 📊 Reportes y Análisis
- **Ventas por Período**: Diario, semanal, mensual
- **Productos Más Vendidos**: Análisis de rendimiento
- **Métodos de Pago**: Distribución por tipo de pago
- **Alertas de Inventario**: Productos con stock crítico
- **Exportación**: Funcionalidad para exportar reportes

## 🚀 Instalación y Configuración

### Requisitos del Sistema
- **Sistema Operativo**: Windows 10/11, macOS 10.14+, Linux Ubuntu 18.04+
- **RAM**: Mínimo 4GB, recomendado 8GB
- **Espacio en Disco**: 500MB libres
- **Cámara**: Opcional, para scanner de códigos de barras

### Instalación para Desarrollo

1. **Clonar el repositorio**:
```bash
git clone [url-del-repositorio]
cd supermarket-erp-desktop
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Ejecutar en modo desarrollo**:
```bash
npm run electron-dev
```

### Construcción para Producción

1. **Construir la aplicación**:
```bash
npm run build
```

2. **Generar instalador**:
```bash
npm run dist
```

Los instaladores se generarán en la carpeta `dist-electron/`:
- **Windows**: `.exe` (NSIS installer)
- **macOS**: `.dmg`
- **Linux**: `.AppImage`

## 🔑 Sistema de Licencias

### Seriales de Demostración
Para pruebas, puedes usar estos seriales:

- `SMERP-ADMIN-12345-DEMO1` - Licencia de Administrador
- `SMERP-TRIAL-54321-DEMO2` - Licencia de Prueba
- `SMERP-FULL1-ABCDE-FGHIJ` - Licencia Completa

### Formato de Serial
- **Patrón**: `SMERP-XXXXX-XXXXX-XXXXX`
- **Longitud**: 23 caracteres incluyendo guiones
- **Caracteres**: Solo letras mayúsculas y números

### Activación
1. Al iniciar la aplicación por primera vez, aparecerá la ventana de activación
2. Ingresa tu clave de licencia
3. La aplicación validará el serial contra el ID de la máquina
4. Una vez activada, la licencia se guarda localmente

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18**: Framework principal
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos y diseño
- **Lucide React**: Iconografía
- **React Router**: Navegación
- **Zustand**: Gestión de estado

### Desktop
- **Electron**: Framework para aplicaciones de escritorio
- **Electron Builder**: Construcción y empaquetado
- **Electron Store**: Almacenamiento persistente

### Funcionalidades Especiales
- **html5-qrcode**: Scanner de códigos de barras
- **crypto-js**: Encriptación para licencias
- **node-machine-id**: Identificación única de máquina
- **date-fns**: Manipulación de fechas

## 📱 Uso de la Aplicación

### Primer Inicio
1. **Activación**: Ingresa tu clave de licencia
2. **Login**: Usa las credenciales por defecto:
   - Email: `admin@supermarket.com`
   - Contraseña: `admin123`

### Flujo de Trabajo Típico

#### Gestión de Inventario
1. **Agregar Productos**: Ir a Inventario → Nuevo Producto
2. **Escanear Código**: Usar el botón scanner junto al campo código de barras
3. **Completar Datos**: Llenar información del producto
4. **Definir Stock**: Establecer stock inicial y cantidad que ingresa
5. **Guardar**: El producto se agrega al inventario

#### Realizar Ventas
1. **Seleccionar Productos**: Buscar o escanear productos
2. **Agregar al Carrito**: Los productos se agregan automáticamente
3. **Revisar Venta**: Verificar cantidades y totales
4. **Procesar Pago**: Seleccionar método de pago
5. **Completar**: La venta se registra y actualiza el inventario

#### Generar Reportes
1. **Seleccionar Período**: Elegir rango de fechas
2. **Ver Métricas**: Revisar ventas, productos top, etc.
3. **Exportar**: Descargar reportes para análisis externo

## 🔧 Configuración Avanzada

### Personalización
- **Tema**: Cambiar entre modo claro y oscuro
- **Notificaciones**: Configurar alertas del sistema
- **Respaldos**: Activar respaldos automáticos

### Gestión de Licencias
- **Ver Información**: Panel de configuración muestra detalles de la licencia
- **Resetear Licencia**: Opción para cambiar de licencia (requiere reinicio)
- **Validación**: El sistema verifica la licencia al iniciar

## 🆘 Soporte y Resolución de Problemas

### Problemas Comunes

**La aplicación no inicia**:
- Verificar que la licencia esté activada
- Comprobar permisos de escritura en el directorio de la aplicación

**Scanner no funciona**:
- Verificar permisos de cámara
- Asegurar que hay buena iluminación
- Probar con diferentes códigos de barras

**Datos no se guardan**:
- Verificar permisos de escritura
- Comprobar espacio disponible en disco

### Logs y Depuración
Los logs de la aplicación se encuentran en:
- **Windows**: `%APPDATA%/supermarket-erp-desktop/logs/`
- **macOS**: `~/Library/Logs/supermarket-erp-desktop/`
- **Linux**: `~/.config/supermarket-erp-desktop/logs/`

## 📄 Licencia

Este software está protegido por derechos de autor. El uso requiere una licencia válida.

## 🤝 Contribución

Para contribuir al desarrollo:
1. Fork el repositorio
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Crear un Pull Request

---

**SuperMarket ERP v1.0.0** - Sistema completo de gestión para supermercados