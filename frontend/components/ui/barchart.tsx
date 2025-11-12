import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

// ==================
// 🔹 Type Definition
// ==================
interface SHIData {
  kelas: string;
  nilai: number;
}

// ==================
// 🔹 Dummy Data
// ==================
const data: SHIData[] = [
  { kelas: "X IPA 1", nilai: 35 },
  { kelas: "X IPA 2", nilai: 52 },
  { kelas: "X IPS 1", nilai: 68 },
  { kelas: "XI IPA 1", nilai: 74 },
  { kelas: "XI IPS 1", nilai: 81 },
  { kelas: "XII IPA 1", nilai: 93 },
];

// ==================
// 🔹 Fungsi Warna SHI
// ==================
const getColor = (v: number): string => {
  if (v < 40) return "#EF4444"; // Merah
  if (v < 60) return "#FACC15"; // Kuning
  if (v < 80) return "#22C55E"; // Hijau
  return "#3B82F6"; // Biru
};

// ==================
// 🔹 Komponen Utama
// ==================
export default function BarChartSHI(){
  return (
    <div className="p-6 bg-white rounded-2xl shadow-md text-center">
      <h2 className="text-2xl font-semibold mb-4">
        Perbandingan Indeks Kebahagiaan per Kelas
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 30, right: 30, left: 20, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis
            dataKey="kelas"
            tick={{ fontSize: 12 }}
            angle={-15}
            textAnchor="end"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            domain={[0, 100]}
            label={{
              value: "Nilai SHI",
              angle: -90,
              position: "insideLeft",
              offset: 10,
            }}
          />
          <Tooltip
            formatter={(value: number) => [`${value}%`, "SHI"]}
            cursor={{ fill: "rgba(0,0,0,0.05)" }}
          />
          <Bar dataKey="nilai" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.nilai)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legenda Warna */}
      <div className="flex justify-center gap-3 mt-6 text-sm">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-red-500 rounded-sm" /> <span>{"< 40 (Risiko Tinggi)"}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-yellow-400 rounded-sm" /> <span>{"< 60 (Perlu Perhatian)"}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-green-500 rounded-sm" /> <span>{"< 80 (Baik)"}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-blue-500 rounded-sm" /> <span>{"≤ 100 (Sangat Baik)"}</span>
        </div>
      </div>
    </div>
  );
}
