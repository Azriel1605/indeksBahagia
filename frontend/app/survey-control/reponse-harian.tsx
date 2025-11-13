"use client"

import { CardHeader, CardContent, Card, CardTitle } from "@/components/ui/card"
import HappinessGauge from "@/components/gauge-chart"
import InfoCard from "@/components/info-card"



export default function SurveyHarianReponse() {
  return (
    <div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-3">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rata-rata Indeks Kebahagiaan</CardTitle>
            </CardHeader>
            <CardContent>
                <HappinessGauge value={80.2} label="Kebahagiaan Siswa" size={300}/>
            </CardContent>
            </Card>

            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Guage Chart</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Judul dan deskripsi */}
            <h2 className="text-lg font-bold mb-1">
                Rata Rata Indeks kebagaiaan hari ini
            </h2>
            <h3 className="text-sm font-semibold mb-3">(SHI Today)</h3>

            {/* Keterangan warna */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 bg-white rounded-full shadow-sm px-3 py-2">
                <span className="text-sm text-red-500 font-semibold">Merah (&lt;40%)</span>:
                <span className="text-smtext-gray-700">Risiko tinggi</span>
                </div>

                <div className="flex items-center gap-2 bg-white rounded-full shadow-sm px-3 py-2">
                <span className="text-sm text-yellow-500 font-semibold">
                    Kuning (40%–59%)
                </span>
                : <span className="text-sm text-gray-700">Perlu perhatian</span>
                </div>

                <div className="flex items-center gap-2 bg-white rounded-full shadow-sm px-3 py-2">
                <span className="text-sm text-green-600 font-semibold">
                    Hijau (60%–79%)
                </span>
                : <span className="text-sm text-gray-700">Baik</span>
                </div>

                <div className="flex items-center gap-2 bg-white rounded-full shadow-sm px-3 py-2">
                <span className="text-sm text-blue-600 font-semibold">
                    Biru (80%–100%)
                </span>
                : <span className="text-sm text-gray-700">Sangat baik</span>
                </div>
            </div>
            </CardContent>
            </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Siswa yang sudah mengisi</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center w-full h-full">
                    <br />
                    <InfoCard value={23} label="Siswa" color="#008000" size="lg" />
                </CardContent>
            </Card>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-1">
            
        </div>
    </div>
)
}