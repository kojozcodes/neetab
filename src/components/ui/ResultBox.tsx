import { useState } from 'react';
import { ClipboardIcon, CheckIcon } from './Icons';

interface ResultBoxProps {
  label: string;
  value: string | number;
  copyable?: boolean;
  large?: boolean;
}

export default function ResultBox({ label, value, copyable = true, large = true }: ResultBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(value));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="result-box">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-600 mb-1">
        {label}
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className={`font-display font-bold tracking-tight text-brand-500 break-all leading-tight ${large ? 'text-2xl' : 'text-lg'}`}>
          {value}
        </div>
        {copyable && (
          <button
            onClick={handleCopy}
            className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold
                       border border-surface-300 dark:border-surface-700 rounded-lg
                       text-surface-500 dark:text-surface-500
                       hover:border-brand-500 hover:text-brand-500
                       transition-colors duration-200"
          >
            {copied ? <><CheckIcon /> Copied</> : <ClipboardIcon />}
          </button>
        )}
      </div>
    </div>
  );
}
