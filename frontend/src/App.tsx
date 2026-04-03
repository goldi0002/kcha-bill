import { useEffect, useMemo, useState } from 'react';
import { api, setAuthToken } from './api';
import type { Bill, Category, Insight, Product } from './models';
import './styles.css';

type CartLine = { product: Product; qty: number };

const defaultForm = { name: '', categoryId: 0, price: 0, defaultDiscount: 0 };

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [topProducts, setTopProducts] = useState<Insight[]>([]);
  const [topCategories, setTopCategories] = useState<Insight[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | ''>('');
  const [gstPercent, setGstPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);

  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState('');

  const [username, setUsername] = useState(localStorage.getItem('kb_user') ?? '');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('kb_user') ?? '');

  const loadAll = async () => {
    try {
      const [p, c, tp, tc, b] = await Promise.all([
        api.products(),
        api.categories(),
        api.topProducts(),
        api.topCategories(),
        api.bills()
      ]);
      setProducts(p);
      setCategories(c);
      setTopProducts(tp);
      setTopCategories(tc);
      setBills(b);
      setError('');
    } catch {
      setError('Failed to load data. Check backend and login session.');
    }
  };

  useEffect(() => {
    if (loggedInUser) {
      loadAll();
    }
  }, [loggedInUser]);

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          (!selectedCategory || p.categoryId === selectedCategory) &&
          p.name.toLowerCase().includes(search.toLowerCase())
      ),
    [products, selectedCategory, search]
  );

  const subTotal = useMemo(() => cart.reduce((sum, c) => sum + c.product.price * c.qty, 0), [cart]);
  const taxAmount = useMemo(() => Math.max(0, subTotal - discountAmount) * (gstPercent / 100), [subTotal, discountAmount, gstPercent]);
  const finalAmount = useMemo(() => Math.max(0, subTotal - discountAmount) + taxAmount, [subTotal, discountAmount, taxAmount]);

  const login = async () => {
    try {
      const auth = await api.login({ username, password });
      setAuthToken(auth.token);
      localStorage.setItem('kb_user', auth.username);
      setLoggedInUser(auth.username);
      setPassword('');
      setError('');
    } catch {
      setError('Login failed. Try owner / owner123');
    }
  };

  const logout = () => {
    setAuthToken('');
    localStorage.removeItem('kb_user');
    setLoggedInUser('');
    setProducts([]);
    setCategories([]);
    setTopProducts([]);
    setTopCategories([]);
    setBills([]);
    setCart([]);
    setError('');
  };

  const saveProduct = async () => {
    const payload = { ...form, isActive: true };
    if (!payload.name || !payload.categoryId || payload.price <= 0) return;

    if (editingProductId) {
      await api.updateProduct(editingProductId, payload);
    } else {
      await api.createProduct(payload);
    }

    setForm(defaultForm);
    setEditingProductId(null);
    await loadAll();
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const line = prev.find((c) => c.product.id === product.id);
      if (line) return prev.map((c) => (c.product.id === product.id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { product, qty: 1 }];
    });
  };

  const changeQty = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.product.id === productId ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0)
    );
  };

  const generateBill = async () => {
    if (!cart.length) return;
    await api.createBill({
      discountAmount,
      gstPercent,
      items: cart.map((c) => ({ productId: c.product.id, quantity: c.qty }))
    });
    setCart([]);
    setDiscountAmount(0);
    setGstPercent(0);
    await loadAll();
  };

  return (
    <div className="page">
      <h1>Smart Kaccha Bill (React)</h1>
      {error && <p className="error">{error}</p>}

      {!loggedInUser ? (
        <section>
          <h2>Login</h2>
          <div className="row">
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={login}>Login</button>
          </div>
          <p className="hint">Demo account: owner / owner123</p>
        </section>
      ) : (
        <>
          <section>
            <div className="row between">
              <h2>Session</h2>
              <div className="row">
                <span>Logged in as: {loggedInUser}</span>
                <button onClick={logout}>Logout</button>
              </div>
            </div>
          </section>

          <section>
            <h2>Insights</h2>
            <p>Top products: {topProducts.map((t) => `${t.name} (${t.value})`).join(', ') || '—'}</p>
            <p>Top categories: {topCategories.map((t) => `${t.name} (₹${t.value.toFixed(0)})`).join(', ') || '—'}</p>
          </section>

          <section>
            <h2>Product Setup</h2>
            <div className="row">
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Product" />
              <select value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: Number(e.target.value) }))}>
                <option value={0}>Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} placeholder="Price" />
              <button onClick={saveProduct}>{editingProductId ? 'Update' : 'Add'}</button>
            </div>

            <ul>
              {products.map((p) => (
                <li key={p.id}>
                  {p.name} ({p.categoryName}) ₹{p.price}
                  <button onClick={() => { setEditingProductId(p.id); setForm({ name: p.name, categoryId: p.categoryId, price: p.price, defaultDiscount: p.defaultDiscount ?? 0 }); }}>Edit</button>
                  <button onClick={async () => { await api.deleteProduct(p.id); await loadAll(); }}>Delete</button>
                  <button onClick={() => addToCart(p)}>Add to cart</button>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Billing</h2>
            <div className="row">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" />
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : '')}>
                <option value="">All categories</option>
                {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </div>
            <div className="chips">
              {filteredProducts.map((p) => (
                <button key={p.id} onClick={() => addToCart(p)}>{p.name} - ₹{p.price}</button>
              ))}
            </div>

            {cart.map((line) => (
              <div key={line.product.id} className="row">
                <span>{line.product.name}</span>
                <div>
                  <button onClick={() => changeQty(line.product.id, -1)}>-</button>
                  <span>{line.qty}</span>
                  <button onClick={() => changeQty(line.product.id, 1)}>+</button>
                </div>
              </div>
            ))}

            <div className="row">
              <label>Discount <input type="number" value={discountAmount} onChange={(e) => setDiscountAmount(Number(e.target.value))} /></label>
              <label>GST
                <select value={gstPercent} onChange={(e) => setGstPercent(Number(e.target.value))}>
                  {[0, 5, 12, 18, 28].map((v) => <option key={v} value={v}>{v}%</option>)}
                </select>
              </label>
            </div>

            <p>Subtotal: ₹{subTotal.toFixed(2)}</p>
            <p>Tax: ₹{taxAmount.toFixed(2)}</p>
            <p>Total: ₹{finalAmount.toFixed(2)}</p>
            <button onClick={generateBill}>Generate Bill</button>
          </section>

          <section>
            <h2>Latest Bill</h2>
            {bills[0] ? (
              <div>
                <p>{bills[0].invoiceNumber} | {new Date(bills[0].createdAt).toLocaleString()}</p>
                <ul>
                  {bills[0].items.map((i) => (<li key={i.id}>{i.productName} x{i.quantity} = ₹{i.total}</li>))}
                </ul>
                <strong>Final: ₹{bills[0].finalAmount.toFixed(2)}</strong>
              </div>
            ) : <p>No bills yet.</p>}
          </section>
        </>
      )}
    </div>
  );
}
