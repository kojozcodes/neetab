import { useState } from 'react';
import { Button } from '../../components/ui/FormControls';

function minifyCSS(css: string): string {
  return css
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove newlines and extra whitespace
    .replace(/\s+/g, ' ')
    // Remove space around selectors & braces
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*,\s*/g, ',')
    // Remove trailing semicolons before closing brace
    .replace(/;}/g, '}')
    .trim();
}

function beautifyCSS(css: string): string {
  // First minify to normalize
  let min = minifyCSS(css);
  let result = '';
  let indent = 0;

  for (let i = 0; i < min.length; i++) {
    const ch = min[i];
    if (ch === '{') {
      result += ' {\n' + '  '.repeat(indent + 1);
      indent++;
    } else if (ch === '}') {
      indent = Math.max(0, indent - 1);
      result += ';\n' + '  '.repeat(indent) + '}\n' + '  '.repeat(indent);
    } else if (ch === ';') {
      result += ';\n' + '  '.repeat(indent);
    } else {
      result += ch;
    }
  }

  return result.replace(/\n\s*\n/g, '\n').replace(/;;\n/g, ';\n').trim();
}

export default function CSSMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'minify' | 'beautify'>('minify');
  const [stats, setStats] = useState<{ before: number; after: number } | null>(null);

  const process = () => {
    if (!input.trim()) return;
    const result = mode === 'minify' ? minifyCSS(input) : beautifyCSS(input);
    setOutput(result);
    setStats({ before: input.length, after: result.length });
  };

  const savings = stats ? Math.round((1 - stats.after / stats.before) * 100) : 0;

  return (
    <div>
      <div className="flex gap-1.5 mb-3">
        {(['minify', 'beautify'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setOutput(''); setStats(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              mode === m
                ? 'bg-brand-500 text-white'
                : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'
            }`}
          >
            {m === 'minify' ? '⚡ Minify' : '✨ Beautify'}
          </button>
        ))}
      </div>

      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste your CSS here..."
        className="input-field min-h-[120px] resize-y mb-3 font-mono text-xs"
      />

      <Button onClick={process} className="w-full mb-3">
        {mode === 'minify' ? 'Minify CSS' : 'Beautify CSS'}
      </Button>

      {stats && mode === 'minify' && (
        <div className="flex justify-center gap-4 mb-3 text-xs">
          <span className="text-surface-500">{stats.before.toLocaleString()} chars →</span>
          <span className="font-bold text-emerald-600">{stats.after.toLocaleString()} chars</span>
          <span className="text-emerald-600 font-bold">({savings}% saved)</span>
        </div>
      )}

      {output && (
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-surface-600 dark:text-surface-500">
              {mode === 'minify' ? 'Minified CSS' : 'Beautified CSS'}
            </label>
            <button
              onClick={() => { navigator.clipboard.writeText(output); }}
              className="text-xs font-semibold text-brand-500 hover:text-brand-600"
            >
              Copy
            </button>
          </div>
          <div className="bg-surface-100 dark:bg-surface-800 rounded-xl p-3 max-h-[200px] overflow-y-auto font-mono text-xs text-surface-700 dark:text-surface-300 whitespace-pre-wrap break-all">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}
