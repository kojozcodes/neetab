import { useState } from 'react';
import { Button } from '../../components/ui/FormControls';
import ResultBox from '../../components/ui/ResultBox';

export default function URLEncoderDecoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [encodeType, setEncodeType] = useState<'component' | 'full'>('component');
  const [error, setError] = useState('');

  const process = () => {
    setError('');
    if (!input.trim()) return;
    try {
      if (mode === 'encode') {
        setOutput(encodeType === 'component' ? encodeURIComponent(input) : encodeURI(input));
      } else {
        setOutput(encodeType === 'component' ? decodeURIComponent(input.trim()) : decodeURI(input.trim()));
      }
    } catch {
      setError('Invalid input - cannot ' + mode);
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

      <div className="mb-3">
        <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-1.5">Method</label>
        <select
          value={encodeType}
          onChange={e => setEncodeType(e.target.value as any)}
          className="input-field cursor-pointer"
        >
          <option value="component">encodeURIComponent (recommended)</option>
          <option value="full">encodeURI (preserves URL structure)</option>
        </select>
      </div>

      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Enter URL or text to encode...' : 'Enter encoded URL to decode...'}
        className="input-field min-h-[80px] resize-y mb-3 font-mono text-sm"
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
        <ResultBox label={mode === 'encode' ? 'Encoded URL' : 'Decoded Text'} value={output} large={false} />
      )}
    </div>
  );
}
