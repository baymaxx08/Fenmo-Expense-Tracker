# Expense Tracker

A full-stack personal finance application for tracking expenses with a modern, responsive UI and robust backend API.

## Technology Stack

### Backend
- **Node.js** with Express.js
- **SQLite** with better-sqlite3 (file-based, lightweight, no separate DB process)
- **Jest** + **Supertest** for testing

### Frontend
- **React** 18 with Vite
- **Tailwind CSS** for styling
- **UUID v4** for idempotency keys

## Features

### Backend API
- **POST /expenses** - Create new expense with idempotency support
- **GET /expenses** - Fetch expenses with filtering and sorting
- **GET /expenses/categories** - Get all unique categories
- Smart idempotency: client-generated UUID prevents duplicate submissions
- Integer-based paise storage: ₹10.50 stored as 1050 (avoids floating-point errors)

### Frontend UI
- Clean, professional card-based layout with Tailwind CSS
- Add Expense form with validation and error handling
- Filterable expense list by category
- Sortable by date (newest/oldest first)
- Real-time category and amount summaries
- Loading skeletons and smooth transitions
- Responsive design (mobile, tablet, desktop)
- Success/error toast notifications

## Setup & Installation

### Prerequisites
- Node.js 16+ and npm

### Backend

```bash
cd backend
npm install
npm start
```

Backend runs on `http://localhost:3001`

Development mode with auto-reload:
```bash
npm run dev
```

Run tests:
```bash
npm test
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

Build for production:
```bash
npm run build
```

## Data Model

### Expenses Table

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT PRIMARY KEY | UUID v4 |
| idempotency_key | TEXT UNIQUE | Client-generated UUID for retry safety |
| amount_paise | INTEGER | Amount in paise (₹10.50 = 1050) |
| category | TEXT | Expense category |
| description | TEXT | Expense description |
| date | TEXT | ISO date (YYYY-MM-DD) |
| created_at | TEXT | ISO timestamp, server-set |

## API Examples

### Create Expense

```bash
curl -X POST http://localhost:3001/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "idempotency_key": "550e8400-e29b-41d4-a716-446655440000",
    "amount": "150.75",
    "category": "Food",
    "description": "Lunch at restaurant",
    "date": "2024-01-15"
  }'
```

Response (201 Created):
```json
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "idempotency_key": "550e8400-e29b-41d4-a716-446655440000",
  "amount": "150.75",
  "category": "Food",
  "description": "Lunch at restaurant",
  "date": "2024-01-15",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

### Get Expenses

```bash
# Get all expenses sorted newest first
curl http://localhost:3001/expenses

# Filter by category
curl "http://localhost:3001/expenses?category=Food"

# Sort oldest first
curl "http://localhost:3001/expenses?sort=date_asc"

# Combined
curl "http://localhost:3001/expenses?category=Food&sort=date_asc"
```

## Design Decisions

### SQLite with Integer Paise Storage
- **Why**: Avoids floating-point precision errors in financial applications
- **How**: Amount stored as `amount_paise` (integer). ₹10.50 = 1050 paise
- **Conversion**: At API boundaries, converted to/from decimal strings ("10.50")

### Client-Generated Idempotency Keys
- **Problem**: Network failures or user double-clicks could create duplicate expenses
- **Solution**: Frontend generates UUID v4, stores in sessionStorage keyed to form content hash
- **Benefit**: POST /expenses can be retried safely; backend returns existing record on key collision
- **Result**: 201 status on creation, 200 on replay of same key

### No Authentication
- **Rationale**: Out of scope for personal tool; intentional omission
- **Future**: Could add user accounts, multi-tenant support, expense sharing

### SQLite Over In-Memory
- **Why**: Persists across server restarts
- **Trade-off**: Won't scale horizontally, but suitable for personal expense volumes

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── db.js              # SQLite setup & schema
│   │   ├── expenses.js        # Data access layer (pure functions)
│   │   ├── routes/
│   │   │   └── expenses.js    # Express router
│   │   ├── app.js             # Express app setup
│   │   └── server.js          # Entry point
│   ├── tests/
│   │   └── expenses.test.js   # Jest + Supertest tests
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── expenses.js    # API client wrapper
│   │   ├── components/        # React components
│   │   ├── hooks/
│   │   │   └── useExpenses.js # Custom hook for state
│   │   ├── utils/             # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## CORS Configuration

Backend allows requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (fallback)

In production, frontend should be served statically from backend's `public/` directory.

## Testing

Backend includes comprehensive Jest tests with Supertest:

```bash
cd backend
npm test
```

Tests cover:
- Creating expenses and returning correct status
- Idempotency key handling (no duplicates on retry)
- Validation (negative amounts, missing fields)
- GET filtering by category
- GET sorting (date ascending/descending)

## Development Workflow

### 1. Start Backend
```bash
cd backend && npm start
```

### 2. Start Frontend
```bash
cd frontend && npm run dev
```

### 3. Access Application
Open http://localhost:5173 in your browser

### 4. Add Expenses
- Fill out the form and click "Add Expense"
- Expenses appear immediately in the table
- Use filters and sort controls to organize

## Future Enhancements

- **Authentication**: Multi-user support with login
- **Edit/Delete**: Modify or remove expenses
- **Pagination**: Handle large expense volumes
- **Recurring Expenses**: Automated periodic entries
- **Budget Goals**: Set category limits and alerts
- **Reports**: Monthly/yearly summaries and charts
- **Export**: CSV/PDF export functionality
- **Recurring Transactions**: Scheduled expenses
- **Mobile App**: Native iOS/Android clients

## Intentionally Not Done

- Multi-user authentication
- Expense editing/deletion
- Pagination (acceptable for personal expense volumes)
- Currency conversion
- Receipt attachments

## License

MIT
