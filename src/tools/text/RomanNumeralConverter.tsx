import { useState } from 'react';

const ROMAN_MAP: [number, string][] = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];

function toRoman(n: number): { result: string; steps: string[] } {
  if (n < 1 || n > 3999) return { result: '', steps: [] };
  let num = n;
  let result = '';
  const steps: string[] = [];
  for (const [val, sym] of ROMAN_MAP) {
    while (num >= val) {
      result += sym;
      steps.push(`${num} >= ${val} -> add ${sym} (remaining: ${num - val})`);
      num -= val;
    }
  }
  return { result, steps };
}

function fromRoman(s: string): number | null {
  const str = s.toUpperCase().trim();
  if (!/^[IVXLCDM]+$/.test(str)) return null;
  const vals: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < str.length; i++) {
    const cur = vals[str[i]];
    const next = vals[str[i + 1]] ?? 0;
    total += cur < next ? -cur : cur;
  }
  return total >= 1 && total <= 3999 ? total : null;
}

export default function RomanNumeralConverter() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const trimmed = input.trim();
  const isArabic = /^\d+$/.test(trimmed);
  const isRoman = /^[IVXLCDMivxlcdm]+$/.test(trimmed);

  let result = '';
  let steps: string[] = [];
  let error = '';
  let direction = '';

  if (trimmed) {
    if (isArabic) {
      const n = parseInt(trimmed);
      if (n < 1 || n > 3999) {
        error = 'Enter a number between 1 and 3999.';
      } else {
        const r = toRoman(n);
        result = r.result;
        steps = r.steps;
        direction = 'Arabic to Roman';
      }
    } else if (isRoman) {
      const n = fromRoman(trimmed);
      if (n === null) { error = 'Invalid Roman numeral.'; }
      else { result = String(n); direction = 'Roman to Arabic'; }
    } else {
      error = 'Enter a number (e.g. 2024) or a Roman numeral (e.g. MMXXIV).';
    }
  }

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">
          Enter a number or Roman numeral
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40 font-mono"
          placeholder="e.g. 2024 or MMXXIV"
          value={input}
          onChange={e => setInput(e.target.value)}
          spellCheck={false}
        />
        {direction && <p className="text-[10px] text-surface-400 mt-1">{direction}</p>}
      </div>
      {error && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{error}</p>}
      {result && (
        <div className="text-center p-6 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700">
          <p className="text-4xl font-bold font-mono text-surface-900 dark:text-surface-100 mb-2">{result}</p>
          <button onClick={copy} className="text-xs text-surface-400 hover:text-brand-500 transition-colors">
            {copied ? '✓ Copied' : 'Copy result'}
          </button>
        </div>
      )}
      {steps.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-surface-400 mb-2">Breakdown</p>
          <div className="space-y-1">
            {steps.map((step, i) => (
              <p key={i} className="text-xs font-mono text-surface-500 dark:text-surface-400">{step}</p>
            ))}
          </div>
        </div>
      )}
      <details className="group">
        <summary className="cursor-pointer text-xs text-surface-400 hover:text-brand-500 transition-colors flex items-center gap-1.5">
          <span className="group-open:rotate-90 transition-transform inline-block">&#9654;</span>
          Roman numeral reference
        </summary>
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {ROMAN_MAP.map(([val, sym]) => (
            <div key={sym} className="flex items-center justify-between px-2 py-1 rounded bg-surface-100 dark:bg-surface-800 text-xs">
              <span className="font-bold text-brand-500">{sym}</span>
              <span className="text-surface-500">{val}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
