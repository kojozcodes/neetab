import { useState, useMemo } from 'react';

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const results = useMemo(() => {
    setError('');
    if (!pattern || !text) return { matches: [], highlighted: escapeHtml(text) };

    try {
      const regex = new RegExp(pattern, flags);
      const matches: { match: string; index: number; groups?: Record<string, string> }[] = [];
      const maxSteps = 10000;
      let steps = 0;

      if (flags.includes('g')) {
        let m;
        while ((m = regex.exec(text)) !== null) {
          matches.push({ match: m[0], index: m.index, groups: m.groups });
          if (m[0].length === 0) regex.lastIndex++;
          if (++steps > maxSteps) { setError('Too many matches (limit: 10,000)'); break; }
        }
      } else {
        const m = regex.exec(text);
        if (m) matches.push({ match: m[0], index: m.index, groups: m.groups });
      }

      // Build highlighted text — HTML-escape all user content
      let highlighted = '';
      let lastIdx = 0;
      for (const m of matches) {
        highlighted += escapeHtml(text.slice(lastIdx, m.index));
        highlighted += `<mark class="bg-brand-200 dark:bg-brand-500/30 text-brand-800 dark:text-brand-200 rounded px-0.5">${escapeHtml(text.slice(m.index, m.index + m.match.length))}</mark>`;
        lastIdx = m.index + m.match.length;
      }
      highlighted += escapeHtml(text.slice(lastIdx));

      return { matches, highlighted };
    } catch (e: any) {
      setError(e.message || 'Invalid regex');
      return { matches: [], highlighted: escapeHtml(text) };
    }
  }, [pattern, flags, text]);

  const flagOptions = [
    { key: 'g', label: 'Global' },
    { key: 'i', label: 'Case-insensitive' },
    { key: 'm', label: 'Multiline' },
    { key: 's', label: 'Dotall' },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-surface-400 text-sm font-mono">/</span>
        <input
          value={pattern}
          onChange={e => setPattern(e.target.value)}
          placeholder="Enter regex pattern..."
          className="input-field flex-1 font-mono text-sm"
          maxLength={500}
        />
        <span className="text-surface-400 text-sm font-mono">/</span>
        <input
          value={flags}
          onChange={e => setFlags(e.target.value)}
          className="input-field w-16 text-center font-mono text-sm"
          placeholder="gi"
          maxLength={6}
        />
      </div>

      <div className="flex gap-2 mb-3 flex-wrap">
        {flagOptions.map(f => (
          <label key={f.key} className="flex items-center gap-1 text-[10px] text-surface-500 cursor-pointer">
            <input
              type="checkbox"
              checked={flags.includes(f.key)}
              onChange={e => {
                setFlags(prev => e.target.checked ? prev + f.key : prev.replace(f.key, ''));
              }}
              className="rounded border-surface-300 text-brand-500 w-3 h-3"
            />
            {f.label}
          </label>
        ))}
      </div>

      {error && <div className="text-red-500 text-xs mb-3 px-1">{error}</div>}

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Enter test string..."
        className="input-field min-h-[100px] resize-y mb-3 font-mono text-sm"
        maxLength={50000}
      />

      {text && pattern && !error && (
        <>
          {/* Highlighted preview */}
          <div className="mb-3">
            <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-1.5">Highlighted Matches</label>
            <div
              className="bg-surface-100 dark:bg-surface-800 rounded-xl p-3 font-mono text-xs whitespace-pre-wrap break-all leading-relaxed"
              dangerouslySetInnerHTML={{ __html: results.highlighted }}
            />
          </div>

          {/* Match count */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-bold ${results.matches.length > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {results.matches.length} match{results.matches.length !== 1 ? 'es' : ''}
            </span>
          </div>

          {/* Match details */}
          {results.matches.length > 0 && (
            <div className="bg-surface-100 dark:bg-surface-800 rounded-xl overflow-hidden max-h-[150px] overflow-y-auto">
              {results.matches.slice(0, 100).map((m, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-1.5 text-xs border-b border-surface-200 dark:border-surface-700 last:border-0">
                  <span className="text-surface-400 w-6 text-right">{i + 1}</span>
                  <span className="font-mono font-bold text-brand-600 dark:text-brand-400">"{escapeHtml(m.match)}"</span>
                  <span className="text-surface-400 ml-auto">idx {m.index}</span>
                </div>
              ))}
              {results.matches.length > 100 && (
                <div className="px-3 py-1.5 text-xs text-surface-400 text-center">
                  ...and {results.matches.length - 100} more
                </div>
              )}
            </div>
          )}
        </>
      )}

      {!text && !pattern && (
        <div className="text-center py-4 text-surface-400 text-xs">
          Enter a regex pattern and test string to see matches
        </div>
      )}
    </div>
  );
}
