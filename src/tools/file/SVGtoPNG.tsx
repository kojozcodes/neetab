import { useState, useCallback } from 'react';

export default function SVGtoPNG() {
  const [svg, setSvg] = useState<{ content: string; name: string; viewW: number; viewH: number } | null>(null);
  const [scale, setScale] = useState(2);
  const [isDrag, setIsDrag] = useState(false);
  const [converting, setConverting] = useState(false);

  const loadSVG = (file: File) => {
    if (!file.name.endsWith('.svg') && file.type !== 'image/svg+xml') return;
    const reader = new FileReader();
    reader.onload = e => {
      const content = e.target?.result as string;
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'image/svg+xml');
      const svgEl = doc.querySelector('svg');
      const vb = svgEl?.getAttribute('viewBox')?.split(/\s+/).map(Number);
      const w = vb ? vb[2] : parseInt(svgEl?.getAttribute('width') || '512') || 512;
      const h = vb ? vb[3] : parseInt(svgEl?.getAttribute('height') || '512') || 512;
      setSvg({ content, name: file.name, viewW: w, viewH: h });
    };
    reader.readAsText(file);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) loadSVG(e.target.files[0]);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDrag(false);
    if (e.dataTransfer.files?.[0]) loadSVG(e.dataTransfer.files[0]);
  }, []);

  const convert = () => {
    if (!svg) return;
    setConverting(true);
    const w = Math.round(svg.viewW * scale);
    const h = Math.round(svg.viewH * scale);

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    const blob = new Blob([svg.content], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      canvas.toBlob(pngBlob => {
        if (!pngBlob) return;
        const a = document.createElement('a');
        a.href = URL.createObjectURL(pngBlob);
        a.download = svg.name.replace(/\.svg$/i, `.png`);
        a.click();
        setConverting(false);
      }, 'image/png');
    };
    img.onerror = () => { URL.revokeObjectURL(url); setConverting(false); };
    img.src = url;
  };

  const outW = svg ? Math.round(svg.viewW * scale) : 0;
  const outH = svg ? Math.round(svg.viewH * scale) : 0;

  if (!svg) {
    return (
      <label
        className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-10 cursor-pointer transition-colors ${isDrag ? 'border-brand-500 bg-brand-500/5' : 'border-surface-200 dark:border-surface-700 hover:border-brand-400'}`}
        onDragOver={e => { e.preventDefault(); setIsDrag(true); }}
        onDragLeave={() => setIsDrag(false)}
        onDrop={onDrop}
      >
        <span className="text-3xl">📐</span>
        <div className="text-center">
          <p className="text-sm font-bold text-surface-700 dark:text-surface-300">Drop SVG or click to upload</p>
          <p className="text-xs text-surface-400 mt-0.5">SVG files only</p>
        </div>
        <input type="file" accept=".svg,image/svg+xml" className="hidden" onChange={onFile} />
      </label>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-100 dark:bg-surface-800">
        <div className="w-12 h-12 rounded bg-white dark:bg-surface-700 flex items-center justify-center overflow-hidden p-1">
          <img src={`data:image/svg+xml,${encodeURIComponent(svg.content)}`} alt="" className="w-full h-full object-contain" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-surface-700 dark:text-surface-300 truncate">{svg.name}</p>
          <p className="text-[11px] text-surface-400">Source: {svg.viewW} × {svg.viewH}</p>
        </div>
        <button onClick={() => setSvg(null)} className="text-xs text-surface-400 hover:text-red-400 transition-colors">✕</button>
      </div>

      <div>
        <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1">
          Scale: {scale}× → {outW} × {outH} px
        </label>
        <input type="range" min="0.5" max="8" step="0.5" value={scale} onChange={e => setScale(Number(e.target.value))}
          className="w-full accent-brand-500" />
        <div className="flex justify-between text-[10px] text-surface-400 mt-0.5">
          <span>0.5×</span><span>2×</span><span>4×</span><span>8×</span>
        </div>
      </div>

      <button
        onClick={convert}
        disabled={converting}
        className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white text-sm font-bold rounded-lg transition-colors"
      >
        {converting ? 'Converting...' : `Export as PNG (${outW}×${outH})`}
      </button>
    </div>
  );
}
