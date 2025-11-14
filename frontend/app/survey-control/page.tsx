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
import SurveyAccessButton from "./survey-harian-control"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SurveyHarianReponse from "./reponse-harian"
import SurveyAccessHarianButton from "./survey-harian-control"
import SurveyAccessMingguanButton from "./survey-mingguan-control"
import SurveyMingguanResponse from "./response-mingguan"
import WordCloud from "@/components/word-cloud"

function InputDataContent() {
  type TabType = "harian" | "mingguan";


  const [isLoading, setIsLoading] = useState(false)
  const data =  [
      { text: "Bahagia", value: 20 },
      { text: "Sedih", value: 5 },
      { text: "Semangat", value: 15 },
      { text: "Fokus", value: 12 },
      { text: "Stress", value: 8 },
      { text: "Aman", value: 11 },
      { text: "Tenang", value: 14 },
    ];

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
          <h1 className="text-3xl font-bold text-gray-900">Mulai Survey</h1>
          <p className="mt-2 text-gray-600">Pilih tipe survey yang akan dibuka</p>
        </div>

        <Tabs defaultValue="harian" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="harian" className="flex items-center">
              <UserPlus className="h-4 w-4 mr-2" />
              Survey Harian
            </TabsTrigger>
            <TabsTrigger value="mingguan" className="flex items-center">
              <FileUp className="h-4 w-4 mr-2" />
              Survey Mingguan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="harian">
            <SurveyAccessHarianButton />
            <br />
            <SurveyHarianReponse />
          </TabsContent>
          <TabsContent value="mingguan">
            <SurveyAccessMingguanButton />
            <br />
            <SurveyMingguanResponse />
            <br />
            <WordCloud  words={data} width={600} height={400} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
    
  )
}

export default function InputSurveyPage() {
  return (
    <RouteGuard requireAuth={true} allowedRoles={["guru", "admin"]}>
      <InputDataContent />
    </RouteGuard>
  )
}
