import { useState, useMemo } from 'react';

const textareaClass = "w-full px-3 py-2 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/40 font-mono";

const STOP_WORDS = new Set([
  'the','a','an','is','are','was','were','be','been','being','have','has','had',
  'do','does','did','will','would','could','should','may','might','shall','can',
  'to','of','in','for','on','with','at','by','from','as','into','through',
  'during','before','after','above','below','up','down','out','off','over',
  'under','again','further','then','once','and','but','or','nor','if','while',
  'because','since','until','although','though','unless','however','therefore',
  'also','too','very','just','than','that','this','these','those','it','its',
  'i','you','he','she','we','they','me','him','her','us','them','my','your',
  'his','our','their','what','which','who','whom','how','when','where','why',
  'not','no','so','such','about','there','here',
]);

interface WordEntry {
  word: string;
  count: number;
  percent: number;
}

export default function WordFrequencyCounter() {
  const [input, setInput] = useState('');
  const [ignoreStopWords, setIgnoreStopWords] = useState(true);
  const [topN, setTopN] = useState(20);

  const entries: WordEntry[] = useMemo(() => {
    if (!input.trim()) return [];
    const words = input
      .toLowerCase()
      .replace(/[^a-z0-9'\s-]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 1);

    const filtered = ignoreStopWords ? words.filter(w => !STOP_WORDS.has(w)) : words;
    const freq: Record<string, number> = {};
    for (const w of filtered) {
      freq[w] = (freq[w] ?? 0) + 1;
    }

    const total = filtered.length;
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([word, count]) => ({ word, count, percent: total > 0 ? (count / total) * 100 : 0 }));
  }, [input, ignoreStopWords, topN]);

  const maxCount = entries[0]?.count ?? 1;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">Input Text</label>
        <textarea
          className={textareaClass + " h-36"}
          placeholder="Paste or type your text here..."
          value={input}
          onChange={e => setInput(e.target.value)}
          spellCheck={false}
        />
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <div
            onClick={() => setIgnoreStopWords(v => !v)}
            className={`relative inline-flex w-8 h-4 rounded-full transition-colors ${ignoreStopWords ? 'bg-brand-500' : 'bg-surface-300 dark:bg-surface-600'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${ignoreStopWords ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
          <span className="text-xs text-surface-600 dark:text-surface-400">Ignore common words</span>
        </label>

        <label className="flex items-center gap-2 text-xs text-surface-600 dark:text-surface-400">
          <span>Show top</span>
          <select
            value={topN}
            onChange={e => setTopN(Number(e.target.value))}
            className="px-1.5 py-0.5 text-xs rounded border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-1 focus:ring-brand-500/40"
          >
            {[10, 20, 30, 50].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <span>words</span>
        </label>
      </div>

      {entries.length > 0 ? (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-surface-600 dark:text-surface-400">
              Word Frequency
            </label>
            <span className="text-xs text-surface-400">{entries.length} unique words</span>
          </div>
          {entries.map(({ word, count, percent }) => (
            <div key={word} className="flex items-center gap-2">
              <span className="text-xs font-mono text-surface-800 dark:text-surface-200 w-24 truncate">{word}</span>
              <div className="flex-1 bg-surface-100 dark:bg-surface-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 bg-brand-500 rounded-full transition-all"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
              <span className="text-xs text-surface-500 w-8 text-right">{count}</span>
              <span className="text-xs text-surface-400 w-10 text-right">{percent.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-surface-400 text-center py-2">
          {input.trim() ? 'No words found with current settings.' : 'Paste text above to analyze word frequency.'}
        </p>
      )}
    </div>
  );
}
