import React from "react";

interface StudentTrend {
  kode: string;
  trend: number;
  lastScore: number;
}

interface Top5Props {
  data: StudentTrend[];
  title?: string;
  fontSize?: string;
}

export default function Top5TrenMenurun({
  data,
  title = "Top 5 Siswa dengan Tren Menurun",
  fontSize = "text-sm",
}: Top5Props) {
  // Ambil 5 data pertama
  const filledRows = [...data.slice(0, 5)];

  // Isi kekurangan dengan placeholder "-"
  while (filledRows.length < 5) {
    filledRows.push({
      kode: "-",
      trend: 0,
      lastScore: 0,
    });
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-full">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className={`text-left px-3 py-2 ${fontSize}`}>Kode</th>
            <th className={`text-left px-3 py-2 ${fontSize}`}>Tren 7 Hari</th>
            <th className={`text-left px-3 py-2 ${fontSize}`}>Skor Terakhir</th>
          </tr>
        </thead>

        <tbody>
          {filledRows.map((siswa, index) => {
            const isPlaceholder = siswa.kode === "-";

            return (
              <tr
                key={index}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td
                  className={`px-3 py-2 font-medium ${fontSize} ${
                    isPlaceholder ? "text-gray-400" : ""
                  }`}
                >
                  {isPlaceholder ? "-" : siswa.kode}
                </td>

                <td
                  className={`px-3 py-2 ${fontSize} ${
                    isPlaceholder
                      ? "text-gray-400"
                      : siswa.trend <= -15
                      ? "text-red-500 font-semibold"
                      : "text-gray-700"
                  }`}
                >
                  {isPlaceholder ? "-" : siswa.trend}
                </td>

                <td
                  className={`px-3 py-2 ${fontSize} ${
                    isPlaceholder ? "text-gray-400" : ""
                  }`}
                >
                  {isPlaceholder ? "-" : siswa.lastScore}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
