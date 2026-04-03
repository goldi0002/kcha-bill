# Repository Feature & Gap Analysis

## Existing Features

### Architecture and stack
- Full-stack setup with a React + Vite + TypeScript frontend and ASP.NET Core (.NET 8) backend.
- Backend follows layered structure: Controllers → Services → Repositories.
- SQLite persistence via EF Core with startup seeding.

### Product and category management
- Product CRUD API endpoints exist (`GET`, `POST`, `PUT`, `DELETE`).
- Categories support list + create APIs.
- UI supports adding, editing, deleting products and assigning categories.

### Billing workflow
- Cart-based bill creation in UI with quantity increment/decrement.
- Bill generation API persists bill + bill items.
- Billing math includes subtotal, discount, GST, tax, and final amount.
- Latest bill panel is rendered in frontend.

### Analytics and insights
- API endpoints for top products and top categories.
- UI shows insights section using those analytics endpoints.

### Platform readiness
- Swagger enabled for development.
- Centralized error handling middleware.
- Data annotation validation on request DTOs.
- Seed data for categories/products included via C# and SQL scripts.

## What This Project Still Needs (High-Impact Next Steps)

### 1) Security and access control
- Authentication and authorization (shop owner/cashier roles).
- Endpoint protection for mutating operations.
- HTTPS/CORS hardening by environment.

### 2) Reliability and data integrity
- Migrations workflow (instead of only `EnsureCreated`) for safe schema evolution.
- Unique invoice number guarantee under concurrency.
- Soft-delete or archival strategy for products referenced by historic bills.
- Business-rule validation (category existence checks, inactive product restrictions).

### 3) Billing completeness for real shops
- Per-line discount support (currently only bill-level discount is used in bill creation).
- Customer details, payment mode, paid/due status.
- Bill cancellation/returns/refunds and stock adjustments.
- Printable invoice templates (A4/thermal), GST invoice fields, and download/share.

### 4) Inventory and operations
- Stock tracking, low-stock alerts, purchase/GRN entries.
- Supplier management and purchase pricing.
- Batch/expiry tracking for grocery/packaged goods.

### 5) Analytics depth
- Date range filters and dashboard metrics (sales/day, margin, avg basket size).
- Exportable reports (CSV/PDF).
- Compare periods (week-over-week/month-over-month).

### 6) Frontend UX and quality
- Better form validation and field-level error messages from API.
- Pagination/virtualization for large product lists.
- Mobile-first cashier flow polish (shortcut keys, barcode input).
- Loading/skeleton states and resilient retry UX.

### 7) Engineering quality
- Automated tests (unit + integration + UI smoke).
- CI pipeline (build, test, lint).
- Logging/monitoring and structured diagnostics.
- Environment configuration docs (`.env`, deployment profiles).
