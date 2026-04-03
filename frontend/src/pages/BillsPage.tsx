import type { Bill } from '../models';
import { currency } from '../utils/format';

export function BillsPage({ latestBill }: { latestBill: Bill | undefined }) {
  return (
    <section className="card">
      <div className="section-heading">
        <h2>Latest Bill</h2>
        <p>Most recently generated invoice details.</p>
      </div>
      {latestBill ? (
        <div className="panel stack">
          <p><strong>{latestBill.invoiceNumber}</strong> • {new Date(latestBill.createdAt).toLocaleString()}</p>
          <ul className="clean-list">
            {latestBill.items.map((i) => (
              <li key={i.id}>
                <span>{i.productName} x{i.quantity}</span>
                <strong>{currency(i.total)}</strong>
              </li>
            ))}
          </ul>
          <p className="grand-total"><span>Final</span> <strong>{currency(latestBill.finalAmount)}</strong></p>
        </div>
      ) : <p className="muted">No bills yet.</p>}
    </section>
  );
}
