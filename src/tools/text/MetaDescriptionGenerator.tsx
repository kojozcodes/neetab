import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';
const taClass = "w-full px-3 py-2.5 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/40";
const inputClass = "w-full px-3 py-2.5 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40";

export default function MetaDescriptionGenerator() {
  const [topic, setTopic] = useState('');
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const run = async () => {
    if (!topic.trim()) return;
    setLoading(true); setError(''); setResult('');
    try {
      const r = await fetch(`${API_URL}/api/ai/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: 'meta_desc', text: topic, options: { keyword } }),
      });
      if (!r.ok) { const e = await r.json(); throw new Error(e.detail || 'Request failed'); }
      setResult((await r.json()).result);
    } catch (e: unknown) { setError((e as Error).message); }
    finally { setLoading(false); }
  };

  // Parse numbered list
  const descs = result
    ? result.split('\n').map(l => l.replace(/^\d+[\.\)]\s*/, '').trim()).filter(Boolean)
    : [];

  const copy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const getCharColor = (len: number) => {
    if (len >= 150 && len <= 160) return 'text-green-500';
    if (len >= 140 && len <= 165) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-4">
      <div className="px-4 py-3 rounded-xl bg-brand-50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-800">
        <p className="text-xs text-brand-700 dark:text-brand-400 leading-relaxed">
          Generate 3 SEO-optimized meta descriptions (150-160 chars) for any page. Include a target keyword to boost search relevance.
        </p>
      </div>

      <div>
        <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">
          Page topic / content <span className="font-normal text-surface-400">({topic.length}/1000)</span>
        </label>
        <textarea className={`${taClass} h-28`}
          placeholder="Describe your page. e.g. A free online tool that converts PDF files to editable Word documents in seconds without losing formatting..."
          value={topic} onChange={e => setTopic(e.target.value)} maxLength={1000} />
      </div>

      <div>
        <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">Target keyword <span className="font-normal text-surface-400">(optional)</span></label>
        <input type="text" className={inputClass} placeholder="e.g. pdf to word converter" value={keyword} onChange={e => setKeyword(e.target.value)} maxLength={100} />
      </div>

      <button onClick={run} disabled={loading || !topic.trim()}
        className="w-full py-2.5 text-xs font-bold bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
        {loading ? 'Generating meta descriptions...' : 'Generate Meta Descriptions'}
      </button>

      {error && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{error}</p>}

      {descs.length > 0 && (
        <div className="space-y-3">
          <label className="block text-xs font-bold text-surface-600 dark:text-surface-400">Meta descriptions - click to copy</label>
          {descs.map((desc, i) => (
            <button key={i} onClick={() => copy(desc, i)}
              className="w-full text-left px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/20 transition-colors group">
              <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed mb-1.5">{desc}</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${getCharColor(desc.length)}`}>{desc.length} chars</span>
                <span className="text-xs text-surface-400 group-hover:text-brand-500 transition-colors">
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
