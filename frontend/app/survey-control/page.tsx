"use client"

import type React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUp, UserPlus } from "lucide-react"
import RouteGuard from "@/components/route-guard"
import SurveyHarianReponse from "./reponse-harian"
import SurveyAccessHarianButton from "./survey-harian-control"
import SurveyAccessMingguanButton from "./survey-mingguan-control"
import SurveyMingguanResponse from "./response-mingguan"
import WordCloud from "@/components/word-cloud"

function InputDataContent() {
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
            <br />
            <div className="flex items-center justify-between w-full bg-white border border-gray-200 rounded-2xl shadow-md p-4">
              <WordCloud type="harian" />
            </div>
          </TabsContent>
          <TabsContent value="mingguan">
            <SurveyAccessMingguanButton />
            <br />
            <SurveyMingguanResponse />
            <br />
            <div className="flex items-center justify-between w-full bg-white border border-gray-200 rounded-2xl shadow-md p-4">
              <WordCloud type="mingguan" />
            </div>
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
