import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';
const taClass = "w-full px-3 py-2.5 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/40";

export default function EmailSubjectGenerator() {
  const [emailBody, setEmailBody] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const run = async () => {
    if (!emailBody.trim()) return;
    setLoading(true); setError(''); setResult('');
    try {
      const r = await fetch(`${API_URL}/api/ai/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: 'email_subject', text: emailBody }),
      });
      if (!r.ok) { const e = await r.json(); throw new Error(e.detail || 'Request failed'); }
      setResult((await r.json()).result);
    } catch (e: unknown) { setError((e as Error).message); }
    finally { setLoading(false); }
  };

  // Parse numbered list from AI response
  const lines = result
    ? result.split('\n').map(l => l.replace(/^\d+[\.\)]\s*/, '').trim()).filter(Boolean)
    : [];

  const copy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="px-4 py-3 rounded-xl bg-brand-50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-800">
        <p className="text-xs text-brand-700 dark:text-brand-400 leading-relaxed">
          Paste your email body and get 8 compelling subject lines optimized for opens.
        </p>
      </div>

      <div>
        <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">
          Email body <span className="font-normal text-surface-400">({emailBody.length}/3000)</span>
        </label>
        <textarea className={`${taClass} h-40`}
          placeholder="Paste your email content here..."
          value={emailBody} onChange={e => setEmailBody(e.target.value)} maxLength={3000} />
      </div>

      <button onClick={run} disabled={loading || !emailBody.trim()}
        className="w-full py-2.5 text-xs font-bold bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
        {loading ? 'Generating subject lines...' : 'Generate Subject Lines'}
      </button>

      {error && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{error}</p>}

      {lines.length > 0 && (
        <div className="space-y-2">
          <label className="block text-xs font-bold text-surface-600 dark:text-surface-400">Subject lines - click to copy</label>
          {lines.map((line, i) => (
            <button key={i} onClick={() => copy(line, i)}
              className="w-full text-left px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/20 transition-colors group">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-surface-700 dark:text-surface-300">{line}</span>
                <span className="text-xs text-surface-400 group-hover:text-brand-500 flex-shrink-0 transition-colors">
                  {copiedIdx === i ? '✓ Copied' : 'Copy'}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
