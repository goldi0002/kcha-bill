import type { AuthResponse, Bill, Category, Insight, Product } from './models';

const base = 'http://localhost:5000/api';

let token = localStorage.getItem('kb_token') ?? '';

export function setAuthToken(nextToken: string) {
  token = nextToken;
  if (nextToken) {
    localStorage.setItem('kb_token', nextToken);
  } else {
    localStorage.removeItem('kb_token');
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${base}${path}`, {
    headers,
    ...init
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

export const api = {
  login: (payload: { username: string; password: string }) => request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
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
