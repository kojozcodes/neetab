import { useState, useEffect, useCallback } from 'react';
import { Button } from '../../components/ui/FormControls';
import ResultBox from '../../components/ui/ResultBox';

const POPULAR_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'NGN',
  'KRW', 'BRL', 'MXN', 'ZAR', 'SGD', 'HKD', 'NOK', 'SEK', 'DKK', 'NZD',
  'TRY', 'RUB', 'PLN', 'THB', 'IDR', 'MYR', 'PHP', 'CZK', 'ILS', 'AED',
];

const CURRENCY_NAMES: Record<string, string> = {
  USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound', JPY: 'Japanese Yen',
  CAD: 'Canadian Dollar', AUD: 'Australian Dollar', CHF: 'Swiss Franc',
  CNY: 'Chinese Yuan', INR: 'Indian Rupee', NGN: 'Nigerian Naira',
  KRW: 'South Korean Won', BRL: 'Brazilian Real', MXN: 'Mexican Peso',
  ZAR: 'South African Rand', SGD: 'Singapore Dollar', HKD: 'Hong Kong Dollar',
  NOK: 'Norwegian Krone', SEK: 'Swedish Krona', DKK: 'Danish Krone',
  NZD: 'New Zealand Dollar', TRY: 'Turkish Lira', RUB: 'Russian Ruble',
  PLN: 'Polish Zloty', THB: 'Thai Baht', IDR: 'Indonesian Rupiah',
  MYR: 'Malaysian Ringgit', PHP: 'Philippine Peso', CZK: 'Czech Koruna',
  ILS: 'Israeli Shekel', AED: 'UAE Dirham',
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [result, setResult] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState('');

  const convert = useCallback(async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`https://api.frankfurter.app/latest?amount=${amt}&from=${from}&to=${to}`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      const converted = data.rates[to];
      setResult(converted);
      setRate(converted / amt);
      setLastUpdate(data.date);
    } catch {
      setError('Failed to fetch rates. Check your connection and try again.');
      setResult(null);
      setRate(null);
    }
    setLoading(false);
  }, [amount, from, to]);

  // Auto-convert on mount and when inputs change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (parseFloat(amount) > 0 && from !== to) convert();
    }, 300);
    return () => clearTimeout(timer);
  }, [amount, from, to]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const CurrencySelect = ({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) => (
    <div>
      <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="input-field cursor-pointer text-sm"
      >
        {POPULAR_CURRENCIES.map(c => (
          <option key={c} value={c}>{c} — {CURRENCY_NAMES[c] || c}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div>
      {/* Amount */}
      <div className="mb-3">
        <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-1.5">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          min="0"
          step="any"
          className="input-field text-lg font-bold"
          placeholder="Enter amount"
        />
      </div>

      {/* From / Swap / To */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-end mb-3">
        <CurrencySelect value={from} onChange={setFrom} label="From" />
        <button
          onClick={swap}
          className="mb-0.5 w-9 h-9 rounded-full bg-surface-100 dark:bg-surface-800 border border-surface-300 dark:border-surface-700 flex items-center justify-center text-sm hover:bg-brand-50 hover:border-brand-500 hover:text-brand-500 transition-colors"
        >
          ⇄
        </button>
        <CurrencySelect value={to} onChange={setTo} label="To" />
      </div>

      {from === to && (
        <div className="text-center text-xs text-surface-400 py-2">Select different currencies to convert.</div>
      )}

      {loading && (
        <div className="text-center py-3">
          <div className="text-xs text-surface-400">Fetching latest rates...</div>
        </div>
      )}

      {error && <div className="text-center py-3 text-red-500 text-xs">{error}</div>}

      {result !== null && !loading && (
        <div>
          <ResultBox
            label={`${parseFloat(amount).toLocaleString()} ${from} =`}
            value={`${result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ${to}`}
            copyable={false}
          />
          {rate !== null && (
            <div className="flex justify-between text-[10px] text-surface-400 mt-2 px-1">
              <span>1 {from} = {rate.toFixed(4)} {to}</span>
              {lastUpdate && <span>Rates from {lastUpdate}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
