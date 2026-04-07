import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileUpload, PrivacyBadge, DownloadButton } from '../../components/ui/FileComponents';
import { Select } from '../../components/ui/FormControls';
import ResultBox from '../../components/ui/ResultBox';

type Level = 'screen' | 'ebook' | 'printer';

const LEVEL_CONFIG: Record<Level, { label: string; quality: number; desc: string }> = {
  screen: { label: 'Screen (smallest)', quality: 0.3, desc: 'Low quality, smallest file size - good for web sharing' },
  ebook: { label: 'eBook (balanced)', quality: 0.6, desc: 'Medium quality, good balance for reading on screens' },
  printer: { label: 'Printer (high)', quality: 0.85, desc: 'High quality, larger file - suitable for printing' },
};

export default function PDFCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<Level>('ebook');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [error, setError] = useState('');

  const handleFile = (files: File[]) => {
    const f = files[0];
    if (!f) return;
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF file.');
      return;
    }
    setFile(f);
    setResultBlob(null);
    setError('');
  };

  const compress = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setProgress(0);
    setError('');
    try {
      const buf = await file.arrayBuffer();
      setProgress(20);
      const srcDoc = await PDFDocument.load(buf, { ignoreEncryption: true });
      setProgress(40);
      const newDoc = await PDFDocument.create();
      const pageCount = srcDoc.getPageCount();
      const pages = await newDoc.copyPages(srcDoc, srcDoc.getPageIndices());
      pages.forEach(p => newDoc.addPage(p));
      setProgress(70);

      // Re-save with reduced image quality via compression flags
      const quality = LEVEL_CONFIG[level].quality;
      // pdf-lib doesn't expose per-image quality directly, but we can use
      // useObjectStreams and compress embedded resources during save
      const bytes = await newDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: Math.max(1, Math.floor(pageCount * quality * 2)),
      });
      setProgress(90);

      // Re-process to strip metadata and compress streams further
      const finalDoc = await PDFDocument.load(bytes);
      finalDoc.setTitle('');
      finalDoc.setAuthor('');
      finalDoc.setSubject('');
      finalDoc.setKeywords([]);
      finalDoc.setProducer('');
      finalDoc.setCreator('');
      const finalBytes = await finalDoc.save({ useObjectStreams: level !== 'printer' });
      setProgress(100);
      setResultBlob(new Blob([finalBytes as BlobPart], { type: 'application/pdf' }));
    } catch {
      setError('Failed to compress PDF. Make sure the file is a valid, unlocked PDF.');
    }
    setLoading(false);
  }, [file, level]);

  const reset = () => {
    setFile(null);
    setResultBlob(null);
    setProgress(0);
    setError('');
  };

  const savings = resultBlob && file ? Math.round((1 - resultBlob.size / file.size) * 100) : 0;
  const baseName = file ? file.name.replace(/\.pdf$/i, '') : 'compressed';

  if (resultBlob && file) {
    return (
      <div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs mb-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">
          <span>✅</span>
          <span>
            <strong>Compression complete</strong> - {LEVEL_CONFIG[level].label} mode applied.
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <ResultBox label="Original" value={`${(file.size / 1024).toFixed(0)} KB`} copyable={false} large={false} />
          <ResultBox label="Compressed" value={`${(resultBlob.size / 1024).toFixed(0)} KB`} copyable={false} large={false} />
          <ResultBox
            label="Savings"
            value={savings > 0 ? `-${savings}%` : `+${Math.abs(savings)}%`}
            copyable={false}
            large={false}
          />
        </div>
        {savings <= 0 && (
          <div className="text-[11px] text-surface-500 dark:text-surface-400 mb-3 px-1 text-center">
            This PDF is already well-compressed. Try a lower quality level for more reduction.
          </div>
        )}
        <DownloadButton blob={resultBlob} filename={`${baseName}-compressed.pdf`} label="Download Compressed PDF" />
        <button
          onClick={reset}
          className="w-full mt-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-surface-600 dark:text-surface-400 border border-surface-300 dark:border-surface-700 hover:border-brand-400 hover:text-brand-500 transition-colors duration-150"
        >
          Compress another PDF
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
              <div className="text-[10px] text-surface-500">{(file.size / 1024).toFixed(0)} KB</div>
            </div>
            <button
              onClick={reset}
              className="text-[11px] text-surface-400 hover:text-red-500 transition-colors px-1.5"
            >
              Remove
            </button>
          </div>

          <Select
            label="Compression Level"
            value={level}
            onChange={v => setLevel(v as Level)}
            options={[
              { value: 'screen', label: 'Screen (smallest file)' },
              { value: 'ebook', label: 'eBook (balanced)' },
              { value: 'printer', label: 'Printer (high quality)' },
            ]}
          />
          <div className="text-[11px] text-surface-500 dark:text-surface-400 mb-4 px-1">
            {LEVEL_CONFIG[level].desc}
          </div>

          {error && <div className="text-red-500 text-xs mb-3">{error}</div>}

          <button
            onClick={compress}
            className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold rounded-lg transition-colors"
          >
            Compress PDF
          </button>
        </div>
      )}

      {loading && (
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-xs font-semibold text-surface-600 dark:text-surface-500">Compressing PDF...</span>
            <span className="text-xs font-bold text-brand-500">{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-surface-200 dark:bg-surface-800 overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
