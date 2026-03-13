import { useState, useCallback } from 'react';

export default function ImageToBase64() {
  const [result, setResult] = useState<{ dataUrl: string; mimeType: string; size: number; name: string } | null>(null);
  const [isDrag, setIsDrag] = useState(false);
  const [copied, setCopied] = useState<'dataurl' | 'base64' | null>(null);

  const loadFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      const dataUrl = e.target?.result as string;
      setResult({ dataUrl, mimeType: file.type, size: file.size, name: file.name });
    };
    reader.readAsDataURL(file);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) loadFile(e.target.files[0]);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDrag(false);
    if (e.dataTransfer.files?.[0]) loadFile(e.dataTransfer.files[0]);
  }, []);

  const copy = (type: 'dataurl' | 'base64') => {
    if (!result) return;
    const text = type === 'dataurl' ? result.dataUrl : result.dataUrl.split(',')[1];
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1500);
  };

  const base64 = result?.dataUrl.split(',')[1] ?? '';
  const base64Size = Math.ceil(base64.length * 0.75);

  if (!result) {
    return (
      <label
        className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-10 cursor-pointer transition-colors ${isDrag ? 'border-brand-500 bg-brand-500/5' : 'border-surface-200 dark:border-surface-700 hover:border-brand-400'}`}
        onDragOver={e => { e.preventDefault(); setIsDrag(true); }}
        onDragLeave={() => setIsDrag(false)}
        onDrop={onDrop}
      >
        <span className="text-3xl">🖼️</span>
        <div className="text-center">
          <p className="text-sm font-bold text-surface-700 dark:text-surface-300">Drop image or click to upload</p>
          <p className="text-xs text-surface-400 mt-0.5">PNG, JPG, WebP, GIF, SVG supported</p>
        </div>
        <input type="file" accept="image/*" className="hidden" onChange={onFile} />
      </label>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-100 dark:bg-surface-800">
        <img src={result.dataUrl} alt="" className="w-12 h-12 object-cover rounded" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-surface-700 dark:text-surface-300 truncate">{result.name}</p>
          <p className="text-[11px] text-surface-400">{result.mimeType} · Original: {(result.size / 1024).toFixed(1)} KB · Base64: {(base64Size / 1024).toFixed(1)} KB</p>
        </div>
        <button onClick={() => setResult(null)} className="text-xs text-surface-400 hover:text-red-400 transition-colors">✕</button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-surface-600 dark:text-surface-400">Data URL <span className="font-normal text-surface-400">(for use in HTML/CSS src=)</span></label>
          <button onClick={() => copy('dataurl')} className="text-xs text-surface-400 hover:text-brand-500 transition-colors">
            {copied === 'dataurl' ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <textarea
          readOnly
          className="w-full h-20 px-3 py-2 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-700 dark:text-surface-300 resize-none font-mono"
          value={result.dataUrl}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-surface-600 dark:text-surface-400">Base64 string only</label>
          <button onClick={() => copy('base64')} className="text-xs text-surface-400 hover:text-brand-500 transition-colors">
            {copied === 'base64' ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <textarea
          readOnly
          className="w-full h-20 px-3 py-2 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-700 dark:text-surface-300 resize-none font-mono"
          value={base64}
        />
      </div>

      <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700">
        <p className="text-[11px] text-surface-400 font-bold mb-1">Usage example</p>
        <p className="text-[11px] font-mono text-surface-500 break-all">{`<img src="${result.dataUrl.slice(0, 60)}..." />`}</p>
      </div>
    </div>
  );
}
