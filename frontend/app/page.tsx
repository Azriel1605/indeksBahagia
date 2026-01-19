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
import { useAuth } from "@/hooks/use-auth"

export default function HomePage() {
  const { user } = useAuth();

  useEffect(() => {
    console.log("API_BASE_URL:", API_BASE_URL);
    fetch(`${API_BASE_URL}/note`)
      .then(res => res.json())
      .then(data => console.log("✅ API response:", data))
      .catch(err => console.error("❌ API error:", err));
  }, []);


  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 flex items-center">
      
      {/* Decorative Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-300/40 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-purple-300/40 rounded-full blur-3xl" />
      <div className="absolute bottom-[-6rem] left-1/3 w-96 h-96 bg-blue-300/40 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Survey <span className="text-indigo-600">Ar Rafi</span>
            </h1>

            <p className="mt-5 text-gray-600 text-lg max-w-xl">
              Platform digital untuk pemantauan dan analisis  
              <span className="font-semibold text-gray-800">
                {" "}Indeks Kebahagiaan Sekolah
              </span>{" "}
              secara real-time, akurat, dan transparan.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {user?.role === "admin" || user?.role === "guru" && (
                <Link href="/dashboard">
                  <Button size="lg" className="px-8">
                    Lihat Analisis
                  </Button>
                </Link>
              )}

              <Link href={user?.role === "user" ? "/survey" : "/survey-control"}>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 bg-white/70 backdrop-blur"
                >
                  Buka Survey
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Glass Card */}
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl p-8 grid grid-cols-2 gap-6 c-border">
            
            <StatCard
              title="Pengguna Aktif"
              value="1.248"
              desc="Siswa & Guru"
            />
            <StatCard
              title="Indeks"
              value="82.4%"
              desc="Tingkat Kebahagiaan"
            />
            <StatCard
              title="Survey Aktif"
              value="4"
              desc="Bulan ini"
            />
            <StatCard
              title="Update"
              value="Real-time"
              desc="Live Dashboard"
            />

          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, desc }: { title: string; value: string; desc: string }) {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{desc}</p>
    </div>
  )
}