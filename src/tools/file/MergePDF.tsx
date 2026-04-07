import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileUpload, PrivacyBadge, DownloadButton } from '../../components/ui/FileComponents';
import { Button } from '../../components/ui/FormControls';
import { ChevronUpIcon, ChevronDownIcon, XIcon } from '../../components/ui/Icons';
import ResultBox from '../../components/ui/ResultBox';

interface PdfEntry { file: File; pageCount: number | null; }

export default function MergePDF() {
  const [entries, setEntries] = useState<PdfEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState('');

  const loadPageCounts = async (files: File[]) => {
    for (const f of files) {
      try {
        const buf = await f.arrayBuffer();
        const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
        setEntries(prev => {
          const arr = [...prev];
          const idx = arr.findIndex(e => e.file === f);
          if (idx !== -1) arr[idx] = { ...arr[idx], pageCount: doc.getPageCount() };
          return arr;
        });
      } catch { /* leave as null */ }
    }
  };

  const addFiles = useCallback((newFiles: File[]) => {
    const pdfs = newFiles.filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    if (!pdfs.length) return;
    const newEntries: PdfEntry[] = pdfs.map(f => ({ file: f, pageCount: null }));
    setEntries(prev => [...prev, ...newEntries]);
    setResultBlob(null);
    setError('');
    loadPageCounts(pdfs);
  }, []);

  const removeFile = (i: number) => setEntries(prev => prev.filter((_, j) => j !== i));

  const moveFile = (i: number, dir: number) => {
    setEntries(prev => {
      const arr = [...prev];
      const ni = i + dir;
      if (ni < 0 || ni >= arr.length) return arr;
      [arr[i], arr[ni]] = [arr[ni], arr[i]];
      return arr;
    });
  };

  const merge = useCallback(async () => {
    if (entries.length < 2) return;
    setLoading(true); setProgress(0); setError('');
    try {
      const merged = await PDFDocument.create();
      for (let i = 0; i < entries.length; i++) {
        const buf = await entries[i].file.arrayBuffer();
        const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach(p => merged.addPage(p));
        setProgress(Math.round(((i + 1) / entries.length) * 90));
      }
      const bytes = await merged.save();
      setTotalPages(merged.getPageCount());
      setResultBlob(new Blob([bytes as BlobPart], { type: 'application/pdf' }));
      setProgress(100);
    } catch {
      setError('Failed to merge PDFs. Make sure all files are valid, unlocked PDFs.');
    }
    setLoading(false);
  }, [entries]);

  const reset = () => { setEntries([]); setResultBlob(null); setProgress(0); setError(''); };

  if (resultBlob) {
    return (
      <div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs mb-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">
          ✅ <span><strong>Merge complete</strong> - {entries.length} PDFs combined into one.</span>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <ResultBox label="Total Pages" value={totalPages} copyable={false} large={false} />
          <ResultBox label="File Size" value={`${(resultBlob.size / 1024).toFixed(0)} KB`} copyable={false} large={false} />
        </div>
        <DownloadButton blob={resultBlob} filename="merged.pdf" label="Download Merged PDF" />
        <button onClick={reset} className="w-full mt-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-surface-600 dark:text-surface-400 border border-surface-300 dark:border-surface-700 hover:border-brand-400 hover:text-brand-500 transition-colors duration-150">
          Merge more files
        </button>
      </div>
    );
  }

  return (
    <div>
      {entries.length === 0 && (
        <>
          <PrivacyBadge />
          <FileUpload accept=".pdf" multiple onFiles={addFiles} label="Drop PDF files here" icon="📄" />
        </>
      )}

      {entries.length > 0 && !loading && (
        <>
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-surface-600 dark:text-surface-500">
                {entries.length} file{entries.length !== 1 ? 's' : ''} to merge
              </label>
              <button
                onClick={() => { const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.pdf'; inp.multiple = true; inp.onchange = e => addFiles(Array.from((e.target as HTMLInputElement).files || [])); inp.click(); }}
                className="text-xs font-semibold text-brand-500 hover:text-brand-600"
              >
                + Add more
              </button>
            </div>
            <div className="space-y-1.5">
              {entries.map((e, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
                  <span className="text-base">📄</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-surface-900 dark:text-surface-100 truncate">{e.file.name}</div>
                    <div className="text-[10px] text-surface-500">
                      {(e.file.size / 1024).toFixed(0)} KB
                      {e.pageCount !== null ? ` • ${e.pageCount} page${e.pageCount !== 1 ? 's' : ''}` : ' • loading...'}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => moveFile(i, -1)} disabled={i === 0} className="p-1 rounded border border-surface-300 dark:border-surface-600 text-surface-500 hover:text-brand-500 disabled:opacity-30"><ChevronUpIcon /></button>
                    <button onClick={() => moveFile(i, 1)} disabled={i === entries.length - 1} className="p-1 rounded border border-surface-300 dark:border-surface-600 text-surface-500 hover:text-brand-500 disabled:opacity-30"><ChevronDownIcon /></button>
                    <button onClick={() => removeFile(i)} className="p-1 rounded border border-surface-300 dark:border-surface-600 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><XIcon /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {error && <div className="text-red-500 text-xs mb-3">{error}</div>}
          <Button onClick={merge} className="w-full" disabled={entries.length < 2}>
            Merge {entries.length} PDFs
          </Button>
          {entries.length < 2 && (
            <div className="text-[11px] text-surface-400 text-center mt-2">Add at least 2 PDFs to merge</div>
          )}
        </>
      )}

      {loading && (
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-xs font-semibold text-surface-600 dark:text-surface-500">Merging PDFs...</span>
            <span className="text-xs font-bold text-brand-500">{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-surface-200 dark:bg-surface-800 overflow-hidden">
            <div className="h-full bg-brand-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
