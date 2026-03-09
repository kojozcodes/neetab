import { useState, useEffect, useRef } from 'react';
import { Button } from '../../components/ui/FormControls';

export default function CountdownTimer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [startTotal, setStartTotal] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const presets = [
    { label: '1 min', h: 0, m: 1, s: 0 },
    { label: '5 min', h: 0, m: 5, s: 0 },
    { label: '10 min', h: 0, m: 10, s: 0 },
    { label: '15 min', h: 0, m: 15, s: 0 },
    { label: '30 min', h: 0, m: 30, s: 0 },
    { label: '1 hour', h: 1, m: 0, s: 0 },
  ];

  const start = () => {
    const total = hours * 3600 + minutes * 60 + seconds;
    if (total <= 0) return;
    setTotalSeconds(total);
    setStartTotal(total);
    setIsRunning(true);
    setIsFinished(false);
  };

  const resume = () => setIsRunning(true);
  const pause = () => setIsRunning(false);

  const reset = () => {
    setIsRunning(false);
    setIsFinished(false);
    setTotalSeconds(0);
    setStartTotal(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const playAlarm = () => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      // Play 3 beeps
      [0, 0.3, 0.6].forEach(delay => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        gain.gain.value = 0.3;
        osc.start(ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.2);
        osc.stop(ctx.currentTime + delay + 0.2);
      });
    } catch {}
  };

  useEffect(() => {
    if (isRunning && totalSeconds > 0) {
      intervalRef.current = window.setInterval(() => {
        setTotalSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            playAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

  // Update document title
  useEffect(() => {
    if (isRunning || totalSeconds > 0) {
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;
      const display = h > 0
        ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
        : `${m}:${s.toString().padStart(2, '0')}`;
      document.title = `${display} | Countdown | Neetab`;
    }
    return () => { document.title = 'Countdown Timer | Neetab'; };
  }, [totalSeconds, isRunning]);

  const displayH = Math.floor(totalSeconds / 3600);
  const displayM = Math.floor((totalSeconds % 3600) / 60);
  const displayS = totalSeconds % 60;
  const progress = startTotal > 0 ? 1 - (totalSeconds / startTotal) : 0;
  const circumference = 2 * Math.PI * 90;

  const applyPreset = (p: typeof presets[0]) => {
    setHours(p.h); setMinutes(p.m); setSeconds(p.s);
  };

  return (
    <div className="text-center">
      {startTotal === 0 && !isFinished ? (
        <>
          {/* Time input */}
          <div className="flex items-end justify-center gap-2 mb-4">
            {[
              { label: 'Hours', value: hours, set: setHours, max: 23 },
              { label: 'Minutes', value: minutes, set: setMinutes, max: 59 },
              { label: 'Seconds', value: seconds, set: setSeconds, max: 59 },
            ].map((field, i) => (
              <div key={field.label} className="flex items-end gap-2">
                <div className="flex flex-col items-center">
                  <label className="text-[10px] font-semibold text-surface-500 mb-1">{field.label}</label>
                  <input
                    type="number"
                    min={0}
                    max={field.max}
                    value={field.value}
                    onChange={e => field.set(Math.min(field.max, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="input-field w-20 text-center text-xl font-mono font-bold !py-3"
                  />
                </div>
                {i < 2 && <span className="text-xl font-bold text-surface-400 mb-3">:</span>}
              </div>
            ))}
          </div>

          {/* Presets */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-4">
            {presets.map(p => (
              <button
                key={p.label}
                onClick={() => applyPreset(p)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-brand-50 hover:text-brand-500 dark:hover:bg-brand-900/20 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          <Button onClick={start} className="w-full" disabled={hours === 0 && minutes === 0 && seconds === 0}>
            ▶ Start Countdown
          </Button>
        </>
      ) : (
        <>
          {/* Timer circle */}
          <div className="relative inline-flex items-center justify-center mb-5">
            <svg width="200" height="200" className="-rotate-90">
              <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor"
                className="text-surface-200 dark:text-surface-800" strokeWidth="6" />
              <circle cx="100" cy="100" r="90" fill="none"
                className={isFinished ? 'text-red-500' : 'text-brand-500'}
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`font-mono text-4xl font-bold ${isFinished ? 'text-red-500 animate-pulse' : 'text-brand-500'}`}>
                {displayH > 0 && `${displayH}:`}
                {displayM.toString().padStart(2, '0')}:{displayS.toString().padStart(2, '0')}
              </span>
              <span className="text-xs text-surface-400 mt-1">
                {isFinished ? "Time's up!" : isRunning ? 'Running' : 'Paused'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2 justify-center">
            {!isFinished && (
              <Button onClick={isRunning ? pause : resume} className="min-w-[100px]">
                {isRunning ? '⏸ Pause' : '▶ Resume'}
              </Button>
            )}
            <Button onClick={reset} variant="secondary">
              ↻ Reset
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
