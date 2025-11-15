import React, { useEffect, useState } from "react";

interface HeatmapProps {
  students: string[];
  dates: string[];
  values: number[][];
}

export default function HeatmapKebahagiaan({ students, dates, values }: HeatmapProps) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsSmallScreen(window.innerWidth < 768); // < 768px = HP / layar kecil
    };

    checkSize(); 
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  // Jika layar terlalu kecil → tampilkan pesan
  if (isSmallScreen) {
    return (
      <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-xl text-yellow-800 text-center shadow-md">
        <p className="font-semibold text-sm">
          Heatmap tidak dapat ditampilkan pada layar kecil.
        </p>
        <p className="text-xs mt-1">
          Silakan buka halaman ini menggunakan laptop atau tablet untuk tampilan lengkap.
        </p>
      </div>
    );
  }

  // Konversi nilai ke warna
  const getColor = (value: number) => {
    if (value >= 85) return "bg-green-500";
    if (value >= 70) return "bg-green-300";
    if (value >= 50) return "bg-yellow-300";
    if (value >= 30) return "bg-orange-400";
    return "bg-red-500";
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-full overflow-auto">
      <h2 className="text-lg font-semibold mb-4">Heatmap Kebahagiaan per Kelas</h2>

      <div className="grid" style={{ gridTemplateColumns: `150px repeat(${dates.length}, 1fr)` }}>
        
        {/* Header kolom */}
        <div className="font-semibold text-sm text-gray-700 border-b pb-2">Siswa</div>
        {dates.map((date, i) => (
          <div key={i} className="text-xs text-gray-600 text-center border-b pb-2">
            {date}
          </div>
        ))}

        {/* Baris siswa */}
        {students.map((student, row) => (
          <>
            <div key={`name-${row}`} className="text-sm font-medium py-2 border-b">
              {student}
            </div>

            {values[row].map((val, col) => (
              <div
                key={`cell-${row}-${col}`}
                className={`h-8 border-b border-r ${getColor(val)}`}
              ></div>
            ))}
          </>
        ))}
      </div>
    </div>
  );
}
