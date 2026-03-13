import { useState } from 'react';

const textareaClass = "w-full px-3 py-2 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/40 font-mono";

const VOID_TAGS = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);

function formatHTML(html: string): string {
  // Remove existing indentation to normalize
  let str = html
    .replace(/<!--[\s\S]*?-->/g, '') // remove comments
    .replace(/>\s+</g, '><')
    .trim();

  let result = '';
  let indent = 0;
  const indentStr = '  ';

  // Split on tag boundaries while preserving tags
  const parts = str.split(/(<[^>]+>)/g);

  for (const part of parts) {
    if (!part) continue;
    const trimmed = part.trim();
    if (!trimmed) continue;

    if (/^<\//.test(trimmed)) {
      // Closing tag
      indent = Math.max(0, indent - 1);
      result += indentStr.repeat(indent) + trimmed + '\n';
    } else if (/^<[^/!][^>]*\/>$/.test(trimmed)) {
      // Self-closing tag
      result += indentStr.repeat(indent) + trimmed + '\n';
    } else if (/^<([a-zA-Z][a-zA-Z0-9]*)/.test(trimmed)) {
      // Opening tag
      const tagMatch = trimmed.match(/^<([a-zA-Z][a-zA-Z0-9]*)/);
      const tagName = tagMatch ? tagMatch[1].toLowerCase() : '';
      result += indentStr.repeat(indent) + trimmed + '\n';
      if (!VOID_TAGS.has(tagName)) {
        indent++;
      }
    } else {
      // Text node
      const text = trimmed;
      if (text) {
        result += indentStr.repeat(indent) + text + '\n';
      }
    }
  }

  return result.trim();
}

function minifyHTML(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();
}

export default function HTMLFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'format' | 'minify'>('format');
  const [stats, setStats] = useState<{ before: number; after: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const process = () => {
    if (!input.trim()) return;
    const result = mode === 'format' ? formatHTML(input) : minifyHTML(input);
    setOutput(result);
    setStats({ before: input.length, after: result.length });
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const savings = stats && stats.before > 0 ? Math.round((1 - stats.after / stats.before) * 100) : 0;

  return (
    <div className="space-y-3">
      <div className="flex gap-1.5">
        {(['format', 'minify'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setOutput(''); setStats(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              mode === m
                ? 'bg-brand-500 text-white'
                : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'
            }`}
          >
            {m === 'format' ? '✨ Format / Beautify' : '⚡ Minify'}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">HTML Input</label>
        <textarea
          className={textareaClass + " h-44"}
          placeholder="Paste your HTML here..."
          value={input}
          onChange={e => setInput(e.target.value)}
          spellCheck={false}
        />
      </div>

      <button
        onClick={process}
        className="w-full py-2 text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors"
      >
        {mode === 'format' ? 'Format HTML' : 'Minify HTML'}
      </button>

      {stats && (
        <div className="flex justify-center gap-4 text-xs">
          <span className="text-surface-500">Before: {stats.before.toLocaleString()} chars</span>
          <span className="text-surface-400">|</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">After: {stats.after.toLocaleString()} chars</span>
          {mode === 'minify' && savings > 0 && (
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">({savings}% saved)</span>
          )}
        </div>
      )}

      {output && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-surface-600 dark:text-surface-400">
              {mode === 'format' ? 'Formatted HTML' : 'Minified HTML'}
            </label>
            <button
              onClick={copy}
              className="text-xs text-surface-500 hover:text-brand-500 transition-colors"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            readOnly
            className={textareaClass + " h-44"}
            value={output}
            spellCheck={false}
          />
        </div>
      )}
    </div>
  );
}
