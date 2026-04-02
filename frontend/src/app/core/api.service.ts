import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Bill, Category, Insight, Product } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = 'http://localhost:5000/api';

  products() { return this.http.get<Product[]>(`${this.base}/products`); }
  createProduct(payload: Partial<Product>) { return this.http.post<Product>(`${this.base}/products`, payload); }
  updateProduct(id: number, payload: Partial<Product>) { return this.http.put<Product>(`${this.base}/products/${id}`, payload); }
  deleteProduct(id: number) { return this.http.delete(`${this.base}/products/${id}`); }
  categories() { return this.http.get<Category[]>(`${this.base}/categories`); }
  createCategory(name: string) { return this.http.post<Category>(`${this.base}/categories`, { name }); }
  createBill(payload: { discountAmount: number; gstPercent: number; items: { productId: number; quantity: number; }[] }) { return this.http.post<Bill>(`${this.base}/bills`, payload); }
  bills() { return this.http.get<Bill[]>(`${this.base}/bills`); }
  topProducts() { return this.http.get<Insight[]>(`${this.base}/analytics/top-products`); }
  topCategories() { return this.http.get<Insight[]>(`${this.base}/analytics/top-categories`); }
}
