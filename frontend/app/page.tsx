"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Heart, Home, TrendingUp } from "lucide-react"
import { Line, ResponsiveContainer } from "recharts"
import HappinessGauge from "@/components/gauge-chart"
import Link from "next/link"
import InfoCard from "@/components/info-card"
import LineChartSekolah from "@/components/ui/line-chart"
import BarChartSHI from "@/components/ui/barchart"
import LineChartHome from "@/components/ui/line-chart-home"
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export default function HomePage() {
  useEffect(() => {
    console.log("API_BASE_URL:", API_BASE_URL);
    fetch(`${API_BASE_URL}/note`)
      .then(res => res.json())
      .then(data => console.log("✅ API response:", data))
      .catch(err => console.error("❌ API error:", err));
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Happy School
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Platform digital untuk pemantauan data dan analisis Indeks Kebahagiaan Sekolah secara real-time
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto">
                    Lihat Analisis
                  </Button>
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link href="/survey-control">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                    Buka Survey
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Gauge Chart and counter student */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rata-rata Indeks Kebahagiaan Sekolah</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <HappinessGauge value={80.2} label="Kebahagiaan Siswa" size={300}/>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Guage Chart</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {/* Judul dan deskripsi */}
        <h2 className="text-lg font-bold mb-1">
          Rata-rata Indeks Kebahagiaan Sekolah
        </h2>
        <h3 className="text-sm font-semibold mb-3">(SHI Overall)</h3>

        {/* Keterangan warna */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 bg-white rounded-full shadow-sm px-3 py-2">
            <span className="text-red-500 font-semibold">Merah (&lt;40%)</span>:
            <span className="text-gray-700">Risiko tinggi</span>
          </div>

          <div className="flex items-center gap-2 bg-white rounded-full shadow-sm px-3 py-2">
            <span className="text-yellow-500 font-semibold">
              Kuning (40%–59%)
            </span>
            : <span className="text-gray-700">Perlu perhatian</span>
          </div>

          <div className="flex items-center gap-2 bg-white rounded-full shadow-sm px-3 py-2">
            <span className="text-green-600 font-semibold">
              Hijau (60%–79%)
            </span>
            : <span className="text-gray-700">Baik</span>
          </div>

          <div className="flex items-center gap-2 bg-white rounded-full shadow-sm px-3 py-2">
            <span className="text-blue-600 font-semibold">
              Biru (80%–100%)
            </span>
            : <span className="text-gray-700">Sangat baik</span>
          </div>
        </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jumlah siswa dalam kondisi risiko</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col items-center w-full h-full">
              <p className="text-gray-600">Siswa yang berada pada status "warning" selama 3 hari berturut-turu</p>
              <br />
              <InfoCard value={23} label="Siswa" color="#EF4444" size="lg" />
            </CardContent>
          </Card>
        </div>

        <br />

        {/* Line Chart and Distribution */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 space-y-4">
          <LineChartHome />
          <BarChartSHI date={new Date().toISOString().slice(0, 10)} />
        </div>
      </div>
    </div>
  )
}
