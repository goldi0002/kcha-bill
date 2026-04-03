import type { Insight } from '../models';
import { currency } from '../utils/format';

export function DashboardPage({ topProducts, topCategories }: { topProducts: Insight[]; topCategories: Insight[] }) {
  return (
    <section className="card">
      <div className="section-heading">
        <h2>Insights Dashboard</h2>
        <p>Quick business overview for popular products and revenue categories.</p>
      </div>
      <div className="grid-two">
        <article className="panel">
          <h3>Top products by sales</h3>
          <ul className="clean-list">
            {topProducts.length ? topProducts.map((t) => (
              <li key={t.name}>
                <span>{t.name}</span>
                <strong>{t.value}</strong>
              </li>
            )) : <li>No data available.</li>}
          </ul>
        </article>
        <article className="panel">
          <h3>Top categories by value</h3>
          <ul className="clean-list">
            {topCategories.length ? topCategories.map((t) => (
              <li key={t.name}>
                <span>{t.name}</span>
                <strong>{currency(t.value)}</strong>
              </li>
            )) : <li>No data available.</li>}
          </ul>
        </article>
      </div>
    </section>
  );
}
