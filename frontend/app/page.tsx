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
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export default function HomePage() {
  useEffect(() => {
    console.log("API_BASE_URL:", API_BASE_URL);
    fetch(`${API_BASE_URL}/note`)
      .then(res => res.json())
      .then(data => console.log("✅ API response:", data))
      .catch(err => console.error("❌ API error:", err));
  }, []);

  const [stats, setStats] = useState({
    totalLansia: 0,
    totalSehat: 0,
    totalMembutuhkanBantuan: 0,
    totalAktifBKL: 0,
  })

  useEffect(() => {
    // Simulate fetching stats
    setStats({
      totalLansia: 156,
      totalSehat: 89,
      totalMembutuhkanBantuan: 23,
      totalAktifBKL: 134,
    })
  }, [])

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
                <Link href="/input-data">
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
            <CardContent>
              <HappinessGauge value={80.2} label="Kebahagiaan Siswa" size={300}/>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Guage Chart</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="mt-5 max-w-md mx-auto sm:flex-col space-y-4 sm:justify-center md:mt-8">
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                    Merah {"<40"} (<span className="text-red-600">Risiko Tinggi</span>)
                  </Button>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <Link href="/input-data">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                      Buka Survey
                    </Button>
                  </Link>
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
          <LineChartSekolah />
          <BarChartSHI />
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Fitur Utama Sistem</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">Kelola data lansia dengan mudah dan efisien</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Profil Demografi</h3>
              <p className="mt-2 text-base text-gray-500">
                Visualisasi data demografi lansia dengan peta sebaran dan statistik lengkap
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Monitoring Kesehatan</h3>
              <p className="mt-2 text-base text-gray-500">
                Pantau kondisi kesehatan, penyakit kronis, dan kebutuhan medis lansia
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mx-auto">
                <Home className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Kesejahteraan Sosial</h3>
              <p className="mt-2 text-base text-gray-500">
                Evaluasi kondisi sosial ekonomi dan identifikasi kebutuhan bantuan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Mulai Kelola Data Lansia Anda</h2>
            <p className="mt-4 text-xl text-blue-100">
              Mari kita meningkatkan kesejahteraan lansia
            </p>
            <div className="mt-8">
              <Link href="/login">
                <Button size="lg" variant="secondary">
                  Masuk ke Sistem
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
