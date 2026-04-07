import { useState, useMemo } from 'react';

const SUBJECTS = [
  'English Language', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'Economics', 'Government', 'Literature in English', 'Civic Education', 'Geography',
  'Further Mathematics', 'Agricultural Science', 'Commerce', 'Accounting',
  'Computer Studies', 'Yoruba', 'Igbo', 'Hausa', 'Other',
];

const GRADES = ['A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9'] as const;
type Grade = typeof GRADES[number];

const GRADE_POINTS: Record<Grade, number> = { A1: 1, B2: 2, B3: 3, C4: 4, C5: 5, C6: 6, D7: 7, E8: 8, F9: 9 };

function isCredit(grade: Grade): boolean {
  return GRADE_POINTS[grade] <= 6;
}

interface Subject {
  name: string;
  customName: string;
  grade: Grade;
}

function makeSubject(name = '', grade: Grade = 'A1'): Subject {
  return { name, customName: '', grade };
}

interface Requirement {
  label: string;
  emoji: string;
  required: string[];
  minCredits: number;
  mathMinGrade?: Grade;
}

const REQUIREMENTS: Requirement[] = [
  { label: 'Medicine & Surgery', emoji: '🩺', required: ['English Language', 'Mathematics', 'Physics', 'Chemistry', 'Biology'], minCredits: 5 },
  { label: 'Engineering', emoji: '⚙️', required: ['English Language', 'Mathematics', 'Physics', 'Chemistry'], minCredits: 5 },
  { label: 'Law', emoji: '⚖️', required: ['English Language', 'Literature in English'], minCredits: 5, mathMinGrade: 'C6' },
  { label: 'Accounting / Business', emoji: '📊', required: ['English Language', 'Mathematics', 'Economics'], minCredits: 5 },
  { label: 'Computer Science', emoji: '💻', required: ['English Language', 'Mathematics', 'Physics'], minCredits: 5 },
  { label: 'Nursing', emoji: '🏥', required: ['English Language', 'Mathematics', 'Biology', 'Chemistry', 'Physics'], minCredits: 5 },
];

const inputClass = 'w-full px-2.5 py-2 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40';

