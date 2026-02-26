import { useState } from 'react';
import { Button } from '../../components/ui/FormControls';
import ResultBox from '../../components/ui/ResultBox';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');

  const process = () => {
    setError('');
    if (!input.trim()) return;
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input.trim()))));
      }
    } catch {
      setError(mode === 'decode' ? 'Invalid Base64 string' : 'Encoding failed');
      setOutput('');
    }
  };

  const swap = () => {
    setMode(m => m === 'encode' ? 'decode' : 'encode');
    setInput(output);
    setOutput('');
    setError('');
  };

  return (
    <div>
      <div className="flex gap-1.5 mb-3">
        {(['encode', 'decode'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setOutput(''); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              mode === m
                ? 'bg-brand-500 text-white'
                : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'
            }`}
          >
            {m === 'encode' ? 'Encode' : 'Decode'}
          </button>
        ))}
      </div>

      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
        className="input-field min-h-[100px] resize-y mb-3 font-mono text-sm"
      />

      <div className="flex gap-2 mb-3">
        <Button onClick={process} className="flex-1">
          {mode === 'encode' ? 'Encode →' : '← Decode'}
        </Button>
        {output && (
          <Button onClick={swap} variant="secondary" className="text-xs">
            ⇄ Swap
          </Button>
        )}
      </div>

      {error && <div className="text-red-500 text-xs mb-3 text-center">{error}</div>}

      {output && (
        <ResultBox label={mode === 'encode' ? 'Base64 Output' : 'Decoded Text'} value={output} large={false} />
      )}
    </div>
  );
}
