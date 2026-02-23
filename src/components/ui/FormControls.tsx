// ─── Select ───
interface SelectOption { value: string | number; label: string; }
interface SelectProps { label?: string; value: string | number; onChange: (v: string) => void; options: SelectOption[]; }

export function Select({ label, value, onChange, options }: SelectProps) {
  return (
    <div className="mb-3.5">
      {label && <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-1.5">{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)} className="input-field cursor-pointer">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ─── Slider ───
interface SliderProps { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step?: number; suffix?: string; }

export function Slider({ label, value, onChange, min, max, step = 1, suffix = '' }: SliderProps) {
  return (
    <div className="mb-3.5">
      <div className="flex justify-between mb-1.5">
        <label className="text-xs font-semibold text-surface-600 dark:text-surface-500">{label}</label>
        <span className="text-sm font-bold text-brand-500">{value}{suffix}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full cursor-pointer"
      />
    </div>
  );
}

// ─── Toggle ───
interface ToggleProps { label: string; checked: boolean; onChange: (v: boolean) => void; }

export function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <label className="flex items-center gap-3 mb-2.5 cursor-pointer select-none">
      <button
        onClick={() => onChange(!checked)}
        className={`w-10 h-[22px] rounded-full relative transition-colors duration-200 flex-shrink-0 ${
          checked ? 'bg-brand-500' : 'bg-surface-300 dark:bg-surface-700'
        }`}
      >
        <div
          className="w-4 h-4 rounded-full bg-white absolute top-[3px] transition-[left] duration-200 shadow-sm"
          style={{ left: checked ? 21 : 3 }}
        />
      </button>
      <span className="text-xs font-semibold text-surface-600 dark:text-surface-500">{label}</span>
    </label>
  );
}

// ─── Button ───
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
  disabled?: boolean;
}

export function Button({ children, onClick, variant = 'primary', className = '', disabled }: ButtonProps) {
  const base = 'flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200 font-sans';
  const variants = {
    primary: 'bg-brand-500 text-white hover:bg-brand-600 active:scale-[0.98] shadow-sm',
    secondary: 'bg-transparent text-surface-600 dark:text-surface-400 border-[1.5px] border-surface-300 dark:border-surface-700 hover:border-brand-500 hover:text-brand-500',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${disabled ? 'opacity-40 pointer-events-none' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
