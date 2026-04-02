import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from './core/api.service';
import { Bill, Category, Insight, Product } from './models/models';

interface CartLine { product: Product; qty: number; }

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private api = inject(ApiService);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  topProducts = signal<Insight[]>([]);
  topCategories = signal<Insight[]>([]);
  cart = signal<CartLine[]>([]);
  bills = signal<Bill[]>([]);

  search = signal('');
  selectedCategory = signal<number | null>(null);
  gstPercent = signal(0);
  discountAmount = signal(0);

  editingProductId: number | null = null;
  form = { name: '', categoryId: 0, price: 0, defaultDiscount: 0 };

  filteredProducts = computed(() => this.products().filter(p =>
    (!this.selectedCategory() || p.categoryId === this.selectedCategory()) &&
    p.name.toLowerCase().includes(this.search().toLowerCase())
  ));

  subTotal = computed(() => this.cart().reduce((s, c) => s + (c.product.price * c.qty), 0));
  taxAmount = computed(() => Math.max(0, this.subTotal() - this.discountAmount()) * this.gstPercent() / 100);
  finalAmount = computed(() => Math.max(0, this.subTotal() - this.discountAmount()) + this.taxAmount());

  constructor() { this.loadAll(); }

  loadAll() {
    this.api.products().subscribe(v => this.products.set(v));
    this.api.categories().subscribe(v => this.categories.set(v));
    this.api.topProducts().subscribe(v => this.topProducts.set(v));
    this.api.topCategories().subscribe(v => this.topCategories.set(v));
    this.api.bills().subscribe(v => this.bills.set(v));
  }

  saveProduct() {
    const payload = { ...this.form, isActive: true };
    const call = this.editingProductId
      ? this.api.updateProduct(this.editingProductId, payload)
      : this.api.createProduct(payload);
    call.subscribe(() => {
      this.form = { name: '', categoryId: 0, price: 0, defaultDiscount: 0 };
      this.editingProductId = null;
      this.loadAll();
    });
  }

  editProduct(product: Product) {
    this.editingProductId = product.id;
    this.form = { name: product.name, categoryId: product.categoryId, price: product.price, defaultDiscount: product.defaultDiscount ?? 0 };
  }

  deleteProduct(id: number) { this.api.deleteProduct(id).subscribe(() => this.loadAll()); }

  addToCart(product: Product) {
    const copy = [...this.cart()];
    const line = copy.find(c => c.product.id === product.id);
    line ? line.qty++ : copy.push({ product, qty: 1 });
    this.cart.set(copy);
  }

  changeQty(productId: number, delta: number) {
    const copy = this.cart().map(c => c.product.id === productId ? { ...c, qty: c.qty + delta } : c).filter(c => c.qty > 0);
    this.cart.set(copy);
  }

  generateBill() {
    if (!this.cart().length) return;
    this.api.createBill({
      discountAmount: this.discountAmount(),
      gstPercent: this.gstPercent(),
      items: this.cart().map(c => ({ productId: c.product.id, quantity: c.qty }))
    }).subscribe(() => {
      this.cart.set([]);
      this.discountAmount.set(0);
      this.gstPercent.set(0);
      this.loadAll();
    });
  }

  printBill() { window.print(); }
}
