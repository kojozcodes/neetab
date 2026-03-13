import { useState } from 'react';

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function linearize(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function isValidHex(hex: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

interface BadgeProps {
  pass: boolean;
  label: string;
}

function Badge({ pass, label }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
        pass
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
      }`}
    >
      {pass ? '✓' : '✗'} {label}
    </span>
  );
}

export default function ColorContrastChecker() {
  const [fg, setFg] = useState('#1a1a2e');
  const [fgInput, setFgInput] = useState('#1a1a2e');
  const [bg, setBg] = useState('#ffffff');
  const [bgInput, setBgInput] = useState('#ffffff');

  const fgValid = isValidHex(fg);
  const bgValid = isValidHex(bg);
  const ratio = fgValid && bgValid ? contrastRatio(fg, bg) : null;

  const aaNormal = ratio !== null && ratio >= 4.5;
  const aaLarge = ratio !== null && ratio >= 3;
  const aaaNormal = ratio !== null && ratio >= 7;
  const aaaLarge = ratio !== null && ratio >= 4.5;

  const handleFgHex = (val: string) => {
    setFgInput(val);
    if (isValidHex(val)) setFg(val);
  };

  const handleBgHex = (val: string) => {
    setBgInput(val);
    if (isValidHex(val)) setBg(val);
  };

  return (
    <div className="space-y-4">
      {/* Color pickers */}
      <div className="grid grid-cols-2 gap-3">
        {/* Foreground */}
        <div>
          <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-1.5">
            Foreground (Text)
          </label>
          <input
            type="color"
            value={fgValid ? fg : '#000000'}
            onChange={e => { setFg(e.target.value); setFgInput(e.target.value); }}
            className="w-full h-10 rounded-lg cursor-pointer border border-surface-200 dark:border-surface-700"
          />
          <input
            type="text"
            value={fgInput}
            onChange={e => handleFgHex(e.target.value)}
            placeholder="#1a1a2e"
            className="w-full mt-1.5 px-2.5 py-1.5 text-sm font-mono rounded-lg bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Background */}
        <div>
          <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-1.5">
            Background
          </label>
          <input
            type="color"
            value={bgValid ? bg : '#ffffff'}
            onChange={e => { setBg(e.target.value); setBgInput(e.target.value); }}
            className="w-full h-10 rounded-lg cursor-pointer border border-surface-200 dark:border-surface-700"
          />
          <input
            type="text"
            value={bgInput}
            onChange={e => handleBgHex(e.target.value)}
            placeholder="#ffffff"
            className="w-full mt-1.5 px-2.5 py-1.5 text-sm font-mono rounded-lg bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Contrast ratio */}
      <div className="p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-center">
        <div className="text-[11px] font-bold uppercase tracking-wider text-surface-400 mb-1">Contrast Ratio</div>
        <div className="text-4xl font-bold text-surface-800 dark:text-surface-100">
          {ratio !== null ? `${ratio.toFixed(2)}:1` : '--'}
        </div>
      </div>

      {/* WCAG results */}
      {ratio !== null && (
        <div className="p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-surface-400">WCAG Compliance</div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-surface-700 dark:text-surface-300">AA Normal Text</span>
                <span className="ml-2 text-xs text-surface-400">4.5:1 required</span>
              </div>
              <Badge pass={aaNormal} label={aaNormal ? 'Pass' : 'Fail'} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-surface-700 dark:text-surface-300">AA Large Text</span>
                <span className="ml-2 text-xs text-surface-400">3:1 required</span>
              </div>
              <Badge pass={aaLarge} label={aaLarge ? 'Pass' : 'Fail'} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-surface-700 dark:text-surface-300">AAA Normal Text</span>
                <span className="ml-2 text-xs text-surface-400">7:1 required</span>
              </div>
              <Badge pass={aaaNormal} label={aaaNormal ? 'Pass' : 'Fail'} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-surface-700 dark:text-surface-300">AAA Large Text</span>
                <span className="ml-2 text-xs text-surface-400">4.5:1 required</span>
              </div>
              <Badge pass={aaaLarge} label={aaaLarge ? 'Pass' : 'Fail'} />
            </div>
          </div>
        </div>
      )}

      {/* Text preview */}
      {fgValid && bgValid && (
        <div
          className="p-5 rounded-xl border border-surface-200 dark:border-surface-700"
          style={{ backgroundColor: bg }}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: fg, opacity: 0.5 }}>
            Preview
          </div>
          <p className="text-base font-medium leading-relaxed mb-2" style={{ color: fg }}>
            Normal Text - The quick brown fox jumps over the lazy dog.
          </p>
          <p className="text-2xl font-bold leading-snug" style={{ color: fg }}>
            Large Text - The quick brown fox.
          </p>
        </div>
      )}
    </div>
  );
}
