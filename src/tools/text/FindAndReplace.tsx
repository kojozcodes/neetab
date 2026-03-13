import { useState, useMemo } from 'react';

const textareaClass = "w-full px-3 py-2 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/40 font-mono";

interface Match {
  start: number;
  end: number;
}

function buildRegex(find: string, caseSensitive: boolean, wholeWord: boolean, useRegex: boolean): RegExp | null {
  if (!find) return null;
  try {
    let pattern = useRegex ? find : find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (wholeWord) pattern = `\\b${pattern}\\b`;
    const flags = 'g' + (caseSensitive ? '' : 'i');
    return new RegExp(pattern, flags);
  } catch {
    return null;
  }
}

function findMatches(text: string, regex: RegExp): Match[] {
  const matches: Match[] = [];
  let m: RegExpExecArray | null;
  regex.lastIndex = 0;
  while ((m = regex.exec(text)) !== null) {
    matches.push({ start: m.index, end: m.index + m[0].length });
    if (m[0].length === 0) regex.lastIndex++;
  }
  return matches;
}

export default function FindAndReplace() {
  const [source, setSource] = useState('');
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [regexError, setRegexError] = useState('');

  const { matches, regex } = useMemo(() => {
    setRegexError('');
    if (!find || !source) return { matches: [], regex: null };
    const r = buildRegex(find, caseSensitive, wholeWord, useRegex);
    if (!r) {
      if (useRegex) setRegexError('Invalid regular expression');
      return { matches: [], regex: null };
    }
    return { matches: findMatches(source, r), regex: r };
  }, [source, find, caseSensitive, wholeWord, useRegex]);

  const highlightedParts = useMemo(() => {
    if (!source || matches.length === 0) return null;
    const parts: { text: string; highlight: boolean }[] = [];
    let cursor = 0;
    for (const m of matches) {
      if (m.start > cursor) parts.push({ text: source.slice(cursor, m.start), highlight: false });
      parts.push({ text: source.slice(m.start, m.end), highlight: true });
      cursor = m.end;
    }
    if (cursor < source.length) parts.push({ text: source.slice(cursor), highlight: false });
    return parts;
  }, [source, matches]);

  const replaceAll = () => {
    if (!regex || !source) return;
    try {
      const r = buildRegex(find, caseSensitive, wholeWord, useRegex);
      if (!r) return;
      setOutput(source.replace(r, replace));
    } catch {
      setOutput(source);
    }
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const Toggle = ({ value, onChange, label }: { value: boolean; onChange: () => void; label: string }) => (
    <label className="flex items-center gap-1.5 cursor-pointer select-none">
      <div
        onClick={onChange}
        className={`relative inline-flex w-7 h-3.5 rounded-full transition-colors ${value ? 'bg-brand-500' : 'bg-surface-300 dark:bg-surface-600'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-2.5 h-2.5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-3.5' : 'translate-x-0'}`} />
      </div>
      <span className="text-xs text-surface-600 dark:text-surface-400">{label}</span>
    </label>
  );

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">Source Text</label>
        <textarea
          className={textareaClass + " h-32"}
          placeholder="Paste your source text here..."
          value={source}
          onChange={e => { setSource(e.target.value); setOutput(''); }}
          spellCheck={false}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1">Find</label>
          <input
            type="text"
            value={find}
            onChange={e => { setFind(e.target.value); setOutput(''); }}
            placeholder="Search term..."
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40 font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1">Replace with</label>
          <input
            type="text"
            value={replace}
            onChange={e => setReplace(e.target.value)}
            placeholder="Replacement..."
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40 font-mono"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Toggle value={caseSensitive} onChange={() => setCaseSensitive(v => !v)} label="Case-sensitive" />
        <Toggle value={wholeWord} onChange={() => setWholeWord(v => !v)} label="Whole word" />
        <Toggle value={useRegex} onChange={() => setUseRegex(v => !v)} label="Regex" />
      </div>

      {regexError && (
        <p className="text-xs text-red-500">{regexError}</p>
      )}

      {source && find && !regexError && (
        <div className="text-xs text-surface-500">
          {matches.length > 0 ? (
            <span className="text-brand-500 font-semibold">{matches.length} match{matches.length !== 1 ? 'es' : ''} found</span>
          ) : (
            <span>No matches found</span>
          )}
        </div>
      )}

      {highlightedParts && (
        <div>
          <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">Preview (matches highlighted)</label>
          <div className="w-full px-3 py-2 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 font-mono max-h-28 overflow-y-auto whitespace-pre-wrap break-words">
            {highlightedParts.map((part, i) =>
              part.highlight ? (
                <mark key={i} className="bg-yellow-200 dark:bg-yellow-700/60 text-surface-900 dark:text-surface-100 rounded px-0.5">
                  {part.text}
                </mark>
              ) : (
                <span key={i}>{part.text}</span>
              )
            )}
          </div>
        </div>
      )}

      <button
        onClick={replaceAll}
        disabled={!find || matches.length === 0}
        className="w-full py-2 text-xs font-bold bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
      >
        Replace All ({matches.length})
      </button>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-surface-600 dark:text-surface-400">Output</label>
            <button onClick={copy} className="text-xs text-surface-500 hover:text-brand-500 transition-colors">
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            readOnly
            className={textareaClass + " h-32"}
            value={output}
            spellCheck={false}
          />
        </div>
      )}
    </div>
  );
}
