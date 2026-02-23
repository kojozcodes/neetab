import { useState } from 'react';
import Input from '../../components/ui/Input';
import { Slider } from '../../components/ui/FormControls';
import ResultBox from '../../components/ui/ResultBox';

export default function TipCalculator() {
  const [bill, setBill] = useState('50');
  const [tipPct, setTipPct] = useState(18);
  const [people, setPeople] = useState('2');

  const billAmt = parseFloat(bill || '0');
  const tip = (billAmt * tipPct) / 100;
  const total = billAmt + tip;
  const numPeople = Math.max(1, parseInt(people || '1'));
  const perPerson = total / numPeople;

  return (
    <div>
      <Input label="Bill Amount" value={bill} onChange={setBill} type="number" suffix="$" />
      <Slider label="Tip" value={tipPct} onChange={setTipPct} min={0} max={50} suffix="%" />
      <Input label="Split Between" value={people} onChange={setPeople} type="number" suffix="people" />
      <ResultBox label="Tip Amount" value={`$${tip.toFixed(2)}`} />
      <ResultBox label="Total" value={`$${total.toFixed(2)}`} />
      {numPeople > 1 && <ResultBox label="Per Person" value={`$${perPerson.toFixed(2)}`} />}
    </div>
  );
}
