import { useState, useRef, useCallback } from 'react';

export default function ImageResizer() {
  const [original, setOriginal] = useState<{ url: string; w: number; h: number; name: string } | null>(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [lockRatio, setLockRatio] = useState(true);
  const [format, setFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [quality, setQuality] = useState(90);
  const [isDrag, setIsDrag] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadImage = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setOriginal({ url, w: img.naturalWidth, h: img.naturalHeight, name: file.name });
      setWidth(String(img.naturalWidth));
      setHeight(String(img.naturalHeight));
    };
    img.src = url;
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) loadImage(e.target.files[0]);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDrag(false);
    if (e.dataTransfer.files?.[0]) loadImage(e.dataTransfer.files[0]);
  }, []);

  const handleWidth = (v: string) => {
    setWidth(v);
    if (lockRatio && original && v) {
      setHeight(String(Math.round((parseInt(v) / original.w) * original.h)));
    }
  };

  const handleHeight = (v: string) => {
    setHeight(v);
    if (lockRatio && original && v) {
      setWidth(String(Math.round((parseInt(v) / original.h) * original.w)));
    }
  };

  const resize = () => {
    if (!original || !width || !height) return;
    const w = parseInt(width);
    const h = parseInt(height);
    if (!w || !h) return;

    const canvas = canvasRef.current!;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, w, h);
      const ext = format === 'image/png' ? 'png' : format === 'image/webp' ? 'webp' : 'jpg';
      const baseName = original.name.replace(/\.[^.]+$/, '');
      canvas.toBlob(blob => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${baseName}-${w}x${h}.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
      }, format, quality / 100);
    };
    img.src = original.url;
  };

  if (!original) {
    return (
      <label
        className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-10 cursor-pointer transition-colors ${isDrag ? 'border-brand-500 bg-brand-500/5' : 'border-surface-200 dark:border-surface-700 hover:border-brand-400'}`}
        onDragOver={e => { e.preventDefault(); setIsDrag(true); }}
        onDragLeave={() => setIsDrag(false)}
        onDrop={onDrop}
      >
        <span className="text-3xl">🖼️</span>
        <div className="text-center">
          <p className="text-sm font-bold text-surface-700 dark:text-surface-300">Drop image or click to upload</p>
          <p className="text-xs text-surface-400 mt-0.5">PNG, JPG, WebP supported</p>
        </div>
        <input type="file" accept="image/*" className="hidden" onChange={onFile} />
      </label>
    );
  }

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-100 dark:bg-surface-800">
        <img src={original.url} alt="" className="w-12 h-12 object-cover rounded" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-surface-700 dark:text-surface-300 truncate">{original.name}</p>
          <p className="text-[11px] text-surface-400">{original.w} × {original.h} px</p>
        </div>
        <button onClick={() => setOriginal(null)} className="text-xs text-surface-400 hover:text-red-400 transition-colors">✕</button>
      </div>

      <div className="space-y-3">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1">Width (px)</label>
            <input type="number" min="1" value={width} onChange={e => handleWidth(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40" />
          </div>
          <button
            onClick={() => setLockRatio(!lockRatio)}
            className={`pb-1 text-sm transition-colors ${lockRatio ? 'text-brand-500' : 'text-surface-400'}`}
            title={lockRatio ? 'Lock ratio on' : 'Lock ratio off'}
          >
            {lockRatio ? '🔒' : '🔓'}
          </button>
          <div className="flex-1">
            <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1">Height (px)</label>
            <input type="number" min="1" value={height} onChange={e => handleHeight(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40" />
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1">Format</label>
            <select value={format} onChange={e => setFormat(e.target.value as typeof format)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40">
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG</option>
              <option value="image/webp">WebP</option>
            </select>
          </div>
          {format !== 'image/png' && (
            <div className="flex-1">
              <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1">Quality: {quality}%</label>
              <input type="range" min="10" max="100" value={quality} onChange={e => setQuality(Number(e.target.value))}
                className="w-full accent-brand-500" />
            </div>
          )}
        </div>
      </div>

      <button
        onClick={resize}
        className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold rounded-lg transition-colors"
      >
        Resize & Download
      </button>
    </div>
  );
}
