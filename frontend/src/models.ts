export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  categoryId: number;
  categoryName?: string;
  price: number;
  defaultDiscount?: number;
  isActive?: boolean;
}

export interface BillItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Bill {
  id: number;
  invoiceNumber: string;
  createdAt: string;
  finalAmount: number;
  items: BillItem[];
}

export interface Insight {
  name: string;
  value: number;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
  expiresAtUtc: string;
}
