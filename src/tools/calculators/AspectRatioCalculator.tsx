import { useState } from 'react';
import Input from '../../components/ui/Input';

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) { const t = b; b = a % b; a = t; }
  return a;
}

function simplifyRatio(w: number, h: number): [number, number] | null {
  if (!w || !h || w <= 0 || h <= 0) return null;
  const d = gcd(w, h);
  return [w / d, h / d];
}

interface RatioDisplay {
  simplified: string;
  decimal: string;
  pctWidth: string;
}

function getRatioDisplay(w: number, h: number): RatioDisplay | null {
  const r = simplifyRatio(w, h);
  if (!r) return null;
  const [rw, rh] = r;
  const dec = w / h;
  return {
    simplified: `${rw}:${rh}`,
    decimal: dec.toFixed(3),
    pctWidth: (dec * 100).toFixed(1) + '%',
  };
}

const PRESETS = [
  { label: '16:9', w: 16, h: 9 },
  { label: '4:3', w: 4, h: 3 },
  { label: '1:1', w: 1, h: 1 },
  { label: '21:9', w: 21, h: 9 },
  { label: '9:16', w: 9, h: 16 },
  { label: '4:5', w: 4, h: 5 },
  { label: '3:2', w: 3, h: 2 },
];

export default function AspectRatioCalculator() {
  // Section 1 - Calculate ratio from dimensions
  const [calcW, setCalcW] = useState('1920');
  const [calcH, setCalcH] = useState('1080');

  // Section 2 - Scale by ratio
  const [ratioW, setRatioW] = useState('16');
  const [ratioH, setRatioH] = useState('9');
  const [knownDim, setKnownDim] = useState('1920');
  const [knownSide, setKnownSide] = useState<'width' | 'height'>('width');

  const calcWNum = parseFloat(calcW) || 0;
  const calcHNum = parseFloat(calcH) || 0;
  const ratioDisplay = getRatioDisplay(calcWNum, calcHNum);

  const rw = parseFloat(ratioW) || 0;
  const rh = parseFloat(ratioH) || 0;
  const known = parseFloat(knownDim) || 0;
  let scaledResult: number | null = null;
  let scaledLabel = '';
  if (rw > 0 && rh > 0 && known > 0) {
    if (knownSide === 'width') {
      scaledResult = Math.round(known * rh / rw);
      scaledLabel = 'Height';
    } else {
      scaledResult = Math.round(known * rw / rh);
      scaledLabel = 'Width';
    }
  }

  const applyPreset = (w: number, h: number) => {
    setCalcW(String(w));
    setCalcH(String(h));
    setRatioW(String(w));
    setRatioH(String(h));
  };

  return (
    <div className="space-y-6">
      {/* Section 1 - Calculate ratio */}
      <div>
        <h2 className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">
          Calculate Ratio from Dimensions
        </h2>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Input label="Width (px)" value={calcW} onChange={setCalcW} type="number" />
          <Input label="Height (px)" value={calcH} onChange={setCalcH} type="number" />
        </div>
        {ratioDisplay ? (
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-surface-100 dark:bg-surface-800 p-3 text-center">
              <div className="text-[10px] font-semibold text-surface-400 uppercase tracking-wider mb-1">Ratio</div>
              <div className="text-xl font-mono font-bold text-surface-900 dark:text-surface-100">
                {ratioDisplay.simplified}
              </div>
            </div>
            <div className="rounded-xl bg-surface-100 dark:bg-surface-800 p-3 text-center">
              <div className="text-[10px] font-semibold text-surface-400 uppercase tracking-wider mb-1">Decimal</div>
              <div className="text-xl font-mono font-bold text-surface-900 dark:text-surface-100">
                {ratioDisplay.decimal}
              </div>
            </div>
            <div className="rounded-xl bg-surface-100 dark:bg-surface-800 p-3 text-center">
              <div className="text-[10px] font-semibold text-surface-400 uppercase tracking-wider mb-1">% Width</div>
              <div className="text-xl font-mono font-bold text-surface-900 dark:text-surface-100">
                {ratioDisplay.pctWidth}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-surface-100 dark:bg-surface-800 p-3 text-center text-sm text-surface-400">
            Enter width and height above
          </div>
        )}
      </div>

      {/* Section 2 - Scale by ratio */}
      <div>
        <h2 className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">
          Scale by Ratio
        </h2>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Input label="Ratio width" value={ratioW} onChange={setRatioW} type="number" />
          <Input label="Ratio height" value={ratioH} onChange={setRatioH} type="number" />
        </div>
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setKnownSide('width')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
              knownSide === 'width'
                ? 'bg-brand-500 text-white'
                : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
            }`}
          >
            I know the width
          </button>
          <button
            onClick={() => setKnownSide('height')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
              knownSide === 'height'
                ? 'bg-brand-500 text-white'
                : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
            }`}
          >
            I know the height
          </button>
        </div>
        <Input
          label={`Known ${knownSide === 'width' ? 'Width' : 'Height'} (px)`}
          value={knownDim}
          onChange={setKnownDim}
          type="number"
        />
        {scaledResult !== null ? (
          <div className="rounded-xl bg-brand-500/10 border border-brand-500/20 p-4 text-center mt-1">
            <div className="text-[10px] font-semibold text-brand-500 uppercase tracking-wider mb-1">
              Calculated {scaledLabel}
            </div>
            <div className="text-3xl font-mono font-bold text-brand-500">
              {scaledResult}px
            </div>
            <div className="text-[11px] text-surface-500 dark:text-surface-400 mt-1">
              {knownSide === 'width' ? knownDim : scaledResult} x {knownSide === 'width' ? scaledResult : knownDim} px
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-surface-100 dark:bg-surface-800 p-3 text-center text-sm text-surface-400 mt-1">
            Fill in ratio and a dimension above
          </div>
        )}
      </div>

      {/* Section 3 - Presets */}
      <div>
        <h2 className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">
          Common Presets
        </h2>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button
              key={p.label}
              onClick={() => applyPreset(p.w, p.h)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors border ${
                ratioW === String(p.w) && ratioH === String(p.h)
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 border-surface-200 dark:border-surface-700 hover:border-brand-400'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-surface-400 dark:text-surface-500 mt-2">
          Click a preset to populate both sections above.
        </p>
      </div>
    </div>
  );
}
