import { Link } from 'react-router-dom';
import { categories } from '../tools/registry';

export default function Footer() {
  return (
    <footer className="border-t border-surface-200 dark:border-surface-800 mt-16">
      <div className="max-w-4xl mx-auto px-5 py-10">
        {/* Tool links for SEO internal linking */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 mb-8">
          {categories.map(cat => (
            <div key={cat.slug}>
              <h3 className="text-xs font-bold text-surface-700 dark:text-surface-300 mb-2">
                {cat.emoji} {cat.name}
              </h3>
              <ul className="space-y-1">
                {cat.tools.map(tool => (
                  <li key={tool.slug}>
                    <Link
                      to={`/tools/${tool.slug}`}
                      className="text-[11px] text-surface-500 hover:text-brand-500 transition-colors"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-surface-200 dark:border-surface-800">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-brand-500 to-brand-400 flex items-center justify-center text-white text-[9px] font-bold font-display">
              N
            </div>
            <span className="text-xs text-surface-500">
              <strong className="text-surface-700 dark:text-surface-300">Neetab</strong> — Neat tools. One tab.
            </span>
          </div>
          <div className="text-[11px] text-surface-400">
            100% free • Your data stays private • No sign-up required
          </div>
        </div>
      </div>
    </footer>
  );
}
