"use client";

import React from "react";

type InfoCardProps = {
  value: number | string;
  label: string;
  color?: string; // warna background
  size?: "sm" | "md" | "lg"; // ukuran kartu
};

export default function InfoCard({
  value,
  label,
  color = "#EF4444",
  size = "md",
}: InfoCardProps) {
  // ukuran dinamis berdasarkan prop size
  const sizeClasses = {
    sm: "w-16 h-16 text-xl",
    md: "w-20 h-20 text-2xl",
    lg: "w-28 h-28 text-4xl",
  }[size];

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl shadow-md text-white p-3 ${sizeClasses}`}
      style={{ backgroundColor: color }}
    >
      <span
        className={`font-bold leading-none ${
          size === "lg" ? "text-5xl" : size === "sm" ? "text-2xl" : "text-3xl"
        }`}
      >
        {value}
      </span>
      <span
        className={`font-medium mt-1 ${
          size === "lg" ? "text-base" : size === "sm" ? "text-xs" : "text-sm"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
