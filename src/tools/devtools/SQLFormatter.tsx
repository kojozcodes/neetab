import { useState, useMemo } from 'react';

const taClass = "w-full px-3 py-2 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/40 font-mono";

// Keywords to uppercase
const KW = new Set([
  'SELECT','FROM','WHERE','JOIN','INNER','LEFT','RIGHT','FULL','OUTER','CROSS',
  'ON','AND','OR','NOT','IN','BETWEEN','LIKE','IS','NULL','AS','DISTINCT',
  'ORDER','BY','GROUP','HAVING','LIMIT','OFFSET','UNION','ALL','EXCEPT',
  'INTERSECT','INSERT','INTO','VALUES','UPDATE','SET','DELETE','CREATE',
  'TABLE','VIEW','INDEX','DROP','ALTER','ADD','COLUMN','PRIMARY','KEY',
  'FOREIGN','REFERENCES','UNIQUE','DEFAULT','CONSTRAINT','IF','EXISTS',
  'WITH','CASE','WHEN','THEN','ELSE','END','CAST','COUNT','SUM','AVG',
  'MIN','MAX','COALESCE','NULLIF','EXISTS','ANY','SOME','ASC','DESC',
  'TRUNCATE','BEGIN','COMMIT','ROLLBACK','TRANSACTION','EXPLAIN',
]);

function formatSQL(raw: string, indent: number): string {
  // Tokenize: strings, block comments, line comments, words, punctuation
  const tokens: string[] = [];
  let i = 0;
  while (i < raw.length) {
    if (raw[i] === "'" || raw[i] === '"' || raw[i] === '`') {
      const q = raw[i]; let j = i + 1;
      while (j < raw.length && !(raw[j] === q && raw[j - 1] !== '\\')) j++;
      tokens.push(raw.slice(i, j + 1)); i = j + 1;
    } else if (raw.slice(i, i + 2) === '--') {
      let j = i; while (j < raw.length && raw[j] !== '\n') j++;
      tokens.push(raw.slice(i, j)); i = j;
    } else if (raw.slice(i, i + 2) === '/*') {
      const end = raw.indexOf('*/', i + 2);
      tokens.push(raw.slice(i, end + 2)); i = end + 2;
    } else if (/\w/.test(raw[i])) {
      let j = i; while (j < raw.length && /[\w.]/.test(raw[j])) j++;
      tokens.push(raw.slice(i, j)); i = j;
    } else if (/\s/.test(raw[i])) {
      i++;
    } else {
      tokens.push(raw[i]); i++;
    }
  }

  const pad = ' '.repeat(indent);
  const lines: string[] = [];
  let current = '';
  let depth = 0;

  const NEWLINE_BEFORE = new Set(['SELECT','FROM','WHERE','JOIN','INNER','LEFT','RIGHT','FULL',
    'OUTER','CROSS','ON','ORDER','GROUP','HAVING','LIMIT','OFFSET','UNION',
    'EXCEPT','INTERSECT','SET','VALUES','INSERT','UPDATE','DELETE','WITH']);
  const NEWLINE_AFTER_COMMA_CONTEXTS = new Set(['SELECT','FROM']);

  const flush = () => { if (current.trim()) { lines.push(pad.repeat(depth) + current.trim()); current = ''; } };

  let lastKw = '';
  for (let t = 0; t < tokens.length; t++) {
    const tok = tokens[t];
    const up = tok.toUpperCase();
    const isKw = KW.has(up);

    if (tok === '(') {
      current += tok;
      flush();
      depth++;
    } else if (tok === ')') {
      flush();
      depth = Math.max(0, depth - 1);
      current = tok;
    } else if (tok === ',') {
      current += tok;
      if (NEWLINE_AFTER_COMMA_CONTEXTS.has(lastKw) || depth > 0) {
        flush();
      }
    } else if (tok === ';') {
      flush();
      lines.push(';');
    } else if (isKw && NEWLINE_BEFORE.has(up)) {
      flush();
      current = up + ' ';
      lastKw = up;
    } else if (isKw) {
      current += up + ' ';
    } else {
      current += tok + ' ';
    }
  }
  flush();

  return lines.join('\n').replace(/\s+\n/g, '\n').trim();
}

function minifySQL(raw: string): string {
  return raw
    .replace(/--[^\n]*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function SQLFormatter() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'format' | 'minify'>('format');
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) return null;
    try {
      const out = mode === 'minify' ? minifySQL(input) : formatSQL(input, indent);
      return { out, error: null };
    } catch (e: unknown) {
      return { out: null, error: (e as Error).message };
    }
  }, [input, mode, indent]);

  const copy = () => {
    if (!result?.out) return;
    navigator.clipboard.writeText(result.out);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    if (!result?.out) return;
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([result.out], { type: 'text/plain' })),
      download: 'query.sql',
    });
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <p className="text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">Mode</p>
          <div className="flex gap-2">
            {(['format', 'minify'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md border capitalize transition-colors ${mode === m ? 'bg-brand-500 text-white border-brand-500' : 'border-surface-300 dark:border-surface-600 text-surface-600 dark:text-surface-400 hover:border-brand-400'}`}
              >
                {m === 'format' ? 'Beautify' : 'Minify'}
              </button>
            ))}
          </div>
        </div>
        {mode === 'format' && (
          <div>
            <p className="text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">Indent</p>
            <div className="flex gap-2">
              {[2, 4].map(n => (
                <button
                  key={n}
                  onClick={() => setIndent(n)}
                  className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${indent === n ? 'bg-brand-500 text-white border-brand-500' : 'border-surface-300 dark:border-surface-600 text-surface-600 dark:text-surface-400 hover:border-brand-400'}`}
                >
                  {n} spaces
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">SQL Input</label>
        <textarea
          className={taClass + ' h-40'}
          placeholder={"SELECT u.id, u.name, COUNT(o.id) AS order_count FROM users u LEFT JOIN orders o ON u.id=o.user_id WHERE u.active=1 GROUP BY u.id ORDER BY order_count DESC LIMIT 10;"}
          value={input}
          onChange={e => setInput(e.target.value)}
          spellCheck={false}
        />
      </div>

      {result?.error && (
        <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{result.error}</p>
      )}

      {result?.out && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-surface-600 dark:text-surface-400">
              {mode === 'minify' ? 'Minified' : 'Formatted'} SQL
              {mode === 'minify' && (
                <span className="font-normal text-surface-400 ml-2 text-green-500">
                  -{Math.round((1 - result.out.length / input.length) * 100)}%
                </span>
              )}
            </label>
            <div className="flex gap-2">
              <button onClick={copy} className="text-xs text-surface-500 hover:text-brand-500 transition-colors">
                {copied ? '✓ Copied' : 'Copy'}
              </button>
              <button onClick={download} className="text-xs px-2.5 py-1 bg-brand-500 text-white rounded-md hover:bg-brand-600 transition-colors">
                Download .sql
              </button>
            </div>
          </div>
          <textarea readOnly className={taClass + ' h-48'} value={result.out} spellCheck={false} />
        </div>
      )}

      {!result && (
        <p className="text-xs text-surface-400 text-center py-2">Paste SQL above to format or minify it</p>
      )}
    </div>
  );
}
