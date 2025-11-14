"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { dataAPI } from "@/lib/api"
import RouteGuard from "@/components/route-guard"
import AlertDashboard from "./alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

interface ClassOption {
  label: string;
  value: string;
}

function DashboardContent() {
  const [classOptions, setClassOptions] = useState<ClassOption[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // ---- FETCH DATA KELAS DARI API ----
  const fetchClassOptions = async () => {
    try {
      const res = await dataAPI.getAccessClass();// ganti dengan endpoint kamu
      const data = await res.json();

      console.log("Fetched class options data:", data);

      const mapped = data.map((item: any) => ({
        label: item.label,
        value: item.value,
      }));

      setClassOptions(mapped);
      setSelectedClass(mapped[0].value);

    } catch (error) {
      console.error("Error fetching class options:", error);
    }
  };

  useEffect(() => {
  const today = new Date();
  const formatted = today.toISOString().split("T")[0];
  setSelectedDate(formatted);
  fetchClassOptions();

  console.log("Effect runs with:", { selectedClass, selectedDate });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end w-full bg-white border border-gray-200 rounded-2xl shadow-md p-4">

          {/* KIRI — Class Picker */}
          <div className="flex flex-col gap-2 w-fit">
            <label className="font-semibold text-gray-700">Pilih Kelas</label>

            <Select value={selectedClass} onValueChange={
              (value) => setSelectedClass(value)
              }>
              <SelectTrigger>
                <SelectValue placeholder={selectedClass} />
              </SelectTrigger>
              <SelectContent>
                {classOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* KANAN — Date Picker */}
          <div className="flex flex-col gap-2 w-fit">
            <label className="font-semibold text-gray-700">Pilih Tanggal</label>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

        </div>
        
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 mt-6">
        {selectedClass && selectedDate && (
          <AlertDashboard kelas={selectedClass as any} date={selectedDate}/>
        )}

      </div>
    </div>
  )

}

export default function DashboardPage() {
  return (
    <RouteGuard requireAuth={true} allowedRoles={['admin', 'guru']}>
      <DashboardContent />
    </RouteGuard>
  )
}
