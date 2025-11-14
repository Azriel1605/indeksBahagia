"use client"

import { CardHeader, CardContent, Card, CardTitle } from "@/components/ui/card"
import HappinessGauge from "@/components/gauge-chart"
import InfoCard from "@/components/info-card"
import { useEffect, useState } from "react";
import { dataAPI } from "@/lib/api";
import { set } from "date-fns";

interface CounterProps{
    count?: number | undefined;
    shi?: number | undefined;
}


export default function SurveyMingguanResponse() {
    const [counter, setCounter] = useState<CounterProps>({ count: undefined });

  const fetchCounter = async () => {
    try {
        const [shiResponse, counterResponse] = await Promise.all([
        dataAPI.getSHIToday("mingguan"),
        dataAPI.counterSubmit("mingguan")
        ]);

        const [shiData, counterData] = await Promise.all([
            shiResponse.json(),
            counterResponse.json()
        ]);

        console.log("✅ SHI Today response:", shiData);
        console.log("✅ Counter response:", counterData);

        if (!shiResponse.ok) throw new Error("getSHIToday failed");
        if (!counterResponse.ok) throw new Error("counterSubmit failed");


        setCounter({ shi: shiData.shi, count: counterData.count });

    } catch (error) {
      console.error("Error fetching counter:", error);
    }
  };

  // ✅ Panggil saat pertama kali halaman dibuka (atau direfresh)
  useEffect(() => {
    fetchCounter();
    const interval = setInterval(fetchCounter, 5000); // panggil ulang setiap 5 detik
    return () => clearInterval(interval); // bersihkan saat komponen unmount
  }, []);
  return (
    <div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-3">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rata-rata Indeks Kebahagiaan</CardTitle>
            </CardHeader>
            <CardContent>
                <HappinessGauge value={counter.shi ?? 0} label="Kebahagiaan Siswa" size={300}/>
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
                    <InfoCard value={counter.count ?? 0} label="Siswa" color="#008000" size="lg" />
                </CardContent>
            </Card>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-1">
            
        </div>
    </div>
)
}