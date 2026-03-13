import { useState } from 'react';

const BASES = [
  { label: 'Binary', short: 'BIN', base: 2, prefix: '0b', pattern: /^[01]*$/ },
  { label: 'Octal', short: 'OCT', base: 8, prefix: '0o', pattern: /^[0-7]*$/ },
  { label: 'Decimal', short: 'DEC', base: 10, prefix: '', pattern: /^[0-9]*$/ },
  { label: 'Hexadecimal', short: 'HEX', base: 16, prefix: '0x', pattern: /^[0-9a-fA-F]*$/ },
];

export default function NumberBaseConverter() {
  const [values, setValues] = useState({ 2: '', 8: '', 10: '', 16: '' } as Record<number, string>);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<number | null>(null);

  const handleChange = (base: number, raw: string) => {
    const val = raw.trim();
    setError('');
    const next: Record<number, string> = { 2: '', 8: '', 10: '', 16: '' };
    next[base] = val;

    if (val === '') {
      setValues(next);
      return;
    }

    const b = BASES.find(b => b.base === base)!;
    if (!b.pattern.test(val)) {
      setError(`Invalid character for base ${base}`);
      setValues(next);
      return;
    }

    const decimal = parseInt(val, base);
    if (isNaN(decimal) || decimal < 0) {
      setError('Invalid number');
      setValues(next);
      return;
    }

    BASES.forEach(({ base: b2 }) => {
      if (b2 !== base) {
        next[b2] = decimal.toString(b2).toUpperCase();
      }
    });
    setValues(next);
  };

  const copy = (base: number) => {
    navigator.clipboard.writeText(values[base]);
    setCopied(base);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-3">
      {BASES.map(({ label, short, base, prefix }) => (
        <div key={base} className="space-y-1">
          <label className="flex items-center gap-2 text-xs font-bold text-surface-600 dark:text-surface-400">
            <span className="w-6 h-5 rounded text-[9px] font-bold bg-brand-500/10 text-brand-500 flex items-center justify-center">{short}</span>
            {label} (base {base})
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="text"
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              placeholder={`Enter ${label.toLowerCase()}...`}
              value={values[base]}
              onChange={e => handleChange(base, e.target.value)}
              spellCheck={false}
            />
            <button
              onClick={() => values[base] && copy(base)}
              disabled={!values[base]}
              className="px-3 py-2 text-xs rounded-lg border border-surface-200 dark:border-surface-700 text-surface-500 hover:text-brand-500 hover:border-brand-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {copied === base ? '✓' : 'Copy'}
            </button>
          </div>
          {values[base] && prefix && (
            <p className="text-[10px] text-surface-400 font-mono pl-1">{prefix}{values[base]}</p>
          )}
        </div>
      ))}

      {error && (
        <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{error}</p>
      )}

      <p className="text-[11px] text-surface-400 pt-1">Edit any field to convert. Supports non-negative integers.</p>
    </div>
  );
}
