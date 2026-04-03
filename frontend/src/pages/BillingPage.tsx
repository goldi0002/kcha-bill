import type { Category, Product } from '../models';
import type { CartLine } from '../types/ui';
import { currency } from '../utils/format';

export function BillingPage({
  search,
  selectedCategory,
  categories,
  filteredProducts,
  cart,
  discountAmount,
  gstPercent,
  subTotal,
  taxAmount,
  finalAmount,
  setSearch,
  setSelectedCategory,
  setDiscountAmount,
  setGstPercent,
  addToCart,
  changeQty,
  generateBill
}: {
  search: string;
  selectedCategory: number | '';
  categories: Category[];
  filteredProducts: Product[];
  cart: CartLine[];
  discountAmount: number;
  gstPercent: number;
  subTotal: number;
  taxAmount: number;
  finalAmount: number;
  setSearch: (value: string) => void;
  setSelectedCategory: (value: number | '') => void;
  setDiscountAmount: (value: number) => void;
  setGstPercent: (value: number) => void;
  addToCart: (product: Product) => void;
  changeQty: (productId: number, delta: number) => void;
  generateBill: () => Promise<void>;
}) {
  return (
    <section className="card">
      <div className="section-heading">
        <h2>Billing</h2>
        <p>Select products, adjust taxes, and generate an invoice instantly.</p>
      </div>

      <div className="row">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products" />
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : '')}>
          <option value="">All categories</option>
          {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
        </select>
      </div>

      <div className="chips">
        {filteredProducts.map((p) => (
          <button key={p.id} className="chip" onClick={() => addToCart(p)}>{p.name} • {currency(p.price)}</button>
        ))}
      </div>

      <div className="stack panel">
        {cart.length ? cart.map((line) => (
          <div key={line.product.id} className="row between cart-line">
            <span>{line.product.name}</span>
            <div className="row compact">
              <button className="btn-ghost" onClick={() => changeQty(line.product.id, -1)}>-</button>
              <strong>{line.qty}</strong>
              <button className="btn-ghost" onClick={() => changeQty(line.product.id, 1)}>+</button>
            </div>
          </div>
        )) : <p className="muted">Cart is empty.</p>}
      </div>

      <div className="row">
        <label>Discount
          <input type="number" value={discountAmount} onChange={(e) => setDiscountAmount(Number(e.target.value))} />
        </label>
        <label>GST
          <select value={gstPercent} onChange={(e) => setGstPercent(Number(e.target.value))}>
            {[0, 5, 12, 18, 28].map((v) => <option key={v} value={v}>{v}%</option>)}
          </select>
        </label>
      </div>

      <div className="totals panel">
        <p><span>Subtotal</span><strong>{currency(subTotal)}</strong></p>
        <p><span>Tax</span><strong>{currency(taxAmount)}</strong></p>
        <p className="grand-total"><span>Total</span><strong>{currency(finalAmount)}</strong></p>
      </div>
      <button className="btn-primary" onClick={() => void generateBill()}>Generate Bill</button>
    </section>
  );
}
