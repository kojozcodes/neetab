import { useState, useMemo } from 'react';
import type { ToolMeta } from '../data/tools';

interface Props {
  tools: ToolMeta[];
  totalCount: number;
}

export default function SearchBox({ tools, totalCount }: Props) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return tools.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.desc.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.includes(q))
    );
  }, [search, tools]);

  if (!filtered) {
    return (
      <div className="relative mb-6">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={`Search ${totalCount} tools...`}
          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-surface-900
                     border-[1.5px] border-surface-300 dark:border-surface-700
                     rounded-2xl text-sm text-surface-900 dark:text-surface-100
                     shadow-soft dark:shadow-soft-dark
                     outline-none focus:border-brand-500 focus:shadow-medium
                     transition-all duration-200
                     placeholder:text-surface-400"
        />
      </div>
    );
  }

  return (
    <>
      <div className="relative mb-6">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={`Search ${totalCount} tools...`}
          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-surface-900
                     border-[1.5px] border-surface-300 dark:border-surface-700
                     rounded-2xl text-sm text-surface-900 dark:text-surface-100
                     shadow-soft dark:shadow-soft-dark
                     outline-none focus:border-brand-500 focus:shadow-medium
                     transition-all duration-200
                     placeholder:text-surface-400"
        />
      </div>

      <div className="text-xs font-semibold text-surface-500 mb-3">
        {filtered.length} tool{filtered.length !== 1 ? 's' : ''} found
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(t => (
          <a key={t.id} href={`/tools/${t.slug}`} className="card p-4 flex items-start gap-3 group">
            <div className="text-2xl leading-none flex-shrink-0 group-hover:scale-110 transition-transform">
              {t.emoji}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-surface-900 dark:text-surface-100 mb-0.5 group-hover:text-brand-500 transition-colors">
                {t.name}
              </div>
              <div className="text-xs text-surface-500 leading-relaxed">{t.desc}</div>
            </div>
          </a>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-16 text-surface-400">
          <div className="text-4xl mb-2">🔍</div>
          <p className="font-medium text-sm">No tools found for "{search}"</p>
        </div>
      )}
    </>
  );
}