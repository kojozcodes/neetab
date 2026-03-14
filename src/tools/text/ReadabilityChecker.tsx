import { useState, useMemo } from 'react';

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const m = word.match(/[aeiouy]{1,2}/g);
  return m ? m.length : 1;
}

function analyze(text: string) {
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
  const words = text.trim().split(/\s+/).filter(w => w.replace(/[^a-zA-Z]/g, '').length > 0);
  const syllableList = words.map(w => countSyllables(w));
  const totalSyllables = syllableList.reduce((a, b) => a + b, 0);
  const complexWords = words.filter((_, i) => syllableList[i] >= 3).length;

  const W = words.length;
  const S = Math.max(sentences.length, 1);
  const Syl = totalSyllables;

  if (W < 5) return null;

  const ASL = W / S; // avg sentence length
  const ASW = Syl / W; // avg syllables per word

  // Flesch Reading Ease
  const fre = 206.835 - 1.015 * ASL - 84.6 * ASW;
  const freScore = Math.max(0, Math.min(100, Math.round(fre)));

  // Flesch-Kincaid Grade Level
  const fkgl = 0.39 * ASL + 11.8 * ASW - 15.59;
  const grade = Math.max(1, Math.round(fkgl * 10) / 10);

  // Gunning Fog
  const fog = 0.4 * (ASL + 100 * (complexWords / W));
  const fogScore = Math.max(1, Math.round(fog * 10) / 10);

  // SMOG (needs 30+ sentences for accuracy)
  const smog = S >= 3 ? 3 + Math.sqrt(complexWords * (30 / S)) : null;

  const freLabel = freScore >= 90 ? 'Very Easy' : freScore >= 80 ? 'Easy' : freScore >= 70 ? 'Fairly Easy'
    : freScore >= 60 ? 'Standard' : freScore >= 50 ? 'Fairly Difficult' : freScore >= 30 ? 'Difficult' : 'Very Difficult';

  const gradeLabel = grade <= 6 ? 'Elementary' : grade <= 8 ? 'Middle School' : grade <= 12 ? 'High School'
    : grade <= 16 ? 'College' : 'Graduate';

  const readingMin = Math.ceil(W / 238);

  return { freScore, freLabel, grade, gradeLabel, fogScore, smog, W, S, totalSyllables, complexWords, readingMin };
}

const scoreColor = (score: number) =>
  score >= 70 ? 'text-green-500' : score >= 50 ? 'text-amber-500' : 'text-red-500';

export default function ReadabilityChecker() {
  const [text, setText] = useState('');
  const result = useMemo(() => analyze(text), [text]);

  return (
    <div className="space-y-4">
      <textarea
        className="w-full px-3 py-2.5 h-44 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/40"
        placeholder="Paste your text here to analyze its readability. Works best with 50+ words."
        value={text}
        onChange={e => setText(e.target.value)}
      />

      {!result && text.length > 0 && (
        <p className="text-xs text-surface-400 text-center">Enter at least 5 words to see scores.</p>
      )}

      {result && (
        <>
          {/* Main scores */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 p-4 text-center">
              <p className={`text-3xl font-bold tabular-nums ${scoreColor(result.freScore)}`}>
                {result.freScore}
              </p>
              <p className="text-xs font-semibold text-surface-500 mt-1">Flesch Reading Ease</p>
              <p className="text-[10px] text-surface-400 mt-0.5">{result.freLabel}</p>
            </div>
            <div className="rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 p-4 text-center">
              <p className="text-3xl font-bold tabular-nums text-brand-500">
                {result.grade}
              </p>
              <p className="text-xs font-semibold text-surface-500 mt-1">Grade Level (FK)</p>
              <p className="text-[10px] text-surface-400 mt-0.5">{result.gradeLabel}</p>
            </div>
          </div>

          {/* Secondary scores */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 p-3 text-center">
              <p className="text-lg font-bold tabular-nums text-surface-800 dark:text-surface-200">{result.fogScore}</p>
              <p className="text-[10px] text-surface-400 mt-0.5 leading-tight">Gunning Fog</p>
            </div>
            {result.smog !== null && (
              <div className="rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 p-3 text-center">
                <p className="text-lg font-bold tabular-nums text-surface-800 dark:text-surface-200">{Math.round(result.smog * 10) / 10}</p>
                <p className="text-[10px] text-surface-400 mt-0.5 leading-tight">SMOG Index</p>
              </div>
            )}
            <div className="rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 p-3 text-center">
              <p className="text-lg font-bold tabular-nums text-surface-800 dark:text-surface-200">{result.readingMin} min</p>
              <p className="text-[10px] text-surface-400 mt-0.5 leading-tight">Read Time</p>
            </div>
          </div>

          {/* Stats */}
          <div className="rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
            <div className="bg-surface-100 dark:bg-surface-800 px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-surface-400">Text Statistics</p>
            </div>
            <div className="grid grid-cols-2 divide-y divide-x divide-surface-100 dark:divide-surface-800">
              {[
                ['Words', result.W],
                ['Sentences', result.S],
                ['Syllables', result.totalSyllables],
                ['Complex words (3+ syl.)', result.complexWords],
              ].map(([label, val]) => (
                <div key={String(label)} className="flex justify-between items-center px-3 py-2 bg-surface-50 dark:bg-surface-900">
                  <span className="text-xs text-surface-500">{label}</span>
                  <span className="text-xs font-bold text-surface-700 dark:text-surface-300 tabular-nums">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scale */}
          <div className="rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
            <div className="bg-surface-100 dark:bg-surface-800 px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-surface-400">Flesch Reading Ease Scale</p>
            </div>
            {[
              ['90-100', 'Very Easy', 'green'],
              ['70-89', 'Easy', 'green'],
              ['60-69', 'Standard', 'amber'],
              ['50-59', 'Fairly Difficult', 'amber'],
              ['0-49', 'Difficult', 'red'],
            ].map(([range, label, color]) => {
              const isActive = (
                (range === '90-100' && result.freScore >= 90) ||
                (range === '70-89' && result.freScore >= 70 && result.freScore < 90) ||
                (range === '60-69' && result.freScore >= 60 && result.freScore < 70) ||
                (range === '50-59' && result.freScore >= 50 && result.freScore < 60) ||
                (range === '0-49' && result.freScore < 50)
              );
              return (
                <div key={range} className={`flex items-center justify-between px-3 py-2 border-t border-surface-100 dark:border-surface-800 ${isActive ? 'bg-brand-50 dark:bg-brand-950/20' : 'bg-surface-50 dark:bg-surface-900'}`}>
                  <span className={`text-xs font-mono ${isActive ? 'font-bold text-brand-500' : 'text-surface-400'}`}>{range}</span>
                  <span className={`text-xs ${isActive ? 'font-semibold text-surface-700 dark:text-surface-300' : 'text-surface-400'}`}>{label}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
