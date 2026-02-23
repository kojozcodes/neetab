import { useState } from 'react';
import Input from '../../components/ui/Input';
import ResultBox from '../../components/ui/ResultBox';

export default function LoanCalculator() {
  const [P, setP] = useState('250000');
  const [rate, setRate] = useState('6.5');
  const [yrs, setYrs] = useState('30');

  const p = parseFloat(P || '0'), r = parseFloat(rate || '0') / 100 / 12, n = parseFloat(yrs || '0') * 12;
  let mo = 0, tot = 0, int_ = 0;
  if (r > 0 && n > 0) { mo = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1); tot = mo * n; int_ = tot - p; }

  return (
    <div>
      <Input label="Loan Amount" value={P} onChange={setP} type="number" suffix="$" />
      <Input label="Interest Rate" value={rate} onChange={setRate} type="number" suffix="%" step="0.1" />
      <Input label="Term" value={yrs} onChange={setYrs} type="number" suffix="years" />
      <ResultBox label="Monthly Payment" value={`$${mo.toFixed(2)}`} />
      <ResultBox label="Total Interest" value={`$${int_.toFixed(2)}`} />
      <ResultBox label="Total Paid" value={`$${tot.toFixed(2)}`} />
    </div>
  );
}
