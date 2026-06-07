# Ondo State Lassa Fever Live Dashboard

A real-time dashboard for tracking Lassa fever cases in Ondo State, Nigeria. Features live data updates, interactive visualizations, and case statistics.

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Backend**: Node.js + Express
- **Real-Time**: WebSockets
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS
- **Charts**: Recharts

## Project Structure

```
.
├── frontend/          # React application
├── backend/           # Express server
├── docker-compose.yml # Docker configuration
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- PostgreSQL 12+
- Docker (optional)

### Installation

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

#### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

#### Docker Setup (Recommended)

```bash
docker-compose up -d
```

## Features

- 📊 Real-time case statistics
- 📈 Interactive charts and graphs
- 🗺️ Regional distribution maps
- 📱 Responsive mobile design
- 🔄 Live data updates via WebSocket
- 📢 Alert notifications
- 🔒 Secure API authentication

## API Documentation

See [BACKEND_SETUP.md](./backend/BACKEND_SETUP.md) for detailed API endpoints.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT License
