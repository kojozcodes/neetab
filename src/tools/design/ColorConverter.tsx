import { useState } from 'react';
import ResultBox from '../../components/ui/ResultBox';
import { hexToRgb, rgbToHsl, getContrastText } from '../../utils/color';

export default function ColorConverter() {
  const [hex, setHex] = useState('#FF6B35');
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  return (
    <div>
      <div className="mb-3.5">
        <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-1.5">Pick or type color</label>
        <div className="flex gap-2 items-center">
          <input type="color" value={hex} onChange={e => setHex(e.target.value)} className="w-14 h-11 rounded-xl cursor-pointer" />
          <input type="text" value={hex.toUpperCase()}
            onChange={e => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) setHex(e.target.value); }}
            className="input-field font-mono text-base" />
        </div>
      </div>
      <div className="h-[72px] rounded-2xl mb-4 border border-surface-200 dark:border-surface-800 flex items-center justify-center"
        style={{ background: hex }}>
        <span className="font-mono font-bold text-sm" style={{ color: getContrastText(hex) }}>{hex.toUpperCase()}</span>
      </div>
      <ResultBox label="HEX" value={hex.toUpperCase()} />
      <ResultBox label="RGB" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
      <ResultBox label="HSL" value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
      <ResultBox label="RGBA" value={`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`} />
    </div>
  );
}
