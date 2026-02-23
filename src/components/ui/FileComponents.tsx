import { useRef, useState } from 'react';
import { ShieldIcon, DownloadIcon } from './Icons';

// ─── File Upload Drop Zone (compact for single-viewport) ───
interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label?: string;
  icon?: string;
}

export function FileUpload({ accept, multiple = false, onFiles, label, icon = '📁' }: FileUploadProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (files?.length) onFiles(Array.from(files));
  };

  return (
    <div
      onClick={() => ref.current?.click()}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
      className={`border-2 border-dashed rounded-2xl py-5 px-4 text-center cursor-pointer transition-all duration-200 mb-3
        ${drag
          ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
          : 'border-surface-300 dark:border-surface-700 bg-surface-100 dark:bg-surface-800 hover:border-brand-400'
        }`}
    >
      <input
        ref={ref}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />
      <div className="text-3xl mb-1">{icon}</div>
      <div className="text-sm font-semibold text-surface-900 dark:text-surface-100">
        {label || 'Drop files here or click to upload'}
      </div>
      <div className="text-[11px] text-surface-500 mt-0.5">
        {accept ? `${accept}` : 'All file types'}{multiple ? ' • Multiple files' : ''}
      </div>
    </div>
  );
}

// ─── Privacy Badge (compact) ───
export function PrivacyBadge() {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-[11px] text-surface-500 dark:text-surface-400 mb-3">
      <ShieldIcon />
      <span><strong className="text-surface-600 dark:text-surface-300">Private:</strong> Files never leave your browser</span>
    </div>
  );
}

// ─── Download Button (prominent, full width, always visible) ───
interface DownloadBtnProps {
  blob: Blob;
  filename: string;
  label?: string;
}

export function DownloadButton({ blob, filename, label }: DownloadBtnProps) {
  const download = () => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={download}
      className="w-full flex items-center justify-center gap-2 py-3.5 px-5 mt-3
                 rounded-xl font-bold text-sm text-white
                 bg-brand-500 hover:bg-brand-600 active:bg-brand-700
                 shadow-[0_2px_10px_rgba(255,107,53,0.3)]
                 transition-all duration-150"
    >
      <DownloadIcon /> {label || `Download ${filename}`}
    </button>
  );
}
