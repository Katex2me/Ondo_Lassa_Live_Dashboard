# Lassa Fever Dashboard - Backend Setup

## Overview

The backend is built with Node.js + Express and provides:
- REST API endpoints for dashboard data
- Real-time WebSocket connections for live updates
- PostgreSQL database integration
- JWT authentication

## Quick Start

### Installation

```bash
cd backend
npm install
cp .env.example .env
```

### Database Setup

```bash
# Initialize database tables
npm run build
node dist/db/init.js

# Seed with sample data
node dist/scripts/seed.js
```

### Running Locally

```bash
# Development with hot reload
npm run dev

# Production
npm run build
npm start
```

## API Endpoints

### Health Check
```
GET /api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### Get Statistics
```
GET /api/stats
```

Response:
```json
{
  "totalCases": 1234,
  "activeCases": 156,
  "deaths": 89,
  "recovered": 989,
  "lastUpdated": "2024-01-01T12:00:00Z"
}
```

### Get Chart Data
```
GET /api/chart-data
```

Response:
```json
[
  {
    "date": "2024-01-01",
    "cases": 45,
    "deaths": 5,
    "recovered": 30
  }
]
```

## WebSocket

Connect to `ws://localhost:5000` to receive real-time updates every 10 seconds.

### Message Format

```json
{
  "stats": {
    "totalCases": 1234,
    "activeCases": 156,
    "deaths": 89,
    "recovered": 989,
    "lastUpdated": "2024-01-01T12:00:00Z"
  },
  "chartData": [
    {
      "date": "2024-01-01",
      "cases": 45,
      "deaths": 5,
      "recovered": 30
    }
  ]
}
```

## Environment Variables

See `.env.example` for all available configuration options.

Key variables:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `CORS_ORIGIN`: Frontend URL for CORS

## Database Schema

### lassa_cases
```sql
- id (PRIMARY KEY)
- date
- region
- confirmed_cases
- suspected_cases
- deaths
- recovered
- created_at
- updated_at
```

### alerts
```sql
- id (PRIMARY KEY)
- title
- message
- severity (low, medium, high, critical)
- region
- created_at
- is_read
```

### users
```sql
- id (PRIMARY KEY)
- email
- password_hash
- role (admin, analyst, viewer)
- created_at
- updated_at
```

## Deployment

See root `README.md` for deployment options.
