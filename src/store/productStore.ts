import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

interface ProductState {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getProductByBarcode: (barcode: string) => Product | undefined;
  updateStock: (id: string, quantity: number) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [
        {
          id: 'prod-1',
          name: 'Coca Cola 500ml',
          barcode: '7790895001234',
          price: 2.50,
          cost: 1.80,
          stock: 100,
          minStock: 20,
          category: 'Bebidas',
          supplier: 'Coca Cola Company',
          description: 'Bebida gaseosa sabor cola',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'prod-2',
          name: 'Pan Lactal',
          barcode: '7790895005678',
          price: 3.20,
          cost: 2.10,
          stock: 50,
          minStock: 10,
          category: 'Panadería',
          supplier: 'Bimbo',
          description: 'Pan de molde lactal',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: `prod-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        set((state) => ({ products: [...state.products, newProduct] }));
      },
      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id 
              ? { ...product, ...updates, updatedAt: new Date() } 
              : product
          )
        }));
      },
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id)
        }));
      },
      getProductById: (id) => {
        return get().products.find((product) => product.id === id);
      },
      getProductByBarcode: (barcode) => {
        return get().products.find((product) => product.barcode === barcode);
      },
      updateStock: (id, quantity) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id 
              ? { ...product, stock: product.stock + quantity, updatedAt: new Date() }
              : product
          )
        }));
      }
    }),
    {
      name: 'products-storage'
    }
  )
);