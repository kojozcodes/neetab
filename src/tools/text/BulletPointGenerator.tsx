import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';
const taClass = "w-full px-3 py-2.5 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/40";

export default function BulletPointGenerator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const run = async () => {
    if (!input.trim()) return;
    setLoading(true); setError(''); setResult('');
    try {
      const r = await fetch(`${API_URL}/api/ai/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: 'bullets', text: input }),
      });
      if (!r.ok) { const e = await r.json(); throw new Error(e.detail || 'Request failed'); }
      setResult((await r.json()).result);
    } catch (e: unknown) { setError((e as Error).message); }
    finally { setLoading(false); }
  };

  const copy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  // Parse bullet lines for display
  const bullets = result
    ? result.split('\n').map(l => l.replace(/^[-*]\s*/, '').trim()).filter(Boolean)
    : [];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">
          Text to convert <span className="font-normal text-surface-400">({input.length}/5000)</span>
        </label>
        <textarea className={`${taClass} h-44`}
          placeholder="Paste a paragraph, article, or any block of text. AI will extract the key points as clean bullet points..."
          value={input} onChange={e => setInput(e.target.value)} maxLength={5000} />
      </div>

      <button onClick={run} disabled={loading || !input.trim()}
        className="w-full py-2.5 text-xs font-bold bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
        {loading ? 'Generating bullets...' : 'Generate Bullet Points'}
      </button>

      {error && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{error}</p>}

      {bullets.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-surface-600 dark:text-surface-400">Bullet points</label>
            <button onClick={copy} className="text-xs text-surface-400 hover:text-brand-500 transition-colors">
              {copied ? '✓ Copied' : 'Copy all'}
            </button>
          </div>
          <div className="px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 space-y-2">
            {bullets.map((b, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                <span className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">{b}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
