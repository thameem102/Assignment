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
| Frontend | Next.js 16, React 19, TypeScript, Material UI, React Hook Form |
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