export default function WAECGradeCalculator() {
  const [subjects, setSubjects] = useState<Subject[]>([
    makeSubject('English Language'),
    makeSubject('Mathematics'),
    makeSubject(''),
    makeSubject(''),
    makeSubject(''),
    makeSubject(''),
    makeSubject(''),
    makeSubject(''),
    makeSubject(''),
  ]);

  const update = (idx: number, field: keyof Subject, value: string) => {
    setSubjects(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const filled = useMemo(() => subjects.filter(s => s.name !== ''), [subjects]);

  const result = useMemo(() => {
    if (filled.length === 0) return null;

    const rows = filled.map(s => {
      const resolvedName = s.name === 'Other' ? (s.customName || 'Other') : s.name;
      const points = GRADE_POINTS[s.grade];
      const credit = isCredit(s.grade);
      return { name: resolvedName, grade: s.grade, points, credit };
    });

    const totalCredits = rows.filter(r => r.credit).length;
    const totalPassed = rows.filter(r => r.points <= 7).length;

    // Aggregate = sum of best 6 grades (lowest point values)
    const sorted = [...rows].sort((a, b) => a.points - b.points);
    const best6 = sorted.slice(0, Math.min(6, sorted.length));
    const aggregate = best6.reduce((sum, r) => sum + r.points, 0);

    // Build a lookup: subject name -> grade
    const gradeMap = new Map<string, Grade>();
    for (const s of filled) {
      const name = s.name === 'Other' ? (s.customName || 'Other') : s.name;
      gradeMap.set(name, s.grade);
    }

    const eligibility = REQUIREMENTS.map(req => {
      const missing: string[] = [];
      let met = true;

      for (const subj of req.required) {
        const g = gradeMap.get(subj);
        if (!g || !isCredit(g)) {
          missing.push(subj);
          met = false;
        }
      }

      // Special case: Law needs Maths at C6 or better (credit)
      if (req.mathMinGrade) {
        const mathGrade = gradeMap.get('Mathematics');
        if (!mathGrade || GRADE_POINTS[mathGrade] > GRADE_POINTS[req.mathMinGrade]) {
          if (!missing.includes('Mathematics')) missing.push('Mathematics (min C6)');
          met = false;
        }
      }

      // Check total credits meet minimum
      if (totalCredits < req.minCredits) met = false;

      return { ...req, met, missing };
    });

    return { rows, totalCredits, totalPassed, aggregate, best6Count: best6.length, eligibility };
  }, [filled, subjects]);

  return (
    <div className="space-y-4">
      {/* Subject inputs */}
      <div className="rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
        <div className="bg-surface-100 dark:bg-surface-800 px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-surface-400">Enter Your Subjects & Grades</p>
        </div>

        <div className="grid grid-cols-[20px_1fr_1fr_90px] gap-2 px-3 pt-2 pb-1">
          <span />
          <span className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">Subject</span>
          <span className="text-[10px] font-bold text-surface-400 uppercase tracking-wider hidden" />
          <span className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">Grade</span>
        </div>

        <div className="px-3 pb-3 space-y-1.5">
          {subjects.map((s, i) => (
            <div key={i} className="grid grid-cols-[20px_1fr_90px] gap-2 items-center">
              <span className="text-[10px] font-bold text-surface-400 tabular-nums text-center">{i + 1}</span>
              <div className="flex gap-1.5">
                <select
                  value={s.name}
                  onChange={e => update(i, 'name', e.target.value)}
                  className={`${inputClass} cursor-pointer ${!s.name ? 'text-surface-400' : ''}`}
                >
                  <option value="">— Select subject —</option>
                  {SUBJECTS.map(subj => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
                {s.name === 'Other' && (
                  <input
                    type="text"
                    value={s.customName}
                    onChange={e => update(i, 'customName', e.target.value)}
                    placeholder="Subject name"
                    className={inputClass}
                  />
                )}
              </div>
              <select
                value={s.grade}
                onChange={e => update(i, 'grade', e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                {GRADES.map(g => (
                  <option key={g} value={g}>{g} ({GRADE_POINTS[g]})</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-3">
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="rounded-xl border-2 border-brand-500 bg-brand-50 dark:bg-brand-950/20 p-3 text-center">
              <p className="text-2xl font-bold text-brand-500 tabular-nums">{result.aggregate}</p>
              <p className="text-[10px] text-surface-500 mt-0.5">Aggregate (Best {result.best6Count})</p>
            </div>
            <div className="rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 p-3 text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 tabular-nums">{result.totalCredits}</p>
              <p className="text-[10px] text-surface-500 mt-0.5">Credits (C6+)</p>
            </div>
            <div className="rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 p-3 text-center">
              <p className="text-2xl font-bold text-surface-800 dark:text-surface-200 tabular-nums">{result.totalPassed}</p>
              <p className="text-[10px] text-surface-500 mt-0.5">Total Passed</p>
            </div>
          </div>

          {/* Subject breakdown */}
          <div className="rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
            <div className="bg-surface-100 dark:bg-surface-800 px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-surface-400">Subject Breakdown</p>
            </div>
            <div className="divide-y divide-surface-100 dark:divide-surface-800">
              {result.rows.map((r, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2 bg-surface-50 dark:bg-surface-900">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${r.credit ? 'bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400' : r.points <= 7 ? 'bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400' : 'bg-red-100 dark:bg-red-950/30 text-red-500 dark:text-red-400'}`}>
                      {r.credit ? '✓' : r.points <= 7 ? 'P' : '✗'}
                    </span>
                    <span className="text-xs text-surface-700 dark:text-surface-300">{r.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold tabular-nums ${r.credit ? 'text-green-600 dark:text-green-400' : 'text-surface-500'}`}>{r.grade}</span>
                    <span className="text-[10px] text-surface-400 w-12 text-right">{r.credit ? 'Credit' : r.points <= 7 ? 'Pass' : 'Fail'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admission eligibility */}
          <div className="rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
            <div className="bg-surface-100 dark:bg-surface-800 px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-surface-400">Admission Eligibility</p>
            </div>
            <div className="divide-y divide-surface-100 dark:divide-surface-800">
              {result.eligibility.map((e, i) => (
                <div key={i} className="px-3 py-2.5 bg-surface-50 dark:bg-surface-900">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{e.emoji}</span>
                      <span className="text-xs font-bold text-surface-700 dark:text-surface-300">{e.label}</span>
                    </div>
                    <span className={`text-sm font-bold ${e.met ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                      {e.met ? '✓ Eligible' : '✗ Not met'}
                    </span>
                  </div>
                  {!e.met && e.missing.length > 0 && (
                    <p className="text-[10px] text-red-400 mt-1 ml-7">
                      Missing credit in: {e.missing.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-surface-400 text-center leading-relaxed">
            Based on WAEC 9-point grading system. Requirements may vary by university. Verify with your chosen institution's admissions office.
          </p>
        </div>
      )}
    </div>
  );
}
