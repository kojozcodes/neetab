import { useState, useCallback } from 'react';
import { Select, Button } from '../../components/ui/FormControls';

export default function JSONFormatter() {
  const [input, setInput] = useState('{"name":"Hamza","age":25,"skills":["React","Python","Docker"],"address":{"city":"Lagos","country":"Nigeria"}}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState('2');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ keys: 0, depth: 0, size: '' });

  const getDepth = (obj: any, d = 0): number => {
    if (typeof obj !== 'object' || obj === null) return d;
    return Math.max(...Object.values(obj).map((v: any) => getDepth(v, d + 1)), d);
  };

  const countKeys = (obj: any): number => {
    if (typeof obj !== 'object' || obj === null) return 0;
    if (Array.isArray(obj)) return obj.reduce((s, v) => s + countKeys(v), 0);
    return Object.keys(obj).length + Object.values(obj).reduce((s: number, v: any) => s + countKeys(v), 0);
  };

  const format = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const spaces = indent === 'tab' ? '\t' : parseInt(indent);
      const formatted = JSON.stringify(parsed, null, spaces);
      setOutput(formatted);
      setError('');
      setStats({
        keys: countKeys(parsed),
        depth: getDepth(parsed),
        size: `${new Blob([input]).size}B → ${new Blob([formatted]).size}B`,
      });
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  }, [input, indent]);

  const minify = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError('');
      setStats({
        keys: countKeys(parsed),
        depth: getDepth(parsed),
        size: `${new Blob([input]).size}B → ${new Blob([minified]).size}B`,
      });
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  }, [input]);

  return (
    <div>
      {/* Input */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-xs font-semibold text-surface-600 dark:text-surface-500">Input JSON</label>
          <button onClick={() => { setInput(''); setOutput(''); setError(''); }}
            className="text-[10px] font-semibold text-surface-400 hover:text-brand-500">Clear</button>
        </div>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder='Paste your JSON here...'
          className="input-field font-mono text-xs min-h-[100px] resize-y leading-relaxed"
          spellCheck={false}
        />
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-xs text-red-600 dark:text-red-400 font-mono">
          ❌ {error}
        </div>
      )}

      {/* Action bar */}
      <div className="flex gap-2 mb-2">
        <Select label="" value={indent} onChange={setIndent} options={[
          { value: '2', label: '2 spaces' }, { value: '4', label: '4 spaces' }, { value: 'tab', label: 'Tab' },
        ]} />
        <Button onClick={format} className="flex-1 !py-2.5">Format</Button>
        <Button onClick={minify} variant="secondary" className="!py-2.5">Minify</Button>
      </div>

      {/* Output */}
      {output && (
        <div>
          {/* Stats row */}
          <div className="flex gap-3 mb-2 text-[10px] font-semibold text-surface-400">
            <span>✅ Valid</span>
            <span>{stats.keys} keys</span>
            <span>Depth: {stats.depth}</span>
            <span>{stats.size}</span>
          </div>

          <div className="relative">
            <pre className="bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl p-4 text-xs font-mono text-surface-700 dark:text-surface-300 leading-relaxed max-h-[220px] overflow-auto whitespace-pre-wrap break-all">
              {output}
            </pre>
            <button
              onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
              className="absolute top-2 right-2 px-2.5 py-1 text-[10px] font-bold rounded-md bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 text-surface-500 hover:text-brand-500 hover:border-brand-500 transition-colors"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
