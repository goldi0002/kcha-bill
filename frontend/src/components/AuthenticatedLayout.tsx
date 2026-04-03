import { NavLink } from 'react-router-dom';

export function AuthenticatedLayout({ user, logout }: { user: string; logout: () => void }) {
  return (
    <section className="card app-header">
      <div className="section-heading">
        <h2>Smart Kaccha Bill</h2>
        <p className="hint">Logged in as: {user}</p>
      </div>
      <div className="row nav-wrap">
        <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
        <NavLink to="/products" className="nav-link">Products</NavLink>
        <NavLink to="/billing" className="nav-link">Billing</NavLink>
        <NavLink to="/bills" className="nav-link">Latest Bill</NavLink>
        <button className="btn-ghost" onClick={logout}>Logout</button>
      </div>
    </section>
  );
}
