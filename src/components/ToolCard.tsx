import { Link } from 'react-router-dom';
import type { Tool } from '../tools/registry';

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      to={`/tools/${tool.slug}`}
      className="card p-4 flex items-start gap-3 group"
    >
      <div className="text-2xl leading-none flex-shrink-0 group-hover:scale-110 transition-transform">
        {tool.emoji}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-bold text-surface-900 dark:text-surface-100 mb-0.5 group-hover:text-brand-500 transition-colors">
          {tool.name}
        </div>
        <div className="text-xs text-surface-500 leading-relaxed">
          {tool.desc}
        </div>
      </div>
    </Link>
  );
}
