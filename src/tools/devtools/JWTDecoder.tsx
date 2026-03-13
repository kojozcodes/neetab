import { useState, useMemo } from 'react';

function base64UrlDecode(str: string): string {
  try {
    const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(str.length + (4 - str.length % 4) % 4, '=');
    return decodeURIComponent(atob(padded).split('').map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join(''));
  } catch {
    throw new Error('Invalid Base64Url encoding');
  }
}

function decode(token: string) {
  const parts = token.trim().split('.');
  if (parts.length !== 3) throw new Error('JWT must have 3 parts separated by dots');
  return {
    header: JSON.parse(base64UrlDecode(parts[0])),
    payload: JSON.parse(base64UrlDecode(parts[1])),
    signature: parts[2],
  };
}

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleString();
}

function JsonView({ obj }: { obj: Record<string, unknown> }) {
  return (
    <pre className="text-xs font-mono text-surface-700 dark:text-surface-300 overflow-x-auto whitespace-pre-wrap break-all">
      {JSON.stringify(obj, null, 2)}
    </pre>
  );
}

export default function JWTDecoder() {
  const [input, setInput] = useState('');

  const result = useMemo(() => {
    if (!input.trim()) return null;
    try {
      return { data: decode(input), error: null };
    } catch (e: unknown) {
      return { data: null, error: (e as Error).message };
    }
  }, [input]);

  const payload = result?.data?.payload as Record<string, unknown> | undefined;
  const exp = payload?.exp as number | undefined;
  const iat = payload?.iat as number | undefined;
  const isExpired = exp ? Date.now() / 1000 > exp : false;

  return (
    <div className="space-y-4">
      <textarea
        className="w-full h-24 px-3 py-2 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/40 font-mono"
        placeholder="Paste a JWT token here..."
        value={input}
        onChange={e => setInput(e.target.value)}
        spellCheck={false}
      />

      {result?.error && (
        <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{result.error}</p>
      )}

      {result?.data && (
        <div className="space-y-3">
          {exp && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${isExpired ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'}`}>
              <span>{isExpired ? '⚠ Token expired' : '✓ Token valid'}</span>
              <span className="text-surface-400 font-normal">{isExpired ? 'Expired' : 'Expires'} {formatDate(exp)}</span>
            </div>
          )}

          <Section title="Header" color="blue">
            <JsonView obj={result.data.header} />
          </Section>

          <Section title="Payload" color="purple">
            <JsonView obj={result.data.payload} />
            {(iat || exp) && (
              <div className="mt-2 pt-2 border-t border-surface-200 dark:border-surface-700 space-y-1">
                {iat && <p className="text-[11px] text-surface-400">Issued: {formatDate(iat)}</p>}
                {exp && <p className="text-[11px] text-surface-400">Expires: {formatDate(exp)}</p>}
              </div>
            )}
          </Section>

          <Section title="Signature" color="orange">
            <p className="text-xs font-mono text-surface-500 break-all">{result.data.signature}</p>
            <p className="text-[11px] text-surface-400 mt-1">Signature verification requires the secret key and is not performed client-side.</p>
          </Section>
        </div>
      )}

      {!result && (
        <p className="text-xs text-surface-400 text-center py-4">Paste a JWT above to decode it instantly</p>
      )}
    </div>
  );
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  const colors: Record<string, string> = {
    blue: 'text-blue-500 border-blue-200 dark:border-blue-800',
    purple: 'text-purple-500 border-purple-200 dark:border-purple-800',
    orange: 'text-orange-500 border-orange-200 dark:border-orange-800',
  };
  return (
    <div className={`rounded-lg border p-3 ${colors[color]}`}>
      <p className="text-[10px] font-bold uppercase tracking-wider mb-2">{title}</p>
      {children}
    </div>
  );
}
