import { useState, useMemo } from 'react';

const taClass = "w-full px-3 py-2 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/40 font-mono";

function xmlNodeToObj(node: Element): unknown {
  const result: Record<string, unknown> = {};

  if (node.attributes.length > 0) {
    const attrs: Record<string, string> = {};
    for (const a of Array.from(node.attributes)) attrs[`@${a.name}`] = a.value;
    Object.assign(result, attrs);
  }

  for (const child of Array.from(node.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      const t = child.textContent?.trim();
      if (t) result['#text'] = t;
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as Element;
      const val = xmlNodeToObj(el);
      if (result[el.tagName] === undefined) {
        result[el.tagName] = val;
      } else if (Array.isArray(result[el.tagName])) {
        (result[el.tagName] as unknown[]).push(val);
      } else {
        result[el.tagName] = [result[el.tagName], val];
      }
    }
  }

  // If only #text with no attrs/children, return string directly
  const keys = Object.keys(result);
  if (keys.length === 1 && keys[0] === '#text') return result['#text'];
  if (keys.length === 0) return null;
  return result;
}

export default function XMLtoJSON() {
  const [input, setInput] = useState('');
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) return null;
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input.trim(), 'application/xml');
      const err = doc.querySelector('parsererror');
      if (err) return { json: null, error: err.textContent?.split('\n')[0] ?? 'Invalid XML' };
      const root = doc.documentElement;
      const obj = { [root.tagName]: xmlNodeToObj(root) };
      return { json: JSON.stringify(obj, null, indent), error: null };
    } catch (e: unknown) {
      return { json: null, error: (e as Error).message };
    }
  }, [input, indent]);

  const copy = () => {
    if (!result?.json) return;
    navigator.clipboard.writeText(result.json);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    if (!result?.json) return;
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([result.json], { type: 'application/json' })),
      download: 'output.json',
    });
    a.click();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">XML Input</label>
        <textarea
          className={taClass + ' h-44'}
          placeholder={'<root>\n  <name>Alice</name>\n  <age>30</age>\n</root>'}
          value={input}
          onChange={e => setInput(e.target.value)}
          spellCheck={false}
        />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-surface-500">Indent:</span>
        {[2, 4].map(n => (
          <button
            key={n}
            onClick={() => setIndent(n)}
            className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${indent === n ? 'bg-brand-500 text-white border-brand-500' : 'border-surface-300 dark:border-surface-600 text-surface-600 dark:text-surface-400 hover:border-brand-400'}`}
          >
            {n} spaces
          </button>
        ))}
      </div>

      {result?.error && (
        <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{result.error}</p>
      )}

      {result?.json && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-surface-600 dark:text-surface-400">JSON Output</label>
            <div className="flex gap-2">
              <button onClick={copy} className="text-xs text-surface-500 hover:text-brand-500 transition-colors">
                {copied ? '✓ Copied' : 'Copy'}
              </button>
              <button onClick={download} className="text-xs px-2.5 py-1 bg-brand-500 text-white rounded-md hover:bg-brand-600 transition-colors">
                Download JSON
              </button>
            </div>
          </div>
          <textarea readOnly className={taClass + ' h-48'} value={result.json} spellCheck={false} />
        </div>
      )}

      {!result && (
        <p className="text-xs text-surface-400 text-center py-2">Paste XML above to convert to JSON</p>
      )}
    </div>
  );
}
