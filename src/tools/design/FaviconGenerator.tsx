import { useState, useCallback } from 'react';
import { FileUpload, DownloadButton } from '../../components/ui/FileComponents';

interface FaviconSize { size: number; label: string; use: string; }

const SIZES: FaviconSize[] = [
  { size: 16, label: '16×16', use: 'Browser tab (standard)' },
  { size: 32, label: '32×32', use: 'Browser tab (retina)' },
  { size: 48, label: '48×48', use: 'Windows shortcut' },
  { size: 64, label: '64×64', use: 'Windows shortcut (hi-res)' },
  { size: 128, label: '128×128', use: 'Chrome Web Store' },
  { size: 180, label: '180×180', use: 'Apple Touch Icon' },
  { size: 192, label: '192×192', use: 'Android Chrome' },
  { size: 512, label: '512×512', use: 'PWA splash screen' },
];

interface GeneratedIcon {
  size: number;
  label: string;
  use: string;
  blob: Blob;
  url: string;
}

export default function FaviconGenerator() {
  const [source, setSource] = useState<HTMLImageElement | null>(null);
  const [sourceName, setSourceName] = useState('');
  const [icons, setIcons] = useState<GeneratedIcon[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([16, 32, 48, 180, 192, 512]);

  const processFile = useCallback((files: File[]) => {
    const f = files[0];
    if (!f?.type.startsWith('image/')) return;
    setSourceName(f.name);
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        setSource(img);
        generateIcons(img);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(f);
  }, [selectedSizes]);

  const generateIcons = (img: HTMLImageElement) => {
    const results: GeneratedIcon[] = [];
    const sizesToGen = SIZES.filter(s => selectedSizes.includes(s.size));

    sizesToGen.forEach(s => {
      const canvas = document.createElement('canvas');
      canvas.width = s.size;
      canvas.height = s.size;
      const ctx = canvas.getContext('2d')!;
      // Draw with smooth scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, s.size, s.size);

      canvas.toBlob(blob => {
        if (!blob) return;
        results.push({
          size: s.size,
          label: s.label,
          use: s.use,
          blob,
          url: URL.createObjectURL(blob),
        });
        if (results.length === sizesToGen.length) {
          setIcons(results.sort((a, b) => a.size - b.size));
        }
      }, 'image/png');
    });
  };

  const toggleSize = (size: number) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const downloadAll = () => {
    icons.forEach(icon => {
      const a = document.createElement('a');
      a.href = icon.url;
      a.download = `favicon-${icon.size}x${icon.size}.png`;
      a.click();
    });
  };

  const reset = () => {
    icons.forEach(i => URL.revokeObjectURL(i.url));
    setSource(null);
    setIcons([]);
  };

  return (
    <div>
      {!source ? (
        <>
          {/* Size selector */}
          <div className="mb-3">
            <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-2">
              Sizes to generate
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SIZES.map(s => (
                <button
                  key={s.size}
                  onClick={() => toggleSize(s.size)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-colors ${
                    selectedSizes.includes(s.size)
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
                      : 'border-surface-300 dark:border-surface-700 text-surface-500'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <FileUpload accept="image/*" onFiles={processFile} label="Drop an image (PNG, SVG, JPG)" icon="🎨" />
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-surface-900 dark:text-surface-100">
              {icons.length} favicon{icons.length !== 1 ? 's' : ''} generated
            </span>
            <div className="flex gap-2">
              {icons.length > 1 && (
                <button onClick={downloadAll} className="text-xs font-semibold text-brand-500 hover:text-brand-600">
                  ⬇ Download All
                </button>
              )}
              <button onClick={reset} className="text-xs font-semibold text-surface-400 hover:text-brand-500">
                ← New image
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {icons.map(icon => (
              <div key={icon.size} className="flex items-center gap-3 p-2.5 bg-surface-100 dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700">
                <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-700" style={{ imageRendering: icon.size <= 32 ? 'pixelated' : 'auto' }}>
                  <img src={icon.url} alt={icon.label} style={{ width: Math.min(icon.size, 48), height: Math.min(icon.size, 48) }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-surface-900 dark:text-surface-100">{icon.label}</div>
                  <div className="text-[10px] text-surface-500">{icon.use} · {(icon.blob.size / 1024).toFixed(1)}KB</div>
                </div>
                <button
                  onClick={() => { const a = document.createElement('a'); a.href = icon.url; a.download = `favicon-${icon.size}x${icon.size}.png`; a.click(); }}
                  className="bg-brand-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-md flex-shrink-0"
                >
                  ⬇
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
