import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ToolCard from '../components/ToolCard';
import AdSlot from '../components/AdSlot';
import { SearchIcon } from '../components/ui/Icons';
import { categories, allTools, popularTools, totalToolCount } from '../tools/registry';

export default function Home() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return allTools.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.desc.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.includes(q))
    );
  }, [search]);

  return (
    <>
      <SEO
        title="Neetab | Free Online Tools, PDF Converter & Calculators"
        description="Free online PDF to Word converter, image compressor, color palette generator, tip calculator & 15+ more tools. Fast, private, no sign-up."
        path="/"
      />

      <div className="max-w-4xl mx-auto px-5 pb-12">
        {/* Hero — compact but impactful */}
        <div className="text-center pt-6 sm:pt-10 mb-6 animate-fade-in">
          <h1 className="font-display text-[clamp(26px,5.5vw,44px)] font-bold tracking-tight leading-[1.1] mb-2">
            Neat tools.{' '}
            <span className="bg-gradient-to-r from-brand-500 to-brand-400 bg-clip-text text-transparent">
              One tab.
            </span>
          </h1>
          <p className="text-surface-500 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            PDF converter, calculators, design tools & more — free, fast, private.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6 animate-slide-up" style={{ animationDelay: '80ms' }}>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400">
            <SearchIcon />
          </div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${totalToolCount} tools...`}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-surface-900
                       border-[1.5px] border-surface-300 dark:border-surface-700
                       rounded-2xl text-sm text-surface-900 dark:text-surface-100
                       shadow-soft dark:shadow-soft-dark
                       outline-none focus:border-brand-500 focus:shadow-medium
                       transition-all duration-200
                       placeholder:text-surface-400"
          />
        </div>

        {/* Search results or home layout */}
        {filtered ? (
          <div className="animate-fade-in">
            <div className="text-xs font-semibold text-surface-500 mb-3">
              {filtered.length} tool{filtered.length !== 1 ? 's' : ''} found
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 stagger-in">
              {filtered.map(t => <ToolCard key={t.id} tool={t} />)}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-surface-400">
                <div className="text-4xl mb-2">🔍</div>
                <p className="font-medium text-sm">No tools found for "{search}"</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* ⭐ Popular Tools — top row, bigger cards */}
            <section className="mb-8 animate-slide-up" style={{ animationDelay: '120ms' }}>
              <h2 className="text-sm font-bold text-surface-600 dark:text-surface-400 mb-3 flex items-center gap-2">
                <span className="text-lg">⭐</span>
                Popular
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 stagger-in">
                {popularTools.map(t => (
                  <Link
                    key={t.id}
                    to={`/tools/${t.slug}`}
                    className="card p-3.5 flex flex-col items-center text-center group"
                  >
                    <div className="text-3xl mb-1.5 group-hover:scale-110 transition-transform">{t.emoji}</div>
                    <div className="text-[13px] font-bold text-surface-900 dark:text-surface-100 group-hover:text-brand-500 transition-colors leading-tight">
                      {t.name}
                    </div>
                    <div className="text-[11px] text-surface-500 mt-0.5 leading-snug">{t.desc}</div>
                  </Link>
                ))}
              </div>
            </section>

            <AdSlot slot="hero-bottom" format="horizontal" />

            {/* Category sections */}
            {categories.map((cat, catIdx) => (
              <div key={cat.slug}>
                <section className="mb-7">
                  <h2 className="text-sm font-bold text-surface-600 dark:text-surface-400 mb-2.5 flex items-center gap-2">
                    <span className="text-lg">{cat.emoji}</span>
                    {cat.name}
                    <span className="text-xs font-medium text-surface-400">({cat.tools.length})</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 stagger-in">
                    {cat.tools.map(t => <ToolCard key={t.id} tool={t} />)}
                  </div>
                </section>

                {(catIdx === 1 || catIdx === 3) && (
                  <AdSlot slot={`category-${catIdx}`} format="horizontal" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
