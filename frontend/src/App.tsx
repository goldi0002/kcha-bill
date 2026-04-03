import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { api, setAuthToken } from './api';
import { AuthenticatedLayout } from './components/AuthenticatedLayout';
import type { Bill, Category, Insight, Product } from './models';
import { BillingPage } from './pages/BillingPage';
import { BillsPage } from './pages/BillsPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { ProductsPage } from './pages/ProductsPage';
import { defaultProductForm, type CartLine, type ProductForm } from './types/ui';
import './styles.css';

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
  const [form, setForm] = useState<ProductForm>(defaultProductForm);
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
      void loadAll();
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

    setForm(defaultProductForm);
    setEditingProductId(null);
    await loadAll();
  };

  const startEditing = (product: Product) => {
    setEditingProductId(product.id);
    setForm({
      name: product.name,
      categoryId: product.categoryId,
      price: product.price,
      defaultDiscount: product.defaultDiscount ?? 0
    });
  };

  const deleteProduct = async (productId: number) => {
    await api.deleteProduct(productId);
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
      <h1>Smart Kaccha Bill</h1>
      {error && <p className="error">{error}</p>}

      {!loggedInUser ? (
        <LoginPage
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          login={() => void login()}
        />
      ) : (
        <>
          <AuthenticatedLayout user={loggedInUser} logout={logout} />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage topProducts={topProducts} topCategories={topCategories} />} />
            <Route
              path="/products"
              element={
                <ProductsPage
                  categories={categories}
                  products={products}
                  form={form}
                  editingProductId={editingProductId}
                  setForm={setForm}
                  startEditing={startEditing}
                  saveProduct={() => void saveProduct()}
                  deleteProduct={deleteProduct}
                  addToCart={addToCart}
                />
              }
            />
            <Route
              path="/billing"
              element={
                <BillingPage
                  search={search}
                  selectedCategory={selectedCategory}
                  categories={categories}
                  filteredProducts={filteredProducts}
                  cart={cart}
                  discountAmount={discountAmount}
                  gstPercent={gstPercent}
                  subTotal={subTotal}
                  taxAmount={taxAmount}
                  finalAmount={finalAmount}
                  setSearch={setSearch}
                  setSelectedCategory={setSelectedCategory}
                  setDiscountAmount={setDiscountAmount}
                  setGstPercent={setGstPercent}
                  addToCart={addToCart}
                  changeQty={changeQty}
                  generateBill={generateBill}
                />
              }
            />
            <Route path="/bills" element={<BillsPage latestBill={bills[0]} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </>
      )}
    </div>
  );
}
