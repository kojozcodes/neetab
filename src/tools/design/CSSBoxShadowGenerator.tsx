import { useState } from 'react';

interface Shadow {
  id: number;
  h: number;
  v: number;
  blur: number;
  spread: number;
  r: number;
  g: number;
  b: number;
  a: number;
  inset: boolean;
}

let nextId = 1;

function shadowToCSS(s: Shadow): string {
  const insetPart = s.inset ? 'inset ' : '';
  return `${insetPart}${s.h}px ${s.v}px ${s.blur}px ${s.spread}px rgba(${s.r},${s.g},${s.b},${s.a.toFixed(2)})`;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function createShadow(): Shadow {
  return { id: nextId++, h: 0, v: 4, blur: 12, spread: 0, r: 0, g: 0, b: 0, a: 0.15, inset: false };
}

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  suffix?: string;
}

function SliderRow({ label, value, min, max, onChange, suffix = 'px' }: SliderRowProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 text-xs text-surface-500 dark:text-surface-400 flex-shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-brand-500"
      />
      <span className="w-14 text-right text-xs font-mono text-surface-600 dark:text-surface-400 flex-shrink-0">
        {value}{suffix}
      </span>
    </div>
  );
}

export default function CSSBoxShadowGenerator() {
  const [shadows, setShadows] = useState<Shadow[]>([createShadow()]);
  const [activeId, setActiveId] = useState<number>(shadows[0].id);
  const [copied, setCopied] = useState(false);

  const active = shadows.find(s => s.id === activeId) ?? shadows[0];
  const cssValue = shadows.map(shadowToCSS).join(',\n     ');
  const cssOutput = `box-shadow: ${cssValue};`;

  function update(id: number, patch: Partial<Shadow>) {
    setShadows(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));
  }

  function addShadow() {
    const s = createShadow();
    setShadows(prev => [...prev, s]);
    setActiveId(s.id);
  }

  function removeShadow(id: number) {
    setShadows(prev => {
      const next = prev.filter(s => s.id !== id);
      if (next.length === 0) {
        const s = createShadow();
        setActiveId(s.id);
        return [s];
      }
      if (activeId === id) setActiveId(next[0].id);
      return next;
    });
  }

  function handleColorPicker(e: React.ChangeEvent<HTMLInputElement>) {
    const { r, g, b } = hexToRgb(e.target.value);
    update(active.id, { r, g, b });
  }

  return (
    <div className="space-y-4">
      {/* Preview */}
      <div className="flex items-center justify-center p-8 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-100 dark:bg-surface-800">
        <div
          className="w-36 h-24 rounded-xl bg-white dark:bg-surface-200 transition-all"
          style={{ boxShadow: shadows.map(shadowToCSS).join(', ') }}
        />
      </div>

      {/* Shadow layers */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-surface-600 dark:text-surface-500">Layers</span>
          <button
            onClick={addShadow}
            className="text-xs px-2.5 py-1 bg-brand-500 text-white rounded-md hover:bg-brand-600 transition-colors"
          >
            + Add Layer
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {shadows.map((s, i) => (
            <div key={s.id} className="flex items-center gap-0.5">
              <button
                onClick={() => setActiveId(s.id)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                  activeId === s.id
                    ? 'bg-brand-500 text-white'
                    : 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-300 dark:hover:bg-surface-600'
                }`}
              >
                Shadow {i + 1}
              </button>
              {shadows.length > 1 && (
                <button
                  onClick={() => removeShadow(s.id)}
                  className="text-xs w-5 h-5 flex items-center justify-center rounded text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Remove"
                >
                  x
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Controls for active shadow */}
      <div className="p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 space-y-3">
        <SliderRow label="Horizontal" value={active.h} min={-50} max={50} onChange={v => update(active.id, { h: v })} />
        <SliderRow label="Vertical" value={active.v} min={-50} max={50} onChange={v => update(active.id, { v: v })} />
        <SliderRow label="Blur" value={active.blur} min={0} max={100} onChange={v => update(active.id, { blur: v })} />
        <SliderRow label="Spread" value={active.spread} min={-50} max={50} onChange={v => update(active.id, { spread: v })} />
        {/* Opacity uses 0-100 integer range, stored as 0-1 float */}
        <div className="flex items-center gap-3">
          <span className="w-16 text-xs text-surface-500 dark:text-surface-400 flex-shrink-0">Opacity</span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(active.a * 100)}
            onChange={e => update(active.id, { a: Number(e.target.value) / 100 })}
            className="w-full accent-brand-500"
          />
          <span className="w-14 text-right text-xs font-mono text-surface-600 dark:text-surface-400 flex-shrink-0">
            {Math.round(active.a * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <span className="w-16 text-xs text-surface-500 dark:text-surface-400 flex-shrink-0">Color</span>
          <input
            type="color"
            value={rgbToHex(active.r, active.g, active.b)}
            onChange={handleColorPicker}
            className="w-10 h-8 rounded-md cursor-pointer border border-surface-200 dark:border-surface-700"
          />
          <span className="text-xs font-mono text-surface-500 dark:text-surface-400">
            rgba({active.r},{active.g},{active.b},{active.a.toFixed(2)})
          </span>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <span className="w-16 text-xs text-surface-500 dark:text-surface-400 flex-shrink-0">Inset</span>
          <button
            onClick={() => update(active.id, { inset: !active.inset })}
            className={`relative w-10 h-5 rounded-full transition-colors ${
              active.inset ? 'bg-brand-500' : 'bg-surface-300 dark:bg-surface-600'
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                active.inset ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
          <span className="text-xs text-surface-500 dark:text-surface-400">
            {active.inset ? 'Inset shadow' : 'Outer shadow'}
          </span>
        </div>
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
