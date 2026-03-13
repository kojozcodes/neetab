import { useState } from 'react';

interface CornerValues {
  tl: number;
  tr: number;
  br: number;
  bl: number;
}

interface EllipticValues {
  tl: [number, number];
  tr: [number, number];
  br: [number, number];
  bl: [number, number];
}

function buildBorderRadius(
  uniform: boolean,
  uniformVal: number,
  corners: CornerValues,
  elliptic: boolean,
  ellipticVals: EllipticValues
): string {
  if (uniform) {
    if (elliptic) {
      return `${uniformVal}px / ${Math.round(uniformVal * 0.5)}px`;
    }
    return `${uniformVal}px`;
  }

  if (elliptic) {
    const h = `${ellipticVals.tl[0]}px ${ellipticVals.tr[0]}px ${ellipticVals.br[0]}px ${ellipticVals.bl[0]}px`;
    const v = `${ellipticVals.tl[1]}px ${ellipticVals.tr[1]}px ${ellipticVals.br[1]}px ${ellipticVals.bl[1]}px`;
    return `${h} / ${v}`;
  }

  const { tl, tr, br, bl } = corners;
  if (tl === tr && tr === br && br === bl) return `${tl}px`;
  if (tl === br && tr === bl) return `${tl}px ${tr}px`;
  if (tr === bl) return `${tl}px ${tr}px ${br}px`;
  return `${tl}px ${tr}px ${br}px ${bl}px`;
}

interface SliderRowProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
}

function SliderRow({ label, value, min = 0, max = 100, onChange }: SliderRowProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 text-xs text-surface-500 dark:text-surface-400 flex-shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-brand-500"
      />
      <span className="w-12 text-right text-xs font-mono text-surface-600 dark:text-surface-400 flex-shrink-0">
        {value}px
      </span>
    </div>
  );
}

export default function CSSBorderRadiusGenerator() {
  const [isUniform, setIsUniform] = useState(true);
  const [uniformVal, setUniformVal] = useState(16);
  const [corners, setCorners] = useState<CornerValues>({ tl: 16, tr: 16, br: 16, bl: 16 });
  const [isElliptic, setIsElliptic] = useState(false);
  const [ellipticVals, setEllipticVals] = useState<EllipticValues>({
    tl: [16, 8], tr: [16, 8], br: [16, 8], bl: [16, 8],
  });
  const [copied, setCopied] = useState(false);

  const radiusValue = buildBorderRadius(isUniform, uniformVal, corners, isElliptic, ellipticVals);
  const cssOutput = `border-radius: ${radiusValue};`;

  function setCorner(key: keyof CornerValues, val: number) {
    setCorners(prev => ({ ...prev, [key]: val }));
  }

  function setEllipticH(key: keyof EllipticValues, val: number) {
    setEllipticVals(prev => ({ ...prev, [key]: [val, prev[key][1]] }));
  }

  function setEllipticV(key: keyof EllipticValues, val: number) {
    setEllipticVals(prev => ({ ...prev, [key]: [prev[key][0], val] }));
  }

  // Effective radius for the preview box
  const previewStyle: React.CSSProperties = { borderRadius: radiusValue };

  const cornerCornerLabel: { key: keyof CornerValues; label: string; ekKey: keyof EllipticValues }[] = [
    { key: 'tl', label: 'Top Left', ekKey: 'tl' },
    { key: 'tr', label: 'Top Right', ekKey: 'tr' },
    { key: 'br', label: 'Bottom Right', ekKey: 'br' },
    { key: 'bl', label: 'Bottom Left', ekKey: 'bl' },
  ];

  return (
    <div className="space-y-4">
      {/* Preview */}
      <div className="flex items-center justify-center p-8 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-100 dark:bg-surface-800">
        <div
          className="w-40 h-28 bg-brand-500 transition-all"
          style={previewStyle}
        />
      </div>

      {/* Toggles */}
      <div className="flex gap-2">
        <button
          onClick={() => setIsUniform(true)}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
            isUniform
              ? 'bg-brand-500 text-white'
              : 'bg-transparent border-[1.5px] border-surface-300 dark:border-surface-700 text-surface-500'
          }`}
        >
          Uniform
        </button>
        <button
          onClick={() => setIsUniform(false)}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
            !isUniform
              ? 'bg-brand-500 text-white'
              : 'bg-transparent border-[1.5px] border-surface-300 dark:border-surface-700 text-surface-500'
          }`}
        >
          Individual Corners
        </button>
      </div>

      {/* Elliptic toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsElliptic(!isElliptic)}
          className={`relative w-10 h-5 rounded-full transition-colors ${
            isElliptic ? 'bg-brand-500' : 'bg-surface-300 dark:bg-surface-600'
          }`}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
              isElliptic ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
        <span className="text-xs text-surface-600 dark:text-surface-400">
          Elliptical radii (horizontal / vertical)
        </span>
      </div>

      {/* Sliders */}
      <div className="p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 space-y-3">
        {isUniform ? (
          <SliderRow label="Radius" value={uniformVal} max={100} onChange={setUniformVal} />
        ) : isElliptic ? (
          cornerCornerLabel.map(({ label, ekKey }) => (
            <div key={ekKey} className="space-y-1">
              <div className="text-[11px] font-semibold text-surface-400 uppercase tracking-wide">{label}</div>
              <SliderRow
                label="Horizontal"
                value={ellipticVals[ekKey][0]}
                max={100}
                onChange={v => setEllipticH(ekKey, v)}
              />
              <SliderRow
                label="Vertical"
                value={ellipticVals[ekKey][1]}
                max={100}
                onChange={v => setEllipticV(ekKey, v)}
              />
            </div>
          ))
        ) : (
          cornerCornerLabel.map(({ key, label }) => (
            <SliderRow key={key} label={label} value={corners[key]} max={100} onChange={v => setCorner(key, v)} />
          ))
        )}
      </div>

      {/* CSS output */}
      <div className="bg-surface-100 dark:bg-surface-800 rounded-xl p-4 font-mono text-xs text-surface-500 leading-loose break-all">
        <div className="text-[10px] font-bold uppercase tracking-wider text-surface-400 mb-1">CSS</div>
        {cssOutput}
      </div>

      <button
        onClick={() => { navigator.clipboard.writeText(cssOutput); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        className="w-full text-xs px-2.5 py-2.5 bg-brand-500 text-white rounded-md hover:bg-brand-600 transition-colors font-semibold"
      >
        {copied ? '✓ Copied!' : 'Copy CSS'}
      </button>
    </div>
  );
}
