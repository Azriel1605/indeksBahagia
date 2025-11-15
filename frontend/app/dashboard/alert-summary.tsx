import React from "react";
import { TrendingUp, TrendingDown, Users, UserPlus, AlertOctagon } from "lucide-react";

interface AlertCardProps {
  title: string;
  value: string | number;
  desc: string;
  percentage: number;
  color: string; // tailwind color (blue, green, yellow, red)
  icon: React.ReactNode;
}

function AlertCard({ title, value, desc, percentage, color, icon }: AlertCardProps) {
  const isPositive = percentage >= 0;

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-md border border-gray-800 text-white w-full">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm text-gray-400">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{desc}</p>
        </div>
        <div className={`text-${color}-400`}>{icon}</div>
      </div>

      {/* Mini Decorative Bars */}
      <div className="flex items-end gap-1 h-8 my-3">
        {Array.from({ length: 28 }).map((_, i) => (
          <div
            key={i}
            className={`w-1 bg-${color}-500/70 rounded`}
            style={{ height: `${Math.random() * 100}%` }}
          ></div>
        ))}
      </div>

      {/* Percentage */}
      <p
        className={`text-sm font-semibold ${
          isPositive ? "text-green-400" : "text-red-400"
        }`}
      >
        {isPositive ? "+" : ""}
        {percentage}%
      </p>
    </div>
  );
}

// MAIN WRAPPER OF 3 CARDS
export default function AlertSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-3">

      <AlertCard
        title="Alert 1 — Siswa Baru"
        value="120"
        desc="Jumlah siswa baru bergabung minggu ini."
        percentage={12}
        color="blue"
        icon={<UserPlus size={28} />}
      />

      <AlertCard
        title="Alert 2 — Siswa Aktif"
        value="540"
        desc="Siswa yang aktif mengerjakan tugas."
        percentage={-5}
        color="green"
        icon={<Users size={28} />}
      />

      <AlertCard
        title="Alert 3 — Tren Menurun"
        value="23"
        desc="Siswa mengalami penurunan skor signifikan."
        percentage={-14}
        color="yellow"
        icon={<AlertOctagon size={28} />}
      />

    </div>
  );
}
