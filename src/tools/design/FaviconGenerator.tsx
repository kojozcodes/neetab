import { useState, useCallback, useEffect, useRef } from 'react';
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
  // Ref tracks current icons for cleanup on unmount without re-running effect
  const iconsRef = useRef<GeneratedIcon[]>([]);
  iconsRef.current = icons;

  // Cleanup ObjectURLs only on unmount
  useEffect(() => {
    return () => {
      iconsRef.current.forEach(i => URL.revokeObjectURL(i.url));
    };
  }, []);

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
    // Revoke previous URLs before generating new ones
    icons.forEach(i => URL.revokeObjectURL(i.url));

    const results: GeneratedIcon[] = [];
    const sizesToGen = SIZES.filter(s => selectedSizes.includes(s.size));

    sizesToGen.forEach(s => {
      const canvas = document.createElement('canvas');
      canvas.width = s.size;
      canvas.height = s.size;
      const ctx = canvas.getContext('2d')!;
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
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                    selectedSizes.includes(s.size)
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'bg-surface-100 dark:bg-surface-800 text-surface-500 border-surface-300 dark:border-surface-700'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <FileUpload accept="image/*" onFiles={processFile} label="Drop an image or click to upload" icon="⭐" />
          <div className="text-center text-[10px] text-surface-400 mt-1">
            Upload a square PNG or SVG for best results
          </div>
        </>
      ) : (
        <>
          {/* Source info + reset */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs text-surface-500 truncate">{sourceName}</div>
            <button onClick={reset} className="text-[11px] text-brand-500 hover:text-brand-600 font-semibold">
              ← New image
            </button>
          </div>

          {/* Generated icons grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-3">
            {icons.map(icon => (
              <div key={icon.size} className="bg-surface-100 dark:bg-surface-800 rounded-xl p-2.5 text-center">
                <div className="flex items-center justify-center h-14 mb-1.5">
                  <img
                    src={icon.url}
                    alt={`${icon.label} favicon`}
                    style={{ width: Math.min(icon.size, 48), height: Math.min(icon.size, 48) }}
                    className="rounded"
                  />
                </div>
                <div className="text-[11px] font-bold text-surface-900 dark:text-surface-100">{icon.label}</div>
                <div className="text-[9px] text-surface-400 mb-1.5">{icon.use}</div>
                <button
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = icon.url;
                    a.download = `favicon-${icon.size}x${icon.size}.png`;
                    a.click();
                  }}
                  className="text-[10px] font-semibold text-brand-500 hover:text-brand-600"
                >
                  Download
                </button>
              </div>
            ))}
          </div>

          {/* Download all */}
          {icons.length > 1 && (
            <button
              onClick={downloadAll}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 mt-1 rounded-xl font-bold text-sm text-white bg-brand-500 hover:bg-brand-600 active:bg-brand-700 shadow-[0_2px_10px_rgba(255,107,53,0.3)] transition-all duration-150"
            >
              ⬇ Download All ({icons.length} icons)
            </button>
          )}
        </>
      )}
    </div>
  );
}
