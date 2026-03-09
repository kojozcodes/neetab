import { useState } from 'react';
import Input from '../../components/ui/Input';
import { Select } from '../../components/ui/FormControls';
import ResultBox from '../../components/ui/ResultBox';

export default function BMICalculator() {
  const [sys, setSys] = useState('metric');
  const [h, setH] = useState('178');
  const [w, setW] = useState('73');

  let bmi = 0;
  if (sys === 'imperial') bmi = (parseFloat(w || '0') / (parseFloat(h || '1') ** 2)) * 703;
  else bmi = parseFloat(w || '0') / ((parseFloat(h || '1') / 100) ** 2);

  const cat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
  const cc = bmi < 18.5 ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' : bmi < 25 ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : bmi < 30 ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'text-red-500 bg-red-50 dark:bg-red-900/20';

  return (
    <div>
      <Select label="Units" value={sys} onChange={v => { setSys(v); setH(v === 'imperial' ? '70' : '178'); setW(v === 'imperial' ? '160' : '73'); }}
        options={[{ value: 'imperial', label: 'Imperial (in/lb)' }, { value: 'metric', label: 'Metric (cm/kg)' }]} />
      <Input label={sys === 'imperial' ? 'Height (inches)' : 'Height (cm)'} value={h} onChange={setH} type="number" />
      <Input label={sys === 'imperial' ? 'Weight (lbs)' : 'Weight (kg)'} value={w} onChange={setW} type="number" />
      <ResultBox label="BMI" value={bmi.toFixed(1)} />
      <div className={`mt-2 py-2.5 px-4 rounded-lg font-bold text-sm text-center ${cc}`}>{cat}</div>
    </div>
  );
}
