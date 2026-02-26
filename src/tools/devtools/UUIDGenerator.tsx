import { useState, useCallback } from 'react';
import { Button } from '../../components/ui/FormControls';
import ResultBox from '../../components/ui/ResultBox';

function generateUUID(): string {
  return crypto.randomUUID();
}

export default function UUIDGenerator() {
  const [uuids, setUuids] = useState<string[]>([generateUUID()]);
  const [count, setCount] = useState(1);
  const [format, setFormat] = useState<'lower' | 'upper' | 'no-dash'>('lower');

  const generate = useCallback(() => {
    const list = Array.from({ length: count }, () => {
      let id = generateUUID();
      if (format === 'upper') id = id.toUpperCase();
      if (format === 'no-dash') id = id.replace(/-/g, '');
      return id;
    });
    setUuids(list);
  }, [count, format]);

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        <div>
          <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-1.5">Count</label>
          <select
            value={count}
            onChange={e => setCount(Number(e.target.value))}
            className="input-field cursor-pointer"
          >
            {[1, 5, 10, 25, 50].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-1.5">Format</label>
          <select
            value={format}
            onChange={e => setFormat(e.target.value as any)}
            className="input-field cursor-pointer"
          >
            <option value="lower">lowercase</option>
            <option value="upper">UPPERCASE</option>
            <option value="no-dash">No dashes</option>
          </select>
        </div>
      </div>

      <Button onClick={generate} className="w-full mb-3">
        🎲 Generate UUID{count > 1 ? 's' : ''}
      </Button>

      {uuids.length === 1 ? (
        <ResultBox label="UUID v4" value={uuids[0]} large={true} />
      ) : (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-surface-500">{uuids.length} UUIDs</span>
            <button onClick={copyAll} className="text-xs font-semibold text-brand-500 hover:text-brand-600">
              Copy all
            </button>
          </div>
          <div className="bg-surface-100 dark:bg-surface-800 rounded-xl p-3 max-h-[200px] overflow-y-auto">
            {uuids.map((id, i) => (
              <div key={i} className="font-mono text-xs text-surface-700 dark:text-surface-300 py-0.5 select-all">
                {id}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
