import { useState, useMemo } from 'react';

type Sex = 'male' | 'female';
type Unit = 'metric' | 'imperial';
type Goal = 'lose' | 'maintain' | 'gain';

const ACTIVITY = [
  { label: 'Sedentary (desk job, little exercise)', factor: 1.2 },
  { label: 'Lightly active (1-3 days/week)', factor: 1.375 },
  { label: 'Moderately active (3-5 days/week)', factor: 1.55 },
  { label: 'Very active (6-7 days/week)', factor: 1.725 },
  { label: 'Extra active (physical job + training)', factor: 1.9 },
];

export default function CalorieCalculator() {
  const [unit, setUnit] = useState<Unit>('metric');
  const [sex, setSex] = useState<Sex>('male');
  const [age, setAge] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightLb, setWeightLb] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [activity, setActivity] = useState(1);
  const [goal, setGoal] = useState<Goal>('maintain');

  const result = useMemo(() => {
    const a = Number(age);
    let w: number, h: number;
    if (unit === 'metric') {
      w = Number(weightKg);
      h = Number(heightCm);
    } else {
      w = Number(weightLb) * 0.453592;
      h = (Number(heightFt) * 12 + Number(heightIn)) * 2.54;
    }
    if (!a || !w || !h || a < 15 || a > 120 || w < 20 || h < 100) return null;

    // Mifflin-St Jeor BMR
    const bmr = sex === 'male'
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;

    const tdee = Math.round(bmr * ACTIVITY[activity].factor);

    const targets: Record<Goal, { cal: number; label: string; desc: string }> = {
      lose:     { cal: tdee - 500, label: 'Weight Loss', desc: 'Deficit of 500 cal/day = ~0.5 kg/week' },
      maintain: { cal: tdee,       label: 'Maintain Weight', desc: 'Matches your energy expenditure' },
      gain:     { cal: tdee + 300, label: 'Muscle Gain', desc: 'Surplus of 300 cal/day for lean bulk' },
    };
    const target = targets[goal];

    const protein = Math.round(w * 1.8); // 1.8g per kg
    const fat = Math.round((target.cal * 0.25) / 9);
    const carbs = Math.round((target.cal - protein * 4 - fat * 9) / 4);

    return { bmr: Math.round(bmr), tdee, target, protein, fat, carbs };
  }, [unit, sex, age, weightKg, heightCm, weightLb, heightFt, heightIn, activity, goal]);

  const labelClass = 'block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1';
  const inputClass = 'w-full px-3 py-2 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40';
  const toggleBase = 'flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors';
  const toggleOn = 'bg-brand-500 text-white';
  const toggleOff = 'text-surface-500 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700';

  return (
    <div className="space-y-4">
      {/* Unit + Sex */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className={labelClass}>Units</label>
          <div className="flex gap-1 p-1 rounded-lg bg-surface-100 dark:bg-surface-800">
            {(['metric', 'imperial'] as Unit[]).map(u => (
              <button key={u} onClick={() => setUnit(u)} className={`${toggleBase} ${unit === u ? toggleOn : toggleOff}`}>
                {u === 'metric' ? 'Metric' : 'Imperial'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <label className={labelClass}>Biological sex</label>
          <div className="flex gap-1 p-1 rounded-lg bg-surface-100 dark:bg-surface-800">
            {(['male', 'female'] as Sex[]).map(s => (
              <button key={s} onClick={() => setSex(s)} className={`${toggleBase} ${sex === s ? toggleOn : toggleOff} capitalize`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Age (years)</label>
          <input type="number" className={inputClass} placeholder="30" min={15} max={120} value={age} onChange={e => setAge(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Weight {unit === 'metric' ? '(kg)' : '(lb)'}</label>
          <input type="number" className={inputClass} placeholder={unit === 'metric' ? '70' : '154'} value={unit === 'metric' ? weightKg : weightLb} onChange={e => unit === 'metric' ? setWeightKg(e.target.value) : setWeightLb(e.target.value)} />
        </div>
        {unit === 'metric' ? (
          <div className="col-span-2">
            <label className={labelClass}>Height (cm)</label>
            <input type="number" className={inputClass} placeholder="175" value={heightCm} onChange={e => setHeightCm(e.target.value)} />
          </div>
        ) : (
          <>
            <div>
              <label className={labelClass}>Height (ft)</label>
              <input type="number" className={inputClass} placeholder="5" value={heightFt} onChange={e => setHeightFt(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Height (in)</label>
              <input type="number" className={inputClass} placeholder="9" value={heightIn} onChange={e => setHeightIn(e.target.value)} />
            </div>
          </>
        )}
      </div>

      {/* Activity level */}
      <div>
        <label className={labelClass}>Activity Level</label>
        <div className="space-y-1">
          {ACTIVITY.map((a, i) => (
            <button
              key={i}
              onClick={() => setActivity(i)}
              className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition-colors ${activity === i ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400 font-semibold' : 'border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:border-brand-300'}`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Goal */}
      <div>
        <label className={labelClass}>Goal</label>
        <div className="flex gap-2">
          {([['lose', 'Lose Weight'], ['maintain', 'Maintain'], ['gain', 'Build Muscle']] as [Goal, string][]).map(([g, l]) => (
            <button key={g} onClick={() => setGoal(g)} className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors ${goal === g ? 'bg-brand-500 text-white border-brand-500' : 'border-surface-300 dark:border-surface-600 text-surface-500 hover:border-brand-300'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 p-4 text-center">
              <p className="text-2xl font-bold text-surface-800 dark:text-surface-200 tabular-nums">{result.bmr.toLocaleString()}</p>
              <p className="text-xs text-surface-500 mt-1">BMR (cal/day)</p>
              <p className="text-[10px] text-surface-400 mt-0.5">Calories at complete rest</p>
            </div>
            <div className="rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 p-4 text-center">
              <p className="text-2xl font-bold text-surface-800 dark:text-surface-200 tabular-nums">{result.tdee.toLocaleString()}</p>
              <p className="text-xs text-surface-500 mt-1">TDEE (cal/day)</p>
              <p className="text-[10px] text-surface-400 mt-0.5">Total daily expenditure</p>
            </div>
          </div>

          <div className="rounded-xl border-2 border-brand-500 bg-brand-50 dark:bg-brand-950/20 p-4 text-center">
            <p className="text-3xl font-bold text-brand-500 tabular-nums">{result.target.cal.toLocaleString()}</p>
            <p className="text-sm font-semibold text-surface-700 dark:text-surface-300 mt-1">{result.target.label}</p>
            <p className="text-xs text-surface-500 mt-0.5">{result.target.desc}</p>
          </div>

          <div className="rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
            <div className="bg-surface-100 dark:bg-surface-800 px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-surface-400">Recommended daily macros</p>
            </div>
            <div className="grid grid-cols-3 divide-x divide-surface-100 dark:divide-surface-800">
              {[
                { label: 'Protein', val: result.protein, unit: 'g', color: 'text-blue-500' },
                { label: 'Carbs', val: result.carbs, unit: 'g', color: 'text-amber-500' },
                { label: 'Fat', val: result.fat, unit: 'g', color: 'text-green-500' },
              ].map(m => (
                <div key={m.label} className="p-3 text-center bg-surface-50 dark:bg-surface-900">
                  <p className={`text-xl font-bold tabular-nums ${m.color}`}>{m.val}{m.unit}</p>
                  <p className="text-[10px] text-surface-400 mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-surface-400 text-center leading-relaxed">
            Based on Mifflin-St Jeor equation. Results are estimates - consult a healthcare provider for personalized advice.
          </p>
        </div>
      )}
    </div>
  );
}
