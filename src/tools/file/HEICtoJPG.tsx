import { useState, useCallback } from 'react';

interface ConvResult { name: string; url: string; size: number; }

export default function HEICtoJPG() {
  const [results, setResults] = useState<ConvResult[]>([]);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState('');
  const [isDrag, setIsDrag] = useState(false);

  const convert = async (files: FileList | File[]) => {
    const heicFiles = Array.from(files).filter(f =>
      f.name.toLowerCase().endsWith('.heic') ||
      f.name.toLowerCase().endsWith('.heif') ||
      f.type === 'image/heic' || f.type === 'image/heif'
    );
    if (heicFiles.length === 0) {
      setError('Please upload HEIC or HEIF files.');
      return;
    }
    setError('');
    setConverting(true);

    try {
      const heic2any = (await import('heic2any')).default;
      const newResults: ConvResult[] = [];

      for (const file of heicFiles) {
        try {
          const result = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 });
          const blob = Array.isArray(result) ? result[0] : result;
          const url = URL.createObjectURL(blob);
          newResults.push({
            name: file.name.replace(/\.(heic|heif)$/i, '.jpg'),
            url,
            size: blob.size,
          });
        } catch {
          setError(`Failed to convert ${file.name}.`);
        }
      }
      setResults(prev => [...prev, ...newResults]);
    } catch {
      setError('Failed to load conversion library. Please try again.');
    }
    setConverting(false);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) convert(e.target.files);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDrag(false);
    if (e.dataTransfer.files) convert(e.dataTransfer.files);
  }, []);

  const download = (r: ConvResult) => {
    const a = document.createElement('a');
    a.href = r.url;
    a.download = r.name;
    a.click();
  };

  const downloadAll = () => results.forEach(download);
  const clear = () => {
    results.forEach(r => URL.revokeObjectURL(r.url));
    setResults([]);
  };

  return (
    <div className="space-y-4">
      <label
        className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors ${isDrag ? 'border-brand-500 bg-brand-500/5' : 'border-surface-200 dark:border-surface-700 hover:border-brand-400'}`}
        onDragOver={e => { e.preventDefault(); setIsDrag(true); }}
        onDragLeave={() => setIsDrag(false)}
        onDrop={onDrop}
      >
        <span className="text-3xl">📸</span>
        <div className="text-center">
          <p className="text-sm font-bold text-surface-700 dark:text-surface-300">
            {converting ? 'Converting...' : 'Drop HEIC files or click to upload'}
          </p>
          <p className="text-xs text-surface-400 mt-0.5">.heic and .heif files supported · Multiple files OK</p>
        </div>
        <input type="file" accept=".heic,.heif,image/heic,image/heif" multiple className="hidden" onChange={onFile} disabled={converting} />
      </label>

      {error && (
        <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{error}</p>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-surface-600 dark:text-surface-400">{results.length} file{results.length !== 1 ? 's' : ''} converted</p>
            <div className="flex gap-2">
              {results.length > 1 && (
                <button onClick={downloadAll} className="text-xs px-2.5 py-1 bg-brand-500 text-white rounded-md hover:bg-brand-600 transition-colors">
                  Download All
                </button>
              )}
              <button onClick={clear} className="text-xs text-surface-400 hover:text-red-400 transition-colors">Clear</button>
            </div>
          </div>
          {results.map((r, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border border-surface-200 dark:border-surface-700">
              <img src={r.url} alt="" className="w-10 h-10 object-cover rounded flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-surface-700 dark:text-surface-300 truncate">{r.name}</p>
                <p className="text-[11px] text-surface-400">{(r.size / 1024).toFixed(1)} KB</p>
              </div>
              <button onClick={() => download(r)} className="text-xs px-2.5 py-1 rounded-md border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:border-brand-400 hover:text-brand-500 transition-colors">
                Download
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-[11px] text-surface-400">Conversion runs in your browser. HEIC files never leave your device.</p>
    </div>
  );
}
