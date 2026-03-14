import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';
const taClass = "w-full px-3 py-2.5 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/40";

const TONES = [
  { value: 'conversational', label: 'Conversational' },
  { value: 'professional',   label: 'Professional' },
  { value: 'friendly',       label: 'Friendly' },
  { value: 'academic',       label: 'Academic' },
];

export default function AIHumanizer() {
  const [input, setInput] = useState('');
  const [tone, setTone] = useState('conversational');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const run = async () => {
    if (!input.trim()) return;
    if (!API_URL) { setError('AI tools require the backend service. Please set VITE_API_URL in Vercel environment variables.'); return; }
    setLoading(true); setError(''); setResult('');
    try {
      const r = await fetch(`${API_URL}/api/ai/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: 'humanize', text: input, options: { tone } }),
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
      <div className="px-4 py-3 rounded-xl bg-brand-50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-800">
        <p className="text-xs text-brand-700 dark:text-brand-400 leading-relaxed">
          Paste AI-generated text to rewrite it with natural sentence variety, human phrasing, and authentic tone.
        </p>
      </div>

      <div>
        <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">Output tone</label>
        <div className="flex flex-wrap gap-2">
          {TONES.map(t => (
            <button key={t.value} onClick={() => setTone(t.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${tone === t.value ? 'bg-brand-500 text-white border-brand-500' : 'border-surface-300 dark:border-surface-600 text-surface-600 dark:text-surface-400 hover:border-brand-400'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">
          AI-generated text <span className="font-normal text-surface-400">({input.length}/8000)</span>
        </label>
        <textarea className={`${taClass} h-40`} placeholder="Paste the AI-generated text here..." value={input} onChange={e => setInput(e.target.value)} maxLength={8000} />
      </div>

      <button onClick={run} disabled={loading || !input.trim()}
        className="w-full py-2.5 text-xs font-bold bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
        {loading ? 'Humanizing...' : 'Humanize Text'}
      </button>

      {error && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{error}</p>}

      {result && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-surface-600 dark:text-surface-400">Humanized result</label>
            <button onClick={copy} className="text-xs text-surface-400 hover:text-brand-500 transition-colors">
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <textarea readOnly className={`${taClass} h-40`} value={result} />
        </div>
      )}
    </div>
  );
}
