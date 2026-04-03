import type { Category, Product } from '../models';
import type { ProductForm } from '../types/ui';
import { currency } from '../utils/format';

export function ProductsPage({
  categories,
  products,
  form,
  editingProductId,
  setForm,
  startEditing,
  saveProduct,
  deleteProduct,
  addToCart
}: {
  categories: Category[];
  products: Product[];
  form: ProductForm;
  editingProductId: number | null;
  setForm: (updater: (prev: ProductForm) => ProductForm) => void;
  startEditing: (product: Product) => void;
  saveProduct: () => void;
  deleteProduct: (productId: number) => Promise<void>;
  addToCart: (product: Product) => void;
}) {
  return (
    <section className="card">
      <div className="section-heading">
        <h2>Product Setup</h2>
        <p>Create, edit, and add products directly to billing cart.</p>
      </div>

      <div className="row">
        <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Product" />
        <select value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: Number(e.target.value) }))}>
          <option value={0}>Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} placeholder="Price" />
        <button className="btn-primary" onClick={saveProduct}>{editingProductId ? 'Update product' : 'Add product'}</button>
      </div>

      <ul className="clean-list products-list">
        {products.map((p) => (
          <li key={p.id}>
            <div>
              <strong>{p.name}</strong>
              <p className="muted">{p.categoryName} • {currency(p.price)}</p>
            </div>
            <div className="row compact">
              <button className="btn-ghost" onClick={() => startEditing(p)}>Edit</button>
              <button className="btn-ghost" onClick={() => void deleteProduct(p.id)}>Delete</button>
              <button className="btn-primary" onClick={() => addToCart(p)}>Add to cart</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
