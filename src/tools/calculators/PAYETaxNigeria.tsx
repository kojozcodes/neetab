import { useState, useMemo } from 'react';
import Input from '../../components/ui/Input';
import { Slider, Toggle } from '../../components/ui/FormControls';

const TAX_BANDS = [
  { limit: 800_000, rate: 0 },
  { limit: 2_200_000, rate: 0.15 },   // 800k–3m
  { limit: 7_000_000, rate: 0.18 },   // 3m–10m
  { limit: 15_000_000, rate: 0.21 },  // 10m–25m
  { limit: 25_000_000, rate: 0.23 },  // 25m–50m
  { limit: Infinity, rate: 0.25 },    // above 50m
];

function calcTax(chargeable: number): { total: number; bands: { range: string; rate: number; taxable: number; tax: number }[] } {
  let remaining = Math.max(0, chargeable);
  let cumulative = 0;
  const bands: { range: string; rate: number; taxable: number; tax: number }[] = [];

  for (const { limit, rate } of TAX_BANDS) {
    if (remaining <= 0) break;
    const taxable = Math.min(remaining, limit);
    const tax = taxable * rate;
    const lo = cumulative;
    cumulative += limit === Infinity ? remaining : limit;
    bands.push({
      range: limit === Infinity ? `Above ₦${fmt(lo)}` : `₦${fmt(lo + 1)} – ₦${fmt(cumulative)}`,
      rate,
      taxable,
      tax,
    });
    remaining -= taxable;
  }
  // Fix first band range display
  if (bands.length > 0) bands[0].range = `First ₦${fmt(800_000)}`;

  return { total: bands.reduce((s, b) => s + b.tax, 0), bands };
}

function fmt(n: number): string {
  return n.toLocaleString('en-NG', { maximumFractionDigits: 0 });
}

function fmtCurrency(n: number): string {
  return '₦' + n.toLocaleString('en-NG', { maximumFractionDigits: 0 });
}

