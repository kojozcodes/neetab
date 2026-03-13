import { useState, useEffect, useRef, useCallback } from 'react';

interface Lap {
  lapNum: number;
  lapTime: number;   // ms for this lap only
  total: number;     // ms cumulative
}

function formatMs(ms: number, showMs = true): string {
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1_000);
  const cs = Math.floor((ms % 1_000) / 10);
  const hh = String(h).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  const frac = String(cs).padStart(2, '0');
  if (showMs) return `${hh}:${mm}:${ss}.${frac}`;
  return `${hh}:${mm}:${ss}`;
}

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const startRef = useRef<number | null>(null);
  const baseRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    if (startRef.current === null) return;
    setElapsed(baseRef.current + (Date.now() - startRef.current));
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (running) {
      startRef.current = Date.now();
      rafRef.current = requestAnimationFrame(tick);
    } else {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (startRef.current !== null) {
        baseRef.current += Date.now() - startRef.current;
        startRef.current = null;
      }
    }
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [running, tick]);

  // Update tab title
  useEffect(() => {
    const original = document.title;
    if (running) {
      document.title = formatMs(elapsed, false) + ' - Stopwatch';
    }
    return () => {
      if (!running) document.title = original;
    };
  }, [elapsed, running]);

  useEffect(() => {
    return () => {
      document.title = 'Stopwatch | Neetab';
    };
  }, []);

  const handleStartPause = () => setRunning(r => !r);

  const handleReset = () => {
    setRunning(false);
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    startRef.current = null;
    baseRef.current = 0;
    setElapsed(0);
    setLaps([]);
    document.title = 'Stopwatch | Neetab';
  };

  const handleLap = () => {
    if (!running) return;
    const prev = laps.length > 0 ? laps[laps.length - 1].total : 0;
    setLaps(ls => [
      ...ls,
      { lapNum: ls.length + 1, lapTime: elapsed - prev, total: elapsed },
    ]);
  };

  const lapListRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (lapListRef.current) {
      lapListRef.current.scrollTop = lapListRef.current.scrollHeight;
    }
  }, [laps.length]);

  const bestLap = laps.length > 1 ? Math.min(...laps.map(l => l.lapTime)) : -1;
  const worstLap = laps.length > 1 ? Math.max(...laps.map(l => l.lapTime)) : -1;

  return (
    <div>
      {/* Display */}
      <div className="text-5xl font-mono font-bold text-surface-900 dark:text-surface-100 tabular-nums text-center py-8 tracking-tight select-none">
        {formatMs(elapsed)}
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={handleStartPause}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${
            running
              ? 'bg-amber-500 hover:bg-amber-600 text-white'
              : 'bg-brand-500 hover:bg-brand-600 text-white'
          }`}
        >
          {running ? 'Pause' : elapsed === 0 ? 'Start' : 'Resume'}
        </button>
        <button
          onClick={handleLap}
          disabled={!running}
          className="flex-1 py-3 rounded-xl font-bold text-sm bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Lap
        </button>
        <button
          onClick={handleReset}
          disabled={elapsed === 0}
          className="flex-1 py-3 rounded-xl font-bold text-sm bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Lap list */}
      {laps.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
              Laps
            </span>
            <span className="text-[11px] text-surface-400">{laps.length} lap{laps.length !== 1 ? 's' : ''}</span>
          </div>
          {/* Header */}
          <div className="grid grid-cols-3 gap-2 text-[10px] font-semibold text-surface-400 uppercase tracking-wider px-3 mb-1">
            <span>Lap</span>
            <span className="text-right">Split</span>
            <span className="text-right">Total</span>
          </div>
          <div
            ref={lapListRef}
            className="max-h-56 overflow-y-auto rounded-xl border border-surface-200 dark:border-surface-700 divide-y divide-surface-100 dark:divide-surface-800"
          >
            {[...laps].reverse().map(lap => {
              const isBest = lap.lapTime === bestLap;
              const isWorst = lap.lapTime === worstLap;
              return (
                <div
                  key={lap.lapNum}
                  className={`grid grid-cols-3 gap-2 px-3 py-2 text-sm font-mono tabular-nums ${
                    isBest
                      ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400'
                      : isWorst
                      ? 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400'
                      : 'bg-white dark:bg-surface-900 text-surface-700 dark:text-surface-300'
                  }`}
                >
                  <span className="font-sans font-semibold">
                    Lap {lap.lapNum}
                    {isBest && <span className="ml-1 text-[10px]">best</span>}
                    {isWorst && <span className="ml-1 text-[10px]">slow</span>}
                  </span>
                  <span className="text-right">{formatMs(lap.lapTime)}</span>
                  <span className="text-right text-surface-400 dark:text-surface-500">{formatMs(lap.total)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
