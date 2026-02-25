import { useNavigate, useLocation } from 'react-router-dom';
import { SunIcon, MoonIcon, BackIcon } from './ui/Icons';
import { totalToolCount } from '../tools/registry';

function LogoIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF6B35"/>
          <stop offset="100%" stopColor="#FF8F65"/>
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#logo-g)"/>
      <circle cx="9.5" cy="9.5" r="2.8" fill="rgba(255,255,255,0.95)"/>
      <circle cx="16" cy="9.5" r="2.8" fill="rgba(255,255,255,0.95)"/>
      <circle cx="22.5" cy="9.5" r="2.8" fill="rgba(255,255,255,0.95)"/>
      <circle cx="9.5" cy="16" r="2.8" fill="rgba(255,255,255,0.95)"/>
      <circle cx="16" cy="16" r="2.8" fill="rgba(255,255,255,0.95)"/>
      <circle cx="22.5" cy="16" r="2.8" fill="rgba(255,255,255,0.95)"/>
      <circle cx="9.5" cy="22.5" r="2.8" fill="rgba(255,255,255,0.95)"/>
      <circle cx="16" cy="22.5" r="2.8" fill="rgba(255,255,255,0.95)"/>
      <circle cx="22.5" cy="22.5" r="2.8" fill="rgba(255,255,255,0.95)"/>
    </svg>
  );
}

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
            <div className="group-hover:scale-105 transition-transform">
              <LogoIcon />
            </div>
            {isToolPage ? (
              <span className="text-[17px] font-bold tracking-tight text-surface-900 dark:text-surface-100">
                {toolName || 'Neetab'}
              </span>
            ) : (
              <span className="text-[17px] font-bold tracking-tight">
                <span className="text-surface-900 dark:text-surface-100">Nee</span>
                <span className="text-brand-500">tab</span>
              </span>
            )}
          </div>
        </div>

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