import { useState } from 'react';
import { Button } from '../../components/ui/FormControls';

interface DiffLine {
  type: 'same' | 'add' | 'remove';
  text: string;
  lineNum: { left?: number; right?: number };
}

function computeDiff(a: string, b: string): DiffLine[] {
  const linesA = a.split('\n');
  const linesB = b.split('\n');
  const maxLen = Math.max(linesA.length, linesB.length);
  const result: DiffLine[] = [];

  // Simple LCS-based diff
  const m = linesA.length, n = linesB.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = linesA[i - 1] === linesB[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);

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

export default function TextDiff() {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [diff, setDiff] = useState<DiffLine[] | null>(null);
  const [stats, setStats] = useState({ added: 0, removed: 0, same: 0 });

  const compare = () => {
    const result = computeDiff(textA, textB);
    setDiff(result);
    setStats({
      added: result.filter(d => d.type === 'add').length,
      removed: result.filter(d => d.type === 'remove').length,
      same: result.filter(d => d.type === 'same').length,
    });
  };

  const clear = () => {
    setTextA(''); setTextB(''); setDiff(null);
  };

  return (
    <div>
      {!diff ? (
        <>
          <div className="grid grid-cols-2 gap-2.5 mb-3">
            <div>
              <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-1.5">Original</label>
              <textarea
                value={textA}
                onChange={e => setTextA(e.target.value)}
                placeholder="Paste original text..."
                className="input-field min-h-[140px] resize-y font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-1.5">Modified</label>
              <textarea
                value={textB}
                onChange={e => setTextB(e.target.value)}
                placeholder="Paste modified text..."
                className="input-field min-h-[140px] resize-y font-mono text-xs"
              />
            </div>
          </div>
          <Button onClick={compare} className="w-full" disabled={!textA && !textB}>
            Compare
          </Button>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-3 text-xs font-semibold">
              <span className="text-emerald-600">+{stats.added} added</span>
              <span className="text-red-500">−{stats.removed} removed</span>
              <span className="text-surface-400">{stats.same} unchanged</span>
            </div>
            <button onClick={clear} className="text-xs font-semibold text-brand-500 hover:text-brand-600">
              ← Edit
            </button>
          </div>

          <div className="bg-surface-100 dark:bg-surface-800 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto">
            {diff.map((line, idx) => (
              <div
                key={idx}
                className={`flex font-mono text-xs leading-relaxed ${
                  line.type === 'add'
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300'
                    : line.type === 'remove'
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                    : 'text-surface-600 dark:text-surface-400'
                }`}
              >
                <span className="w-8 text-right pr-2 text-[10px] text-surface-400 dark:text-surface-600 select-none flex-shrink-0 py-0.5">
                  {line.lineNum.left || line.lineNum.right || ''}
                </span>
                <span className="w-5 text-center font-bold select-none flex-shrink-0 py-0.5">
                  {line.type === 'add' ? '+' : line.type === 'remove' ? '−' : ' '}
                </span>
                <span className="flex-1 py-0.5 pr-3 whitespace-pre-wrap break-all">
                  {line.text || ' '}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
