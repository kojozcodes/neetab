import { useState, useMemo } from 'react';

const taClass = "w-full px-3 py-2 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/40 font-mono";

function escXml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function toXml(value: unknown, tag: string, depth: number): string {
  const pad = '  '.repeat(depth);
  const safeTag = /^[a-zA-Z_][\w.-]*$/.test(tag) ? tag : `item`;

  if (value === null || value === undefined) return `${pad}<${safeTag} />`;

  if (typeof value !== 'object') {
    return `${pad}<${safeTag}>${escXml(String(value))}</${safeTag}>`;
  }

  if (Array.isArray(value)) {
    return value.map(v => toXml(v, safeTag, depth)).join('\n');
  }

  const obj = value as Record<string, unknown>;
  const attrEntries = Object.entries(obj).filter(([k]) => k.startsWith('@'));
  const childEntries = Object.entries(obj).filter(([k]) => !k.startsWith('@') && k !== '#text');
  const textVal = obj['#text'];

  const attrStr = attrEntries.map(([k, v]) => ` ${k.slice(1)}="${escXml(String(v))}"`).join('');

  if (childEntries.length === 0 && !textVal) return `${pad}<${safeTag}${attrStr} />`;

  if (childEntries.length === 0 && textVal !== undefined) {
    return `${pad}<${safeTag}${attrStr}>${escXml(String(textVal))}</${safeTag}>`;
  }

  const inner = childEntries.map(([k, v]) => toXml(v, k, depth + 1)).join('\n');
  return `${pad}<${safeTag}${attrStr}>\n${inner}\n${pad}</${safeTag}>`;
}

export default function JSONtoXML() {
  const [input, setInput] = useState('');
  const [rootTag, setRootTag] = useState('root');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) return null;
    try {
      const obj = JSON.parse(input.trim());
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      if (typeof obj === 'object' && !Array.isArray(obj) && obj !== null) {
        const keys = Object.keys(obj as object);
        if (keys.length === 1) {
          xml += toXml((obj as Record<string, unknown>)[keys[0]], keys[0], 0);
        } else {
          xml += toXml(obj, rootTag, 0);
        }
      } else {
        xml += toXml(obj, rootTag, 0);
      }
      return { xml, error: null };
    } catch (e: unknown) {
      return { xml: null, error: (e as Error).message };
    }
  }, [input, rootTag]);

  const copy = () => {
    if (!result?.xml) return;
    navigator.clipboard.writeText(result.xml);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    if (!result?.xml) return;
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([result.xml], { type: 'application/xml' })),
      download: 'output.xml',
    });
    a.click();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">JSON Input</label>
        <textarea
          className={taClass + ' h-44'}
          placeholder={'{\n  "name": "Alice",\n  "age": 30,\n  "city": "NYC"\n}'}
          value={input}
          onChange={e => setInput(e.target.value)}
          spellCheck={false}
        />
      </div>

      <div className="flex items-center gap-3">
        <label className="text-xs text-surface-500 whitespace-nowrap">Root tag:</label>
        <input
          type="text"
          value={rootTag}
          onChange={e => setRootTag(e.target.value || 'root')}
          className="px-2.5 py-1 text-xs rounded-md border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40 font-mono w-32"
          placeholder="root"
        />
        <span className="text-xs text-surface-400">Used when JSON has no single root key</span>
      </div>

      {result?.error && (
        <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{result.error}</p>
      )}

      {result?.xml && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-surface-600 dark:text-surface-400">XML Output</label>
            <div className="flex gap-2">
              <button onClick={copy} className="text-xs text-surface-500 hover:text-brand-500 transition-colors">
                {copied ? '✓ Copied' : 'Copy'}
              </button>
              <button onClick={download} className="text-xs px-2.5 py-1 bg-brand-500 text-white rounded-md hover:bg-brand-600 transition-colors">
                Download XML
              </button>
            </div>
          </div>
          <textarea readOnly className={taClass + ' h-48'} value={result.xml} spellCheck={false} />
        </div>
      )}

      {!result && (
        <p className="text-xs text-surface-400 text-center py-2">Paste JSON above to convert to XML</p>
      )}
    </div>
  );
}
