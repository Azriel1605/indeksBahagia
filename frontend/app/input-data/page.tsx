"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { FileUp, UserPlus } from "lucide-react"
import { dataAPI } from "@/lib/api"
import RouteGuard from "@/components/route-guard"

function InputDataContent() {
  const [formData, setFormData] = useState({

  })

  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  const handleArrayChange = useCallback((field: string, value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter((item) => item !== value),
    }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setMessage("")

    try {
      const response = await dataAPI.createLansia(formData)
      const data = await response.json()
      if (response.ok) {
        setMessage("Data lansia berhasil ditambahkan!")
        resetForm()
      } else {
        setError(data.message || "Terjadi kesalahan saat menyimpan data")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const resetForm = useCallback(() => {
    setFormData({
      nama_lengkap: "",
      nik: "",
      jenis_kelamin: "",
      tanggal_lahir: "",
      alamat_lengkap: "",
      koordinat: "",
      rt: "",
      rw: "",
      status_perkawinan: "",
      agama: "",
      pendidikan_terakhir: "",
      pekerjaan_terakhir: "",
      sumber_penghasilan: "",
      kondisi_kesehatan_umum: "",
      riwayat_penyakit_kronis: [],
      penggunaan_obat_rutin: "",
      alat_bantu: "",
      aktivitas_fisik: "",
      status_gizi: "",
      riwayat_imunisasi: "",
      dukungan_keluarga: "",
      kondisi_rumah: "",
      kebutuhan_mendesak: [],
      hobi_minat: "",
      kondisi_psikologis: "",
      nama_pendamping: "",
      hubungan_dengan_lansia: "",
      tanggal_lahir_pendamping: "",
      pendidikan_pendamping: "",
      ketersediaan_waktu: "",
      partisipasi_program_bkl: "",
      riwayat_partisipasi_bkl: "",
      keterlibatan_data: "",
      bab: 0,
      bak: 0,
      membersihkan_diri: 0,
      toilet: 0,
      makan: 0,
      pindah_tempat: 0,
      mobilitas: 0,
      berpakaian: 0,
      naik_turun_tangga: 0,
      mandi:0
    })
  }, [])

  // Memoized data objects for each section


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Input Data Lansia</h1>
          <p className="mt-2 text-gray-600">Tambahkan data lansia baru ke dalam sistem</p>
        </div>

        <Tabs defaultValue="manual" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" className="flex items-center">
              <UserPlus className="h-4 w-4 mr-2" />
              Input Manual
            </TabsTrigger>
            <TabsTrigger value="excel" className="flex items-center">
              <FileUp className="h-4 w-4 mr-2" />
              Upload Excel
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual">
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                  Batal
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Menyimpan..." : "Simpan Data"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function InputDataPage() {
  return (
    <RouteGuard requireAuth={true}>
      <InputDataContent />
    </RouteGuard>
  )
}
