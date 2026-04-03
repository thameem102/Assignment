# Microservice-Based Application

A full-stack application built with NestJS microservices and a Next.js frontend.

## Architecture

```
├── apps/
│   ├── product-service/   # NestJS gRPC microservice (port 5001)
│   ├── order-service/     # NestJS HTTP gateway (port 3003)
│   └── web/               # Next.js frontend (port 3000)
└── proto/
    └── product.proto      # gRPC contract between services
```

**Communication flow:** Web → Order Service (REST) → Product Service (gRPC)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4, React Hook Form |
| Order Service | NestJS, REST API, SQLite |
| Product Service | NestJS, gRPC, SQLite |
| Inter-service | Protocol Buffers (gRPC) |

## Prerequisites

- Node.js >= 18
- npm >= 9

## Getting Started

### 1. Install dependencies

```bash
# Root (installs all workspaces)
npm install

# Install web dependencies separately
cd apps/web && npm install
```

### 2. Run all services

```bash
npm run start:all
```

Or run each service individually:

```bash
# Terminal 1 - Product Service (gRPC :5001)
npm run start:product

# Terminal 2 - Order Service (HTTP :3003)
npm run start:order

# Terminal 3 - Web App (:3000)
npm run start:web
```

### 3. Open the app

```
http://localhost:3000
```

## Services

### Product Service — gRPC (port 5001)

Manages product catalog. Exposes gRPC endpoints:

| Method | Description |
|---|---|
| `CreateProduct` | Create a new product |
| `FindAllProducts` | List all products |
| `FindOneProduct` | Get product by ID |
| `UpdateProduct` | Update product details |
| `DeleteProduct` | Delete a product |
| `DecrementStock` | Reduce stock when order is placed |

### Order Service — REST (port 3003)

HTTP gateway that accepts order requests and communicates with Product Service via gRPC.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/orders` | Create a new order |
| `GET` | `/orders` | List all orders with product details |

## Frontend (port 3000)

| Route | Description |
|---|---|
| `/` | Landing page |
| `/signup` | Dynamic signup form |
| `/login` | Login page |
| `/dashboard` | View submitted forms / orders |
| `/retail` | Point-of-sale retail interface |

---

### Retail Page (`/retail`)

A full-featured **point-of-sale (POS) interface** designed for retail staff to browse products, manage a shopping cart, and process checkouts.

#### Page Layout

The retail page uses a **split-panel layout**:

```
┌─────────────────────────────────────────┬──────────────────┐
│           Product Catalog               │   Cart Sidebar   │
│                                         │   (360px fixed)  │
│  ┌─────────┐  ┌─────────┐  ┌────────┐  │                  │
│  │ Product  │  │ Product  │  │ Product│  │  Cart Items      │
│  │  Card    │  │  Card    │  │  Card  │  │  - Qty controls  │
│  └─────────┘  └─────────┘  └────────┘  │  - Line totals   │
│  ┌─────────┐  ┌─────────┐  ┌────────┐  │                  │
│  │ Product  │  │ Product  │  │ Product│  │  ──────────────  │
│  │  Card    │  │  Card    │  │  Card  │  │  Subtotal        │
│  └─────────┘  └─────────┘  └────────┘  │  Tax (10%)        │
│                                         │  Payable Amount   │
│                                         │  [Hold] [Checkout]│
└─────────────────────────────────────────┴──────────────────┘
```

- **Left panel** (flexible width): Product catalog with search and responsive grid
- **Right panel** (360px fixed): Shopping cart sidebar with totals and actions
- Height: `calc(100vh - 56px - 64px)` — accounts for navbar and layout padding

#### Components

| Component | Purpose |
|---|---|
| `ProductCard` | Displays a product as a clickable card (image placeholder, name, price, stock count). Clicking adds the item to the cart. |
| `CartItemRow` | Renders a single cart line item with quantity increment/decrement controls, line total, and a remove button. |

#### Product Grid

- Products are fetched from the Order Service API (`GET /products`)
- **Search bar** with live filtering by product name (optimized with `useMemo`)
- **Responsive grid**: 2 columns → 3 at `md` → 3 at `lg` → 4 at `xl`
- Displays dynamic product count based on search results
- States: loading spinner, error banner, empty results, populated grid

#### Cart Features

| Feature | Description |
|---|---|
| **Add to cart** | Click a product card; auto-increments if already in cart |
| **Quantity controls** | `+` / `-` buttons per item; removing below 1 removes the item |
| **Remove item** | `×` button deletes item from cart |
| **Pricing** | Subtotal, 10% tax, and payable amount — displayed in monospace font |
| **Hold cart** | Saves current cart with ID `SI-{invoiceNum}-{timestamp}` to localStorage for later |
| **Restore held cart** | Restores a previously held cart and removes it from the hold list |
| **Hold list** | Dropdown showing all held carts with item count, timestamp, restore/delete actions, and a badge count |
| **Checkout** | Clears the cart and shows a success confirmation |
| **Clear** | Empties the cart immediately |

#### Authentication

The page checks for a logged-in user via `getCurrentUser()` from localStorage. Unauthenticated users are redirected to `/login`.

#### Design & Styling

- **Styling framework**: Tailwind CSS v4 (utility classes, no custom CSS modules)
- **Typography**:
  - **Syne** (display font) — section headings ("All Products", "Cart")
  - **Outfit** (body font) — general text and labels
  - **JetBrains Mono** (monospace) — prices, quantities, invoice IDs
- **Color palette**:
  - Primary: `#3b82f6` (blue) / Hover: `#2563eb`
  - Success: `#22c55e` (green, stock indicators & checkout confirmation)
  - Error: `#ef4444` (red, error states & remove actions)
  - Surface: `#f8fafc` (light gray backgrounds)
- **Card hover effects**: Border shifts to `blue-300` with elevated shadow
- **Transitions**: Smooth `transition-all` / `transition-colors` on interactive elements

#### State Management

All state is managed with React hooks — no external state library:

| Hook | Usage |
|---|---|
| `useState` | Products, cart items, search query, UI toggles, checkout status |
| `useMemo` | Memoized filtered products list (recomputes only on products/search change) |
| `useEffect` | Auth check, data fetching, loading held carts from localStorage |
| `useRouter` | Navigation and auth redirects |

#### Data Flow

```
User clicks product → addToCart() → cart state updates → CartItemRow re-renders
User clicks Checkout → handleCheckout() → cart cleared → success message shown
User clicks Hold → holdCart() → cart saved to localStorage → cart cleared
```

---

### Dynamic Form

The signup form fields are driven by a JSON config (`src/config/formConfig.json`). Each field supports:

- `fieldType: "TEXT"` — renders a text input
- `fieldType: "LIST"` — renders a dropdown select
- `fieldType: "RADIO"` — renders radio buttons

Changing `fieldType` in the JSON automatically changes how the field renders, along with validation rules (`required`, `minLength`, `maxLength`) and default values.

## Project Structure

```
apps/
├── product-service/
│   └── src/
│       └── product/       # Product CRUD module
├── order-service/
│   └── src/
│       ├── order/         # Order management module
│       └── product-proxy/ # gRPC client to product service
└── web/
    └── src/
        ├── app/           # Next.js pages (App Router)
        ├── components/    # Reusable UI components
        ├── config/        # formConfig.json
        └── lib/           # Types, theme, localStorage utils
```
