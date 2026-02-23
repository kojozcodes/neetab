import { useState } from 'react';
import Input from '../../components/ui/Input';
import { Slider } from '../../components/ui/FormControls';
import ResultBox from '../../components/ui/ResultBox';

export default function DiscountCalculator() {
  const [price, setPrice] = useState('100');
  const [disc, setDisc] = useState(20);
  const p = parseFloat(price || '0');
  const saved = (p * disc) / 100;
  const final_ = p - saved;

  return (
    <div>
      <Input label="Original Price" value={price} onChange={setPrice} type="number" suffix="$" />
      <Slider label="Discount" value={disc} onChange={setDisc} min={0} max={90} suffix="%" />
      <ResultBox label="You Save" value={`$${saved.toFixed(2)}`} />
      <ResultBox label="Final Price" value={`$${final_.toFixed(2)}`} />
    </div>
  );
}
