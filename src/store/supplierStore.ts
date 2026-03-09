import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Supplier, CommunicationLog, Order } from '../types';

interface SupplierState {
  suppliers: Supplier[];
  communications: CommunicationLog[];
  orders: Order[];
  
  // Supplier management
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  getSupplierById: (id: string) => Supplier | undefined;
  
  // Communication management
  addCommunication: (communication: Omit<CommunicationLog, 'id' | 'createdAt'>) => void;
  getCommunicationsBySupplier: (supplierId: string) => CommunicationLog[];
  
  // Order management
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  getOrdersBySupplier: (supplierId: string) => Order[];
}

export const useSupplierStore = create<SupplierState>()(
  persist(
    (set, get) => ({
      suppliers: [
        {
          id: 'sup-1',
          name: 'Juan Pérez',
          company: 'Distribuidora Central',
          email: 'juan@distribuidora.com',
          phone: '+54 11 1234-5678',
          address: 'Av. Corrientes 1234',
          city: 'Buenos Aires',
          country: 'Argentina',
          category: 'Bebidas',
          status: 'active',
          socialMedia: {
            whatsapp: '+5411123456789',
            facebook: 'distribuidoracentral',
            instagram: '@distribuidora_central'
          },
          paymentTerms: '30 días',
          creditLimit: 50000,
          notes: 'Proveedor principal de bebidas',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'sup-2',
          name: 'María González',
          company: 'Panadería Artesanal',
          email: 'maria@panaderia.com',
          phone: '+54 11 9876-5432',
          address: 'Calle San Martín 567',
          city: 'Buenos Aires',
          country: 'Argentina',
          category: 'Panadería',
          status: 'active',
          socialMedia: {
            whatsapp: '+5411987654321',
            instagram: '@panaderia_artesanal'
          },
          paymentTerms: '15 días',
          creditLimit: 25000,
          notes: 'Productos frescos diarios',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      communications: [],
      orders: [],

      addSupplier: (supplierData) => {
        const newSupplier: Supplier = {
          ...supplierData,
          id: `sup-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        set((state) => ({ suppliers: [...state.suppliers, newSupplier] }));
      },

      updateSupplier: (id, updates) => {
        set((state) => ({
          suppliers: state.suppliers.map((supplier) =>
            supplier.id === id 
              ? { ...supplier, ...updates, updatedAt: new Date() } 
              : supplier
          )
        }));
      },

      deleteSupplier: (id) => {
        set((state) => ({
          suppliers: state.suppliers.filter((supplier) => supplier.id !== id)
        }));
      },

      getSupplierById: (id) => {
        return get().suppliers.find((supplier) => supplier.id === id);
      },

      addCommunication: (communicationData) => {
        const newCommunication: CommunicationLog = {
          ...communicationData,
          id: `comm-${Date.now()}`,
          createdAt: new Date()
        };
        set((state) => ({ communications: [...state.communications, newCommunication] }));
      },

      getCommunicationsBySupplier: (supplierId) => {
        return get().communications.filter((comm) => comm.supplierId === supplierId);
      },

      addOrder: (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: `order-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        set((state) => ({ orders: [...state.orders, newOrder] }));
      },

      updateOrder: (id, updates) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id 
              ? { ...order, ...updates, updatedAt: new Date() } 
              : order
          )
        }));
      },

      getOrdersBySupplier: (supplierId) => {
        return get().orders.filter((order) => order.supplierId === supplierId);
      }
    }),
    {
      name: 'supplier-storage'
    }
  )
);