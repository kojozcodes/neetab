import { useState, useRef, useEffect } from 'react';

const LANGUAGES = [
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'es-ES', label: 'Spanish' },
  { code: 'fr-FR', label: 'French' },
  { code: 'de-DE', label: 'German' },
  { code: 'pt-BR', label: 'Portuguese (BR)' },
  { code: 'it-IT', label: 'Italian' },
  { code: 'ja-JP', label: 'Japanese' },
  { code: 'zh-CN', label: 'Chinese (Simplified)' },
  { code: 'ar-SA', label: 'Arabic' },
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'ko-KR', label: 'Korean' },
];

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function SpeechToText() {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const [lang, setLang] = useState('en-US');
  const [continuous, setContinuous] = useState(true);
  const [copied, setCopied] = useState(false);
  const recogRef = useRef<any>(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSupported(!!SR);
  }, []);

  const start = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const recog = new SR();
    recog.lang = lang;
    recog.continuous = continuous;
    recog.interimResults = true;

    recog.onresult = (e: any) => {
      let final = '';
      let inter = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + ' ';
        else inter += e.results[i][0].transcript;
      }
      if (final) setTranscript(prev => prev + final);
      setInterim(inter);
    };

    recog.onend = () => {
      setRecording(false);
      setInterim('');
    };

    recog.onerror = () => {
      setRecording(false);
      setInterim('');
    };

    recogRef.current = recog;
    recog.start();
    setRecording(true);
  };

  const stop = () => {
    recogRef.current?.stop();
    setRecording(false);
    setInterim('');
  };

  const clear = () => {
    stop();
    setTranscript('');
    setInterim('');
  };

  const copy = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const words = transcript.trim().split(/\s+/).filter(Boolean).length;

  if (supported === false) {
    return (
      <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-700 dark:text-amber-300">
        <p className="font-semibold mb-1">Browser not supported</p>
        <p className="text-xs">Speech recognition requires Chrome or Edge. Firefox and Safari do not support the Web Speech API. Please open this page in Chrome for the best experience.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-40">
          <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">Language</label>
          <select
            value={lang}
            onChange={e => setLang(e.target.value)}
            disabled={recording}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40 disabled:opacity-60"
          >
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none mt-auto mb-0.5">
          <div
            onClick={() => !recording && setContinuous(v => !v)}
            className={`relative inline-flex w-8 h-4 rounded-full transition-colors ${continuous ? 'bg-brand-500' : 'bg-surface-300 dark:bg-surface-600'} ${recording ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${continuous ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
          <span className="text-xs text-surface-600 dark:text-surface-400">Continuous mode</span>
        </label>
      </div>

      <div className="flex gap-2">
        {!recording ? (
          <button
            onClick={start}
            disabled={supported === null}
            className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white text-xs font-semibold rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50"
          >
            <span className="w-2 h-2 rounded-full bg-white" />
            Start Recording
          </button>
        ) : (
          <button
            onClick={stop}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors animate-pulse"
          >
            <span className="w-2 h-2 rounded-full bg-white" />
            Stop Recording
          </button>
        )}
        <button
          onClick={clear}
          className="px-3 py-2 text-xs text-surface-500 border border-surface-200 dark:border-surface-700 rounded-lg hover:text-red-500 hover:border-red-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {recording && (
        <div className="flex items-center gap-2 text-xs text-brand-500">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          Listening...
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-surface-600 dark:text-surface-400">
            Transcript
            {words > 0 && (
              <span className="font-normal text-surface-400 ml-2">{words} word{words !== 1 ? 's' : ''} - {transcript.length} chars</span>
            )}
          </label>
          {transcript && (
            <button onClick={copy} className="text-xs text-surface-500 hover:text-brand-500 transition-colors">
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          )}
        </div>
        <div className="relative">
          <textarea
            readOnly
            value={transcript}
            placeholder="Transcript will appear here as you speak..."
            className="w-full px-3 py-2 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 resize-none focus:outline-none h-40 font-mono"
            spellCheck={false}
          />
          {interim && (
            <p className="text-xs text-surface-400 italic px-3 py-1">{interim}</p>
          )}
        </div>
      </div>

      <p className="text-xs text-surface-400">Audio is processed locally by your browser - nothing is sent to Neetab servers.</p>
    </div>
  );
}
