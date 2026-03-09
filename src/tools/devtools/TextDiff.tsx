import { useState } from 'react';
import { Button } from '../../components/ui/FormControls';

interface DiffLine {
  type: 'same' | 'add' | 'remove';
  text: string;
  lineNum: { left?: number; right?: number };
}

interface SideBySideRow {
  left:  { lineNum: number | null; text: string | null; type: 'same' | 'remove' | 'empty' };
  right: { lineNum: number | null; text: string | null; type: 'same' | 'add'    | 'empty' };
}

function computeDiff(a: string, b: string): DiffLine[] {
  const linesA = a.split('\n');
  const linesB = b.split('\n');
  const m = linesA.length, n = linesB.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = linesA[i - 1] === linesB[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);

  let i = m, j = n;
  const ops: DiffLine[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
      ops.unshift({ type: 'same', text: linesA[i - 1], lineNum: { left: i, right: j } });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      ops.unshift({ type: 'add', text: linesB[j - 1], lineNum: { right: j } });
      j--;
    } else {
      ops.unshift({ type: 'remove', text: linesA[i - 1], lineNum: { left: i } });
      i--;
    }
  }

  return ops;
}

function toSideBySide(diff: DiffLine[]): SideBySideRow[] {
  const rows: SideBySideRow[] = [];
  let i = 0;

  while (i < diff.length) {
    const line = diff[i];

    if (line.type === 'same') {
      rows.push({
        left:  { lineNum: line.lineNum.left!,  text: line.text, type: 'same' },
        right: { lineNum: line.lineNum.right!, text: line.text, type: 'same' },
      });
      i++;
    } else {
      // Collect consecutive removes then adds
      const removes: DiffLine[] = [];
      const adds: DiffLine[] = [];
      while (i < diff.length && diff[i].type === 'remove') removes.push(diff[i++]);
      while (i < diff.length && diff[i].type === 'add')    adds.push(diff[i++]);

      const len = Math.max(removes.length, adds.length);
      for (let j = 0; j < len; j++) {
        const rem = removes[j];
        const add = adds[j];
        rows.push({
          left:  rem ? { lineNum: rem.lineNum.left!,  text: rem.text, type: 'remove' }
                     : { lineNum: null, text: null, type: 'empty' },
          right: add ? { lineNum: add.lineNum.right!, text: add.text, type: 'add' }
                     : { lineNum: null, text: null, type: 'empty' },
        });
      }
    }
  }

  return rows;
}

const MONO = { fontFamily: "'JetBrains Mono', 'Fira Mono', monospace" } as const;

export default function TextDiff() {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [rows, setRows]   = useState<SideBySideRow[] | null>(null);
  const [stats, setStats] = useState({ added: 0, removed: 0, same: 0 });

  const compare = () => {
    const MAX_LINES = 5000;
    if (textA.split('\n').length > MAX_LINES || textB.split('\n').length > MAX_LINES) return;
    const diff = computeDiff(textA, textB);
    setRows(toSideBySide(diff));
    setStats({
      added:   diff.filter(d => d.type === 'add').length,
      removed: diff.filter(d => d.type === 'remove').length,
      same:    diff.filter(d => d.type === 'same').length,
    });
  };

  const clear  = () => { setTextA(''); setTextB(''); setRows(null); };
  const goBack = () => setRows(null);

  if (!rows) {
    return (
      <div>
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          <div>
            <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-1.5">Original</label>
            <textarea
              value={textA}
              onChange={e => setTextA(e.target.value)}
              placeholder="Paste original text..."
              className="input-field resize-y text-xs"
              style={{ ...MONO, minHeight: 250 }}
              maxLength={500000}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-1.5">Modified</label>
            <textarea
              value={textB}
              onChange={e => setTextB(e.target.value)}
              placeholder="Paste modified text..."
              className="input-field resize-y text-xs"
              style={{ ...MONO, minHeight: 250 }}
              maxLength={500000}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={compare} className="flex-1" disabled={!textA && !textB}>
            Compare
          </Button>
          {(textA || textB) && (
            <Button variant="secondary" onClick={clear} className="!px-5">
              Clear
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats + back */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-3 text-xs font-semibold">
          <span className="text-emerald-600 dark:text-emerald-400">+{stats.added} added</span>
          <span className="text-red-500">−{stats.removed} removed</span>
          <span className="text-surface-400">{stats.same} unchanged</span>
        </div>
        <button
          onClick={goBack}
          className="text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors"
        >
          ← Edit
        </button>
      </div>

      {/* Side-by-side diff */}
      <div className="rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden text-xs" style={MONO}>
        {/* Column headers */}
        <div className="grid grid-cols-2 bg-surface-100 dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700">
          <div className="px-3 py-1.5 text-[10px] font-bold text-surface-400 uppercase tracking-wider border-r border-surface-200 dark:border-surface-700">
            Original
          </div>
          <div className="px-3 py-1.5 text-[10px] font-bold text-surface-400 uppercase tracking-wider">
            Modified
          </div>
        </div>

        {/* Rows */}
        <div className="max-h-[500px] overflow-y-auto overflow-x-auto">
          {rows.map((row, idx) => (
            <div key={idx} className="grid grid-cols-2 leading-5">
              {/* Left cell */}
              <div className={`flex min-w-0 border-r border-surface-200 dark:border-surface-700 ${
                row.left.type === 'remove' ? 'bg-red-50    dark:bg-red-950/40' :
                row.left.type === 'empty'  ? 'bg-surface-50 dark:bg-surface-800/50' :
                                             'bg-white dark:bg-surface-900'
              }`}>
                <span className="w-9 shrink-0 text-right pr-2 py-0.5 text-[10px] text-surface-400 dark:text-surface-600 select-none border-r border-surface-200 dark:border-surface-700">
                  {row.left.lineNum ?? ''}
                </span>
                <span className={`py-0.5 px-2 whitespace-pre-wrap break-words min-w-0 ${
                  row.left.type === 'remove' ? 'text-red-700 dark:text-red-300' :
                                               'text-surface-600 dark:text-surface-400'
                }`}>
                  {row.left.text ?? ''}
                </span>
              </div>

              {/* Right cell */}
              <div className={`flex min-w-0 ${
                row.right.type === 'add'   ? 'bg-emerald-50 dark:bg-emerald-950/40' :
                row.right.type === 'empty' ? 'bg-surface-50 dark:bg-surface-800/50' :
                                             'bg-white dark:bg-surface-900'
              }`}>
                <span className="w-9 shrink-0 text-right pr-2 py-0.5 text-[10px] text-surface-400 dark:text-surface-600 select-none border-r border-surface-200 dark:border-surface-700">
                  {row.right.lineNum ?? ''}
                </span>
                <span className={`py-0.5 px-2 whitespace-pre-wrap break-words min-w-0 ${
                  row.right.type === 'add' ? 'text-emerald-700 dark:text-emerald-300' :
                                             'text-surface-600 dark:text-surface-400'
                }`}>
                  {row.right.text ?? ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
