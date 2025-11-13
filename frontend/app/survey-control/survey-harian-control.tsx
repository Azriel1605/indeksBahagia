import React, { useState, useEffect, useRef } from "react";
import { Play, StopCircle } from "lucide-react";
import { dataAPI } from "@/lib/api";

const SurveyAccessHarianButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 🧠 Ambil status awal dari API
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await dataAPI.getSurveyStatus("harian");
        if (!res.ok) throw new Error("Gagal mengambil status survei");

        const data = await res.json();
        setIsOpen(data.isOpen);

        // Jika survei sedang dibuka, mulai timer berdasarkan waktu server
        if (data.isOpen && data.openedAt) {
          const start = new Date(data.openedAt).getTime();
          intervalRef.current = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - start) / 1000));
          }, 1000);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchStatus();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // ⏱️ Timer kontrol saat tombol diklik
  useEffect(() => {
    if (isOpen === null) return; // tunggu sampai status API diketahui

    if (isOpen) {
      const start = Date.now();
      intervalRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - start) / 1000));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setElapsedTime(0);
    }
  }, [isOpen]);

  // 🔄 Toggle survei open/close via API
  const toggleSurveyAccess = async () => {
    if (isOpen === null) return;

    try {
      const action = isOpen ? "close" : "open";
      const res = await dataAPI.toggleSurveyAccess("harian", action);

      if (!res.ok) throw new Error("Gagal mengubah status survei");

      const data = await res.json();
      setIsOpen(data.isOpen ?? !isOpen); // fallback kalau API tidak return boolean

      // Reset timer jika baru dibuka
      if (data.isOpen && data.openedAt) {
        const start = new Date(data.openedAt).getTime();
        setElapsedTime(Math.floor((Date.now() - start) / 1000));
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menghubungkan ke API.");
    }
  };

  // ⏰ Format waktu ke mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // 🌀 Loading state (saat belum dapat status dari API)
  if (isOpen === null) {
    return (
      <div className="w-full md:w-1/2 bg-white border border-gray-200 rounded-2xl shadow-md p-4 flex items-center justify-center">
        <span className="text-gray-500 animate-pulse">Memuat status survei...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full md:w-1/2 bg-white border border-gray-200 rounded-2xl shadow-md p-4">
      {/* Tombol toggle */}
      <button
        onClick={toggleSurveyAccess}
        className={`flex items-center gap-2 px-5 py-2 rounded-xl text-white font-semibold shadow transition-all duration-300 ${
          isOpen
            ? "bg-red-500 hover:bg-red-600"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {isOpen ? (
          <>
            <StopCircle className="w-5 h-5" /> Tutup Akses Survei
          </>
        ) : (
          <>
            <Play className="w-5 h-5" /> Buka Akses Survei
          </>
        )}
      </button>

      {/* Timer */}
      <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
        {isOpen ? (
          <>
            <span>⏱️ Dibuka selama:</span>
            <span className="font-semibold text-blue-700">
              {formatTime(elapsedTime)}
            </span>
          </>
        ) : (
          <span className="italic text-gray-400">Survei tertutup</span>
        )}
      </div>
    </div>
  );
};

export default SurveyAccessHarianButton;
