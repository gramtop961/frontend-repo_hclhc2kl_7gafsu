import React from "react";

const SHAPES = [
  { id: "rect", label: "Dikdörtgen", type: "rect" },
  { id: "square", label: "Kare", type: "square" },
  { id: "circle", label: "Daire", type: "circle" },
  { id: "triangle", label: "Üçgen", type: "triangle" },
  { id: "star", label: "Yıldız", type: "star" },
  { id: "arrow", label: "Ok", type: "arrow" },
  { id: "badge", label: "Rozet", type: "badge" },
];

export default function ShapeGallery({ onAdd }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {SHAPES.map((s) => (
        <button
          key={s.id}
          onClick={() => onAdd(s.type)}
          className="group aspect-square rounded-lg bg-slate-700/50 border border-white/10 flex items-center justify-center text-slate-100 hover:border-blue-400 hover:bg-slate-700 transition"
          title={s.label}
        >
          <span className="text-xs opacity-80 group-hover:opacity-100">{s.label}</span>
        </button>
      ))}
    </div>
  );
}
