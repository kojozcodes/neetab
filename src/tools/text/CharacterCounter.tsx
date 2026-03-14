import { useState, useMemo } from 'react';

export default function CharacterCounter() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const sentences = text === '' ? 0 : (text.match(/[.!?]+/g) || []).length;
    const lines = text === '' ? 0 : text.split('\n').length;
    const paragraphs = text === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim()).length;
    const bytes = new TextEncoder().encode(text).length;

    // Character frequency (top 10 non-space)
    const freq: Record<string, number> = {};
    for (const c of text) {
      if (c !== ' ' && c !== '\n' && c !== '\r' && c !== '\t') {
        freq[c] = (freq[c] || 0) + 1;
      }
    }
    const top = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return { chars, charsNoSpaces, words, sentences, lines, paragraphs, bytes, top };
  }, [text]);

  const tiles = [
    { label: 'Characters', value: stats.chars },
    { label: 'No Spaces', value: stats.charsNoSpaces },
    { label: 'Words', value: stats.words },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Lines', value: stats.lines },
    { label: 'Paragraphs', value: stats.paragraphs },
    { label: 'Bytes (UTF-8)', value: stats.bytes },
  ];

  return (
    <div className="space-y-4">
      <textarea
        className="w-full px-3 py-2.5 h-40 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/40"
        placeholder="Type or paste your text here..."
        value={text}
        onChange={e => setText(e.target.value)}
      />

      <div className="grid grid-cols-4 gap-2">
        {tiles.map(t => (
          <div key={t.label} className="rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 p-3 text-center">
            <p className="text-lg font-bold text-surface-900 dark:text-white tabular-nums">
              {t.value.toLocaleString()}
            </p>
            <p className="text-[10px] text-surface-400 mt-0.5 leading-tight">{t.label}</p>
          </div>
        ))}
      </div>

      {stats.top.length > 0 && (
        <div>
          <p className="text-xs font-bold text-surface-600 dark:text-surface-400 mb-2">Top characters</p>
          <div className="flex flex-wrap gap-2">
            {stats.top.map(([char, count]) => (
              <div key={char} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
                <span className="text-xs font-mono font-bold text-surface-700 dark:text-surface-300">
                  {char === '\n' ? '\\n' : char}
                </span>
                <span className="text-xs text-surface-400">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {text.length > 0 && (
        <button
          onClick={() => setText('')}
          className="text-xs text-surface-400 hover:text-red-500 transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
}
