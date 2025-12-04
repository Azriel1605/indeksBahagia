"use client";

import React from "react";
import { ResponsiveContainer } from "recharts";
import dynamic from "next/dynamic";
const GaugeComponent = dynamic(() => import('react-gauge-component'), { ssr: false });

type HappinessGaugeProps = {
  value?: number; // Nilai 0–100
  label?: string;
  size?: number | string; // Diameter chart
};

export default function HappinessGauge({ value = 0, label = "", size = "100%" }: HappinessGaugeProps) {
  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="w-full" style={{ height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          {/* Gunakan div wrapper karena GaugeComponent bukan elemen SVG Recharts */}
          <div className="w-full h-full flex items-center justify-center">
            <GaugeComponent
          type="semicircle"
          arc={{
            width: 0.3,
            padding: 0.005,
            cornerRadius: 1,
            // gradient: true,
            subArcs: [
              {
                limit: 40,
                color: '#EA4228',
                showTick: true,
                tooltip: {
                  text: 'Risiko Tinggi!'
                }
              },
              {
                limit: 60,
                color: '#F5CD19',
                showTick: true,
                tooltip: {
                  text: 'Perlu Perhatian!'
                }
              },
              {
                limit: 80,
                color: '#5BE12C',
                showTick: true,
                tooltip: {
                  text: 'Baik!'
                }
              },
              {
                color: '#3B82F6',
                tooltip: {
                  text: 'Sangat Baik!'
                }
              }
            ]
          }}
          pointer={{
            color: '#345243',
            length: 0.80,
            width: 15,
            elastic: true,
          }}
          labels={{
            valueLabel: { formatTextValue: value => value },
            tickLabels: {
              type: 'outer',
              defaultTickValueConfig: { 
                formatTextValue: (value: any) => value ,
                style: {fontSize: 15}
            },
            }
          }}
          value={value}
          minValue={1}
          maxValue={100}
        />
          </div>
        </ResponsiveContainer>
      </div>

      {/* Label di bawah chart */}
      <p className="mt-2 text-center text-sm font-medium text-gray-700">
        {label || "Rata-rata Indeks Kebahagiaan Sekolah (SHI Overall)"}
      </p>
    </div>

  );
}