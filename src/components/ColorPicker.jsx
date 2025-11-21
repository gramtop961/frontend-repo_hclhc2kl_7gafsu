import React from "react";

export default function ColorPicker({ label, value, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 text-sm text-slate-100">
      <span className="whitespace-nowrap">{label}</span>
      <input
        type="color"
        className="h-9 w-12 rounded border border-white/10 bg-slate-700/50 cursor-pointer"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
