import { useState } from 'react';
import Input from '../../components/ui/Input';
import { Select } from '../../components/ui/FormControls';
import ResultBox from '../../components/ui/ResultBox';

const cats: Record<string, { units: string[]; base: number[]; special?: boolean }> = {
  Length: { units: ['Meters', 'Kilometers', 'Miles', 'Feet', 'Inches', 'Centimeters', 'Yards'], base: [1, 1000, 1609.34, .3048, .0254, .01, .9144] },
  Weight: { units: ['Kilograms', 'Grams', 'Pounds', 'Ounces', 'Tons'], base: [1, .001, .453592, .0283495, 907.185] },
  Temperature: { units: ['Celsius', 'Fahrenheit', 'Kelvin'], base: [], special: true },
  Volume: { units: ['Liters', 'Milliliters', 'Gallons (US)', 'Cups', 'Fluid Oz'], base: [1, .001, 3.78541, .236588, .0295735] },
  Area: { units: ['Sq Meters', 'Sq Feet', 'Sq Km', 'Acres', 'Hectares'], base: [1, .0929, 1000000, 4046.86, 10000] },
  Speed: { units: ['m/s', 'km/h', 'mph', 'knots'], base: [1, .277778, .44704, .514444] },
  Data: { units: ['Bytes', 'KB', 'MB', 'GB', 'TB'], base: [1, 1024, 1048576, 1073741824, 1099511627776] },
};

export default function UnitConverter() {
  const [cat, setCat] = useState('Length');
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(1);
  const [val, setVal] = useState('1');

  const c = cats[cat];
  let result = 0;
  if (c.special) {
    const v = parseFloat(val || '0');
    const toC = [v, (v - 32) * 5 / 9, v - 273.15][from];
    result = [toC, toC * 9 / 5 + 32, toC + 273.15][to];
  } else {
    result = (parseFloat(val || '0') * c.base[from]) / c.base[to];
  }

  return (
    <div>
      <Select label="Category" value={cat} onChange={v => { setCat(v); setFrom(0); setTo(1); }} options={Object.keys(cats).map(k => ({ value: k, label: k }))} />
      <Input label="Value" value={val} onChange={setVal} type="number" />
      <Select label="From" value={String(from)} onChange={v => setFrom(+v)} options={c.units.map((u, i) => ({ value: String(i), label: u }))} />
      <div className="flex justify-center my-1">
        <button
          onClick={() => { setFrom(to); setTo(from); }}
          className="text-surface-400 hover:text-brand-500 transition-colors text-lg leading-none"
          title="Swap units"
          aria-label="Swap units"
        >
          ⇄
        </button>
      </div>
      <Select label="To" value={String(to)} onChange={v => setTo(+v)} options={c.units.map((u, i) => ({ value: String(i), label: u }))} />
      <ResultBox label={c.units[to]} value={result.toFixed(6).replace(/\.?0+$/, '')} />
    </div>
  );
}
