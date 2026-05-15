# Inventory Items Manager

A production-ready full-stack inventory management application with a modern React dashboard and a .NET 8 REST API backed by SQLite.

> **Note:** Add a screenshot at `docs/screenshot.png` after running the app locally.

## Project Overview

Manage product inventory with real-time stock status badges, search, sorting, pagination, and full CRUD operations. The backend enforces validation rules and unique SKUs; the frontend provides a polished SaaS-style dashboard with dark mode support.

## Features

### Core
- Add, list, edit, and delete inventory items
- Fields: **Name**, **SKU**, **Quantity**
- Real-time stock status badges:
  - `Quantity = 0` → **Out of Stock** (red)
  - `Quantity < 10` → **Low Stock** (yellow)
  - `Quantity >= 10` → **In Stock** (green)
- Form validation (client + server)
- Duplicate SKU prevention
- Search/filter by name or SKU
- Sort by quantity (asc/desc)
- Loading, empty, and error states
- Toast notifications

### Bonus
- Dark mode toggle
- Edit & delete items
- Server-side pagination
- Local storage caching (5 min TTL)
- Docker Compose setup

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, Vite, Tailwind CSS, Axios, React Hook Form, React Hot Toast, Lucide React |
| Backend | .NET 8, ASP.NET Core Web API, Entity Framework Core, SQLite |
| DevOps | Docker, Docker Compose |

## Folder Structure

```
inventory-items-manager/
├── backend/
│   ├── Dockerfile
│   └── InventoryApi/
│       ├── Controllers/      # REST API endpoints
│       ├── Services/         # Business logic
│       ├── Models/           # EF entities
│       ├── DTOs/             # Request/response models
│       ├── Data/             # DbContext
│       └── Program.cs
├── frontend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/            # useInventory hook
│   │   ├── services/         # Axios API layer
│   │   └── utils/            # Status & cache helpers
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- (Optional) [Docker](https://www.docker.com/)

## Setup Instructions

### Option A: Run locally

#### 1. Backend

```bash
cd backend/InventoryApi
dotnet restore
dotnet run
```

API: **http://localhost:5000**  
Swagger: **http://localhost:5000/swagger**

#### 2. Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

UI: **http://localhost:5173**

The Vite dev server proxies `/api` requests to the backend.

### Option B: Docker Compose

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- API: http://localhost:5000

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `/api` | API base URL (use full URL in production) |

Copy `frontend/.env.example` to `frontend/.env` to customize.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/items` | List items (search, sort, pagination) |
| `GET` | `/api/items/stats` | Inventory summary counts |
| `GET` | `/api/items/{id}` | Get item by ID |
| `POST` | `/api/items` | Create item |
| `PUT` | `/api/items/{id}` | Update item |
| `DELETE` | `/api/items/{id}` | Delete item |

### Query parameters (`GET /api/items`)

| Param | Default | Description |
|-------|---------|-------------|
| `search` | — | Filter by name or SKU |
| `sortBy` | `quantity` | Sort field (`name`, `sku`, `quantity`) |
| `sortDir` | `asc` | `asc` or `desc` |
| `page` | `1` | Page number |
| `pageSize` | `10` | Items per page (max 100) |

### Example: Create item

```bash
curl -X POST http://localhost:5000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Wireless Mouse","sku":"WM-001","quantity":5}'
```

Response (`201 Created`):

```json
{
  "id": 4,
  "name": "Wireless Mouse",
  "sku": "WM-001",
  "quantity": 5,
  "stockStatus": "Low Stock"
}
```

### Validation Rules

- Name: required
- SKU: required, unique (stored uppercase)
- Quantity: required, cannot be negative


## License

MIT
