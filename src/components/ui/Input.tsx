interface InputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  suffix?: string;
  step?: string;
}

export default function Input({ label, value, onChange, type = 'text', placeholder, suffix, step }: InputProps) {
  return (
    <div className="mb-3.5">
      {label && (
        <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          step={step}
          className="input-field"
          style={{ paddingRight: suffix ? 48 : undefined }}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-surface-500">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
