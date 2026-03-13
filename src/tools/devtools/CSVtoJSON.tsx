import { useState, useMemo } from 'react';
import Papa from 'papaparse';

const textareaClass = "w-full px-3 py-2 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/40 font-mono";

export default function CSVtoJSON() {
  const [input, setInput] = useState('');
  const [headerRow, setHeaderRow] = useState(true);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) return null;
    try {
      const parsed = Papa.parse(input.trim(), {
        header: headerRow,
        skipEmptyLines: true,
        dynamicTyping: true,
      });
      if (parsed.errors.length > 0 && parsed.data.length === 0) {
        return { json: null, error: parsed.errors[0].message, rowCount: 0 };
      }
      const json = JSON.stringify(parsed.data, null, 2);
      return { json, error: null, rowCount: parsed.data.length };
    } catch (e: unknown) {
      return { json: null, error: (e as Error).message, rowCount: 0 };
    }
  }, [input, headerRow]);

  const copy = () => {
    if (!result?.json) return;
    navigator.clipboard.writeText(result.json);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    if (!result?.json) return;
    const blob = new Blob([result.json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">CSV Input</label>
        <textarea
          className={textareaClass + " h-40"}
          placeholder={"name,age,city\nAlice,30,NYC\nBob,25,LA"}
          value={input}
          onChange={e => setInput(e.target.value)}
          spellCheck={false}
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <div
            onClick={() => setHeaderRow(v => !v)}
            className={`relative inline-flex w-8 h-4 rounded-full transition-colors ${headerRow ? 'bg-brand-500' : 'bg-surface-300 dark:bg-surface-600'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${headerRow ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
          <span className="text-xs text-surface-600 dark:text-surface-400">First row is header</span>
        </label>
        <span className="text-xs text-surface-400">Delimiter: auto-detect</span>
      </div>

      {result?.error && (
        <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{result.error}</p>
      )}

      {result?.json && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-surface-600 dark:text-surface-400">
              JSON Output{' '}
              <span className="font-normal text-surface-400">
                ({result.rowCount} row{result.rowCount !== 1 ? 's' : ''})
              </span>
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
                Download JSON
              </button>
            </div>
          </div>
          <textarea
            readOnly
            className={textareaClass + " h-48"}
            value={result.json}
            spellCheck={false}
          />
        </div>
      )}

      {!result && (
        <p className="text-xs text-surface-400 text-center py-2">Paste CSV above to convert it to JSON</p>
      )}
    </div>
  );
}
