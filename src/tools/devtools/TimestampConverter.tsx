import { useState, useEffect } from 'react';
import ResultBox from '../../components/ui/ResultBox';
import { Button } from '../../components/ui/FormControls';

function formatDate(d: Date): Record<string, string> {
  return {
    'ISO 8601': d.toISOString(),
    'UTC': d.toUTCString(),
    'Local': d.toLocaleString(),
    'Date Only': d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    'Unix (seconds)': Math.floor(d.getTime() / 1000).toString(),
    'Unix (milliseconds)': d.getTime().toString(),
  };
}

export default function TimestampConverter() {
  const [mode, setMode] = useState<'to-date' | 'to-unix'>('to-date');
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Record<string, string> | null>(null);
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(t);
  }, []);

  const convert = () => {
    setError('');
    if (!input.trim()) return;

    if (mode === 'to-date') {
      const num = Number(input.trim());
      if (isNaN(num)) { setError('Enter a valid number'); return; }
      // Auto-detect seconds vs milliseconds
      const ms = num > 1e12 ? num : num * 1000;
      const d = new Date(ms);
      if (isNaN(d.getTime())) { setError('Invalid timestamp'); return; }
      setResults(formatDate(d));
    } else {
      const d = new Date(input.trim());
      if (isNaN(d.getTime())) { setError('Invalid date string. Try: 2024-01-15 or Jan 15, 2024'); return; }
      setResults(formatDate(d));
    }
  };

  const useNow = () => {
    setResults(formatDate(new Date()));
  };

  return (
    <div>
      {/* Live clock */}
      <div className="flex items-center justify-center gap-2 mb-4 py-2 rounded-lg bg-surface-100 dark:bg-surface-800">
        <span className="text-xs text-surface-500">Now:</span>
        <span className="font-mono text-sm font-bold text-brand-500">{now}</span>
        <button onClick={useNow} className="text-[10px] font-semibold text-brand-500 hover:text-brand-600 underline">
          Convert
        </button>
      </div>

      <div className="flex gap-1.5 mb-3">
        {([['to-date', 'Timestamp → Date'], ['to-unix', 'Date → Timestamp']] as const).map(([m, label]) => (
          <button
            key={m}
            onClick={() => { setMode(m as any); setResults(null); setError(''); setInput(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              mode === m
                ? 'bg-brand-500 text-white'
                : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mb-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && convert()}
          placeholder={mode === 'to-date' ? 'Enter Unix timestamp (e.g. 1700000000)' : 'Enter date (e.g. 2024-01-15 or Jan 15, 2024)'}
          className="input-field font-mono text-sm"
        />
      </div>

      <Button onClick={convert} className="w-full mb-3">
        Convert
      </Button>

      {error && <div className="text-red-500 text-xs mb-3 text-center">{error}</div>}

      {results && (
        <div className="space-y-2">
          {Object.entries(results).map(([label, value]) => (
            <ResultBox key={label} label={label} value={value} large={false} />
          ))}
        </div>
      )}
    </div>
  );
}
