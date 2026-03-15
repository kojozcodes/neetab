import { useState } from 'react';

const API_URL = import.meta.env.PUBLIC_API_URL || '';
const taClass = "w-full px-3 py-2.5 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/40";
const inputClass = "w-full px-3 py-2.5 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40";

export default function CoverLetterGenerator() {
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [background, setBackground] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const run = async () => {
    if (!jobTitle.trim() || !company.trim() || !background.trim()) return;
    if (!API_URL) { setError('AI service is temporarily unavailable. Please try again in a moment.'); return; }
    setLoading(true); setError(''); setResult('');
    try {
      const r = await fetch(`${API_URL}/api/ai/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'cover_letter',
          text: background,
          options: { job_title: jobTitle, company },
        }),
      });
      const data = await r.json().catch(() => ({})) as Record<string, string>;
      if (!r.ok) throw new Error(data.detail || `Server error (${r.status})`);
      setResult(data.result || '');
    } catch (e: unknown) { setError((e as Error).message); }
    finally { setLoading(false); }
  };

  const copy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  const canRun = jobTitle.trim() && company.trim() && background.trim();

  return (
    <div className="space-y-4">
      <div className="px-4 py-3 rounded-xl bg-brand-50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-800">
        <p className="text-xs text-brand-700 dark:text-brand-400 leading-relaxed">
          Enter the job title, company name, and a brief summary of your experience. AI will write a tailored, professional cover letter in seconds.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">Job title</label>
          <input type="text" className={inputClass} placeholder="e.g. Software Engineer" value={jobTitle} onChange={e => setJobTitle(e.target.value)} maxLength={100} />
        </div>
        <div>
          <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">Company name</label>
          <input type="text" className={inputClass} placeholder="e.g. Google" value={company} onChange={e => setCompany(e.target.value)} maxLength={100} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">
          Your background <span className="font-normal text-surface-400">({background.length}/2000)</span>
        </label>
        <textarea className={`${taClass} h-32`}
          placeholder="Briefly describe your experience, skills, and why you're a great fit. e.g. 5 years of React/Node experience, led 3-person team, built products used by 100K users..."
          value={background} onChange={e => setBackground(e.target.value)} maxLength={2000} />
      </div>

      <button onClick={run} disabled={loading || !canRun}
        className="w-full py-2.5 text-xs font-bold bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
        {loading ? 'Generating cover letter...' : 'Generate Cover Letter'}
      </button>

      {error && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{error}</p>}

      <p className="text-xs text-surface-400 text-center">Text is processed by AI and not stored on our servers.</p>

      {result && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-surface-600 dark:text-surface-400">Cover letter</label>
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
