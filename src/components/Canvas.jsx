import React, { useRef, useState, useEffect } from "react";

function randId() {
  return Math.random().toString(36).slice(2, 9);
}

function defaultShape(type, x, y, color) {
  const base = { id: randId(), type, x, y, w: 160, h: 120, r: 12, fill: color, stroke: "#ffffff", text: "", image: null };
  if (type === "square") return { ...base, w: 140, h: 140 };
  if (type === "circle") return { ...base, w: 140, h: 140 };
  if (type === "triangle") return { ...base, w: 160, h: 140 };
  if (type === "star") return { ...base, w: 180, h: 180 };
  if (type === "arrow") return { ...base, w: 200, h: 80 };
  if (type === "badge") return { ...base, w: 180, h: 120 };
  return base; // rect
}

export default function Canvas({ bg, shapes, setShapes, selectedId, setSelectedId, showGrid }) {
  const svgRef = useRef(null);
  const [drag, setDrag] = useState(null);

  useEffect(() => {
    // App içerisindeki "export-btn" tıklanınca PNG dışa aktar
    const btn = document.getElementById("export-btn");
    if (!btn) return;
    const handler = () => exportPNG();
    btn.addEventListener("click", handler);
    return () => btn.removeEventListener("click", handler);
  });

  useEffect(() => {
    function onKey(e) {
      if (!selectedId) return;
      if (e.key === "Delete" || e.key === "Backspace") {
        setShapes((list) => list.filter((s) => s.id !== selectedId));
        setSelectedId(null);
      }
      if (e.key === "ArrowUp") move(0, -5);
      if (e.key === "ArrowDown") move(0, 5);
      if (e.key === "ArrowLeft") move(-5, 0);
      if (e.key === "ArrowRight") move(5, 0);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId]);

  function addShape(type) {
    const rect = svgRef.current?.getBoundingClientRect();
    const x = rect ? rect.width / 2 - 80 : 100;
    const y = rect ? rect.height / 2 - 60 : 100;
    setShapes((l) => [...l, defaultShape(type, x, y, "#38bdf8")]);
  }

  function move(dx, dy) {
    setShapes((list) => list.map((s) => (s.id === selectedId ? { ...s, x: s.x + dx, y: s.y + dy } : s)));
  }

  function onMouseDown(e, id) {
    const svgRect = svgRef.current.getBoundingClientRect();
    const offsetX = e.clientX - svgRect.left;
    const offsetY = e.clientY - svgRect.top;
    const shape = shapes.find((s) => s.id === id);
    const relX = offsetX - shape.x;
    const relY = offsetY - shape.y;

    if (Math.abs(relX - shape.w) < 12 && Math.abs(relY - shape.h) < 12) {
      setDrag({ id, mode: "resize", startX: offsetX, startY: offsetY, startW: shape.w, startH: shape.h });
      return;
    }

    setDrag({ id, mode: "move", startX: offsetX, startY: offsetY, startPosX: shape.x, startPosY: shape.y });
    setSelectedId(id);
  }

  function onMouseMove(e) {
    if (!drag) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - svgRect.left;
    const y = e.clientY - svgRect.top;

    setShapes((list) =>
      list.map((s) => {
        if (s.id !== drag.id) return s;
        if (drag.mode === "move") {
          return { ...s, x: drag.startPosX + (x - drag.startX), y: drag.startPosY + (y - drag.startY) };
        }
        if (drag.mode === "resize") {
          return { ...s, w: Math.max(40, drag.startW + (x - drag.startX)), h: Math.max(40, drag.startH + (y - drag.startY)) };
        }
        return s;
      })
    );
  }

  function onMouseUp() {
    setDrag(null);
  }

  function drawShape(s) {
    const common = {
      key: s.id,
      onMouseDown: (e) => onMouseDown(e, s.id),
      style: { cursor: "move" },
      fill: s.fill,
      stroke: s.stroke,
      strokeWidth: selectedId === s.id ? 3 : 1,
    };
    if (s.type === "rect" || s.type === "square") return <rect {...common} x={s.x} y={s.y} width={s.w} height={s.h} rx={s.r} ry={s.r} />;
    if (s.type === "circle") return <ellipse {...common} cx={s.x + s.w / 2} cy={s.y + s.h / 2} rx={s.w / 2} ry={s.h / 2} />;
    if (s.type === "triangle") {
      const p = `${s.x + s.w / 2},${s.y} ${s.x + s.w},${s.y + s.h} ${s.x},${s.y + s.h}`;
      return <polygon {...common} points={p} />;
    }
    if (s.type === "star") {
      const cx = s.x + s.w / 2;
      const cy = s.y + s.h / 2;
      const spikes = 5;
      const outer = Math.min(s.w, s.h) / 2;
      const inner = outer / 2.5;
      const pts = [];
      for (let i = 0; i < spikes * 2; i++) {
        const r = i % 2 === 0 ? outer : inner;
        const a = (Math.PI * i) / spikes - Math.PI / 2;
        pts.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`);
      }
      return <polygon {...common} points={pts.join(" ")} />;
    }
    if (s.type === "arrow") {
      const h = s.h, w = s.w, x = s.x, y = s.y;
      const points = `${x},${y + h / 3} ${x + (w * 2) / 3},${y + h / 3} ${x + (w * 2) / 3},${y} ${x + w},${y + h / 2} ${x + (w * 2) / 3},${y + h} ${x + (w * 2) / 3},${y + (2 * h) / 3} ${x},${y + (2 * h) / 3}`;
      return <polygon {...common} points={points} />;
    }
    if (s.type === "badge") {
      const path = `M ${s.x + s.r} ${s.y} H ${s.x + s.w - s.r} Q ${s.x + s.w} ${s.y} ${s.x + s.w} ${s.y + s.r} V ${s.y + s.h - s.r} Q ${s.x + s.w} ${s.y + s.h} ${s.x + s.w - s.r} ${s.y + s.h} H ${s.x + s.r} Q ${s.x} ${s.y + s.h} ${s.x} ${s.y + s.h - s.r} V ${s.y + s.r} Q ${s.x} ${s.y} ${s.x + s.r} ${s.y} Z`;
      return <path {...common} d={path} />;
    }
    if (s.type === "image" && s.url) {
      return (
        <image
          key={s.id}
          href={s.url}
          x={s.x}
          y={s.y}
          width={s.w}
          height={s.h}
          preserveAspectRatio="xMidYMid slice"
          style={{ cursor: "move" }}
          onMouseDown={(e) => onMouseDown(e, s.id)}
        />
      );
    }
    return null;
  }

  function exportPNG() {
    const svg = svgRef.current;
    const serializer = new XMLSerializer();
    const src = serializer.serializeToString(svg);
    const svgBlob = new Blob([src], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = svg.viewBox.baseVal.width || svg.clientWidth;
      canvas.height = svg.viewBox.baseVal.height || svg.clientHeight;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const png = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = png;
      a.download = "infografik.png";
      a.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center gap-2 p-2 bg-slate-800/60 text-slate-100 border-b border-white/10">
        <button onClick={() => addShape("rect")} className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500">Şekil</button>
        <button onClick={() => addShape("circle")} className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500">Daire</button>
        <button onClick={() => addShape("arrow")} className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500">Ok</button>
        <button onClick={exportPNG} className="ml-auto px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500">PNG Dışa Aktar</button>
      </div>

      <div className="relative flex-1 overflow-hidden">
        {showGrid && (
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        )}
        <svg
          ref={svgRef}
          className="w-full h-full"
          viewBox="0 0 1200 700"
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
        >
          <rect x="0" y="0" width="1200" height="700" fill={bg} />
          {shapes.map((s) => drawShape(s))}
          {shapes.map((s) => (
            <g key={s.id + "handles"}>
              {/* resize handle */}
              <rect
                x={s.x + s.w - 8}
                y={s.y + s.h - 8}
                width={16}
                height={16}
                fill="#ffffff"
                opacity={selectedId === s.id ? 0.9 : 0.0}
                style={{ cursor: "nwse-resize" }}
                onMouseDown={(e) => onMouseDown(e, s.id)}
              />
              {/* selection outline */}
              {selectedId === s.id && s.type !== 'image' && (
                <rect x={s.x} y={s.y} width={s.w} height={s.h} fill="none" stroke="#22d3ee" strokeDasharray="6 4" />
              )}
              {selectedId === s.id && s.type === 'image' && (
                <rect x={s.x} y={s.y} width={s.w} height={s.h} fill="none" stroke="#22d3ee" strokeDasharray="6 4" />
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
