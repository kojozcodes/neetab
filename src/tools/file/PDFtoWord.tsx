import { useState, useCallback } from 'react';
import { FileUpload, DownloadButton } from '../../components/ui/FileComponents';
import { ShieldIcon } from '../../components/ui/Icons';
import ResultBox from '../../components/ui/ResultBox';

const API_URL = import.meta.env.PUBLIC_API_URL || '';

export default function PDFtoWord() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; size: number } | null>(null);
  const [method, setMethod] = useState<'server' | 'client' | null>(null);
  const [error, setError] = useState('');

  // Server-side conversion (real DOCX via pdf2docx + LibreOffice)
  const convertWithServer = async (f: File): Promise<Blob | null> => {
    try {
      setProgress(30);
      const formData = new FormData();
      formData.append('file', f);
      const res = await fetch(`${API_URL}/api/convert/pdf-to-word`, {
        method: 'POST',
        body: formData,
      });
      setProgress(80);
      if (!res.ok) return null;
      const blob = await res.blob();
      // Verify it's actually a DOCX (starts with PK zip header)
      const header = new Uint8Array(await blob.slice(0, 4).arrayBuffer());
      if (header[0] === 0x50 && header[1] === 0x4B) return blob;
      return null;
    } catch {
      return null;
    }
  };

  // Client-side fallback (text extraction via pdf.js)
  const convertClientSide = async (f: File): Promise<Blob | null> => {
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      const buf = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      const allContent: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const lines: Record<number, { text: string; fontSize: number }> = {};
        textContent.items.forEach((item: any) => {
          if (!item.str?.trim() && !item.str?.includes(' ')) return;
          const y = Math.round(item.transform[5]);
          if (!lines[y]) lines[y] = { text: '', fontSize: item.height || 12 };
          if (lines[y].text) lines[y].text += ' ';
          lines[y].text += item.str;
        });
        const sorted = Object.entries(lines)
          .sort(([a], [b]) => Number(b) - Number(a))
          .map(([_, data]) => data);
        const avgFont = sorted.reduce((s, l) => s + l.fontSize, 0) / sorted.length || 12;
        const pageHtml = sorted.map(line => {
          const t = line.text.trim();
          if (!t) return '<br/>';
          if (line.fontSize > avgFont * 1.3) return `<h2 style="font-size:${Math.round(line.fontSize)}pt;font-weight:bold;margin:12pt 0 6pt;">${t}</h2>`;
          if (line.fontSize > avgFont * 1.1) return `<h3 style="font-size:${Math.round(line.fontSize)}pt;font-weight:bold;margin:10pt 0 4pt;">${t}</h3>`;
          return `<p style="margin:0 0 4pt;font-size:${Math.round(line.fontSize)}pt;line-height:1.5;">${t}</p>`;
        }).join('\n');
        allContent.push(pageHtml);
        setProgress(30 + Math.round((i / pdf.numPages) * 60));
      }
      const pageBreak = '<br clear="all" style="page-break-before:always;mso-break-type:section-break;" />';
      const body = allContent.join(pageBreak + '\n');
      const wordHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8">
<style>body{font-family:Calibri,sans-serif;font-size:11pt;line-height:1.5;margin:1in;}h2{font-family:Calibri;color:#1a1a1a;}h3{font-family:Calibri;color:#333;}p{font-family:Calibri;}@page{size:A4;margin:1in;}</style>
</head><body>${body}</body></html>`;
      return new Blob([wordHtml], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    } catch {
      return null;
    }
  };

  // Main handler: try server first, fallback to client
  const processFile = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f?.type.includes('pdf')) return;
    setFile(f); setResult(null); setLoading(true); setProgress(0); setError(''); setMethod(null);

    setProgress(10);
    const serverBlob = await convertWithServer(f);

    if (serverBlob) {
      setMethod('server');
      setProgress(100);
      setResult({ blob: serverBlob, size: serverBlob.size });
      setLoading(false);
      return;
    }

    // Fallback to client-side
    setMethod('client');
    setProgress(20);
    const clientBlob = await convertClientSide(f);

    if (clientBlob) {
      setProgress(100);
      setResult({ blob: clientBlob, size: clientBlob.size });
    } else {
      setError('Failed to convert. Make sure this is a valid PDF with selectable text.');
    }
    setLoading(false);
  }, []);

  return (
    <div>
      {!result && !loading && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-xs text-surface-600 dark:text-surface-400 mb-4">
          <ShieldIcon />
          <span>
            <strong className="text-surface-700 dark:text-surface-300">High-quality conversion:</strong> Server-powered with layout, tables & images preserved. Client-side fallback available.
          </span>
        </div>
      )}

      <FileUpload accept=".pdf" onFiles={processFile} label="Drop a PDF file here" icon="📄" />

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

      {result && (
        <div>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs mb-4 ${
            method === 'server'
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
              : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
          }`}>
            {method === 'server' ? '✅' : '⚠️'}
            <span>
              {method === 'server'
                ? <><strong>Server conversion</strong> — Full layout, tables, and images preserved. Opens perfectly in Microsoft Word.</>
                : <><strong>Client-side conversion</strong> — Text extracted successfully. Complex layouts may need adjustment in Word.</>
              }
            </span>
          </div>

          <ResultBox label="File Size" value={`${(result.size / 1024).toFixed(0)}KB`} copyable={false} large={false} />
          <DownloadButton blob={result.blob} filename={`${file!.name.replace(/\.pdf$/i, '')}.docx`} label="⬇ Download Word Document" />
        </div>
      )}

      {error && <div className="text-center py-5 text-red-500 text-sm">{error}</div>}
    </div>
  );
}
