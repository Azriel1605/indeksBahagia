// 📁 components/ui/line-chart-home.tsx
// (Komponen baru untuk homepage, TIDAK memerlukan props)

import React, { useState, useEffect } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { dataAPI } from "@/lib/api" // Import API Anda
import { Loader2 } from "lucide-react"

// Props tidak lagi diperlukan
interface LineChartProps {
  chartHeight?: number
  fontSize?: number
  dotSize?: number
}

interface TrendData {
  name: string
  value: number
}

// Ubah nama fungsi dan hapus 'userId' dari props
export default function LineChartHome({
  chartHeight = 220,
  fontSize = 10,
  dotSize = 4,
}: LineChartProps) {
  const [mode, setMode] = useState("harian")
  const [harianData, setHarianData] = useState<TrendData[]>([])
  const [mingguanData, setMingguanData] = useState<TrendData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fungsi untuk mengambil data chart
    const fetchChartData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Panggil kedua endpoint PUBLIK baru
        const [harianRes, mingguanRes] = await Promise.all([
          dataAPI.getOverallTrendHarian(),  // <-- MODIFIED
          dataAPI.getOverallTrendMingguan(), // <-- MODIFIED
        ])

        if (harianRes.ok) {
          const data = await harianRes.json()
          setHarianData(data.data)
        } else {
          throw new Error("Gagal memuat data harian")
        }

        if (mingguanRes.ok) {
          const data = await mingguanRes.json()
          setMingguanData(data.data)
        } else {
          throw new Error("Gagal memuat data mingguan")
        }
      } catch (err: any) {
        setError(err.message || "Gagal mengambil data tren")
      } finally {
        setIsLoading(false)
      }
    }

    // Hapus 'if (userId)' dan panggil fetchChartData() saat mount
    fetchChartData()
    
  }, []) // Dependency array diubah menjadi [] (hanya jalan sekali)

  const data = mode === "harian" ? harianData : mingguanData

  if (isLoading) {
    // ... (Loading state sama)
    return (
        <div
            className="flex items-center justify-center p-6 bg-slate-100 rounded-2xl shadow-md"
            style={{ height: chartHeight + 150 }}
        >
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
    )
  }

  if (error) {
    // ... (Error state sama)
    return (
        <div
            className="flex items-center justify-center p-6 bg-red-100 text-red-700 rounded-2xl shadow-md"
            style={{ height: chartHeight + 150 }}
        >
            <p>{error}</p>
        </div>
    )
  }

  return (
    <div className="p-6 bg-slate-100 rounded-2xl shadow-md text-center">
      {/* Judul diubah */}
      <h2 className="text-xl font-semibold mb-4">Line Chart Tren Keseluruhan</h2>

      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setMode("harian")}
          className={`px-4 py-1 rounded-full ${
            mode === "harian"
              ? "bg-black text-white"
              : "bg-white text-gray-700 shadow"
          }`}
        >
          Harian (7 Hari)
        </button>
        <button
          onClick={() => setMode("mingguan")}
          className={`px-4 py-1 rounded-full ${
            mode === "mingguan"
              ? "bg-black text-white"
              : "bg-white text-gray-700 shadow"
          }`}
        >
          Mingguan (4 Pekan)
        </button>
      </div>

      <div className="bg-orange-500 rounded-2xl p-4">
        {data.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff40" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#fff", fontSize }}
                />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(val) => `${val}%`}
                  tick={{ fill: "#fff", fontSize }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    fontSize,
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)}%`, "Rata-rata Skor"]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#fff"
                  strokeWidth={2}
                  dot={{ r: dotSize, fill: "#fff" }}
                />
              </LineChart>
            </ResponsiveContainer>

            <div
              className="flex justify-around mt-4 flex-wrap gap-2"
              style={{ fontSize }}
            >
              {data.map((d, i) => (
                <div
                  key={i}
                  className="bg-orange-300 px-3 py-1 rounded-full text-sm font-semibold text-black"
                >
                  {d.name}: {d.value.toFixed(0)}%
                </div>
              ))}
            </div>
          </>
        ) : (
          <div
            className="flex items-center justify-center text-white font-medium"
            style={{ height: chartHeight }}
          >
            Data {mode} tidak ditemukan.
          </div>
        )}
      </div>
    </div>
  )
}