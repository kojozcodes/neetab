import { useState } from 'react';
import Input from '../../components/ui/Input';
import { Select } from '../../components/ui/FormControls';
import ResultBox from '../../components/ui/ResultBox';

export default function PercentageCalculator() {
  const [mode, setMode] = useState('whatIs');
  const [a, setA] = useState('25');
  const [b, setB] = useState('200');

  let result = '';
  const va = parseFloat(a || '0'), vb = parseFloat(b || '0');
  if (mode === 'whatIs') result = ((va / 100) * vb).toFixed(2);
  else if (mode === 'isWhatPct') result = ((va / (vb || 1)) * 100).toFixed(2) + '%';
  else result = (((vb - va) / Math.abs(va || 1)) * 100).toFixed(2) + '%';

  return (
    <div>
      <Select label="Calculation Type" value={mode} onChange={setMode} options={[
        { value: 'whatIs', label: 'What is X% of Y?' },
        { value: 'isWhatPct', label: 'X is what % of Y?' },
        { value: 'change', label: '% change from X to Y' },
      ]} />
      <Input label={mode === 'whatIs' ? 'Percentage' : mode === 'isWhatPct' ? 'Value' : 'From'} value={a} onChange={setA} type="number" />
      <Input label={mode === 'whatIs' ? 'Of' : mode === 'isWhatPct' ? 'Of Total' : 'To'} value={b} onChange={setB} type="number" />
      <ResultBox label="Result" value={result} />
    </div>
  );
}
