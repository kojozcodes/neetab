import { useState, useCallback, useRef } from 'react';
import { Select } from '../../components/ui/FormControls';
import { FileUpload, DownloadButton } from '../../components/ui/FileComponents';
import { ShieldIcon } from '../../components/ui/Icons';
import ResultBox from '../../components/ui/ResultBox';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function WordToPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [method, setMethod] = useState<'server' | 'client' | null>(null);
  const [error, setError] = useState('');
  const [pageSize, setPageSize] = useState('a4');
  const [orientation, setOrientation] = useState('portrait');
  const [htmlContent, setHtmlContent] = useState('');
  const renderRef = useRef<HTMLDivElement>(null);

  // Server-side conversion (LibreOffice — near-perfect quality)
  const convertWithServer = async (f: File): Promise<Blob | null> => {
    try {
      setProgress(30);
      const formData = new FormData();
      formData.append('file', f);
      const res = await fetch(`${API_URL}/api/convert/word-to-pdf`, {
        method: 'POST',
        body: formData,
      });
      setProgress(80);
      if (!res.ok) return null;
      const blob = await res.blob();
      // Verify it's a PDF (starts with %PDF)
      const header = new Uint8Array(await blob.slice(0, 5).arrayBuffer());
      const str = String.fromCharCode(...header);
      if (str.startsWith('%PDF')) return blob;
      return null;
    } catch {
      return null;
    }
  };

  // Client-side fallback (mammoth + html2canvas + jsPDF)
  const convertClientSide = async (f: File): Promise<Blob | null> => {
    try {
      const [mammoth, { jsPDF }, html2canvas] = await Promise.all([
        import('mammoth'),
        import('jspdf'),
        import('html2canvas'),
      ]);
      setProgress(30);

      const buf = await f.arrayBuffer();
      const result = await mammoth.default.convertToHtml({ arrayBuffer: buf });
      setHtmlContent(result.value);
      setProgress(50);

      // Wait for DOM render
      await new Promise(r => setTimeout(r, 500));
      const el = renderRef.current;
      if (!el) return null;

      const canvas = await html2canvas.default(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      setProgress(75);

      const pdf = new jsPDF({ orientation: orientation as any, format: pageSize, unit: 'mm' });
      const pw = pdf.internal.pageSize.getWidth();
      const ph = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const usableW = pw - margin * 2;
      const usableH = ph - margin * 2;
      const ratio = usableW / canvas.width;
      const pageHeightPx = usableH / ratio;
      const totalPages = Math.ceil(canvas.height / pageHeightPx);

      for (let i = 0; i < totalPages; i++) {
        if (i > 0) pdf.addPage(pageSize as any, orientation as any);
        const srcY = i * pageHeightPx;
        const srcH = Math.min(pageHeightPx, canvas.height - srcY);
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width; sliceCanvas.height = srcH;
        sliceCanvas.getContext('2d')!.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);
        pdf.addImage(sliceCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', margin, margin, usableW, srcH * ratio);
      }
      setProgress(95);
      return pdf.output('blob');
    } catch {
      return null;
    }
  };

  const processFile = useCallback(async (files: File[]) => {
    const f = files[0]; if (!f) return;
    setFile(f); setPdfBlob(null); setLoading(true); setProgress(0); setError(''); setMethod(null); setHtmlContent('');

    setProgress(10);
    const serverBlob = await convertWithServer(f);

    if (serverBlob) {
      setMethod('server');
      setProgress(100);
      setPdfBlob(serverBlob);
      setLoading(false);
      return;
    }

    setMethod('client');
    setProgress(20);
    const clientBlob = await convertClientSide(f);

    if (clientBlob) {
      setProgress(100);
      setPdfBlob(clientBlob);
    } else {
      setError('Failed to convert. Make sure it\'s a valid .docx file.');
    }
    setLoading(false);
  }, [pageSize, orientation]);

  return (
    <div>
      {!pdfBlob && !loading && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-xs text-surface-600 dark:text-surface-400 mb-4">
          <ShieldIcon />
          <span>
            <strong className="text-surface-700 dark:text-surface-300">High-quality conversion:</strong> Server-powered via LibreOffice for near-perfect PDF output. Client-side fallback available.
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2.5 mb-3.5">
        <Select label="Page Size" value={pageSize} onChange={setPageSize} options={[{ value: 'a4', label: 'A4' }, { value: 'letter', label: 'Letter' }]} />
        <Select label="Orientation" value={orientation} onChange={setOrientation} options={[{ value: 'portrait', label: 'Portrait' }, { value: 'landscape', label: 'Landscape' }]} />
      </div>

      <FileUpload accept=".docx,.doc" onFiles={processFile} label="Drop a Word document here" icon="📝" />

      {loading && (
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-xs font-semibold text-surface-600 dark:text-surface-500">
              {method === 'server' ? 'Converting on server...' : method === 'client' ? 'Converting in browser...' : 'Connecting to server...'}
            </span>
            <span className="text-xs font-bold text-brand-500">{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-surface-200 dark:bg-surface-800 overflow-hidden">
            <div className="h-full bg-brand-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Hidden render area for client-side fallback */}
      {htmlContent && (
        <div className="absolute -left-[9999px] top-0">
          <div ref={renderRef} style={{ width: 680, padding: 40, background: '#fff', fontFamily: 'Calibri,Arial,sans-serif', fontSize: '11pt', lineHeight: 1.6, color: '#1a1a1a' }}
            dangerouslySetInnerHTML={{ __html: `<style>h1{font-size:20pt;font-weight:bold;margin:16px 0 8px;}h2{font-size:16pt;font-weight:bold;margin:14px 0 6px;}h3{font-size:13pt;font-weight:bold;margin:12px 0 4px;}p{margin:0 0 8px;}table{border-collapse:collapse;width:100%;margin:8px 0;}td,th{border:1px solid #ccc;padding:6px 8px;}img{max-width:100%;}</style>${htmlContent}` }} />
        </div>
      )}

      {pdfBlob && (
        <div>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs mb-4 ${
            method === 'server'
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
              : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
          }`}>
            {method === 'server' ? '✅' : '⚠️'}
            <span>
              {method === 'server'
                ? <><strong>Server conversion</strong> — Converted via LibreOffice. Fonts, tables, and formatting preserved.</>
                : <><strong>Client-side conversion</strong> — Rendered from HTML. Some formatting may differ from the original.</>
              }
            </span>
          </div>

          <ResultBox label="PDF Size" value={`${(pdfBlob.size / 1024).toFixed(0)}KB`} copyable={false} large={false} />
          <DownloadButton blob={pdfBlob} filename={`${file!.name.replace(/\.(docx?|doc)$/i, '')}.pdf`} label="⬇ Download PDF" />
        </div>
      )}

      {error && <div className="text-center py-5 text-red-500 text-sm">{error}</div>}
    </div>
  );
}
