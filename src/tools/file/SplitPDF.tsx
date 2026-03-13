import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileUpload, PrivacyBadge } from '../../components/ui/FileComponents';

type Mode = 'all' | 'range';

function parseRanges(input: string, maxPage: number): number[][] | null {
  const parts = input.split(',').map(s => s.trim()).filter(Boolean);
  const result: number[][] = [];
  for (const part of parts) {
    if (/^\d+$/.test(part)) {
      const n = parseInt(part, 10);
      if (n < 1 || n > maxPage) return null;
      result.push([n]);
    } else if (/^\d+-\d+$/.test(part)) {
      const [a, b] = part.split('-').map(Number);
      if (a < 1 || b > maxPage || a > b) return null;
      result.push([a, b]);
    } else {
      return null;
    }
  }
  return result.length > 0 ? result : null;
}

export default function SplitPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<Mode>('all');
  const [rangeInput, setRangeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [downloaded, setDownloaded] = useState(0);
  const [error, setError] = useState('');

  const handleFile = async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF file.');
      return;
    }
    setError('');
    setDone(false);
    setDownloaded(0);
    setFile(f);
    try {
      const buf = await f.arrayBuffer();
      const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
      setPageCount(doc.getPageCount());
    } catch {
      setError('Could not read the PDF. Make sure it is a valid, unlocked PDF.');
      setFile(null);
    }
  };

  const downloadPage = async (srcBuf: ArrayBuffer, pageIndex: number, baseName: string) => {
    const src = await PDFDocument.load(srcBuf, { ignoreEncryption: true });
    const newDoc = await PDFDocument.create();
    const [page] = await newDoc.copyPages(src, [pageIndex]);
    newDoc.addPage(page);
    const bytes = await newDoc.save();
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}-page-${pageIndex + 1}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadRange = async (srcBuf: ArrayBuffer, indices: number[], label: string, baseName: string) => {
    const src = await PDFDocument.load(srcBuf, { ignoreEncryption: true });
    const newDoc = await PDFDocument.create();
    const pages = await newDoc.copyPages(src, indices);
    pages.forEach(p => newDoc.addPage(p));
    const bytes = await newDoc.save();
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}-${label}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const split = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setProgress(0);
    setError('');
    setDownloaded(0);

    try {
      const buf = await file.arrayBuffer();
      const baseName = file.name.replace(/\.pdf$/i, '');

      if (mode === 'all') {
        for (let i = 0; i < pageCount; i++) {
          await downloadPage(buf, i, baseName);
          setProgress(Math.round(((i + 1) / pageCount) * 100));
          setDownloaded(i + 1);
          // Small delay to avoid browser throttling downloads
          await new Promise(r => setTimeout(r, 120));
        }
      } else {
        const parsed = parseRanges(rangeInput, pageCount);
        if (!parsed) {
          setError(`Invalid range. Use formats like "1-3, 5, 7-9". Pages must be between 1 and ${pageCount}.`);
          setLoading(false);
          return;
        }
        for (let i = 0; i < parsed.length; i++) {
          const segment = parsed[i];
          let indices: number[];
          let label: string;
          if (segment.length === 1) {
            indices = [segment[0] - 1];
            label = `page-${segment[0]}`;
          } else {
            indices = [];
            for (let p = segment[0]; p <= segment[1]; p++) indices.push(p - 1);
            label = `pages-${segment[0]}-${segment[1]}`;
          }
          await downloadRange(buf, indices, label, baseName);
          setProgress(Math.round(((i + 1) / parsed.length) * 100));
          setDownloaded(i + 1);
          await new Promise(r => setTimeout(r, 120));
        }
      }

      setDone(true);
    } catch {
      setError('Failed to split PDF. Make sure the file is a valid, unlocked PDF.');
    }
    setLoading(false);
  }, [file, mode, rangeInput, pageCount]);

  const reset = () => {
    setFile(null);
    setPageCount(0);
    setRangeInput('');
    setDone(false);
    setDownloaded(0);
    setProgress(0);
    setError('');
  };

  const rangeValid = mode === 'range' ? parseRanges(rangeInput, pageCount) !== null && rangeInput.trim() !== '' : true;

  if (done) {
    const count = mode === 'all' ? pageCount : (parseRanges(rangeInput, pageCount)?.length ?? 0);
    return (
      <div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs mb-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">
          <span>✅</span>
          <span>
            <strong>Split complete</strong> - {count} PDF{count !== 1 ? 's' : ''} downloaded to your device.
          </span>
        </div>
        <button
          onClick={reset}
          className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-surface-600 dark:text-surface-400 border border-surface-300 dark:border-surface-700 hover:border-brand-400 hover:text-brand-500 transition-colors duration-150"
        >
          Split another PDF
        </button>
      </div>
    );
  }

  return (
    <div>
      {!file && (
        <>
          <PrivacyBadge />
          <FileUpload accept=".pdf" onFiles={handleFile} label="Drop a PDF here" icon="📄" />
        </>
      )}

      {file && !loading && (
        <div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 mb-4">
            <span className="text-base">📄</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-surface-900 dark:text-surface-100 truncate">{file.name}</div>
              <div className="text-[10px] text-surface-500">
                {(file.size / 1024).toFixed(0)} KB - {pageCount} page{pageCount !== 1 ? 's' : ''}
              </div>
            </div>
            <button
              onClick={reset}
              className="text-[11px] text-surface-400 hover:text-red-500 transition-colors px-1.5"
            >
              Remove
            </button>
          </div>

          {/* Mode selector */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-2">Split Mode</label>
            <div className="grid grid-cols-2 gap-2">
              {(['all', 'range'] as Mode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                    mode === m
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
                      : 'border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:border-brand-400'
                  }`}
                >
                  {m === 'all' ? 'Split All Pages' : 'Extract Range'}
                </button>
              ))}
            </div>
          </div>

          {mode === 'all' && (
            <div className="text-[11px] text-surface-500 dark:text-surface-400 mb-4 px-1">
              Each of the {pageCount} pages will be saved as a separate PDF file and downloaded individually.
            </div>
          )}

          {mode === 'range' && (
            <div className="mb-4">
              <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-1.5">
                Page Ranges
              </label>
              <input
                type="text"
                value={rangeInput}
                onChange={e => setRangeInput(e.target.value)}
                placeholder={`e.g. 1-3, 5, 7-9 (max page: ${pageCount})`}
                className="w-full px-3 py-2 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
              <div className="text-[11px] text-surface-500 dark:text-surface-400 mt-1 px-1">
                Each segment will be downloaded as a separate PDF. Separate multiple ranges with commas.
              </div>
              {rangeInput && !rangeValid && (
                <div className="text-[11px] text-red-500 mt-1 px-1">
                  Invalid range. Check page numbers are between 1 and {pageCount}.
                </div>
              )}
            </div>
          )}

          {error && <div className="text-red-500 text-xs mb-3">{error}</div>}

          <button
            onClick={split}
            disabled={!rangeValid || (mode === 'range' && !rangeInput.trim())}
            className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:pointer-events-none text-white text-sm font-bold rounded-lg transition-colors"
          >
            {mode === 'all' ? `Split into ${pageCount} PDFs` : 'Extract Selected Pages'}
          </button>
        </div>
      )}

      {loading && (
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-xs font-semibold text-surface-600 dark:text-surface-500">
              Downloading file {downloaded}...
            </span>
            <span className="text-xs font-bold text-brand-500">{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-surface-200 dark:bg-surface-800 overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-[11px] text-surface-500 mt-2 text-center">
            Your browser will download each PDF separately. Check your downloads folder.
          </div>
        </div>
      )}
    </div>
  );
}
