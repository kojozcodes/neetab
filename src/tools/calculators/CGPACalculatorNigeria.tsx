import { useState, useMemo } from 'react';

type Scale = '5.0' | '4.0';

interface Course {
  name: string;
  credits: number;
  grade: string;
}

interface Semester {
  id: number;
  label: string;
  courses: Course[];
}

const GRADES_5: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
const GRADES_4: Record<string, number> = { A: 4, B: 3, C: 2, D: 1, E: 0, F: 0 };

const CLASS_5 = [
  { min: 4.50, max: 5.00, label: 'First Class', color: 'text-green-600 dark:text-green-400' },
  { min: 3.50, max: 4.49, label: 'Second Class Upper (2:1)', color: 'text-blue-600 dark:text-blue-400' },
  { min: 2.40, max: 3.49, label: 'Second Class Lower (2:2)', color: 'text-amber-600 dark:text-amber-400' },
  { min: 1.50, max: 2.39, label: 'Third Class', color: 'text-orange-600 dark:text-orange-400' },
  { min: 1.00, max: 1.49, label: 'Pass', color: 'text-surface-500' },
];

const CLASS_4 = [
  { min: 3.50, max: 4.00, label: 'First Class', color: 'text-green-600 dark:text-green-400' },
  { min: 3.00, max: 3.49, label: 'Second Class Upper (2:1)', color: 'text-blue-600 dark:text-blue-400' },
  { min: 2.00, max: 2.99, label: 'Second Class Lower (2:2)', color: 'text-amber-600 dark:text-amber-400' },
  { min: 1.00, max: 1.99, label: 'Third Class', color: 'text-orange-600 dark:text-orange-400' },
];

function getClassification(cgpa: number, scale: Scale) {
  const classes = scale === '5.0' ? CLASS_5 : CLASS_4;
  for (const c of classes) {
    if (cgpa >= c.min && cgpa <= c.max) return c;
  }
  return { label: 'Below Pass', color: 'text-red-500' };
}

function makeCourse(): Course {
  return { name: '', credits: 3, grade: 'A' };
}

function makeSemester(id: number): Semester {
  return { id, label: `Semester ${id}`, courses: [makeCourse(), makeCourse(), makeCourse()] };
}

const labelClass = 'block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1';
const inputClass = 'w-full px-2.5 py-2 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40';
const toggleBase = 'flex-1 py-2 text-xs font-semibold rounded-md transition-colors text-center';
const toggleOn = 'bg-brand-500 text-white';
const toggleOff = 'text-surface-500 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700';

