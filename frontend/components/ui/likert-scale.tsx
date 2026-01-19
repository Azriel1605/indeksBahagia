import React, { useEffect, useState } from "react";

interface LikertQuestionJoyfulRequiredProps {
  number?: number; // nomor pertanyaan
  question: string;
  value?: number;
  onChange?: (value: number) => void;
  required?: boolean;
  showError?: boolean;
  option?: string[];
}

const OPTIONS = [
  { label: "Sangat Tidak Setuju", value: 1, emoji: "😞" },
  { label: "Tidak Setuju", value: 2, emoji: "🙁" },
  { label: "Netral", value: 3, emoji: "😐" },
  { label: "Setuju", value: 4, emoji: "😃" },
  { label: "Sangat Setuju", value: 5, emoji: "🤩" },
];

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

const LikertQuestionJoyfulRequired: React.FC<
  LikertQuestionJoyfulRequiredProps
> = ({ number, question, value, onChange, required = false, showError = false, option = OPTIONS }) => {
  const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const [shuffledOptions, setShuffledOptions] = React.useState<string[]>([]);

  useEffect(() => {
    // Acak opsi setiap kali komponen dimount
    setShuffledOptions(shuffleArray(OPTIONS));
  }, []);

  return (
    <div className="relative w-full max-w-3xl mx-auto p-6 rounded-3xl shadow-md bg-gradient-to-b from-white to-blue-50 border border-blue-100">
      {/* Nomor pertanyaan */}
      {number && (
        <div className="absolute -top-3 -left-3 bg-gradient-to-br from-sky-400 to-blue-500 text-white text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full shadow-md">
          {number}
        </div>
      )}

      {/* Pertanyaan */}
      <p className="text-lg sm:text-xl font-semibold text-center mb-4 text-blue-800">
        {question}
        {required && <span className="text-red-500 ml-1">*</span>}
      </p>

      {/* Skala */}
      <div className="grid grid-cols-5 gap-2 sm:gap-4 text-center">
        {option.map((option, index) => {
          const optionValue = index + 1;
          const isSelected = value === optionValue;

          return (
            <label
              key={index}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                isSelected ? ACTIVE_COLORS[index] : COLORS[index]
              }`}
              onClick={() => onChange?.(optionValue)}
            >
              <span className="text-xs sm:text-sm font-medium">{option}</span>
            </label>
          );
        })}
      </div>

      {/* Pesan error */}
      {required && showError && !value && (
        <p className="mt-2 text-sm text-red-600 text-center font-medium">
          Harap pilih salah satu jawaban.
        </p>
      )}
    </div>
  );
};

export default LikertQuestionJoyfulRequired;


// import React from "react";

// interface LikertQuestionJoyfulProps {
//   question: string;
//   value?: number;
//   onChange?: (value: number) => void;
// }

// const EMOJIS = ["😞", "🙁", "😐", "😃", "🤩"];
// const LABELS = [
//   "Sangat Tidak Bahagia",
//   "Kurang Bahagia",
//   "Netral",
//   "Bahagia",
//   "Sangat Bahagia",
// ];
// const COLORS = [
//   "bg-red-100 border-red-300",
//   "bg-orange-100 border-orange-300",
//   "bg-yellow-100 border-yellow-300",
//   "bg-green-100 border-green-300",
//   "bg-teal-100 border-teal-300",
// ];
// const ACTIVE_COLORS = [
//   "bg-red-400 text-white border-red-500",
//   "bg-orange-400 text-white border-orange-500",
//   "bg-yellow-400 text-white border-yellow-500",
//   "bg-green-400 text-white border-green-500",
//   "bg-teal-400 text-white border-teal-500",
// ];

// const LikertQuestionJoyful: React.FC<LikertQuestionJoyfulProps> = ({
//   question,
//   value,
//   onChange,
// }) => {
//   return (
//     <div className="w-full max-w-3xl mx-auto p-6 rounded-3xl shadow-lg bg-gradient-to-b from-yellow-50 to-white border border-yellow-100">
//       {/* Pertanyaan */}
//       <p className="text-xl font-semibold text-center mb-6 text-amber-700">
//         {question}
//       </p>

//       {/* Skala */}
//       <div className="grid grid-cols-5 gap-3 sm:gap-4 text-center">
//         {EMOJIS.map((emoji, index) => (
//           <label
//             key={index}
//             className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 cursor-pointer transform hover:scale-105 ${
//               value === index + 1 ? ACTIVE_COLORS[index] : COLORS[index]
//             }`}
//             onClick={() => onChange?.(index + 1)}
//           >
//             <span className="text-3xl sm:text-4xl">{emoji}</span>
//             <span className="text-xs sm:text-sm mt-2 font-medium hidden sm:block">
//               {LABELS[index]}
//             </span>
//           </label>
//         ))}
//       </div>

//       {/* Label bawah untuk mobile */}
//       <div className="flex justify-between mt-4 text-xs text-gray-500 sm:hidden">
//         <span>{LABELS[0]}</span>
//         <span>{LABELS[LABELS.length - 1]}</span>
//       </div>

//       {/* Nilai terpilih */}
//       {value && (
//         <p className="mt-6 text-center text-amber-700 font-medium text-sm sm:text-base">
//           Kamu merasa:{" "}
//           <span className="font-bold">
//             {LABELS[value - 1]} {EMOJIS[value - 1]}
//           </span>
//         </p>
//       )}
//     </div>
//   );
// };

// export default LikertQuestionJoyful;

