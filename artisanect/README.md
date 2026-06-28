# Artisanect

An AI-powered marketplace connecting local artisans and handicraft sellers with customers, built with React + Vite + Tailwind CSS on the frontend and Express on the backend.

The app has two roles, chosen at login (no real passwords yet — it's a demo auth flow):
- **Customer** — browse/search/filter products, view product details, manage a cart and wishlist, view profile.
- **Crafter** — a seller dashboard with live stats, upload/edit/delete products, view orders received (dummy data), and a showcase gallery.

## Project structure

```
artisanect/
├── backend/                  # Express REST API (see "How to run backend locally")
│   ├── server.js
│   └── src/
│       ├── routes/           # products, cart, crafters, auth
│       ├── controllers/
│       ├── data/             # in-memory product/cart/user stores
│       └── middleware/       # 404 + centralised error handler
├── src/                      # React frontend
│   ├── services/api.js       # single API layer — every fetch call lives here
│   ├── context/              # Theme, Auth, Cart, Wishlist providers
│   ├── components/
│   │   ├── ui/                # reusable UI library (Button, Input, Modal, Toast, Loader)
│   │   ├── ProductCard.jsx, ProductCatalog.jsx, RecentlyViewed.jsx
│   │   └── RequireRole.jsx    # route guard based on logged-in role
│   ├── utils/recentlyViewed.js
│   └── pages/
├── .env.example               # frontend env var template
└── backend/.env.example       # backend env var template
```

## How to run the frontend locally

```bash
npm install
npm run dev
```
Runs on `http://localhost:5173` by default. Copy `.env.example` to `.env` if you need to point at a backend running somewhere other than `http://localhost:5000`.

## How to run backend locally

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

This starts the Express server on `http://localhost:5000` (configurable via `PORT` in `.env`). `npm run dev` uses `nodemon` to restart on file changes; use `npm start` for a plain `node server.js` run.

For the frontend to talk to it, make sure the frontend's `.env` has:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### Environment variables (backend)

| Variable | Description | Default |
|---|---|---|
| `PORT` | Port the Express server listens on | `5000` |
| `FRONTEND_ORIGIN` | Origin allowed by CORS | `http://localhost:5173` |

### API reference

All routes are prefixed with `/api`. Data is stored in memory and resets whenever the server restarts — a real database is planned for a future week.

**Products**
| Method | Endpoint | Description |
|---|---|---|
| GET | `/products` | List all products (optional `?category=`) |
| GET | `/products/categories` | Distinct list of categories |
| GET | `/products/search?q=...` | Search by title, category, description, or artisan |
| GET | `/products/:id` | Get a single product |
| POST | `/products` | Create a product |
| PUT | `/products/:id` | Update a product |
| DELETE | `/products/:id` | Delete a product |

**Cart** (single demo cart, not per-user yet)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/cart` | List current cart items |
| POST | `/cart` | Add an item (merges quantity if already present) |
| PUT | `/cart/:id` | Update an item's quantity (`:id` = productId) |
| DELETE | `/cart/:id` | Remove an item (`:id` = productId) |

**Crafters**
| Method | Endpoint | Description |
|---|---|---|
| GET | `/crafters/products` | Products belonging to the demo crafter |
| POST | `/crafters/products` | Crafter uploads a new product |

**Auth (dummy — no real passwords/sessions)**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/login` | Body `{ role: "customer" \| "crafter" }` → demo profile + token |
| GET | `/profile?role=...` | Demo profile for that role |

**Misc**
| Method | Endpoint | Description |
|---|---|---|
| GET | `/stats` | Dashboard summary stats (products, orders, revenue) |

Note: the backend accepts JSON bodies up to 10MB (`express.json({ limit: "10mb" })`), since the Upload Product form sends images as base64 data URLs.

## Running both together

You'll need two terminals: one running `npm run dev` inside `backend/`, and one running `npm run dev` at the project root for the frontend. With both running:
1. Go to `/login` and pick **Customer** or **Crafter**.
2. As a customer: Home/Shop pull live products, Cart/Wishlist/Profile all hit the backend.
3. As a crafter: Dashboard shows live stats, Upload Product posts straight to the catalog, My Products lets you edit/delete what you've uploaded.
