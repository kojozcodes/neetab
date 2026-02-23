import { useState, useCallback, useEffect } from 'react';
import { Select } from '../../components/ui/FormControls';
import { Button } from '../../components/ui/FormControls';
import { RefreshIcon, LockIcon, UnlockIcon } from '../../components/ui/Icons';
import { hexToRgb, rgbToHsl, hslToRgb, rgbToHex, randomHex, getContrastText } from '../../utils/color';

export default function ColorPalette() {
  const [mode, setMode] = useState('random');
  const [baseColor, setBaseColor] = useState('#FF6B35');
  const [palette, setPalette] = useState<string[]>([]);
  const [locked, setLocked] = useState([false, false, false, false, false]);
  const [copiedIdx, setCopiedIdx] = useState(-1);
  const [copiedAll, setCopiedAll] = useState(false);

  const generate = useCallback(() => {
    const { r, g, b } = hexToRgb(baseColor);
    const { h, s, l } = rgbToHsl(r, g, b);
    let nc: string[] = [];

    switch (mode) {
      case 'random': nc = Array.from({ length: 5 }, () => randomHex()); break;
      case 'complementary': nc = [0, 30, 60, 180, 210].map(o => { const c = hslToRgb((h + o) % 360, s, l); return rgbToHex(c.r, c.g, c.b); }); break;
      case 'analogous': nc = [-30, -15, 0, 15, 30].map(o => { const c = hslToRgb((h + o + 360) % 360, s, l); return rgbToHex(c.r, c.g, c.b); }); break;
      case 'triadic': nc = [0, 120, 240, 60, 300].map(o => { const c = hslToRgb((h + o) % 360, s, l); return rgbToHex(c.r, c.g, c.b); }); break;
      case 'monochromatic': nc = [20, 35, 50, 65, 80].map(lt => { const c = hslToRgb(h, s, lt); return rgbToHex(c.r, c.g, c.b); }); break;
      case 'warm': nc = Array.from({ length: 5 }, () => { const c = hslToRgb(Math.floor(Math.random() * 60), 60 + Math.floor(Math.random() * 40), 40 + Math.floor(Math.random() * 40)); return rgbToHex(c.r, c.g, c.b); }); break;
      case 'cool': nc = Array.from({ length: 5 }, () => { const c = hslToRgb(180 + Math.floor(Math.random() * 80), 50 + Math.floor(Math.random() * 40), 35 + Math.floor(Math.random() * 45)); return rgbToHex(c.r, c.g, c.b); }); break;
      case 'pastel': nc = Array.from({ length: 5 }, () => { const c = hslToRgb(Math.floor(Math.random() * 360), 60 + Math.floor(Math.random() * 20), 78 + Math.floor(Math.random() * 12)); return rgbToHex(c.r, c.g, c.b); }); break;
      default: nc = Array.from({ length: 5 }, () => randomHex());
    }

    setPalette(prev => nc.map((c, i) => (locked[i] && prev[i]) ? prev[i] : c));
  }, [mode, baseColor, locked]);

  useEffect(() => { generate(); }, []);

  const showBase = ['complementary', 'analogous', 'triadic', 'monochromatic'].includes(mode);

  const copySingle = (hex: string, i: number) => {
    navigator.clipboard.writeText(hex);
    setCopiedIdx(i); setTimeout(() => setCopiedIdx(-1), 1200);
  };

  return (
    <div>
      <Select label="Palette Mode" value={mode} onChange={setMode} options={[
        { value: 'random', label: '🎲 Random' }, { value: 'complementary', label: '🔄 Complementary' },
        { value: 'analogous', label: '🌊 Analogous' }, { value: 'triadic', label: '🔺 Triadic' },
        { value: 'monochromatic', label: '🎯 Monochromatic' }, { value: 'warm', label: '🔥 Warm Tones' },
        { value: 'cool', label: '❄️ Cool Tones' }, { value: 'pastel', label: '🧁 Pastel' },
      ]} />

      {showBase && (
        <div className="mb-3.5">
          <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-1.5">Base Color</label>
          <div className="flex gap-2 items-center">
            <input type="color" value={baseColor} onChange={e => setBaseColor(e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer" />
            <input type="text" value={baseColor.toUpperCase()} onChange={e => setBaseColor(e.target.value)}
              className="input-field font-mono text-sm" />
          </div>
        </div>
      )}

      {/* Palette strip */}
      <div className="rounded-2xl overflow-hidden mb-4 shadow-soft dark:shadow-soft-dark border border-surface-200 dark:border-surface-800">
        {palette.map((hex, i) => (
          <div key={i} style={{ background: hex }}
            className="py-5 px-4 flex items-center justify-between cursor-pointer transition-all hover:brightness-105"
            onClick={() => copySingle(hex, i)}>
            <div className="flex items-center gap-2.5">
              <button onClick={e => { e.stopPropagation(); setLocked(p => p.map((v, j) => j === i ? !v : v)); }}
                className="p-1 rounded" style={{ background: 'rgba(255,255,255,0.2)', color: getContrastText(hex) }}>
                {locked[i] ? <LockIcon /> : <UnlockIcon />}
              </button>
              <span className="font-mono font-bold text-sm" style={{ color: getContrastText(hex) }}>
                {copiedIdx === i ? '✓ Copied!' : hex.toUpperCase()}
              </span>
            </div>
            <span className="text-[11px] font-medium opacity-70" style={{ color: getContrastText(hex) }}>
              {(() => { const { r, g, b } = hexToRgb(hex); const { h, s, l } = rgbToHsl(r, g, b); return `HSL(${h},${s}%,${l}%)`; })()}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        <Button onClick={generate} className="flex-1"><RefreshIcon /> Generate</Button>
        <Button variant="secondary" className="flex-1" onClick={() => {
          navigator.clipboard.writeText(palette.join(', '));
          setCopiedAll(true); setTimeout(() => setCopiedAll(false), 1500);
        }}>{copiedAll ? '✓ Copied!' : 'Copy All'}</Button>
      </div>

      {/* CSS export */}
      {palette.length > 0 && (
        <div className="bg-surface-100 dark:bg-surface-800 rounded-xl p-4 font-mono text-xs text-surface-500 leading-loose">
          <div className="text-[10px] font-bold uppercase tracking-wider text-surface-400 mb-1.5">CSS Variables</div>
          {palette.map((hex, i) => <div key={i}>--color-{i + 1}: {hex.toLowerCase()};</div>)}
        </div>
      )}

      <div className="mt-3.5 p-3 rounded-xl bg-brand-50 dark:bg-brand-900/20 text-xs text-surface-600 dark:text-surface-400 leading-relaxed">
        💡 <strong>Tip:</strong> Click any color to copy. Lock colors with 🔒 before regenerating to keep favorites.
      </div>
    </div>
  );
}
