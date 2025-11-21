import React, { useMemo, useState } from 'react'
import { Palette, Type, Image as ImageIcon, Grid as GridIcon, Download } from 'lucide-react'
import Canvas from './components/Canvas'
import ColorPicker from './components/ColorPicker'
import ShapeGallery from './components/ShapeGallery'

function App() {
  const [bg, setBg] = useState('#0f172a')
  const [accent, setAccent] = useState('#38bdf8')
  const [textColor, setTextColor] = useState('#e2e8f0')
  const [title, setTitle] = useState('Başlık')
  const [subtitle, setSubtitle] = useState('Açıklama metni buraya gelecek. Türkçe karakter desteği: ğüşiöç ĞÜŞİÖÇ')
  const [shapes, setShapes] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [showGrid, setShowGrid] = useState(true)
  const [imageUrl, setImageUrl] = useState('')

  const toolbar = useMemo(() => (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <ColorPicker label="Arka Plan" value={bg} onChange={setBg} />
        <ColorPicker label="Vurgu Rengi" value={accent} onChange={setAccent} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ColorPicker label="Yazı Rengi" value={textColor} onChange={setTextColor} />
        <label className="flex items-center gap-3 text-sm text-slate-100">
          <GridIcon size={18} />
          Izgarayı Göster
          <input type="checkbox" className="ml-auto" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} />
        </label>
      </div>

      <div className="space-y-2">
        <label className="block text-xs text-slate-300">Başlık</label>
        <input value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full rounded bg-slate-700/60 border border-white/10 px-3 py-2 text-slate-100" />
        <label className="block text-xs text-slate-300 mt-2">Alt Başlık</label>
        <textarea value={subtitle} onChange={(e)=>setSubtitle(e.target.value)} className="w-full rounded bg-slate-700/60 border border-white/10 px-3 py-2 text-slate-100" rows={3} />
      </div>

      <div className="space-y-2">
        <span className="text-sm text-slate-100 flex items-center gap-2"><ImageIcon size={18}/>Resim Ekle (URL)</span>
        <div className="flex gap-2">
          <input value={imageUrl} onChange={(e)=>setImageUrl(e.target.value)} placeholder="https://..." className="flex-1 rounded bg-slate-700/60 border border-white/10 px-3 py-2 text-slate-100" />
          <button onClick={()=>{
            if(!imageUrl) return;
            setShapes(s=>[...s,{ id: Math.random().toString(36).slice(2,9), type:'image', x:80, y:120, w:240, h:160, url:imageUrl }])
            setImageUrl('')
          }} className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white">Ekle</button>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-sm text-slate-100 flex items-center gap-2"><Palette size={18}/>Şekiller</span>
        <ShapeGallery onAdd={(t)=>setShapes(s=>[...s,{ id: Math.random().toString(36).slice(2,9), type:t, x:120, y:140, w:160, h:120, r:12, fill:accent, stroke:'#ffffff'}])} />
      </div>
    </div>
  ), [bg, accent, textColor, title, subtitle, showGrid, imageUrl])

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="grid grid-cols-12 gap-0 h-screen">
        <aside className="col-span-4 md:col-span-3 lg:col-span-3 xl:col-span-2 p-4 border-r border-white/10 bg-slate-800/40 backdrop-blur-sm">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Ayarlar</h2>
              <p className="text-xs text-slate-400">Türkçe karakter desteği ile infografik oluşturun.</p>
            </div>
            {toolbar}
          </div>
        </aside>

        <main className="col-span-8 md:col-span-9 lg:col-span-9 xl:col-span-10">
          <div className="h-20 px-6 flex items-center justify-between border-b border-white/10 bg-slate-800/60">
            <div className="flex items-center gap-3">
              <Type size={18} />
              <div>
                <div className="text-xl font-bold" style={{color:textColor}}>{title}</div>
                <div className="text-sm opacity-80" style={{color:textColor}}>{subtitle}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={()=>setShapes([])} className="px-3 py-2 rounded bg-slate-700 hover:bg-slate-600">Temizle</button>
              <button onClick={()=>document.querySelector('#export-btn')?.click()} className="px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2"><Download size={16}/>Dışa Aktar</button>
            </div>
          </div>

          <div className="h-[calc(100vh-5rem)]">
            <Canvas bg={bg} shapes={shapes} setShapes={setShapes} selectedId={selectedId} setSelectedId={setSelectedId} showGrid={showGrid} />
            {/* gizli buton: Canvas içinde handle ediliyor */}
            <button id="export-btn" className="hidden" />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
