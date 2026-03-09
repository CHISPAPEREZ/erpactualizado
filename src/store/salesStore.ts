import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Sale, SaleItem } from '../types';

interface SalesState {
  sales: Sale[];
  currentSale: SaleItem[];
  addToCurrentSale: (item: SaleItem) => void;
  removeFromCurrentSale: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCurrentSale: () => void;
  completeSale: (paymentMethod: 'cash' | 'card' | 'transfer', cashierId: string, cashierName: string) => string;
  getSaleById: (id: string) => Sale | undefined;
  getTodaySales: () => Sale[];
}

export const useSalesStore = create<SalesState>()(
  persist(
    (set, get) => ({
      sales: [],
      currentSale: [],
      addToCurrentSale: (item) => {
        set((state) => {
          const existingItem = state.currentSale.find(
            (saleItem) => saleItem.productId === item.productId
          );
          
          if (existingItem) {
            return {
              currentSale: state.currentSale.map((saleItem) =>
                saleItem.productId === item.productId
                  ? {
                      ...saleItem,
                      quantity: saleItem.quantity + item.quantity,
                      total: (saleItem.quantity + item.quantity) * saleItem.price
                    }
                  : saleItem
              )
            };
          } else {
            return {
              currentSale: [...state.currentSale, item]
            };
          }
        });
      },
      removeFromCurrentSale: (productId) => {
        set((state) => ({
          currentSale: state.currentSale.filter((item) => item.productId !== productId)
        }));
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          currentSale: state.currentSale.map((item) =>
            item.productId === productId
              ? { ...item, quantity, total: quantity * item.price }
              : item
          )
        }));
      },
      clearCurrentSale: () => {
        set({ currentSale: [] });
      },
      completeSale: (paymentMethod, cashierId, cashierName) => {
        const { currentSale } = get();
        const subtotal = currentSale.reduce((sum, item) => sum + item.total, 0);
        const tax = subtotal * 0.21; // 21% IVA
        const total = subtotal + tax;
        
        const newSale: Sale = {
          id: `sale-${Date.now()}`,
          items: [...currentSale],
          subtotal,
          tax,
          total,
          discount: 0,
          paymentMethod,
          cashierId,
          cashierName,
          createdAt: new Date()
        };
        
        set((state) => ({
          sales: [...state.sales, newSale],
          currentSale: []
        }));
        
        return newSale.id;
      },
      getSaleById: (id) => {
        return get().sales.find((sale) => sale.id === id);
      },
      getTodaySales: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return get().sales.filter((sale) => sale.createdAt >= today);
      }
    }),
    {
      name: 'sales-storage'
    }
  )
);