export default function PAYETaxNigeria() {
  const [monthlySalary, setMonthlySalary] = useState('500000');
  const [basicPct, setBasicPct] = useState(40);
  const [housingPct, setHousingPct] = useState(30);
  const [transportPct, setTransportPct] = useState(10);
  const [annualRent, setAnnualRent] = useState('0');
  const [pensionOn, setPensionOn] = useState(true);
  const [nhfOn, setNhfOn] = useState(true);

  const othersPct = Math.max(0, 100 - basicPct - housingPct - transportPct);

  const result = useMemo(() => {
    const monthly = parseFloat(monthlySalary || '0');
    if (monthly <= 0) return null;

    const annualGross = monthly * 12;
    const basic = annualGross * (basicPct / 100);
    const housing = annualGross * (housingPct / 100);
    const transport = annualGross * (transportPct / 100);
    const others = annualGross * (othersPct / 100);

    // Deductions
    const pension = pensionOn ? (basic + housing + transport) * 0.08 : 0;
    const nhf = nhfOn ? basic * 0.025 : 0;
    const rent = parseFloat(annualRent || '0');
    const rentRelief = Math.min(rent * 0.2, 500_000);

    const chargeableIncome = Math.max(0, annualGross - pension - nhf - rentRelief);

    const { total: annualTax, bands } = calcTax(chargeableIncome);
    const monthlyTax = annualTax / 12;
    const effectiveRate = annualGross > 0 ? (annualTax / annualGross) * 100 : 0;
    const monthlyTakeHome = monthly - (pension / 12) - (nhf / 12) - monthlyTax;

    return {
      annualGross,
      basic, housing, transport, others,
      pension, nhf, rentRelief,
      chargeableIncome,
      annualTax, monthlyTax,
      effectiveRate,
      monthlyTakeHome,
      annualTakeHome: monthlyTakeHome * 12,
      bands,
    };
  }, [monthlySalary, basicPct, housingPct, transportPct, othersPct, annualRent, pensionOn, nhfOn]);

  return (
    <div className="space-y-4">
      {/* Salary Input */}
      <Input label="Monthly Gross Salary" value={monthlySalary} onChange={setMonthlySalary} type="number" suffix="₦" placeholder="500000" />

      {/* Salary Structure */}
      <div className="rounded-xl border border-surface-200 dark:border-surface-700 p-4 space-y-1">
        <p className="text-xs font-bold text-surface-600 dark:text-surface-400 mb-2">Salary Structure</p>
        <Slider label="Basic" value={basicPct} onChange={setBasicPct} min={0} max={100} suffix="%" />
        <Slider label="Housing" value={housingPct} onChange={setHousingPct} min={0} max={100} suffix="%" />
        <Slider label="Transport" value={transportPct} onChange={setTransportPct} min={0} max={100} suffix="%" />
        <div className="flex justify-between text-xs text-surface-500 pt-1">
          <span>Others</span>
          <span className={`font-bold ${othersPct < 0 ? 'text-red-500' : 'text-brand-500'}`}>{othersPct}%</span>
        </div>
        {othersPct < 0 && (
          <p className="text-[10px] text-red-500 font-semibold">Percentages exceed 100% — adjust the sliders.</p>
        )}
      </div>

      {/* Rent */}
      <Input label="Annual Rent Paid" value={annualRent} onChange={setAnnualRent} type="number" suffix="₦" placeholder="0" />

      {/* Toggles */}
      <div className="flex gap-6">
        <Toggle label="Pension (8%)" checked={pensionOn} onChange={setPensionOn} />
        <Toggle label="NHF (2.5%)" checked={nhfOn} onChange={setNhfOn} />
      </div>

      {/* Results */}
      {result && othersPct >= 0 && (
        <div className="space-y-3 mt-2">
          {/* Headline numbers */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border-2 border-brand-500 bg-brand-50 dark:bg-brand-950/20 p-4 text-center">
              <p className="text-2xl font-bold text-brand-500 tabular-nums">{fmtCurrency(Math.round(result.monthlyTax))}</p>
              <p className="text-xs text-surface-500 mt-1">Monthly PAYE Tax</p>
            </div>
            <div className="rounded-xl border-2 border-brand-500 bg-brand-50 dark:bg-brand-950/20 p-4 text-center">
              <p className="text-2xl font-bold text-brand-500 tabular-nums">{fmtCurrency(Math.round(result.monthlyTakeHome))}</p>
              <p className="text-xs text-surface-500 mt-1">Monthly Take-Home</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 p-4 text-center">
              <p className="text-xl font-bold text-surface-800 dark:text-surface-200 tabular-nums">{fmtCurrency(Math.round(result.annualTax))}</p>
              <p className="text-xs text-surface-500 mt-1">Annual PAYE Tax</p>
            </div>
            <div className="rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 p-4 text-center">
              <p className="text-xl font-bold text-surface-800 dark:text-surface-200 tabular-nums">{result.effectiveRate.toFixed(1)}%</p>
              <p className="text-xs text-surface-500 mt-1">Effective Tax Rate</p>
            </div>
          </div>

          {/* Deduction breakdown */}
          <div className="rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
            <div className="bg-surface-100 dark:bg-surface-800 px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-surface-400">Monthly Breakdown</p>
            </div>
            <div className="divide-y divide-surface-100 dark:divide-surface-800">
              {[
                { label: 'Gross Salary', value: parseFloat(monthlySalary || '0') },
                ...(result.pension > 0 ? [{ label: 'Pension (8%)', value: -(result.pension / 12) }] : []),
                ...(result.nhf > 0 ? [{ label: 'NHF (2.5%)', value: -(result.nhf / 12) }] : []),
                ...(result.rentRelief > 0 ? [{ label: 'Rent Relief', value: -(result.rentRelief / 12) }] : []),
                { label: 'PAYE Tax', value: -result.monthlyTax },
                { label: 'Take-Home Pay', value: result.monthlyTakeHome },
              ].map((row, i, arr) => (
                <div key={row.label} className={`flex justify-between items-center px-3 py-2.5 text-xs ${i === arr.length - 1 ? 'bg-brand-50 dark:bg-brand-950/20 font-bold' : 'bg-surface-50 dark:bg-surface-900'}`}>
                  <span className="text-surface-600 dark:text-surface-400">{row.label}</span>
                  <span className={`tabular-nums font-semibold ${row.value < 0 ? 'text-red-500 dark:text-red-400' : i === arr.length - 1 ? 'text-brand-600 dark:text-brand-400' : 'text-surface-800 dark:text-surface-200'}`}>
                    {row.value < 0 ? '−' : ''}{fmtCurrency(Math.abs(Math.round(row.value)))}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tax band breakdown */}
          <div className="rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
            <div className="bg-surface-100 dark:bg-surface-800 px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-surface-400">Tax Bands Applied</p>
            </div>
            <div className="divide-y divide-surface-100 dark:divide-surface-800">
              <div className="grid grid-cols-4 gap-1 px-3 py-2 text-[10px] font-bold text-surface-400 uppercase tracking-wider bg-surface-50 dark:bg-surface-900">
                <span>Band</span>
                <span className="text-right">Rate</span>
                <span className="text-right">Taxable</span>
                <span className="text-right">Tax</span>
              </div>
              {result.bands.map((b, i) => (
                <div key={i} className="grid grid-cols-4 gap-1 px-3 py-2 text-[11px] bg-surface-50 dark:bg-surface-900">
                  <span className="text-surface-600 dark:text-surface-400 truncate" title={b.range}>{b.range}</span>
                  <span className="text-right text-surface-500 tabular-nums">{(b.rate * 100).toFixed(0)}%</span>
                  <span className="text-right text-surface-700 dark:text-surface-300 tabular-nums">{fmtCurrency(Math.round(b.taxable))}</span>
                  <span className="text-right text-surface-700 dark:text-surface-300 tabular-nums font-semibold">{fmtCurrency(Math.round(b.tax))}</span>
                </div>
              ))}
              <div className="grid grid-cols-4 gap-1 px-3 py-2 text-xs font-bold bg-brand-50 dark:bg-brand-950/20">
                <span className="col-span-3 text-surface-600 dark:text-surface-400">Total Annual PAYE</span>
                <span className="text-right text-brand-600 dark:text-brand-400 tabular-nums">{fmtCurrency(Math.round(result.annualTax))}</span>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-[10px] text-surface-400 text-center leading-relaxed">
            Based on Nigeria Tax Act 2025, effective January 2026. This calculator provides estimates for informational purposes. Consult a qualified tax professional for advice.
          </p>
        </div>
      )}
    </div>
  );
}
