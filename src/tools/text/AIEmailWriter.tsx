import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';
const taClass = "w-full px-3 py-2.5 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/40";
const inputClass = "w-full px-3 py-2.5 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40";

const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly',     label: 'Friendly' },
  { value: 'formal',       label: 'Formal' },
  { value: 'persuasive',   label: 'Persuasive' },
  { value: 'concise',      label: 'Concise' },
];

export default function AIEmailWriter() {
  const [purpose, setPurpose] = useState('');
  const [context, setContext] = useState('');
  const [tone, setTone] = useState('professional');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const run = async () => {
    if (!context.trim()) return;
    setLoading(true); setError(''); setResult('');
    try {
      const r = await fetch(`${API_URL}/api/ai/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'email',
          text: context,
          options: { purpose, tone },
        }),
      });
      if (!r.ok) { const e = await r.json(); throw new Error(e.detail || 'Request failed'); }
      setResult((await r.json()).result);
    } catch (e: unknown) { setError((e as Error).message); }
    finally { setLoading(false); }
  };

  const copy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">Tone</label>
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
        <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">Email purpose <span className="font-normal text-surface-400">(optional)</span></label>
        <input type="text" className={inputClass} placeholder="e.g. Follow up on interview, Request a meeting, Cold outreach..." value={purpose} onChange={e => setPurpose(e.target.value)} maxLength={200} />
      </div>

      <div>
        <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">
          Context / details <span className="font-normal text-surface-400">({context.length}/2000)</span>
        </label>
        <textarea className={`${taClass} h-36`}
          placeholder="Describe what you want to say. Include recipient, your role, key points, any relevant background..."
          value={context} onChange={e => setContext(e.target.value)} maxLength={2000} />
      </div>

      <button onClick={run} disabled={loading || !context.trim()}
        className="w-full py-2.5 text-xs font-bold bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
        {loading ? 'Writing email...' : 'Write Email'}
      </button>

      {error && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{error}</p>}

      {result && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-surface-600 dark:text-surface-400">Your email</label>
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
