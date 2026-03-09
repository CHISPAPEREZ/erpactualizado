import React, { useState } from 'react';
import { BarChart3, DollarSign, Package, TrendingUp, Calendar, Download } from 'lucide-react';
import { useSalesStore } from '../store/salesStore';
import { useProductStore } from '../store/productStore';
import { format, startOfDay, endOfDay, subDays } from 'date-fns';

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState('today');
  const { sales } = useSalesStore();
  const { products } = useProductStore();

  const getDateRange = () => {
    const today = new Date();
    switch (dateRange) {
      case 'today':
        return { start: startOfDay(today), end: endOfDay(today) };
      case 'week':
        return { start: startOfDay(subDays(today, 7)), end: endOfDay(today) };
      case 'month':
        return { start: startOfDay(subDays(today, 30)), end: endOfDay(today) };
      default:
        return { start: startOfDay(today), end: endOfDay(today) };
    }
  };

  const { start, end } = getDateRange();
  const filteredSales = sales.filter(sale => 
    sale.createdAt >= start && sale.createdAt <= end
  );

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalTransactions = filteredSales.length;
  const averageTicket = totalTransactions > 0 ? totalSales / totalTransactions : 0;

  const lowStockProducts = products.filter(p => p.stock <= p.minStock);
  const totalProducts = products.length;

  const topProducts = filteredSales
    .flatMap(sale => sale.items)
    .reduce((acc, item) => {
      const existing = acc.find(p => p.productId === item.productId);
      if (existing) {
        existing.quantity += item.quantity;
        existing.total += item.total;
      } else {
        acc.push({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          total: item.total
        });
      }
      return acc;
    }, [] as any[])
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const salesByPaymentMethod = filteredSales.reduce((acc, sale) => {
    acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + sale.total;
    return acc;
  }, {} as Record<string, number>);

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cash': return 'Efectivo';
      case 'card': return 'Tarjeta';
      case 'transfer': return 'Transferencia';
      default: return method;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Reportes y Análisis</h1>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="today">Hoy</option>
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="h-5 w-5 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ventas Totales</p>
              <p className="text-2xl font-bold text-gray-900">${totalSales.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Transacciones</p>
              <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ticket Promedio</p>
              <p className="text-2xl font-bold text-gray-900">${averageTicket.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Productos</p>
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos más vendidos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos Más Vendidos</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.productId} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{product.productName}</p>
                    <p className="text-sm text-gray-500">{product.quantity} unidades vendidas</p>
                  </div>
                </div>
                <span className="font-semibold text-green-600">
                  ${product.total.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ventas por método de pago */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventas por Método de Pago</h3>
          <div className="space-y-4">
            {Object.entries(salesByPaymentMethod).map(([method, amount]) => (
              <div key={method} className="flex items-center justify-between">
                <span className="font-medium text-gray-900">
                  {getPaymentMethodLabel(method)}
                </span>
                <span className="font-semibold text-green-600">
                  ${amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alertas de inventario */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas de Inventario</h3>
        {lowStockProducts.length > 0 ? (
          <div className="space-y-3">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">Stock actual: {product.stock} | Mínimo: {product.minStock}</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  Stock Bajo
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No hay productos con stock bajo</p>
        )}
      </div>

      {/* Historial de ventas recientes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventas Recientes</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Venta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cajero
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Método de Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.slice(0, 10).map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sale.id.slice(-8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(sale.createdAt, 'dd/MM/yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.cashierName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getPaymentMethodLabel(sale.paymentMethod)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    ${sale.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;