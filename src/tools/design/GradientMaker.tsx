import { useState } from 'react';
import { Select, Slider, Toggle, Button } from '../../components/ui/FormControls';
import { RefreshIcon } from '../../components/ui/Icons';
import { randomHex } from '../../utils/color';

export default function GradientMaker() {
  const [type, setType] = useState('linear');
  const [angle, setAngle] = useState(135);
  const [c1, setC1] = useState('#FF6B35');
  const [c2, setC2] = useState('#6366F1');
  const [c3, setC3] = useState('#FFD700');
  const [useThird, setUseThird] = useState(false);
  const [copiedCSS, setCopiedCSS] = useState(false);

  const stops = [c1, c2, ...(useThird ? [c3] : [])].join(', ');
  const css = type === 'linear' ? `linear-gradient(${angle}deg, ${stops})` : type === 'radial' ? `radial-gradient(circle, ${stops})` : `conic-gradient(from ${angle}deg, ${stops})`;

  const presets = [
    { name: 'Sunset', a: '#FF6B35', b: '#FF1493', c: '' }, { name: 'Ocean', a: '#667EEA', b: '#764BA2', c: '' },
    { name: 'Forest', a: '#11998E', b: '#38EF7D', c: '' }, { name: 'Peach', a: '#FFECD2', b: '#FCB69F', c: '' },
    { name: 'Night', a: '#0F0C29', b: '#302B63', c: '#24243E' }, { name: 'Aurora', a: '#00C9FF', b: '#92FE9D', c: '' },
    { name: 'Fire', a: '#F12711', b: '#F5AF19', c: '' }, { name: 'Berry', a: '#8E2DE2', b: '#4A00E0', c: '' },
  ];

  return (
    <div>
      {/* Preview */}
      <div className="h-40 rounded-2xl mb-4 shadow-soft dark:shadow-soft-dark border border-surface-200 dark:border-surface-800 transition-all" style={{ background: css }} />

      {/* Type selector */}
      <div className="flex gap-1.5 mb-3.5">
        {['linear', 'radial', 'conic'].map(tp => (
          <button key={tp} onClick={() => setType(tp)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${type === tp ? 'bg-brand-500 text-white' : 'bg-transparent border-[1.5px] border-surface-300 dark:border-surface-700 text-surface-500'}`}>
            {tp}
          </button>
        ))}
      </div>

      {type !== 'radial' && <Slider label="Angle" value={angle} onChange={setAngle} min={0} max={360} suffix="°" />}

      {/* Color pickers */}
      <div className={`grid gap-2.5 mb-3.5 ${useThird ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {[{ val: c1, set: setC1, lb: 'Start' }, { val: c2, set: setC2, lb: 'End' }, ...(useThird ? [{ val: c3, set: setC3, lb: 'Mid' }] : [])].map(({ val, set, lb }) => (
          <div key={lb}>
            <label className="block text-[11px] font-semibold text-surface-500 mb-1">{lb}</label>
            <input type="color" value={val} onChange={e => set(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer" />
            <input type="text" value={val.toUpperCase()} onChange={e => set(e.target.value)}
              className="w-full mt-1 px-2 py-1 text-[11px] font-mono text-center rounded-md bg-surface-100 dark:bg-surface-800 border border-surface-300 dark:border-surface-700 text-surface-700 dark:text-surface-300" />
          </div>
        ))}
      </div>

      <Toggle label="Add third color" checked={useThird} onChange={setUseThird} />

      {/* Presets */}
      <div className="mb-3.5">
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-surface-500 mb-2">Presets</label>
        <div className="flex gap-1.5 flex-wrap">
          {presets.map(p => (
            <button key={p.name} onClick={() => { setC1(p.a); setC2(p.b); if (p.c) { setC3(p.c); setUseThird(true); } else setUseThird(false); }}
              title={p.name}
              className="w-8 h-8 rounded-lg border-2 border-surface-200 dark:border-surface-700 hover:scale-110 hover:border-brand-500 transition-all cursor-pointer"
              style={{ background: `linear-gradient(135deg,${p.a},${p.b}${p.c ? `,${p.c}` : ''})` }} />
          ))}
        </div>
      </div>

      {/* CSS output */}
      <div className="bg-surface-100 dark:bg-surface-800 rounded-xl p-4 font-mono text-xs text-surface-500 leading-loose mb-3 break-all">
        <div className="text-[10px] font-bold uppercase tracking-wider text-surface-400 mb-1">CSS</div>
        background: {css};
      </div>

      <div className="flex gap-2">
        <Button onClick={() => { navigator.clipboard.writeText(`background: ${css};`); setCopiedCSS(true); setTimeout(() => setCopiedCSS(false), 1500); }} className="flex-1">
          {copiedCSS ? '✓ Copied!' : 'Copy CSS'}
        </Button>
        <Button variant="secondary" className="flex-1" onClick={() => { setC1(randomHex()); setC2(randomHex()); if (useThird) setC3(randomHex()); setAngle(Math.floor(Math.random() * 360)); }}>
          <RefreshIcon /> Random
        </Button>
      </div>
    </div>
  );
}
