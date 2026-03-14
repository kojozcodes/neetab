import { useState, useMemo } from 'react';

interface Field {
  label: string;
  min: number;
  max: number;
  names?: string[];
}

const FIELDS: Field[] = [
  { label: 'Minute', min: 0, max: 59 },
  { label: 'Hour', min: 0, max: 23 },
  { label: 'Day of Month', min: 1, max: 31 },
  { label: 'Month', min: 1, max: 12, names: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] },
  { label: 'Day of Week', min: 0, max: 6, names: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'] },
];

const PRESETS = [
  { label: 'Every minute', expr: '* * * * *' },
  { label: 'Every hour', expr: '0 * * * *' },
  { label: 'Every day at midnight', expr: '0 0 * * *' },
  { label: 'Every day at noon', expr: '0 12 * * *' },
  { label: 'Every Monday 9am', expr: '0 9 * * 1' },
  { label: 'Every weekday 9am', expr: '0 9 * * 1-5' },
  { label: 'Every Sunday midnight', expr: '0 0 * * 0' },
  { label: 'Every 15 minutes', expr: '*/15 * * * *' },
  { label: 'Every 6 hours', expr: '0 */6 * * *' },
  { label: '1st of every month', expr: '0 0 1 * *' },
  { label: 'Every quarter', expr: '0 0 1 */3 *' },
  { label: 'Every year Jan 1', expr: '0 0 1 1 *' },
];

function parseField(part: string, field: Field): string {
  const { min, max, names } = field;

  const resolveName = (s: string): string => {
    if (names) {
      const idx = names.findIndex(n => n.toLowerCase() === s.toLowerCase());
      if (idx !== -1) return String(idx + (field.label === 'Month' ? 1 : 0));
    }
    return s;
  };

  if (part === '*') return `every ${field.label.toLowerCase()}`;

  if (part.startsWith('*/')) {
    const step = Number(part.slice(2));
    if (!isNaN(step)) return `every ${step} ${field.label.toLowerCase()}${step > 1 ? 's' : ''}`;
  }

  const parts = part.split(',');
  if (parts.length > 1) {
    const labels = parts.map(p => parseField(p, field));
    return labels.slice(0, -1).join(', ') + ' and ' + labels[labels.length - 1];
  }

  if (part.includes('-')) {
    const [from, to] = part.split('-').map(resolveName);
    const fromLabel = names ? names[Number(from) - (field.label === 'Month' ? 1 : 0)] ?? from : from;
    const toLabel = names ? names[Number(to) - (field.label === 'Month' ? 1 : 0)] ?? to : to;
    return `${fromLabel} through ${toLabel}`;
  }

  if (part.includes('/')) {
    const [range, step] = part.split('/');
    const rangeDesc = parseField(range, field);
    return `${rangeDesc}, every ${step} ${field.label.toLowerCase()}${Number(step) > 1 ? 's' : ''}`;
  }

  const n = Number(resolveName(part));
  if (!isNaN(n)) {
    if (n < min || n > max) return `(out of range: ${part})`;
    if (names) {
      const label = field.label === 'Month' ? names[n - 1] : names[n];
      return label ?? String(n);
    }
    return String(n);
  }

  return part;
}

function explain(expr: string): { lines: string[]; error: string | null } {
  const trimmed = expr.trim();
  const parts = trimmed.split(/\s+/);
  if (parts.length !== 5) return { lines: [], error: `Expected 5 fields, got ${parts.length}. Format: minute hour day month weekday` };
  try {
    const lines = FIELDS.map((f, i) => `${f.label}: ${parseField(parts[i], f)}`);
    return { lines, error: null };
  } catch (e: unknown) {
    return { lines: [], error: (e as Error).message };
  }
}

