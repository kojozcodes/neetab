import { useState } from 'react';

const API_URL = import.meta.env.PUBLIC_API_URL || '';
const taClass = "w-full px-3 py-2.5 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/40";

const LENGTHS = [
  { value: 'one sentence', label: '1 Sentence' },
  { value: 'short (2-3 sentences)', label: 'Short' },
  { value: 'concise paragraph', label: 'Paragraph' },
  { value: 'detailed (3-4 paragraphs)', label: 'Detailed' },
];

export default function Summarizer() {
  const [input, setInput] = useState('');
  const [length, setLength] = useState('concise paragraph');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const run = async () => {
    if (!input.trim()) return;
    if (!API_URL) { setError('AI service is temporarily unavailable. Please try again in a moment.'); return; }
    setLoading(true); setError(''); setResult('');
    try {
      const r = await fetch(`${API_URL}/api/ai/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: 'summarize', text: input, options: { length } }),
      });
      const data = await r.json().catch(() => ({})) as Record<string, string>;
      if (!r.ok) throw new Error(data.detail || `Server error (${r.status})`);
      setResult(data.result || '');
    } catch (e: unknown) { setError((e as Error).message); }
    finally { setLoading(false); }
  };

  const copy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">Summary length</label>
        <div className="flex gap-2">
          {LENGTHS.map(l => (
            <button key={l.value} onClick={() => setLength(l.value)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md border transition-colors ${length === l.value ? 'bg-brand-500 text-white border-brand-500' : 'border-surface-300 dark:border-surface-600 text-surface-600 dark:text-surface-400 hover:border-brand-400'}`}>
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">
          Text to summarize <span className="font-normal text-surface-400">({input.length}/8000)</span>
        </label>
        <textarea className={`${taClass} h-44`} placeholder="Paste an article, document, or any long text..." value={input} onChange={e => setInput(e.target.value)} maxLength={8000} />
      </div>

      <button onClick={run} disabled={loading || !input.trim()}
        className="w-full py-2.5 text-xs font-bold bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
        {loading ? 'Summarizing...' : 'Summarize'}
      </button>

      {error && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{error}</p>}

      {result && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-surface-600 dark:text-surface-400">Summary</label>
            <button onClick={copy} className="text-xs text-surface-400 hover:text-brand-500 transition-colors">
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <div className="px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-sm text-surface-700 dark:text-surface-300 leading-relaxed whitespace-pre-wrap">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
