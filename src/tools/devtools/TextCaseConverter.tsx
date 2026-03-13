import { useState } from 'react';

const cases = [
  { label: 'UPPER CASE', fn: (s: string) => s.toUpperCase() },
  { label: 'lower case', fn: (s: string) => s.toLowerCase() },
  { label: 'Title Case', fn: (s: string) => s.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) },
  { label: 'Sentence case', fn: (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() },
  { label: 'camelCase', fn: (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
  { label: 'PascalCase', fn: (s: string) => s.replace(/(^\w|[^a-zA-Z0-9]+\w)/g, c => c.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()) },
  { label: 'snake_case', fn: (s: string) => s.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') },
  { label: 'kebab-case', fn: (s: string) => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') },
  { label: 'CONSTANT_CASE', fn: (s: string) => s.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '') },
  { label: 'aLtErNaTiNg', fn: (s: string) => s.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('') },
];

export default function TextCaseConverter() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-4">
      <textarea
        className="w-full h-28 px-3 py-2 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/40 font-mono"
        placeholder="Type or paste your text here..."
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <div className="grid gap-2">
        {cases.map(({ label, fn }) => {
          const result = input ? fn(input) : '';
          return (
            <div
              key={label}
              className="flex items-center gap-2 p-2.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 group"
            >
              <span className="text-[10px] font-bold text-surface-400 w-28 flex-shrink-0">{label}</span>
              <span className="flex-1 text-xs text-surface-700 dark:text-surface-300 font-mono truncate">
                {result || <span className="text-surface-400 italic">preview</span>}
              </span>
              <button
                onClick={() => result && copy(result, label)}
                disabled={!result}
                className="flex-shrink-0 text-[10px] text-surface-400 hover:text-brand-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed px-1.5 py-0.5 rounded"
              >
                {copied === label ? '✓' : 'Copy'}
              </button>
            </div>
          );
        })}
      </div>
      {input && (
        <button
          onClick={() => setInput('')}
          className="text-xs text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
}
