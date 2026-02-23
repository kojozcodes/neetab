import { useState, useCallback, useEffect } from 'react';
import { Slider, Toggle, Button } from '../../components/ui/FormControls';
import { RefreshIcon } from '../../components/ui/Icons';
import ResultBox from '../../components/ui/ResultBox';

export default function PasswordGenerator() {
  const [len, setLen] = useState(16);
  const [up, setUp] = useState(true);
  const [lo, setLo] = useState(true);
  const [nums, setNums] = useState(true);
  const [syms, setSyms] = useState(true);
  const [pw, setPw] = useState('');

  const gen = useCallback(() => {
    let ch = '';
    if (up) ch += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lo) ch += 'abcdefghijklmnopqrstuvwxyz';
    if (nums) ch += '0123456789';
    if (syms) ch += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!ch) return setPw('Enable an option');
    let p = '';
    const a = new Uint32Array(len);
    crypto.getRandomValues(a);
    for (let i = 0; i < len; i++) p += ch[a[i] % ch.length];
    setPw(p);
  }, [len, up, lo, nums, syms]);

  useEffect(() => { gen(); }, [gen]);

  const str = [up, lo, nums, syms].filter(Boolean).length;
  const sLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const sColors = ['', 'text-red-500', 'text-amber-500', 'text-blue-500', 'text-emerald-500'];
  const sBgs = ['', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];

  return (
    <div>
      <ResultBox label="Password" value={pw} />
      <div className="flex items-center gap-2 my-3">
        <div className="flex-1 h-1 rounded-full bg-surface-200 dark:bg-surface-800 overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-300 ${sBgs[str]}`} style={{ width: `${str * 25}%` }} />
        </div>
        <span className={`text-[11px] font-bold ${sColors[str]}`}>{sLabels[str]}</span>
      </div>
      <Slider label="Length" value={len} onChange={setLen} min={4} max={64} />
      <Toggle label="Uppercase (A-Z)" checked={up} onChange={setUp} />
      <Toggle label="Lowercase (a-z)" checked={lo} onChange={setLo} />
      <Toggle label="Numbers (0-9)" checked={nums} onChange={setNums} />
      <Toggle label="Symbols (!@#$)" checked={syms} onChange={setSyms} />
      <Button onClick={gen} className="w-full mt-2"><RefreshIcon /> Generate New</Button>
    </div>
  );
}
