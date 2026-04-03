# Smart Kaccha Bill Web App

Production-ready starter for a small-shop billing workflow with analytics.

## Tech Stack
- Frontend: React 18 + Vite + TypeScript
- Backend: ASP.NET Core .NET 8 Web API + EF Core (SQLite)
- DB script: `db/schema-and-seed.sql`

## Folder Structure
- `backend/KacchaBill.Api` - API with clean layering (Controllers → Services → Repositories)
- `frontend` - Mobile-first billing UI
- `db` - SQL schema and sample seed data

## API Endpoints
- `GET/POST/PUT/DELETE /api/products`
- `GET/POST /api/categories`
- `POST /api/bills`, `GET /api/bills`, `GET /api/bills/{id}`
- `GET /api/analytics/top-products`
- `GET /api/analytics/top-categories`

## Backend Setup (.NET 8)
1. Install .NET 8 SDK.
2. Run:
   ```bash
   cd backend/KacchaBill.Api
   dotnet restore
   dotnet run
   ```
3. API starts (default Kestrel URL). Swagger is enabled in development.

## Frontend Setup
1. Run:
   ```bash
   cd frontend
   npm install
   npm start
   ```
2. Open `http://localhost:4200`.

The frontend now uses React + Vite and connects to the backend API at `http://localhost:5000/api`.

## Database Setup
- API auto-creates SQLite database (`kaccha-bill.db`) and seeds starter data.
- Optional manual DB script:
  - Execute `db/schema-and-seed.sql` in SQLite (or adapt datatypes for SQL Server).

## Deployment
- Backend: publish for IIS/Kestrel via `dotnet publish -c Release`.
- Frontend: static build with `npm run build` (deploy `frontend/dist`).

## Notes
- Includes DTO validation, central error middleware, and structured services.
- Billing supports discount + GST rates (0/5/12/18/28).
- Insights panel shows top products and top categories.
