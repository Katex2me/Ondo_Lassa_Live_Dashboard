import { useEffect, useState } from 'react'

interface WebSocketData {
  stats: {
    totalCases: number
    activeCases: number
    deaths: number
    recovered: number
    lastUpdated: string
  }
  chartData: Array<{
    date: string
    cases: number
    deaths: number
    recovered: number
  }>
}

export function useWebSocket() {
  const [data, setData] = useState<WebSocketData | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:5000'
    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log('WebSocket connected')
      setIsConnected(true)
      setError(null)
    }

    ws.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data)
        setData(parsedData)
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err)
      }
    }

    ws.onerror = (event) => {
      console.error('WebSocket error:', event)
      setError('Connection error')
      setIsConnected(false)
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
      setIsConnected(false)
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        window.location.reload()
      }, 5000)
    }

    return () => {
      ws.close()
    }
  }, [])

  return { data, isConnected, error }
}
