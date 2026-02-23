import { Suspense } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import AdSlot from '../components/AdSlot';
import { toolBySlug, categories } from '../tools/registry';

function ToolSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-10 bg-surface-200 dark:bg-surface-800 rounded-xl" />
      <div className="h-10 bg-surface-200 dark:bg-surface-800 rounded-xl" />
      <div className="h-16 bg-surface-200 dark:bg-surface-800 rounded-xl" />
    </div>
  );
}

export default function ToolPage() {
  const { slug } = useParams<{ slug: string }>();
  const tool = slug ? toolBySlug(slug) : null;

  if (!tool) return <Navigate to="/" replace />;

  const category = categories.find(c => c.tools.some(t => t.id === tool.id));
  const Component = tool.component;

  // Related tools: same category, excluding current
  const related = category?.tools.filter(t => t.id !== tool.id).slice(0, 4) || [];

  return (
    <>
      <SEO
        title={tool.seo.title}
        description={tool.seo.description}
        path={`/tools/${tool.slug}`}
      />

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: tool.name,
        url: `https://neetab.com/tools/${tool.slug}`,
        description: tool.seo.description,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        isPartOf: { '@type': 'WebApplication', name: 'Neetab', url: 'https://neetab.com' },
      })}} />

      <div className="max-w-lg mx-auto px-4 pb-10">
        {/* Breadcrumb — compact */}
        <nav className="flex items-center gap-1.5 text-[11px] text-surface-400 py-2.5 animate-fade-in" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-brand-500 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-surface-500 dark:text-surface-400">{category?.name}</span>
          <span>/</span>
          <span className="text-surface-600 dark:text-surface-300 font-medium">{tool.name}</span>
        </nav>

        {/* Tool header — tight, no wasted space */}
        <div className="text-center mb-4 animate-slide-up">
          <span className="text-3xl">{tool.emoji}</span>
          <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-surface-900 dark:text-surface-100 mt-1 mb-0.5">
            {tool.seo.h1}
          </h1>
          <p className="text-surface-500 text-xs">{tool.desc}</p>
        </div>

        {/* Tool body — the main event, designed to fit one viewport */}
        <div className="card p-4 sm:p-5 animate-slide-up" style={{ animationDelay: '60ms' }}>
          <Suspense fallback={<ToolSkeleton />}>
            <Component />
          </Suspense>
        </div>

        {/* Ad below tool */}
        <AdSlot slot="tool-bottom" format="rectangle" />

        {/* Related tools — horizontal scroll, doesn't waste vertical space */}
        {related.length > 0 && (
          <div className="mt-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-surface-400 mb-2.5">
              More {category?.name}
            </h2>
            <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1 snap-x">
              {related.map(t => (
                <Link
                  key={t.id}
                  to={`/tools/${t.slug}`}
                  className="card p-3 flex items-center gap-2.5 flex-shrink-0 min-w-[160px] snap-start"
                >
                  <span className="text-lg">{t.emoji}</span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-surface-900 dark:text-surface-100 truncate">{t.name}</div>
                    <div className="text-[10px] text-surface-500 truncate">{t.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
