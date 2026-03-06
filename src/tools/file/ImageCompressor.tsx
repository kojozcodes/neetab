import { useState, useCallback, useEffect } from 'react';
import { Select, Slider } from '../../components/ui/FormControls';
import { FileUpload, DownloadButton, PrivacyBadge } from '../../components/ui/FileComponents';

interface OrigImage { el: HTMLImageElement; src: string; w: number; h: number; name: string; }
interface CompressResult { blob: Blob; url: string; w: number; h: number; size: number; }

export default function ImageCompressor() {
  const [origImg, setOrigImg] = useState<OrigImage | null>(null);
  const [origSize, setOrigSize] = useState(0);
  const [quality, setQuality] = useState(80);
  const [outputFormat, setOutputFormat] = useState('jpeg');
  const [result, setResult] = useState<CompressResult | null>(null);

  const loadImage = (files: File[]) => {
    const f = files[0]; if (!f?.type.startsWith('image/')) return;
    setOrigSize(f.size); setResult(null);
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => setOrigImg({ el: img, src: reader.result as string, w: img.width, h: img.height, name: f.name });
      img.src = reader.result as string;
    };
    reader.readAsDataURL(f);
  };

  const compress = useCallback(() => {
    if (!origImg) return;
    const canvas = document.createElement('canvas');
    const w = origImg.w, h = origImg.h;
    canvas.width = w; canvas.height = h;
    canvas.getContext('2d')!.drawImage(origImg.el, 0, 0, w, h);
    canvas.toBlob(blob => {
      if (!blob) return;
      // Revoke previous ObjectURL to prevent memory leak
      if (result?.url) URL.revokeObjectURL(result.url);
      setResult({ blob, url: URL.createObjectURL(blob), w, h, size: blob.size });
    }, outputFormat === 'png' ? 'image/png' : 'image/jpeg', quality / 100);
  }, [origImg, quality, outputFormat]);

  useEffect(() => { if (origImg) compress(); }, [compress, origImg]);

  const savings = result ? Math.round((1 - result.size / origSize) * 100) : 0;

  return (
    <div>
      {!origImg && (
        <>
          <FileUpload accept="image/*" onFiles={loadImage} label="Drop an image here" icon="🖼️" />
          <PrivacyBadge />
        </>
      )}

      {origImg && (
        <div>
          {/* Controls */}
          <Select label="Format" value={outputFormat} onChange={setOutputFormat} options={[
            { value: 'jpeg', label: 'JPEG' }, { value: 'png', label: 'PNG' },
          ]} />
          {outputFormat === 'jpeg' && <Slider label="Quality" value={quality} onChange={setQuality} min={10} max={100} suffix="%" />}
          {outputFormat === 'png' && (
            <div className="text-[11px] text-surface-500 dark:text-surface-400 mb-3 px-1">
              PNG is lossless — file size won't shrink much. Switch to JPEG for smaller files.
            </div>
          )}

          {/* Compact before/after */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700">
              <img src={origImg.src} alt="Original" className="w-full block max-h-48 object-cover" />
              <div className="py-1.5 px-2 text-[10px] text-surface-500 text-center bg-surface-100 dark:bg-surface-800">
                {origImg.w}×{origImg.h} • {(origSize / 1024).toFixed(0)}KB
              </div>
            </div>
            {result && (
              <div className="rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700">
                <img src={result.url} alt="Compressed" className="w-full block max-h-48 object-cover" />
                <div className="py-1.5 px-2 text-[10px] text-surface-500 text-center bg-surface-100 dark:bg-surface-800">
                  {result.w}×{result.h} • {(result.size / 1024).toFixed(0)}KB
                </div>
              </div>
            )}
          </div>

          {/* Savings + Download */}
          {result && (
            <div>
              <div className="flex items-center justify-center gap-3 mb-1">
                <span className={`text-2xl font-display font-bold ${savings > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {savings > 0 ? `-${savings}%` : `+${Math.abs(savings)}%`}
                </span>
                <span className="text-xs text-surface-500">{(origSize / 1024).toFixed(0)}KB → {(result.size / 1024).toFixed(0)}KB</span>
              </div>
              <DownloadButton blob={result.blob} filename={`compressed-${origImg.name.replace(/\.[^.]+$/, '')}.${outputFormat}`} label="Download Compressed Image" />
              <button onClick={() => { if (result?.url) URL.revokeObjectURL(result.url); setOrigImg(null); setResult(null); }}
                className="w-full mt-1.5 py-1.5 text-[11px] font-semibold text-surface-400 hover:text-brand-500 transition-colors">
                Compress another image
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
