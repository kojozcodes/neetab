import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <>
      <SEO
        title="Page Not Found | Neetab"
        description="The page you're looking for doesn't exist. Browse our free online tools instead."
        path="/404"
      />
      <div className="max-w-lg mx-auto px-5 py-20 text-center animate-fade-in">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
          Page not found
        </h1>
        <p className="text-sm text-surface-500 mb-6">
          The tool or page you're looking for doesn't exist. It may have been moved or removed.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold rounded-xl transition-colors"
        >
          ← Browse all tools
        </Link>
      </div>
    </>
  );
}