import { useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

// ─── Color utilities ───
function colorDist(a: number[], b: number[]) {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
}

function kMeans(pixels: number[][], k: number, iterations = 12): number[][] {
  if (pixels.length === 0) return [];
  // seed centroids evenly from the pixel list
  const step = Math.max(1, Math.floor(pixels.length / k));
  let centroids = Array.from({ length: k }, (_, i) => [...pixels[i * step]]);

  for (let iter = 0; iter < iterations; iter++) {
    const clusters: number[][][] = Array.from({ length: k }, () => []);
    for (const px of pixels) {
      let best = 0, bestDist = Infinity;
      for (let i = 0; i < k; i++) {
        const d = colorDist(px, centroids[i]);
        if (d < bestDist) { bestDist = d; best = i; }
      }
      clusters[best].push(px);
    }
    centroids = clusters.map((cluster, i) => {
      if (cluster.length === 0) return centroids[i];
      const sum = cluster.reduce((acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]], [0, 0, 0]);
      return [Math.round(sum[0] / cluster.length), Math.round(sum[1] / cluster.length), Math.round(sum[2] / cluster.length)];
    });
  }
  return centroids;
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function isLight(r: number, g: number, b: number) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

function extractFromCanvas(canvas: HTMLCanvasElement, count: number): { hex: string; rgb: string; hsl: string }[] {
  const ctx = canvas.getContext('2d')!;
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  const pixels: number[][] = [];
  const sampleEvery = Math.max(1, Math.floor((data.length / 4) / 2000));
  for (let i = 0; i < data.length; i += 4 * sampleEvery) {
    const a = data[i + 3];
    if (a > 100) pixels.push([data[i], data[i + 1], data[i + 2]]);
  }

  const centroids = kMeans(pixels, count);
  // sort by luminance (dark to light)
  centroids.sort((a, b) => (0.299 * a[0] + 0.587 * a[1] + 0.114 * a[2]) - (0.299 * b[0] + 0.587 * b[1] + 0.114 * b[2]));

  return centroids.map(([r, g, b]) => ({
    hex: rgbToHex(r, g, b),
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: rgbToHsl(r, g, b),
  }));
}

// ─── Component ───
type ColorEntry = { hex: string; rgb: string; hsl: string };
type CopyTarget = { id: string; field: string };

const COLOR_COUNTS = [4, 6, 8, 10, 12];

export default function ColorPickerFromImage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [colors, setColors] = useState<ColorEntry[]>([]);
  const [count, setCount] = useState(8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDrag, setIsDrag] = useState(false);
  const [copied, setCopied] = useState<CopyTarget | null>(null);
  const [sourceCanvas, setSourceCanvas] = useState<HTMLCanvasElement | null>(null);

  const processImage = (file: File) => {
    setError('');
    const url = URL.createObjectURL(file);
    setPreview(url);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX = 400;
      const scale = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight));
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      setSourceCanvas(canvas);
      setColors(extractFromCanvas(canvas, count));
      setLoading(false);
    };
    img.onerror = () => { setError('Failed to load image.'); setLoading(false); };
    img.src = url;
  };

  const processPDF = async (file: File) => {
    setError('');
    setLoading(true);
    try {
      const buf = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise;
      setPreview(canvas.toDataURL());
      setSourceCanvas(canvas);
      setColors(extractFromCanvas(canvas, count));
    } catch {
      setError('Could not extract colors from PDF.');
    }
    setLoading(false);
  };

  const handleFile = (file: File) => {
    setLoading(true);
    setColors([]);
    if (file.type.includes('pdf') || file.name.endsWith('.pdf')) {
      processPDF(file);
    } else if (file.type.startsWith('image/')) {
      processImage(file);
    } else {
      setError('Please upload an image (PNG, JPG, WebP) or a PDF file.');
      setLoading(false);
    }
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDrag(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }, [count]);

  const reExtract = (newCount: number) => {
    setCount(newCount);
    if (sourceCanvas) setColors(extractFromCanvas(sourceCanvas, newCount));
  };

  const copy = (id: string, field: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied({ id, field });
    setTimeout(() => setCopied(null), 1500);
  };

  const isCopied = (id: string, field: string) => copied?.id === id && copied?.field === field;

  if (!preview) {
    return (
      <label
        className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-10 cursor-pointer transition-colors ${isDrag ? 'border-brand-500 bg-brand-500/5' : 'border-surface-200 dark:border-surface-700 hover:border-brand-400'}`}
        onDragOver={e => { e.preventDefault(); setIsDrag(true); }}
        onDragLeave={() => setIsDrag(false)}
        onDrop={onDrop}
      >
        <span className="text-3xl">🎨</span>
        <div className="text-center">
          <p className="text-sm font-bold text-surface-700 dark:text-surface-300">Drop a file or click to upload</p>
          <p className="text-xs text-surface-400 mt-0.5">Images (PNG, JPG, WebP) and PDFs supported</p>
        </div>
        <input type="file" accept="image/*,.pdf,application/pdf" className="hidden" onChange={onFile} />
      </label>
    );
  }

  return (
    <div className="space-y-4">
      {/* Preview + controls */}
      <div className="flex gap-3 items-start">
        <div className="relative flex-shrink-0">
          <img src={preview} alt="Source" className="w-24 h-24 object-cover rounded-lg border border-surface-200 dark:border-surface-700" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-surface-500">Colors:</span>
            {COLOR_COUNTS.map(n => (
              <button
                key={n}
                onClick={() => reExtract(n)}
                className={`w-7 h-7 text-xs rounded-md font-bold transition-colors ${count === n ? 'bg-brand-500 text-white' : 'bg-surface-100 dark:bg-surface-800 text-surface-500 hover:text-brand-500'}`}
              >
                {n}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs text-brand-500 hover:text-brand-600 transition-colors">
            <span>Upload another</span>
            <input type="file" accept="image/*,.pdf,application/pdf" className="hidden" onChange={onFile} />
          </label>
        </div>
      </div>

      {error && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{error}</p>}

      {loading && (
        <div className="flex items-center gap-2 text-xs text-surface-400 py-4 justify-center">
          <span className="animate-spin">⏳</span> Extracting colors...
        </div>
      )}

      {/* Palette grid */}
      {colors.length > 0 && (
        <>
          {/* Swatch row */}
          <div className="flex rounded-xl overflow-hidden h-14 border border-surface-200 dark:border-surface-700">
            {colors.map(c => (
              <div
                key={c.hex}
                className="flex-1 cursor-pointer hover:flex-[2] transition-all duration-200"
                style={{ backgroundColor: c.hex }}
                title={c.hex}
                onClick={() => copy(c.hex, 'hex', c.hex)}
              />
            ))}
          </div>

          {/* Color cards */}
          <div className="grid grid-cols-2 gap-2">
            {colors.map(c => {
              const light = isLight(
                parseInt(c.hex.slice(1, 3), 16),
                parseInt(c.hex.slice(3, 5), 16),
                parseInt(c.hex.slice(5, 7), 16)
              );
              return (
                <div key={c.hex} className="rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700">
                  {/* Color preview */}
                  <div
                    className="h-12 flex items-center justify-center cursor-pointer group"
                    style={{ backgroundColor: c.hex }}
                    onClick={() => copy(c.hex, 'hex', c.hex)}
                  >
                    <span className={`text-sm font-bold font-mono opacity-0 group-hover:opacity-100 transition-opacity ${light ? 'text-black/60' : 'text-white/80'}`}>
                      {isCopied(c.hex, 'hex') ? '✓' : c.hex.toUpperCase()}
                    </span>
                  </div>
                  {/* Values */}
                  <div className="bg-surface-50 dark:bg-surface-900 p-2 space-y-1">
                    {([['HEX', c.hex.toUpperCase(), 'hex'], ['RGB', c.rgb, 'rgb'], ['HSL', c.hsl, 'hsl']] as [string, string, string][]).map(([label, value, field]) => (
                      <button
                        key={field}
                        className="w-full flex items-center justify-between gap-1 text-left group/row"
                        onClick={() => copy(c.hex, field, value)}
                      >
                        <span className="text-[9px] font-bold text-surface-400 w-6 flex-shrink-0">{label}</span>
                        <span className="text-[10px] font-mono text-surface-600 dark:text-surface-400 truncate flex-1">{value}</span>
                        <span className="text-[9px] text-surface-300 dark:text-surface-600 group-hover/row:text-brand-400 transition-colors flex-shrink-0">
                          {isCopied(c.hex, field) ? '✓' : 'copy'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Export all hex codes */}
          <button
            onClick={() => copy('all', 'hex', colors.map(c => c.hex.toUpperCase()).join(', '))}
            className="w-full py-2 text-xs text-surface-500 hover:text-brand-500 border border-surface-200 dark:border-surface-700 rounded-lg transition-colors"
          >
            {isCopied('all', 'hex') ? '✓ Copied all HEX codes' : 'Copy all HEX codes'}
          </button>
        </>
      )}

      <p className="text-[11px] text-surface-400">Colors are extracted using k-means clustering. Your file never leaves your browser.</p>
    </div>
  );
}
