"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { FileUp, UserPlus } from "lucide-react"
import { dataAPI } from "@/lib/api"
import RouteGuard from "@/components/route-guard"
import { set } from "date-fns"
import SurveyHarian from "@/components/survey-harian"
import SurveyMingguan from "@/components/survey-mingguan"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function InputDataContent() {
  type TabType = "harian" | "mingguan" | null;


  const [message, setMessage] = useState("")
  const [activeTab, setActiveTab] = useState<TabType>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleTabChange = async (tipe: TabType) => {    
    if (tipe === null) return;

    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      // value "manual" → harian, "excel" → mingguan (misal)
      const response = await dataAPI.validInput(tipe);
      const data = await response.json();

      if (response.ok) {
        if (data.valid){
            setActiveTab(tipe);
            setMessage(data.message);
        } else{
            setError(data.message);
        }
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Isi Survey</h1>
          <p className="mt-2 text-gray-600">Pilih tipe survey yang akan diisi</p>
        </div>

        <Tabs value={activeTab ?? undefined} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                value="harian"
                onClick={() => handleTabChange("harian")}
                disabled={isLoading}
                >
                Survey Harian
                </TabsTrigger>
                <TabsTrigger
                value="mingguan"
                onClick={() => handleTabChange("mingguan")}
                disabled={isLoading}
                >
                Survey Mingguan
                </TabsTrigger>
            </TabsList>

            {message && (
                <Alert>
                <AlertDescription>{message}</AlertDescription>
                </Alert>
            )}

            {error && (
                <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <TabsContent value="harian">
                <SurveyHarian />
            </TabsContent>

            <TabsContent value="mingguan">
                {/* form input mingguan di sini */}
                <SurveyMingguan />
            </TabsContent>
            </Tabs>
        </div>
    </div>
    
  )
}

export default function InputSurveyPage() {
  return (
    <RouteGuard requireAuth={true} allowedRoles={["user"]}>
      <InputDataContent />
    </RouteGuard>
  )
}
