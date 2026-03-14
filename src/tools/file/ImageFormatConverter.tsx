import { useState, useRef, useCallback } from 'react';

type Format = 'image/jpeg' | 'image/png' | 'image/webp';
const FORMAT_LABELS: Record<Format, string> = {
  'image/jpeg': 'JPG',
  'image/png': 'PNG',
  'image/webp': 'WebP',
};

interface ConvertedFile {
  name: string;
  url: string;
  size: number;
  originalSize: number;
}

export default function ImageFormatConverter() {
  const [format, setFormat] = useState<Format>('image/jpeg');
  const [quality, setQuality] = useState(92);
  const [dragging, setDragging] = useState(false);
  const [results, setResults] = useState<ConvertedFile[]>([]);
  const [converting, setConverting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const convertFile = (file: File): Promise<ConvertedFile> =>
    new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) { reject(new Error(`${file.name} is not an image`)); return; }
      const img = new Image();
      const objUrl = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d')!;
        if (format === 'image/jpeg') {
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(objUrl);
        canvas.toBlob(blob => {
          if (!blob) { reject(new Error('Conversion failed')); return; }
          const ext = FORMAT_LABELS[format].toLowerCase();
          const baseName = file.name.replace(/\.[^.]+$/, '');
          resolve({
            name: `${baseName}.${ext}`,
            url: URL.createObjectURL(blob),
            size: blob.size,
            originalSize: file.size,
          });
        }, format, format === 'image/png' ? undefined : quality / 100);
      };
      img.onerror = () => { URL.revokeObjectURL(objUrl); reject(new Error(`Failed to load ${file.name}`)); };
      img.src = objUrl;
    });

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setConverting(true);
    setResults([]);
    const images = Array.from(files).filter(f => f.type.startsWith('image/'));
    const converted = await Promise.allSettled(images.map(convertFile));
    const ok = converted
      .filter((r): r is PromiseFulfilledResult<ConvertedFile> => r.status === 'fulfilled')
      .map(r => r.value);
    setResults(ok);
    setConverting(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [format, quality]);

  const fmt = (n: number) => n < 1024 * 1024 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1024 / 1024).toFixed(2)} MB`;

  const downloadAll = () => {
    results.forEach(r => {
      const a = Object.assign(document.createElement('a'), { href: r.url, download: r.name });
      a.click();
    });
  };

  const reset = () => { results.forEach(r => URL.revokeObjectURL(r.url)); setResults([]); };

  return (
    <div className="space-y-4">
      {results.length === 0 ? (
        <>
          <div className="flex flex-wrap gap-3">
            <div>
              <p className="text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">Output format</p>
              <div className="flex gap-2">
                {(Object.keys(FORMAT_LABELS) as Format[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${format === f ? 'bg-brand-500 text-white border-brand-500' : 'border-surface-300 dark:border-surface-600 text-surface-600 dark:text-surface-400 hover:border-brand-400'}`}
                  >
                    {FORMAT_LABELS[f]}
                  </button>
                ))}
              </div>
            </div>
            {format !== 'image/png' && (
              <div className="flex-1 min-w-48">
                <p className="text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">
                  Quality: <span className="text-brand-500">{quality}%</span>
                </p>
                <input
                  type="range" min={10} max={100} value={quality}
                  onChange={e => setQuality(Number(e.target.value))}
                  className="w-full accent-brand-500"
                />
              </div>
            )}
          </div>

          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
            className={`flex flex-col items-center justify-center gap-2 p-10 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${dragging ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/20' : 'border-surface-300 dark:border-surface-700 hover:border-brand-400 bg-surface-50 dark:bg-surface-900'}`}
          >
            <span className="text-2xl">🖼️</span>
            <p className="text-sm font-semibold text-surface-600 dark:text-surface-400">
              {converting ? 'Converting...' : 'Drop images here or click to upload'}
            </p>
            <p className="text-xs text-surface-400">JPG, PNG, WebP, GIF, BMP - multiple files supported</p>
            <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
          </div>

          <p className="text-xs text-surface-400 text-center">Images are converted in your browser - nothing is uploaded.</p>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-surface-600 dark:text-surface-400">
              {results.length} file{results.length !== 1 ? 's' : ''} converted to {FORMAT_LABELS[format]}
            </p>
            <div className="flex gap-2">
              {results.length > 1 && (
                <button onClick={downloadAll} className="text-xs px-2.5 py-1 bg-brand-500 text-white rounded-md hover:bg-brand-600 transition-colors">
                  Download All
                </button>
              )}
              <button onClick={reset} className="text-xs text-surface-500 hover:text-brand-500 transition-colors">
                Convert more
              </button>
            </div>
          </div>

          <div className="divide-y divide-surface-100 dark:divide-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
            {results.map((r, i) => {
              const saved = r.originalSize - r.size;
              const pct = Math.round((saved / r.originalSize) * 100);
              return (
                <div key={i} className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-900">
                  <div className="min-w-0 mr-3">
                    <p className="text-xs font-medium text-surface-700 dark:text-surface-300 truncate">{r.name}</p>
                    <p className="text-xs text-surface-400 mt-0.5">
                      {fmt(r.originalSize)} - {fmt(r.size)}
                      {saved > 0 && <span className="text-green-500 ml-1">(-{pct}%)</span>}
                      {saved < 0 && <span className="text-amber-500 ml-1">(+{Math.abs(pct)}%)</span>}
                    </p>
                  </div>
                  <a
                    href={r.url}
                    download={r.name}
                    className="flex-shrink-0 text-xs px-2.5 py-1 bg-brand-500 text-white rounded-md hover:bg-brand-600 transition-colors"
                  >
                    Download
                  </a>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
