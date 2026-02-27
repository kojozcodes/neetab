import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '../../components/ui/FormControls';

type Mode = 'work' | 'short' | 'long';

const DEFAULTS: Record<Mode, number> = {
  work: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

const LABELS: Record<Mode, string> = {
  work: 'Focus',
  short: 'Short Break',
  long: 'Long Break',
};

const COLORS: Record<Mode, string> = {
  work: 'text-brand-500',
  short: 'text-emerald-500',
  long: 'text-blue-500',
};

export default function PomodoroTimer() {
  const [mode, setMode] = useState<Mode>('work');
  const [timeLeft, setTimeLeft] = useState(DEFAULTS.work);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const switchMode = useCallback((m: Mode) => {
    setMode(m);
    setTimeLeft(DEFAULTS[m]);
    setIsRunning(false);
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            // Play notification sound (reuse AudioContext)
            try {
              if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
              const ctx = audioCtxRef.current;
              if (ctx.state === 'suspended') ctx.resume();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.frequency.value = 800;
              gain.gain.value = 0.3;
              osc.start();
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
              osc.stop(ctx.currentTime + 0.5);
            } catch {}

            if (mode === 'work') {
              setSessions(s => s + 1);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode]);

  // Update document title with timer
  useEffect(() => {
    if (isRunning) {
      const m = Math.floor(timeLeft / 60);
      const s = timeLeft % 60;
      document.title = `${m}:${s.toString().padStart(2, '0')} | ${LABELS[mode]} | Neetab`;
    }
    return () => { document.title = 'Pomodoro Timer | Neetab'; };
  }, [timeLeft, isRunning, mode]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = 1 - (timeLeft / DEFAULTS[mode]);
  const circumference = 2 * Math.PI * 90;

  return (
    <div className="text-center">
      {/* Mode tabs */}
      <div className="flex gap-1.5 mb-5">
        {(['work', 'short', 'long'] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              mode === m
                ? 'bg-brand-500 text-white'
                : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'
            }`}
          >
            {LABELS[m]}
          </button>
        ))}
      </div>

      {/* Timer circle */}
      <div className="relative inline-flex items-center justify-center mb-5">
        <svg width="200" height="200" className="-rotate-90">
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor"
            className="text-surface-200 dark:text-surface-800" strokeWidth="6" />
          <circle cx="100" cy="100" r="90" fill="none"
            className={COLORS[mode]}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-mono text-4xl font-bold ${COLORS[mode]}`}>
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </span>
          <span className="text-xs text-surface-400 mt-1">{LABELS[mode]}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 justify-center mb-4">
        <Button onClick={() => setIsRunning(!isRunning)} className="min-w-[100px]">
          {isRunning ? '⏸ Pause' : timeLeft === 0 ? '🔄 Restart' : '▶ Start'}
        </Button>
        <Button onClick={() => switchMode(mode)} variant="secondary">
          ↻ Reset
        </Button>
      </div>

      {/* Session counter */}
      <div className="flex items-center justify-center gap-1.5">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i < (sessions % 4)
                ? 'bg-brand-500'
                : 'bg-surface-200 dark:bg-surface-700'
            }`}
          />
        ))}
        <span className="text-xs text-surface-400 ml-2">
          {sessions} session{sessions !== 1 ? 's' : ''} completed
        </span>
      </div>

      {/* Auto-suggest next */}
      {timeLeft === 0 && (
        <div className="mt-4 p-3 bg-surface-100 dark:bg-surface-800 rounded-xl">
          <p className="text-xs text-surface-500 mb-2">
            {mode === 'work'
              ? sessions % 4 === 0 ? 'Great work! Take a long break.' : 'Nice! Take a short break.'
              : 'Ready to focus again?'}
          </p>
          <button
            onClick={() => switchMode(mode === 'work' ? (sessions % 4 === 0 ? 'long' : 'short') : 'work')}
            className="text-xs font-bold text-brand-500 hover:text-brand-600"
          >
            Start {mode === 'work' ? (sessions % 4 === 0 ? 'Long Break' : 'Short Break') : 'Focus'} →
          </button>
        </div>
      )}
    </div>
  );
}