export default function CGPACalculatorNigeria() {
  const [scale, setScale] = useState<Scale>('5.0');
  const [semesters, setSemesters] = useState<Semester[]>([makeSemester(1)]);

  const grades = scale === '5.0' ? GRADES_5 : GRADES_4;
  const gradeLetters = Object.keys(grades);

  const updateCourse = (semIdx: number, courseIdx: number, field: keyof Course, value: string | number) => {
    setSemesters(prev => prev.map((s, si) =>
      si === semIdx ? { ...s, courses: s.courses.map((c, ci) => ci === courseIdx ? { ...c, [field]: value } : c) } : s
    ));
  };

  const addCourse = (semIdx: number) => {
    setSemesters(prev => prev.map((s, si) =>
      si === semIdx ? { ...s, courses: [...s.courses, makeCourse()] } : s
    ));
  };

  const removeCourse = (semIdx: number, courseIdx: number) => {
    setSemesters(prev => prev.map((s, si) =>
      si === semIdx ? { ...s, courses: s.courses.filter((_, ci) => ci !== courseIdx) } : s
    ));
  };

  const addSemester = () => {
    setSemesters(prev => [...prev, makeSemester(prev.length + 1)]);
  };

  const removeSemester = (semIdx: number) => {
    setSemesters(prev => {
      const updated = prev.filter((_, i) => i !== semIdx);
      return updated.map((s, i) => ({ ...s, id: i + 1, label: `Semester ${i + 1}` }));
    });
  };

  const result = useMemo(() => {
    let totalCredits = 0;
    let totalQP = 0;

    const semResults = semesters.map(sem => {
      let semCredits = 0;
      let semQP = 0;
      for (const c of sem.courses) {
        const points = grades[c.grade] ?? 0;
        semCredits += c.credits;
        semQP += c.credits * points;
      }
      totalCredits += semCredits;
      totalQP += semQP;
      const gpa = semCredits > 0 ? semQP / semCredits : 0;
      return { semCredits, semQP, gpa };
    });

    const cgpa = totalCredits > 0 ? totalQP / totalCredits : 0;
    const classification = getClassification(cgpa, scale);
    const usGPA = scale === '5.0' ? cgpa * 0.8 : cgpa;

    return { semResults, totalCredits, totalQP, cgpa, classification, usGPA };
  }, [semesters, scale, grades]);

  return (
    <div className="space-y-4">
      {/* Scale toggle */}
      <div>
        <label className={labelClass}>Grading Scale</label>
        <div className="flex gap-1 p-1 rounded-lg bg-surface-100 dark:bg-surface-800">
          {(['5.0', '4.0'] as Scale[]).map(s => (
            <button key={s} onClick={() => setScale(s)} className={`${toggleBase} ${scale === s ? toggleOn : toggleOff}`}>
              {s} Scale
            </button>
          ))}
        </div>
        <p className="text-[10px] text-surface-400 mt-1">
          {scale === '5.0' ? 'Used by most Nigerian universities (UNILAG, UI, OAU, etc.)' : 'Used by some universities per NUC 2017 directive'}
        </p>
      </div>

      {/* Summary card */}
      {result.totalCredits > 0 && (
        <div className="rounded-xl border-2 border-brand-500 bg-brand-50 dark:bg-brand-950/20 p-4">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="text-center">
              <p className="text-3xl font-bold text-brand-500 tabular-nums">{result.cgpa.toFixed(2)}</p>
              <p className="text-xs text-surface-500 mt-0.5">Cumulative GPA / {scale}</p>
            </div>
            <div className="text-center">
              <p className={`text-lg font-bold ${result.classification.color}`}>{result.classification.label}</p>
              <p className="text-xs text-surface-500 mt-0.5">Degree Classification</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-brand-200 dark:border-brand-800">
            <div className="text-center">
              <p className="text-sm font-bold text-surface-800 dark:text-surface-200 tabular-nums">{result.totalCredits}</p>
              <p className="text-[10px] text-surface-400">Total Credits</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-surface-800 dark:text-surface-200 tabular-nums">{result.totalQP}</p>
              <p className="text-[10px] text-surface-400">Quality Points</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-surface-800 dark:text-surface-200 tabular-nums">{result.usGPA.toFixed(2)}</p>
              <p className="text-[10px] text-surface-400">US 4.0 GPA</p>
            </div>
          </div>
        </div>
      )}

      {/* Semesters */}
      {semesters.map((sem, semIdx) => {
        const sr = result.semResults[semIdx];
        return (
          <div key={sem.id} className="rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
            {/* Semester header */}
            <div className="flex items-center justify-between bg-surface-100 dark:bg-surface-800 px-3 py-2">
              <div className="flex items-center gap-3">
                <p className="text-xs font-bold text-surface-600 dark:text-surface-300">{sem.label}</p>
                {sr && sr.semCredits > 0 && (
                  <span className="text-[10px] font-semibold text-brand-500 bg-brand-50 dark:bg-brand-950/30 px-2 py-0.5 rounded-full tabular-nums">
                    GPA: {sr.gpa.toFixed(2)}
                  </span>
                )}
              </div>
              {semesters.length > 1 && (
                <button onClick={() => removeSemester(semIdx)} className="text-[10px] text-red-400 hover:text-red-500 font-semibold transition-colors">
                  Remove
                </button>
              )}
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-[1fr_70px_70px_32px] gap-2 px-3 pt-2 pb-1">
              <span className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">Course (optional)</span>
              <span className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">Credits</span>
              <span className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">Grade</span>
              <span />
            </div>

            {/* Courses */}
            <div className="px-3 pb-2 space-y-1.5">
              {sem.courses.map((course, ci) => (
                <div key={ci} className="grid grid-cols-[1fr_70px_70px_32px] gap-2 items-center">
                  <input
                    type="text"
                    value={course.name}
                    onChange={e => updateCourse(semIdx, ci, 'name', e.target.value)}
                    placeholder={`Course ${ci + 1}`}
                    className={inputClass}
                  />
                  <select
                    value={course.credits}
                    onChange={e => updateCourse(semIdx, ci, 'credits', Number(e.target.value))}
                    className={`${inputClass} cursor-pointer`}
                  >
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <select
                    value={course.grade}
                    onChange={e => updateCourse(semIdx, ci, 'grade', e.target.value)}
                    className={`${inputClass} cursor-pointer`}
                  >
                    {gradeLetters.map(g => (
                      <option key={g} value={g}>{g} ({grades[g]})</option>
                    ))}
                  </select>
                  {sem.courses.length > 1 ? (
                    <button onClick={() => removeCourse(semIdx, ci)} className="w-7 h-7 flex items-center justify-center rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-sm">
                      ×
                    </button>
                  ) : <span />}
                </div>
              ))}
            </div>

            {/* Add course */}
            <div className="px-3 pb-3">
              <button
                onClick={() => addCourse(semIdx)}
                className="w-full py-1.5 text-[11px] font-semibold text-brand-500 hover:text-brand-600 border border-dashed border-surface-300 dark:border-surface-600 hover:border-brand-400 rounded-lg transition-colors"
              >
                + Add Course
              </button>
            </div>

            {/* Semester summary */}
            {sr && sr.semCredits > 0 && (
              <div className="grid grid-cols-3 divide-x divide-surface-100 dark:divide-surface-800 border-t border-surface-100 dark:border-surface-800">
                <div className="py-2 text-center bg-surface-50 dark:bg-surface-900">
                  <p className="text-xs font-bold text-surface-700 dark:text-surface-300 tabular-nums">{sr.semCredits}</p>
                  <p className="text-[10px] text-surface-400">Credits</p>
                </div>
                <div className="py-2 text-center bg-surface-50 dark:bg-surface-900">
                  <p className="text-xs font-bold text-surface-700 dark:text-surface-300 tabular-nums">{sr.semQP}</p>
                  <p className="text-[10px] text-surface-400">Quality Pts</p>
                </div>
                <div className="py-2 text-center bg-surface-50 dark:bg-surface-900">
                  <p className="text-xs font-bold text-brand-500 tabular-nums">{sr.gpa.toFixed(2)}</p>
                  <p className="text-[10px] text-surface-400">GPA</p>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Add semester */}
      <button
        onClick={addSemester}
        className="w-full py-2.5 text-xs font-bold text-brand-500 hover:text-brand-600 border-2 border-dashed border-surface-300 dark:border-surface-600 hover:border-brand-400 rounded-xl transition-colors"
      >
        + Add Semester
      </button>

      {/* Conversion note */}
      {result.totalCredits > 0 && scale === '5.0' && (
        <p className="text-[10px] text-surface-400 text-center leading-relaxed">
          US 4.0 GPA is an approximation (CGPA × 0.8). Universities may use their own conversion formulas — confirm with your institution or credential evaluator (e.g. WES).
        </p>
      )}

      <p className="text-[10px] text-surface-400 text-center leading-relaxed">
        Based on NUC grading standards. Grade point values follow the standard used by UNILAG, UI, OAU, and most Nigerian universities. Verify with your institution's handbook.
      </p>
    </div>
  );
}
