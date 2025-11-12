import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const dataHarian = [
  { name: "Senin", value: 68 },
  { name: "Selasa", value: 68 },
  { name: "Rabu", value: 68 },
  { name: "Kamis", value: 68 },
  { name: "Jumat", value: 68 },
  { name: "Sabtu", value: 68 },
  { name: "Minggu", value: 68 },
];

const dataMingguan = [
  { name: "Minggu 1", value: 70 },
  { name: "Minggu 2", value: 72 },
  { name: "Minggu 3", value: 67 },
  { name: "Minggu 4", value: 74 },
];

export default function LineChartSekolah() {
  const [mode, setMode] = useState("harian");
  const data = mode === "harian" ? dataHarian : dataMingguan;

  return (
    <div className="p-6 bg-slate-100 rounded-2xl shadow-md text-center">
      <h2 className="text-2xl font-semibold mb-4">
        Line Chart Tren Harian & Mingguan Sekolah
      </h2>

      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setMode("harian")}
          className={`px-4 py-1 rounded-full ${
            mode === "harian"
              ? "bg-black text-white"
              : "bg-white text-gray-700 shadow"
          }`}
        >
          Harian
        </button>
        <button
          onClick={() => setMode("mingguan")}
          className={`px-4 py-1 rounded-full ${
            mode === "mingguan"
              ? "bg-black text-white"
              : "bg-white text-gray-700 shadow"
          }`}
        >
          Mingguan
        </button>
      </div>

      <div className="bg-orange-500 rounded-2xl p-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#fff4" />
            <XAxis dataKey="name" tick={{ fill: "#fff" }} />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(val) => `${val}%`}
              tick={{ fill: "#fff" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "8px",
              }}
              formatter={(v) => `${v}%`}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#fff"
              strokeWidth={3}
              dot={{ fill: "#fff", r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="flex justify-around mt-4 flex-wrap gap-2">
          {data.map((d, i) => (
            <div
              key={i}
              className="bg-orange-300 px-3 py-1 rounded-full text-sm font-semibold text-black"
            >
              {d.name}: {d.value}%
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
