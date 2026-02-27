import { Link } from 'react-router-dom';
import { categories } from '../tools/registry';

export default function Footer() {
  return (
    <footer className="border-t border-surface-200 dark:border-surface-800 mt-16">
      <div className="max-w-4xl mx-auto px-5 py-10">
        {/* Tool links for SEO internal linking */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-8">
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
            <svg width="20" height="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <defs><linearGradient id="fg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FF6B35"/><stop offset="100%" stopColor="#FF8F65"/></linearGradient></defs>
              <rect width="32" height="32" rx="8" fill="url(#fg)"/>
              <circle cx="9.5" cy="9.5" r="2.8" fill="rgba(255,255,255,0.95)"/><circle cx="16" cy="9.5" r="2.8" fill="rgba(255,255,255,0.95)"/><circle cx="22.5" cy="9.5" r="2.8" fill="rgba(255,255,255,0.95)"/>
              <circle cx="9.5" cy="16" r="2.8" fill="rgba(255,255,255,0.95)"/><circle cx="16" cy="16" r="2.8" fill="rgba(255,255,255,0.95)"/><circle cx="22.5" cy="16" r="2.8" fill="rgba(255,255,255,0.95)"/>
              <circle cx="9.5" cy="22.5" r="2.8" fill="rgba(255,255,255,0.95)"/><circle cx="16" cy="22.5" r="2.8" fill="rgba(255,255,255,0.95)"/><circle cx="22.5" cy="22.5" r="2.8" fill="rgba(255,255,255,0.95)"/>
            </svg>
            <span className="text-xs text-surface-500">
              <span className="font-bold text-surface-700 dark:text-surface-300">Nee</span><span className="font-bold text-brand-500">tab</span> | Neat tools. One tab.
            </span>
          </div>
          <div className="text-[11px] text-surface-400">
            100% free • Your data stays private • No sign-up required
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <Link to="/about" className="text-surface-400 hover:text-brand-500 transition-colors">About</Link>
            <Link to="/privacy" className="text-surface-400 hover:text-brand-500 transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
