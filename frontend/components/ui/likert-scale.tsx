import React, { useEffect, useState } from "react";

interface LikertQuestionJoyfulRequiredProps {
  number?: number;
  question: string;
  value?: number;
  onChange?: (value: number) => void;
  required?: boolean;
  showError?: boolean;
  option?: string[];
}

const DEFAULT_OPTIONS = [
  "Sangat Tidak Setuju",
  "Tidak Setuju",
  "Netral",
  "Setuju",
  "Sangat Setuju",
];

const DEFAULT_EMOJIS = ["😞", "🙁", "😐", "😃", "🤩"];

const COLORS = [
  "bg-red-100 border-red-300",
  "bg-orange-100 border-orange-300",
  "bg-yellow-100 border-yellow-300",
  "bg-green-100 border-green-300",
  "bg-teal-100 border-teal-300",
];

const ACTIVE_COLORS = [
  "bg-red-400 text-white border-red-500",
  "bg-orange-400 text-white border-orange-500",
  "bg-yellow-400 text-white border-yellow-500",
  "bg-green-400 text-white border-green-500",
  "bg-teal-400 text-white border-teal-500",
];

type ShuffledItem = {
  label: string;
  value: number;
  emoji: string;
};

const LikertQuestionJoyfulRequired: React.FC<
  LikertQuestionJoyfulRequiredProps
> = ({
  number,
  question,
  value,
  onChange,
  required = false,
  showError = false,
  option = DEFAULT_OPTIONS,
}) => {
  const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const [shuffledOptions, setShuffledOptions] = useState<ShuffledItem[]>([]);

  useEffect(() => {
    const mapped = option.map((label, i) => ({
      label,
      value: i + 1,
      emoji: DEFAULT_EMOJIS[i] ?? "⭐",
    }));

    // Shuffle HANYA sekali saat pertama kali halaman dimuat
    setShuffledOptions(shuffleArray(mapped));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full max-w-3xl mx-auto p-5 sm:p-6 rounded-3xl shadow-md bg-gradient-to-b from-white to-blue-50 border border-blue-100">
      {number && (
        <div className="absolute -top-3 -left-3 bg-gradient-to-br from-sky-400 to-blue-500 text-white text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full shadow-md">
          {number}
        </div>
      )}

      <p className="text-base sm:text-lg font-semibold text-center mb-4 text-blue-800">
        {question}
        {required && <span className="text-red-500 ml-1">*</span>}
      </p>

      {/* Responsif: 2 kolom di HP, 3 di tablet, 5 di desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-center">
        {shuffledOptions.map((opt) => {
          const isSelected = value === opt.value;
          const colorIndex = opt.value - 1; // <-- KUNCI PERBAIKAN

          return (
            <label
              key={opt.value}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                isSelected
                  ? ACTIVE_COLORS[colorIndex]
                  : COLORS[colorIndex]
              }`}
              onClick={() => onChange?.(opt.value)}
            >
              <span className="text-2xl mb-1">{opt.emoji}</span>
              <span className="text-xs sm:text-sm font-medium text-center">
                {opt.label}
              </span>
            </label>
          );
        })}
      </div>

      {required && showError && !value && (
        <p className="mt-3 text-sm text-red-600 text-center font-medium">
          Harap pilih salah satu jawaban.
        </p>
      )}
    </div>
  );
};

export default LikertQuestionJoyfulRequired;
