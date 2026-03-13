import { useState, useMemo } from 'react';

function jsonToCSV(input: string): string {
  const data = JSON.parse(input);
  const arr: Record<string, unknown>[] = Array.isArray(data) ? data : [data];
  if (arr.length === 0) return '';

  const headers = Array.from(new Set(arr.flatMap(row => Object.keys(row))));
  const escape = (val: unknown): string => {
    if (val === null || val === undefined) return '';
    const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };

  const rows = arr.map(row => headers.map(h => escape(row[h])).join(','));
  return [headers.join(','), ...rows].join('\n');
}

export default function JSONtoCSV() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) return null;
    try {
      return { csv: jsonToCSV(input), error: null };
    } catch (e: unknown) {
      return { csv: null, error: (e as Error).message };
    }
  }, [input]);

  const copy = () => {
    if (!result?.csv) return;
    navigator.clipboard.writeText(result.csv);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    if (!result?.csv) return;
    const blob = new Blob([result.csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const rowCount = result?.csv ? result.csv.split('\n').length - 1 : 0;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">JSON Input</label>
        <textarea
          className="w-full h-40 px-3 py-2 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/40 font-mono"
          placeholder={'[\n  { "name": "Alice", "age": 30 },\n  { "name": "Bob", "age": 25 }\n]'}
          value={input}
          onChange={e => setInput(e.target.value)}
          spellCheck={false}
        />
      </div>

      {result?.error && (
        <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{result.error}</p>
      )}

      {result?.csv && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-surface-600 dark:text-surface-400">
              CSV Output <span className="font-normal text-surface-400">({rowCount} row{rowCount !== 1 ? 's' : ''})</span>
            </label>
            <div className="flex gap-2">
              <button
                onClick={copy}
                className="text-xs text-surface-500 hover:text-brand-500 transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
              <button
                onClick={download}
                className="text-xs px-2.5 py-1 bg-brand-500 text-white rounded-md hover:bg-brand-600 transition-colors"
              >
                Download CSV
              </button>
            </div>
          </div>
          <textarea
            readOnly
            className="w-full h-40 px-3 py-2 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 resize-none font-mono"
            value={result.csv}
          />
        </div>
      )}

      {!result && (
        <p className="text-xs text-surface-400 text-center py-2">Paste a JSON array above to convert it to CSV</p>
      )}
    </div>
  );
}
