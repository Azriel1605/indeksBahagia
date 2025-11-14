import React, { useEffect, useRef, useState } from "react";

interface Word {
  text: string;
  value: number;
}

interface PlacedWord extends Word {
  x: number;
  y: number;
  size: number;
  rotate: number;
}

interface WordCloudProps {
  words: Word[];
  width?: number;
  height?: number;
}

const WordCloud: React.FC<WordCloudProps> = ({
  words,
  width = 600,
  height = 400,
}) => {
  const [placed, setPlaced] = useState<PlacedWord[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!words.length) return;

    const sorted = [...words].sort((a, b) => b.value - a.value);

    const newPlaced: PlacedWord[] = [];

    function collide(x: number, y: number, size: number) {
      return newPlaced.some((w) => {
        const dx = x - w.x;
        const dy = y - w.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < (size + w.size) / 2 + 8; // jarak rapat
      });
    }

    sorted.forEach((word, i) => {
      const size = 14 + (word.value / sorted[0].value) * 40;
      let angle = 0;
      let radius = 0;
      let x = 0;
      let y = 0;

      // spiral search
      while (true) {
        x = radius * Math.cos(angle);
        y = radius * Math.sin(angle);

        if (!collide(x, y, size)) {
          newPlaced.push({
            ...word,
            x,
            y,
            size,
            rotate: Math.random() < 0.2 ? 90 : 0,
          });
          break;
        }

        angle += 0.3;
        radius += 0.5;
      }
    });

    setPlaced(newPlaced);
  }, [words]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width,
        height,
        border: "1px solid #eee",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: width / 2,
          top: height / 2,
        }}
      >
        {placed.map((w, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              transform: `translate(${w.x}px, ${w.y}px) rotate(${w.rotate}deg)`,
              fontSize: w.size,
              fontWeight: 600,
              whiteSpace: "nowrap",
              color: `hsl(${(i * 40) % 360}, 70%, 40%)`,
            }}
          >
            {w.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordCloud;
