import { useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Select, Button } from '../../components/ui/FormControls';
import { FileUpload, PrivacyBadge } from '../../components/ui/FileComponents';
import { DownloadIcon } from '../../components/ui/Icons';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

interface PageResult {
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
  page: number;
}

export default function PDFtoImage() {
  const [pages, setPages] = useState<PageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [format, setFormat] = useState('png');
  const [scale, setScale] = useState('2');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const processFile = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f?.type.includes('pdf')) return;
    setFile(f); setPages([]); setError('');
    setLoading(true);
    setProgress(0);

    try {
      const buf = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      const imgs: PageResult[] = [];
      const sc = parseFloat(scale);

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const vp = page.getViewport({ scale: sc });
        const canvas = document.createElement('canvas');
        canvas.width = vp.width;
        canvas.height = vp.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport: vp }).promise;

        const mime = format === 'jpg' ? 'image/jpeg' : 'image/png';
        const dataUrl = canvas.toDataURL(mime, format === 'jpg' ? 0.92 : undefined);
        const res = await fetch(dataUrl);
        const blob = await res.blob();

        imgs.push({ dataUrl, blob, width: Math.round(vp.width), height: Math.round(vp.height), page: i });
        setProgress(Math.round((i / pdf.numPages) * 100));
      }
      setPages(imgs);
    } catch {
      setError('Failed to convert. Make sure this is a valid PDF file.');
    }
    setLoading(false);
  }, [format, scale]);

  const downloadAll = () => {
    pages.forEach((p, i) => {
      const a = document.createElement('a');
      a.href = p.dataUrl;
      a.download = `page-${i + 1}.${format}`;
      a.click();
    });
  };

  const reset = () => {
    setFile(null); setPages([]); setLoading(false); setProgress(0); setError('');
  };

  return (
    <div>
      {!loading && pages.length === 0 && !error && (
        <>
          <PrivacyBadge />
          <div className="grid grid-cols-2 gap-2.5 mb-3.5">
            <Select label="Format" value={format} onChange={setFormat} options={[
              { value: 'png', label: 'PNG (lossless)' }, { value: 'jpg', label: 'JPG (smaller)' },
            ]} />
            <Select label="Resolution" value={scale} onChange={setScale} options={[
              { value: '1', label: '1x (fast)' }, { value: '2', label: '2x (good)' }, { value: '3', label: '3x (HD)' },
            ]} />
          </div>

          <FileUpload accept=".pdf" onFiles={processFile} label="Drop a PDF file here" icon="📄" />
        </>
      )}

      {loading && (
        <div className="mb-4">
          {file && (
            <div className="flex items-center gap-2 mb-2 text-xs text-surface-600 dark:text-surface-400">
              <span className="font-medium truncate">{file.name}</span>
              <span className="text-surface-500 shrink-0">({(file.size / 1024).toFixed(0)} KB)</span>
            </div>
          )}
          <div className="flex justify-between mb-1">
            <span className="text-xs font-semibold text-surface-600 dark:text-surface-500">Converting...</span>
            <span className="text-xs font-bold text-brand-500">{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-surface-200 dark:bg-surface-800 overflow-hidden">
            <div className="h-full bg-brand-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {pages.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-surface-900 dark:text-surface-100">{pages.length} page{pages.length > 1 ? 's' : ''} converted</span>
            {pages.length > 1 && (
              <Button variant="secondary" onClick={downloadAll} className="!py-2 !px-3 !text-xs"><DownloadIcon /> Download All</Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {pages.map((p, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
                <img src={p.dataUrl} alt={`Page ${i + 1}`} className="w-full block" />
                <div className="p-2 flex justify-between items-center">
                  <span className="text-[11px] text-surface-500">Page {i + 1} • {p.width}×{p.height}</span>
                  <button onClick={() => { const a = document.createElement('a'); a.href = p.dataUrl; a.download = `page-${i + 1}.${format}`; a.click(); }}
                    className="bg-brand-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-md"><DownloadIcon /></button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={reset}
            className="w-full mt-3 py-2.5 px-4 rounded-xl text-sm font-semibold
                       text-surface-600 dark:text-surface-400
                       border border-surface-300 dark:border-surface-700
                       hover:border-brand-400 hover:text-brand-500
                       transition-colors duration-150"
          >
            Convert another PDF
          </button>
        </div>
      )}

      {error && (
        <div className="text-center py-5">
          <p className="text-red-500 text-sm mb-3">{error}</p>
          <button
            onClick={reset}
            className="text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors"
          >
            Try another file
          </button>
        </div>
      )}
    </div>
  );
}
