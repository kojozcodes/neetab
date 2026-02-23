import { useNavigate, useLocation } from 'react-router-dom';
import { SunIcon, MoonIcon, BackIcon } from './ui/Icons';
import { totalToolCount } from '../tools/registry';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  toolName?: string;
}

export default function Header({ theme, onToggleTheme, toolName }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isToolPage = location.pathname.startsWith('/tools/');

  return (
    <header className="glass-header sticky top-0 z-50 px-5">
      <div className="max-w-4xl mx-auto h-14 flex items-center justify-between">
        {/* Left: Logo + back */}
        <div className="flex items-center gap-2.5">
          {isToolPage && (
            <button
              onClick={() => navigate('/')}
              className="p-1 text-surface-500 hover:text-brand-500 transition-colors"
              aria-label="Back to home"
            >
              <BackIcon />
            </button>
          )}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-400 flex items-center justify-center text-white font-display text-sm font-bold shadow-sm group-hover:scale-105 transition-transform">
              N
            </div>
            <span className="text-[17px] font-bold tracking-tight text-surface-900 dark:text-surface-100">
              {isToolPage ? (toolName || 'Neetab') : 'Neetab'}
            </span>
          </div>
        </div>

        {/* Right: tool count + theme toggle */}
        <div className="flex items-center gap-3">
          {!isToolPage && (
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-surface-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {totalToolCount} tools
            </div>
          )}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg bg-surface-100 dark:bg-surface-800 border border-surface-300 dark:border-surface-700
                       text-surface-600 dark:text-surface-400 hover:text-brand-500 dark:hover:text-brand-400
                       transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}
