import express, { Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
}));
app.use(express.json());

// Database Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Types
interface CaseData {
  date: string;
  cases: number;
  deaths: number;
  recovered: number;
}

interface DashboardStats {
  totalCases: number;
  activeCases: number;
  deaths: number;
  recovered: number;
  lastUpdated: string;
}

interface WebSocketMessage {
  stats: DashboardStats;
  chartData: CaseData[];
}

// Mock data generator (replace with real database queries)
function generateMockData(): WebSocketMessage {
  const mockChartData: CaseData[] = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    cases: Math.floor(Math.random() * 100) + 50,
    deaths: Math.floor(Math.random() * 20) + 5,
    recovered: Math.floor(Math.random() * 80) + 30,
  }));

  const stats: DashboardStats = {
    totalCases: 1234,
    activeCases: 156,
    deaths: 89,
    recovered: 989,
    lastUpdated: new Date().toISOString(),
  };

  return {
    stats,
    chartData: mockChartData,
  };
}

// REST Routes
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/stats', async (_req: Request, res: Response) => {
  try {
    // Replace with real database query
    const data = generateMockData();
    res.json(data.stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.get('/api/chart-data', async (_req: Request, res: Response) => {
  try {
    // Replace with real database query
    const data = generateMockData();
    res.json(data.chartData);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
});

// WebSocket Connection Handler
wss.on('connection', (ws: WebSocket) => {
  console.log('New WebSocket connection established');

  // Send initial data
  const initialData = generateMockData();
  ws.send(JSON.stringify(initialData));

  // Send updates every 10 seconds
  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      const updatedData = generateMockData();
      ws.send(JSON.stringify(updatedData));
    }
  }, 10000);

  ws.on('close', () => {
    console.log('WebSocket connection closed');
    clearInterval(interval);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clearInterval(interval);
  });
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`📡 WebSocket server ready at ws://localhost:${port}`);
});

export default app;
