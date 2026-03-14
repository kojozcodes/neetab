import { useState, useEffect } from 'react';
import type { ToolMeta } from '../data/tools';

const KEY = 'neetab-recent';
const MAX = 6;

export function trackToolVisit(slug: string) {
  try {
    const prev: string[] = JSON.parse(localStorage.getItem(KEY) || '[]');
    const updated = [slug, ...prev.filter(s => s !== slug)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch { /* storage blocked */ }
}

interface Props {
  tools: ToolMeta[];
}

export default function RecentTools({ tools }: Props) {
  const [recent, setRecent] = useState<ToolMeta[]>([]);

  useEffect(() => {
    try {
      const slugs: string[] = JSON.parse(localStorage.getItem(KEY) || '[]');
      const matched = slugs
        .map(s => tools.find(t => t.slug === s))
        .filter((t): t is ToolMeta => !!t);
      setRecent(matched);
    } catch { /* storage blocked */ }
  }, [tools]);

  if (recent.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-sm font-bold text-surface-600 dark:text-surface-400 mb-3 flex items-center gap-2">
        <span className="text-lg">🕐</span> Recently Used
      </h2>
      <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1 snap-x">
        {recent.map(t => (
          <a key={t.id} href={`/tools/${t.slug}`}
            className="card p-3 flex items-center gap-2.5 flex-shrink-0 min-w-[160px] snap-start group">
            <span className="text-xl group-hover:scale-110 transition-transform">{t.emoji}</span>
            <div className="min-w-0">
              <div className="text-xs font-bold text-surface-900 dark:text-surface-100 truncate group-hover:text-brand-500 transition-colors">{t.name}</div>
              <div className="text-[10px] text-surface-500 truncate">{t.desc}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
