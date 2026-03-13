import { useState, useRef } from 'react';

const MORSE: Record<string, string> = {
  A:'.-', B:'-...', C:'-.-.', D:'-..', E:'.', F:'..-.', G:'--.', H:'....', I:'..', J:'.---',
  K:'-.-', L:'.-..', M:'--', N:'-.', O:'---', P:'.--.', Q:'--.-', R:'.-.', S:'...', T:'-',
  U:'..-', V:'...-', W:'.--', X:'-..-', Y:'-.--', Z:'--..',
  '0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....',
  '6':'-....','7':'--...','8':'---..','9':'----.',
  '.':'.-.-.-', ',':'--..--', '?':'..--..', "'":'.----.', '!':'-.-.--',
  '/':'-..-.', '(':'-.--.', ')':'-.--.-', '&':'.-...', ':':'---...','=':'-...-',
  '+':'.-.-.', '-':'-....-', '_':'..--.-', '"':'.-..-.', '$':'...-..-','@':'.--.-.',
};
const REVERSE: Record<string, string> = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

function textToMorse(text: string): string {
  return text.toUpperCase().split('').map(ch => {
    if (ch === ' ') return '/';
    return MORSE[ch] ?? '?';
  }).join(' ');
}

function morseToText(morse: string): string {
  return morse.trim().split(' / ').map(word =>
    word.split(' ').map(code => REVERSE[code] ?? '?').join('')
  ).join(' ');
}

export default function MorseCodeConverter() {
  const [mode, setMode] = useState<'text2morse' | 'morse2text'>('text2morse');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [wpm, setWpm] = useState(15);
  const stopRef = useRef(false);

  const output = mode === 'text2morse' ? textToMorse(input) : morseToText(input);

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const playMorse = async () => {
    const morse = mode === 'text2morse' ? output : textToMorse(morseToText(input));
    if (!morse || playing) return;
    setPlaying(true);
    stopRef.current = false;
    const ctx = new AudioContext();
    const dotDuration = 1200 / wpm / 1000;
    const freq = 600;

    const beep = (duration: number) => new Promise<void>(resolve => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
      osc.onended = () => resolve();
    });

    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

    for (const ch of morse.split('')) {
      if (stopRef.current) break;
      if (ch === '.') { await beep(dotDuration); await sleep(dotDuration * 1000); }
      else if (ch === '-') { await beep(dotDuration * 3); await sleep(dotDuration * 1000); }
      else if (ch === ' ') { await sleep(dotDuration * 3 * 1000); }
      else if (ch === '/') { await sleep(dotDuration * 7 * 1000); }
    }
    ctx.close();
    setPlaying(false);
  };

  const stopPlay = () => { stopRef.current = true; setPlaying(false); };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['text2morse', 'morse2text'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setInput(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${mode === m ? 'bg-brand-500 text-white' : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'}`}
          >
            {m === 'text2morse' ? 'Text to Morse' : 'Morse to Text'}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">
          {mode === 'text2morse' ? 'Enter text' : 'Enter Morse code (use spaces between symbols, / between words)'}
        </label>
        <textarea
          className="w-full h-24 px-3 py-2 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/40 font-mono"
          placeholder={mode === 'text2morse' ? 'Hello World' : '.... . .-.. .-.. --- / .-- --- .-. .-.. -..'}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
      </div>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-surface-600 dark:text-surface-400">Output</label>
            <button onClick={copy} className="text-xs text-surface-400 hover:text-brand-500 transition-colors">
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <div className="px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-sm font-mono text-surface-700 dark:text-surface-300 break-all leading-relaxed min-h-[3rem]">
            {output}
          </div>
        </div>
      )}

      {mode === 'text2morse' && output && output !== '?' && (
        <div className="flex items-center gap-3">
          <button
            onClick={playing ? stopPlay : playMorse}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${playing ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-brand-500 hover:bg-brand-600 text-white'}`}
          >
            {playing ? 'Stop' : 'Play Audio'}
          </button>
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xs text-surface-400 flex-shrink-0">Speed: {wpm} WPM</span>
            <input type="range" min="5" max="30" value={wpm} onChange={e => setWpm(Number(e.target.value))}
              className="flex-1 accent-brand-500" />
          </div>
        </div>
      )}

      <details className="group">
        <summary className="cursor-pointer text-xs text-surface-400 hover:text-brand-500 transition-colors flex items-center gap-1.5">
          <span className="group-open:rotate-90 transition-transform inline-block">&#9654;</span>
          Morse code reference
        </summary>
        <div className="mt-2 grid grid-cols-4 gap-1">
          {Object.entries(MORSE).filter(([k]) => /[A-Z0-9]/.test(k)).map(([ch, code]) => (
            <div key={ch} className="flex items-center justify-between px-2 py-1 rounded bg-surface-100 dark:bg-surface-800 text-xs">
              <span className="font-bold text-brand-500">{ch}</span>
              <span className="font-mono text-surface-500">{code}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
