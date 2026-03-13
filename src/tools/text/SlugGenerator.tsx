import { useState, useMemo } from 'react';

type Separator = 'hyphen' | 'underscore';

function toSlug(text: string, separator: string, lowercase: boolean, maxLength: number): string {
  let s = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s_-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, separator);
  if (lowercase) s = s.toLowerCase();
  if (maxLength > 0 && s.length > maxLength) {
    s = s.slice(0, maxLength).replace(new RegExp(`[${separator}]+$`), '');
  }
  return s;
}

function toUrlSafe(text: string): string {
  return encodeURIComponent(
    text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase()
  );
}

function toCamelCase(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
}

function toTitleCase(text: string): string {
  return text
    .trim()
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="text-xs text-surface-500 hover:text-brand-500 transition-colors shrink-0">
      {copied ? '✓' : 'Copy'}
    </button>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 bg-surface-100 dark:bg-surface-800 rounded-lg px-3 py-2">
      <span className="text-xs text-surface-500 w-24 shrink-0">{label}</span>
      <span className="flex-1 text-xs font-mono text-surface-800 dark:text-surface-200 break-all">{value || '-'}</span>
      {value && <CopyButton value={value} />}
    </div>
  );
}

export default function SlugGenerator() {
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState<Separator>('hyphen');
  const [lowercase, setLowercase] = useState(true);
  const [maxLength, setMaxLength] = useState(0);

  const sep = separator === 'hyphen' ? '-' : '_';

  const slug = useMemo(() => input ? toSlug(input, sep, lowercase, maxLength) : '', [input, sep, lowercase, maxLength]);
  const urlSafe = useMemo(() => input ? toUrlSafe(input) : '', [input]);
  const camel = useMemo(() => input ? toCamelCase(input) : '', [input]);
  const title = useMemo(() => input ? toTitleCase(input) : '', [input]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">Input Text</label>
        <input
          type="text"
          className="w-full px-3 py-2 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
          placeholder="My Awesome Blog Post Title!"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-surface-600 dark:text-surface-400">Separator:</span>
          {(['hyphen', 'underscore'] as Separator[]).map(s => (
            <button
              key={s}
              onClick={() => setSeparator(s)}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                separator === s ? 'bg-brand-500 text-white' : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'
              }`}
            >
              {s === 'hyphen' ? 'Hyphen (-)' : 'Underscore (_)'}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <div
            onClick={() => setLowercase(v => !v)}
            className={`relative inline-flex w-8 h-4 rounded-full transition-colors ${lowercase ? 'bg-brand-500' : 'bg-surface-300 dark:bg-surface-600'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${lowercase ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
          <span className="text-xs text-surface-600 dark:text-surface-400">Lowercase</span>
        </label>

        <label className="flex items-center gap-2 text-xs text-surface-600 dark:text-surface-400">
          <span>Max length:</span>
          <input
            type="number"
            min={0}
            max={500}
            value={maxLength === 0 ? '' : maxLength}
            onChange={e => setMaxLength(Number(e.target.value) || 0)}
            placeholder="None"
            className="w-16 px-1.5 py-0.5 text-xs rounded border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-1 focus:ring-brand-500/40"
          />
        </label>
      </div>

      {input ? (
        <div className="space-y-2">
          <ResultRow label="Slug" value={slug} />
          <ResultRow label="URL-safe" value={urlSafe} />
          <ResultRow label="camelCase" value={camel} />
          <ResultRow label="Title Case" value={title} />
        </div>
      ) : (
        <p className="text-xs text-surface-400 text-center py-2">Type something above to generate slugs</p>
      )}
    </div>
  );
}