function nextRuns(expr: string, count = 5): Date[] {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return [];
  const results: Date[] = [];
  const now = new Date();
  now.setSeconds(0, 0);
  const d = new Date(now.getTime() + 60000);

  const matchField = (val: number, part: string, min: number, max: number): boolean => {
    if (part === '*') return true;
    if (part.startsWith('*/')) { const s = Number(part.slice(2)); return (val - min) % s === 0; }
    return part.split(',').some(p => {
      if (p.includes('-')) {
        const [a, b] = p.split('-').map(Number);
        return val >= a && val <= b;
      }
      if (p.includes('/')) {
        const [range, step] = p.split('/');
        const [a, b] = range.includes('-') ? range.split('-').map(Number) : [min, max];
        return val >= a && val <= b && (val - a) % Number(step) === 0;
      }
      return val === Number(p);
    });
  };

  let safety = 0;
  while (results.length < count && safety++ < 100000) {
    if (
      matchField(d.getMinutes(), parts[0], 0, 59) &&
      matchField(d.getHours(), parts[1], 0, 23) &&
      matchField(d.getDate(), parts[2], 1, 31) &&
      matchField(d.getMonth() + 1, parts[3], 1, 12) &&
      matchField(d.getDay(), parts[4], 0, 6)
    ) {
      results.push(new Date(d));
    }
    d.setMinutes(d.getMinutes() + 1);
  }
  return results;
}

export default function CronParser() {
  const [expr, setExpr] = useState('0 9 * * 1-5');
  const [copied, setCopied] = useState(false);

  const { lines, error } = useMemo(() => explain(expr), [expr]);
  const runs = useMemo(() => {
    if (error) return [];
    return nextRuns(expr);
  }, [expr, error]);

  const copy = () => {
    navigator.clipboard.writeText(expr);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const fmtDate = (d: Date) =>
    d.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">Cron Expression</label>
        <div className="relative">
          <input
            type="text"
            value={expr}
            onChange={e => setExpr(e.target.value)}
            spellCheck={false}
            className="w-full px-3 py-2.5 pr-16 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            placeholder="* * * * *"
          />
          <button
            onClick={copy}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-surface-400 hover:text-brand-500 transition-colors px-2 py-1"
          >
            {copied ? '✓' : 'Copy'}
          </button>
        </div>
        <div className="flex justify-between mt-1 px-1">
          {['min', 'hour', 'day', 'month', 'weekday'].map(l => (
            <span key={l} className="text-[10px] text-surface-400">{l}</span>
          ))}
        </div>
      </div>

      {error ? (
        <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{error}</p>
      ) : (
        <div className="rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
          <div className="bg-surface-100 dark:bg-surface-800 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-surface-400">Explanation</p>
          </div>
          <div className="divide-y divide-surface-100 dark:divide-surface-800">
            {lines.map((l, i) => {
              const [label, ...rest] = l.split(': ');
              return (
                <div key={i} className="flex items-center gap-3 px-3 py-2 bg-surface-50 dark:bg-surface-900">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-surface-400 w-24 flex-shrink-0">{label}</span>
                  <span className="text-xs text-surface-700 dark:text-surface-300">{rest.join(': ')}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {runs.length > 0 && (
        <div className="rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
          <div className="bg-surface-100 dark:bg-surface-800 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-surface-400">Next 5 executions</p>
          </div>
          <div className="divide-y divide-surface-100 dark:divide-surface-800">
            {runs.map((d, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 bg-surface-50 dark:bg-surface-900">
                <span className="text-[10px] text-surface-400 w-4 flex-shrink-0">{i + 1}</span>
                <span className="text-xs font-mono text-surface-700 dark:text-surface-300">{fmtDate(d)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-xs font-bold text-surface-600 dark:text-surface-400 mb-2">Presets</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button
              key={p.expr}
              onClick={() => setExpr(p.expr)}
              className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${expr === p.expr ? 'bg-brand-500 text-white border-brand-500' : 'border-surface-300 dark:border-surface-600 text-surface-600 dark:text-surface-400 hover:border-brand-400'}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
