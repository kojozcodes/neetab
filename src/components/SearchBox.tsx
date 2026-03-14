import { useState, useMemo, useEffect, useRef } from 'react';
import type { ToolMeta } from '../data/tools';

interface Props {
  tools: ToolMeta[];
  totalCount: number;
}

export default function SearchBox({ tools, totalCount }: Props) {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Ctrl+K / Cmd+K focuses search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
      if (e.key === 'Escape' && search) {
        setSearch('');
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [search]);

  const filtered = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase().trim();
    return tools
      .map(t => {
        let score = 0;
        if (t.name.toLowerCase() === q) score = 100;
        else if (t.name.toLowerCase().startsWith(q)) score = 80;
        else if (t.name.toLowerCase().includes(q)) score = 60;
        else if (t.desc.toLowerCase().includes(q)) score = 40;
        else if (t.tags.some(tag => tag.includes(q))) score = 20;
        return { t, score };
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(x => x.t);
  }, [search, tools]);

  const inputClass = `w-full pl-11 pr-16 py-3 bg-white dark:bg-surface-900
    border-[1.5px] border-surface-300 dark:border-surface-700
    rounded-2xl text-sm text-surface-900 dark:text-surface-100
    shadow-soft dark:shadow-soft-dark
    outline-none focus:border-brand-500 focus:shadow-medium
    transition-all duration-200 placeholder:text-surface-400`;

  return (
    <>
      <div className="relative mb-6">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input
          ref={inputRef}
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={`Search ${totalCount} tools...`}
          className={inputClass}
          aria-label="Search tools"
          autoComplete="off"
          spellCheck="false"
        />
        {search ? (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
            aria-label="Clear search"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        ) : (
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-surface-400 bg-surface-100 dark:bg-surface-800 rounded border border-surface-200 dark:border-surface-700 pointer-events-none">
            ⌘K
          </kbd>
        )}
      </div>

      {filtered !== null && (
        <>
          {filtered.length > 0 ? (
            <>
              <div className="text-xs font-semibold text-surface-500 mb-3">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
                {filtered.map(t => (
                  <a key={t.id} href={`/tools/${t.slug}`} className="card p-4 flex items-start gap-3 group">
                    <div className="text-2xl leading-none flex-shrink-0 group-hover:scale-110 transition-transform">{t.emoji}</div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-surface-900 dark:text-surface-100 mb-0.5 group-hover:text-brand-500 transition-colors">{t.name}</div>
                      <div className="text-xs text-surface-500 leading-relaxed">{t.desc}</div>
                    </div>
                  </a>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 mb-8">
              <div className="text-4xl mb-3">🔍</div>
              <p className="font-semibold text-sm text-surface-700 dark:text-surface-300 mb-1">No tools found for "{search}"</p>
              <p className="text-xs text-surface-400 mb-4">Try "compress", "convert", "generate" or browse below</p>
              <button onClick={() => setSearch('')} className="text-xs font-semibold text-brand-500 hover:underline">
                Browse all {totalCount} tools
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
