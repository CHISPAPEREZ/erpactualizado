export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'cashier' | 'manager';
  isActive: boolean;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  barcode: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  category: string;
  supplier: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  subtotal: number;
  tax: number;
  discount: number;
  paymentMethod: 'cash' | 'card' | 'transfer';
  cashierId: string;
  cashierName: string;
  createdAt: Date;
}

export interface SaleItem {
  productId: string;
  productName: string;
  barcode: string;
  quantity: number;
  price: number;
  total: number;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  userId: string;
  userName: string;
  createdAt: Date;
}

// Nuevos tipos para CRM
export interface Supplier {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  category: string;
  status: 'active' | 'inactive' | 'pending';
  socialMedia: {
    whatsapp?: string;
    facebook?: string;
    instagram?: string;
    website?: string;
  };
  paymentTerms: string;
  creditLimit: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunicationLog {
  id: string;
  supplierId: string;
  supplierName: string;
  type: 'whatsapp' | 'facebook' | 'instagram' | 'email' | 'phone' | 'meeting';
  subject: string;
  message: string;
  direction: 'incoming' | 'outgoing';
  status: 'sent' | 'delivered' | 'read' | 'replied';
  userId: string;
  userName: string;
  createdAt: Date;
}

export interface Order {
  id: string;
  supplierId: string;
  supplierName: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'confirmed' | 'delivered' | 'cancelled';
  orderDate: Date;
  expectedDelivery?: Date;
  actualDelivery?: Date;
  notes: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  total: number;
}