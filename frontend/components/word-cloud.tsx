"use client";

import React, { useEffect, useState } from "react";
import { dataAPI } from "@/lib/api";

interface Word {
  text: string;
  size: number;
}

interface PositionedWord extends Word {
  x: number;
  y: number;
  angle: number;
  color: string;
}

interface WordCloudProps {
  type: "harian" | "mingguan";
  width?: number;
  height?: number;
}

const vibrantColors = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FDCB6E",
  "#A29BFE",
  "#55EFC4",
  "#81ECEC",
  "#FAB1A0",
  "#FF7675",
  "#74B9FF",
];

const WordCloud: React.FC<WordCloudProps> = ({
  type,
  width = 600,
  height = 400,
}) => {
  const [positions, setPositions] = useState<PositionedWord[]>([]);

  useEffect(() => {
    fetchWords();
    const interval = setInterval(fetchWords, 20000); // panggil ulang setiap 20 detik
    return () => clearInterval(interval); // bersihkan saat komponen unmount
  }, [type]);

  const fetchWords = async () => {
    try {
      const res = await dataAPI.getOpenQuestion(type);
      const data = await res.json();

      let text: string;
      if (Array.isArray(data.text)) {
        text = data.text
          .filter((t: unknown) => t)
          .map((t: unknown) => String(t))
          .join(" ");
      } else if (typeof data.text === "string") {
        text = data.text;
      } else {
        text = "";
      }

      const freq: Record<string, number> = {};
      text
        .toUpperCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .forEach((word) => {
          if (!word) return;
          freq[word] = (freq[word] || 0) + 1;
        });

      const wordList: Word[] = Object.entries(freq).map(([text, value]) => ({
        text,
        size: 12 + value * 6,
      }));

      generateCloud(wordList);
    } catch (error) {
      console.error("Word cloud API error:", error);
    }
  };

  const generateCloud = (words: Word[]) => {
    const placed: PositionedWord[] = [];
    const sorted = [...words].sort((a, b) => b.size - a.size);

    sorted.forEach((w) => {
      const angle = Math.random() > 0.5 ? 0 : 90;
      const color = vibrantColors[Math.floor(Math.random() * vibrantColors.length)];
      const placedWord = placeWord(w, angle, color, placed);
      if (placedWord) placed.push(placedWord);
    });

    setPositions(placed);
  };

  const placeWord = (
    word: Word,
    angle: number,
    color: string,
    placed: PositionedWord[]
  ): PositionedWord | null => {
    const centerX = width / 2;
    const centerY = height / 2;
    let radius = 0;
    let theta = 0;

    while (radius < Math.max(width, height)) {
      const x = centerX + radius * Math.cos(theta);
      const y = centerY + radius * Math.sin(theta);

      const newBox = getBBox(word.text, word.size, x, y, angle);

      if (!isOverlapping(newBox, placed)) {
        return { ...word, x, y, angle, color };
      }

      theta += 0.15;
      radius += 0.5;
    }

    return null;
  };

  const getBBox = (text: string, size: number, x: number, y: number, angle: number) => {
    const baseWidth = text.length * (size * 0.6);
    const baseHeight = size;

    let widthBox = baseWidth;
    let heightBox = baseHeight;

    if (angle === 90) {
      widthBox = baseHeight;
      heightBox = baseWidth;
    }

    return {
      left: x - widthBox / 2,
      right: x + widthBox / 2,
      top: y - heightBox / 2,
      bottom: y + heightBox / 2,
    };
  };

  const isOverlapping = (box: any, placed: PositionedWord[]) =>
    placed.some((p) => {
      const pw = getBBox(p.text, p.size, p.x, p.y, p.angle);
      return !(
        box.right < pw.left ||
        box.left > pw.right ||
        box.bottom < pw.top ||
        box.top > pw.bottom
      );
    });

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {positions.map((w, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: w.x,
            top: w.y,
            fontSize: w.size,
            whiteSpace: "nowrap",
            fontWeight: 600,
            color: w.color,
            userSelect: "none",
            transition: "transform 0.2s ease, text-shadow 0.2s ease",

            // posisi
            transform: "translate(-50%, -50%)",

            // rotasi vertikal baca bottom → top
            writingMode: w.angle === 90 ? "vertical-rl" : "horizontal-tb",
            transformOrigin: "center",
            ...(w.angle === 90 ? { transform: "translate(-50%, -50%) rotate(180deg)" } : {}),
          }}
          className="word-item"
        >
          {w.text}
        </div>
      ))}

      <style>{`
        .word-item:hover {
          transform: scale(1.2) translate(-50%, -50%);
          text-shadow: 0 2px 6px rgba(0,0,0,0.2);
          z-index: 10;
        }
      `}</style>
    </div>
  );
};

export default WordCloud;
