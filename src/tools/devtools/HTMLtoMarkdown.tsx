import { useState, useMemo } from 'react';

const taClass = "w-full px-3 py-2 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/40 font-mono";

type TurndownService = {
  turndown: (html: string) => string;
  options: { headingStyle: string; codeBlockStyle: string };
};

export default function HTMLtoMarkdown() {
  const [input, setInput] = useState('');
  const [headingStyle, setHeadingStyle] = useState<'atx' | 'setext'>('atx');
  const [codeStyle, setCodeStyle] = useState<'fenced' | 'indented'>('fenced');
  const [copied, setCopied] = useState(false);
  const [td, setTd] = useState<TurndownService | null>(null);
  const [loading, setLoading] = useState(false);

  const ensureLib = async () => {
    if (td) return td;
    setLoading(true);
    const mod = await import('turndown');
    const svc = new mod.default({ headingStyle, codeBlockStyle: codeStyle }) as TurndownService;
    setTd(svc);
    setLoading(false);
    return svc;
  };

  // Rebuild service when options change
  const getService = () => {
    if (!td) return null;
    td.options.headingStyle = headingStyle;
    td.options.codeBlockStyle = codeStyle;
    return td;
  };

  const result = useMemo(() => {
    if (!input.trim() || !td) return null;
    try {
      const svc = getService()!;
      const md = svc.turndown(input.trim());
      return { md, error: null };
    } catch (e: unknown) {
      return { md: null, error: (e as Error).message };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, headingStyle, codeStyle, td]);

  const handleInput = async (val: string) => {
    setInput(val);
    if (val.trim() && !td) await ensureLib();
  };

  const copy = () => {
    if (!result?.md) return;
    navigator.clipboard.writeText(result.md);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    if (!result?.md) return;
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([result.md], { type: 'text/markdown' })),
      download: 'output.md',
    });
    a.click();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">HTML Input</label>
        <textarea
          className={taClass + ' h-44'}
          placeholder={'<h1>Hello World</h1>\n<p>This is a <strong>bold</strong> paragraph.</p>\n<ul><li>Item 1</li><li>Item 2</li></ul>'}
          value={input}
          onChange={e => handleInput(e.target.value)}
          spellCheck={false}
        />
        <p className="text-xs text-surface-400 mt-1">
          {input.length > 0 ? `${input.length} chars` : 'Paste HTML from any source'}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-surface-500">Headings:</span>
          {(['atx', 'setext'] as const).map(s => (
            <button
              key={s}
              onClick={() => setHeadingStyle(s)}
              className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${headingStyle === s ? 'bg-brand-500 text-white border-brand-500' : 'border-surface-300 dark:border-surface-600 text-surface-600 dark:text-surface-400 hover:border-brand-400'}`}
            >
              {s === 'atx' ? '# ATX' : 'Setext'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-surface-500">Code:</span>
          {(['fenced', 'indented'] as const).map(s => (
            <button
              key={s}
              onClick={() => setCodeStyle(s)}
              className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${codeStyle === s ? 'bg-brand-500 text-white border-brand-500' : 'border-surface-300 dark:border-surface-600 text-surface-600 dark:text-surface-400 hover:border-brand-400'}`}
            >
              {s === 'fenced' ? '``` Fenced' : 'Indented'}
            </button>
          ))}
        </div>
        {loading && <span className="text-xs text-surface-400">Loading converter...</span>}
      </div>

      {result?.error && (
        <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{result.error}</p>
      )}

      {result?.md && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-surface-600 dark:text-surface-400">
              Markdown Output
              <span className="font-normal text-surface-400 ml-2">{result.md.length} chars</span>
            </label>
            <div className="flex gap-2">
              <button onClick={copy} className="text-xs text-surface-500 hover:text-brand-500 transition-colors">
                {copied ? '✓ Copied' : 'Copy'}
              </button>
              <button onClick={download} className="text-xs px-2.5 py-1 bg-brand-500 text-white rounded-md hover:bg-brand-600 transition-colors">
                Download .md
              </button>
            </div>
          </div>
          <textarea readOnly className={taClass + ' h-48'} value={result.md} spellCheck={false} />
        </div>
      )}

      {!result && !loading && (
        <p className="text-xs text-surface-400 text-center py-2">Paste HTML above to convert to Markdown</p>
      )}
    </div>
  );
}
