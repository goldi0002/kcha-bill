import type { Bill, Category, Insight, Product } from './models';

const base = 'http://localhost:5000/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${base}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

export const api = {
  products: () => request<Product[]>('/products'),
  categories: () => request<Category[]>('/categories'),
  bills: () => request<Bill[]>('/bills'),
  topProducts: () => request<Insight[]>('/analytics/top-products'),
  topCategories: () => request<Insight[]>('/analytics/top-categories'),
  createProduct: (payload: Partial<Product>) => request<Product>('/products', { method: 'POST', body: JSON.stringify(payload) }),
  updateProduct: (id: number, payload: Partial<Product>) => request<Product>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteProduct: (id: number) => request<void>(`/products/${id}`, { method: 'DELETE' }),
  createBill: (payload: { discountAmount: number; gstPercent: number; items: { productId: number; quantity: number }[] }) =>
    request<Bill>('/bills', { method: 'POST', body: JSON.stringify(payload) })
};
