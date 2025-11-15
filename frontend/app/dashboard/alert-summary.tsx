import React, {useEffect, useState} from "react";
import { TrendingUp, TrendingDown, Users, UserPlus, AlertOctagon, Hand, UserX } from "lucide-react";
import { dataAPI } from "@/lib/api";

interface AlertCardProps {
  title: string;
  value: string | number;
  desc: string;
  percentage: number;
  color: string; // tailwind color (blue, green, yellow, red)
  icon: React.ReactNode;
}

interface AlertDashboardProps {
  kelas?: string;
  date?: string;
}

interface AlertData {
  alert1: number;
  alert2: number;
  alert3: number;
}

function AlertCard({
  title, value, desc, percentage, color, icon
}: AlertCardProps) {
  const isPositive = percentage >= 0;

  return (
    <div className="bg-[#E53935] p-4 rounded-xl shadow-md border border-[#B71C1C] text-white w-full">
  <div className="flex justify-between items-start">
    <div>
      <h3 className="text-sm text-red-200">{title}</h3>
      <p className="text-2xl font-bold mt-1 text-white">{value}</p>
      <p className="text-xs text-red-100 mt-1">{desc}</p>
    </div>

    {/* icon warna merah terang */}
    <div className="text-red-100">{icon}</div>
  </div>

  {/* Mini Decorative Bars */}
  <div className="flex items-end gap-1 h-8 my-3">
    {Array.from({ length: 28 }).map((_, i) => (
      <div
        key={i}
        className="w-1 bg-[#FFCDD2] rounded" // soft red bars
        style={{ height: `${Math.random() * 100}%` }}
      ></div>
    ))}
  </div>

  {/* Percentage */}
  <p
    className={`text-sm font-semibold ${
      isPositive ? "text-green-200" : "text-red-100"
    }`}
  >
    {isPositive ? "+" : ""}
    {percentage}%
  </p>
</div>

  );
}

// MAIN WRAPPER OF 3 CARDS
export default function AlertSummary({
  kelas,
  date = new Date().toISOString().split("T")[0]
}: AlertDashboardProps) {
  const [alertData, setAlertData] = useState<AlertData | null>(null);

  const fetchData = async () => {
    try {
      console.log(" X Kelas dan Date:", { kelas, date });
        const alertResponse = await dataAPI.getAlerts(kelas || "", date);
        const Data = await alertResponse.json();
        console.log("✅ Alert response:", Data);
  
        if (!alertResponse.ok) throw new Error("getAlerts failed");
        setAlertData(Data);
  
      } catch (error) {
        console.error("Error fetching counter:", error);
      }
    };
  
  // ✅ Panggil saat pertama kali halaman dibuka (atau direfresh)
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // panggil ulang setiap 5 detik
    return () => clearInterval(interval); // bersihkan saat komponen unmount
  }, [kelas, date]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-3">

      {/* ALERT 1 — SHI rendah */}
    <AlertCard
      title="Alert 1 — SHI Rendah"
      value={alertData?.alert1 || 0}
      desc="Jumlah siswa dengan SHI <40 selama 3 hari berturut-turut"
      percentage={12}
      color="red"
      icon={<TrendingDown size={28} />}   // 🔥 IKON DIGANTI
    />

    {/* ALERT 2 — Bullying */}
    <AlertCard
      title="Alert 2 — Bullying"
      value={alertData?.alert2 || 0}
      desc="Siswa merasa tidak aman atau terdapat laporan bullying"
      percentage={-5}
      color="red"
      icon={<Hand size={28} />}          // 🔥 IKON DIGANTI
    />

    {/* ALERT 3 — Tren Menurun */}
    <AlertCard
      title="Alert 3 — Tren Menurun"
      value={alertData?.alert3 || 0}
      desc="Siswa mengalami penurunan skor signifikan"
      percentage={-14}
      color="red"
      icon={<TrendingDown size={28} />}   // 🔥 IKON DIGANTI
    />

    </div>
  );
}
