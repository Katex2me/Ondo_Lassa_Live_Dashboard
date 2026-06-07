import { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Activity, TrendingUp, Users, AlertCircle } from 'lucide-react'
import { useWebSocket } from './hooks/useWebSocket'
import Header from './components/Header'
import StatCard from './components/StatCard'
import './App.css'

interface CaseData {
  date: string
  cases: number
  deaths: number
  recovered: number
}

interface DashboardStats {
  totalCases: number
  activeCases: number
  deaths: number
  recovered: number
  lastUpdated: string
}

function App() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCases: 0,
    activeCases: 0,
    deaths: 0,
    recovered: 0,
    lastUpdated: new Date().toISOString(),
  })
  const [chartData, setChartData] = useState<CaseData[]>([])
  const { data, isConnected } = useWebSocket()

  useEffect(() => {
    if (data) {
      setStats(data.stats)
      setChartData(data.chartData)
    }
  }, [data])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header isConnected={isConnected} />

      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Cases"
            value={stats.totalCases}
            icon={<Activity className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Active Cases"
            value={stats.activeCases}
            icon={<AlertCircle className="w-6 h-6" />}
            color="red"
          />
          <StatCard
            title="Deaths"
            value={stats.deaths}
            icon={<TrendingUp className="w-6 h-6" />}
            color="orange"
          />
          <StatCard
            title="Recovered"
            value={stats.recovered}
            icon={<Users className="w-6 h-6" />}
            color="green"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Cases Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cases" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="recovered" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Daily Statistics</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cases" fill="#ef4444" />
                <Bar dataKey="deaths" fill="#f97316" />
                <Bar dataKey="recovered" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          Last updated: {new Date(stats.lastUpdated).toLocaleString()}
        </div>
      </main>
    </div>
  )
}

export default App
