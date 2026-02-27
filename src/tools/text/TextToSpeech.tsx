import { useState, useEffect, useRef } from 'react';
import { Button, Slider, Select } from '../../components/ui/FormControls';

export default function TextToSpeech() {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const available = speechSynthesis.getVoices();
      if (available.length > 0) {
        setVoices(available);
        // Default to first English voice
        const english = available.find(v => v.lang.startsWith('en'));
        if (english) setSelectedVoice(english.name);
        else setSelectedVoice(available[0].name);
      }
    };
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
    return () => { speechSynthesis.cancel(); };
  }, []);

  const speak = () => {
    if (!text.trim()) return;
    speechSynthesis.cancel();

    const utt = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) utt.voice = voice;
    utt.rate = rate;
    utt.pitch = pitch;

    utt.onstart = () => { setIsSpeaking(true); setIsPaused(false); };
    utt.onend = () => { setIsSpeaking(false); setIsPaused(false); setCharIndex(0); };
    utt.onpause = () => setIsPaused(true);
    utt.onresume = () => setIsPaused(false);
    utt.onboundary = (e) => setCharIndex(e.charIndex);

    utteranceRef.current = utt;
    speechSynthesis.speak(utt);
  };

  const pause = () => speechSynthesis.pause();
  const resume = () => speechSynthesis.resume();
  const stop = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setCharIndex(0);
  };

  // Group voices by language
  const voiceOptions = voices.map(v => ({
    value: v.name,
    label: `${v.name} (${v.lang})${v.default ? ' ★' : ''}`,
  }));

  return (
    <div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type or paste text to read aloud..."
        className="input-field min-h-[120px] resize-y mb-3 text-sm"
        maxLength={10000}
      />
      <div className="flex justify-between text-[10px] text-surface-400 -mt-2 mb-3 px-1">
        <span>{text.length.toLocaleString()} / 10,000</span>
        <span>~{Math.ceil(text.split(/\s+/).filter(Boolean).length / 150)} min read</span>
      </div>

      {/* Voice selector */}
      {voices.length > 0 && (
        <div className="mb-3">
          <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-1.5">Voice</label>
          <select
            value={selectedVoice}
            onChange={e => setSelectedVoice(e.target.value)}
            className="input-field cursor-pointer text-xs"
          >
            {voiceOptions.map(v => (
              <option key={v.value} value={v.value}>{v.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Controls row */}
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        <Slider label="Speed" value={rate * 100} onChange={v => setRate(v / 100)} min={25} max={200} suffix="%" />
        <Slider label="Pitch" value={pitch * 100} onChange={v => setPitch(v / 100)} min={25} max={200} suffix="%" />
      </div>

      {/* Progress indicator */}
      {isSpeaking && (
        <div className="mb-3">
          <div className="h-1.5 rounded-full bg-surface-200 dark:bg-surface-800 overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-200"
              style={{ width: `${text.length > 0 ? (charIndex / text.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        {!isSpeaking ? (
          <Button onClick={speak} className="flex-1" disabled={!text.trim()}>
            🔊 Speak
          </Button>
        ) : (
          <>
            <Button onClick={isPaused ? resume : pause} className="flex-1">
              {isPaused ? '▶ Resume' : '⏸ Pause'}
            </Button>
            <Button onClick={stop} variant="secondary">
              ⏹ Stop
            </Button>
          </>
        )}
      </div>

      {voices.length === 0 && (
        <div className="mt-3 text-center text-xs text-surface-400">
          Your browser doesn't support text-to-speech voices.
        </div>
      )}
    </div>
  );
}
