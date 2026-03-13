import { useState } from 'react';
import Input from '../../components/ui/Input';
import ResultBox from '../../components/ui/ResultBox';

export default function AgeCalculator() {
  const [dob, setDob] = useState('1995-06-15');

  let years = 0, months = 0, days = 0, totalDays = 0, nextBday = '-';

  if (dob) {
    const b = new Date(dob), n = new Date();
    let y = n.getFullYear() - b.getFullYear(), m = n.getMonth() - b.getMonth(), d = n.getDate() - b.getDate();
    if (d < 0) { m--; d += new Date(n.getFullYear(), n.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    years = y; months = m; days = d;
    totalDays = Math.floor((n.getTime() - b.getTime()) / 86400000);
    const nx = new Date(n.getFullYear(), b.getMonth(), b.getDate());
    if (nx <= n) nx.setFullYear(nx.getFullYear() + 1);
    nextBday = `${Math.ceil((nx.getTime() - n.getTime()) / 86400000)} days`;
  }

  return (
    <div>
      <Input label="Date of Birth" value={dob} onChange={setDob} type="date" />
      <ResultBox label="Age" value={`${years}y ${months}m ${days}d`} />
      <ResultBox label="Days Lived" value={totalDays.toLocaleString()} />
      <ResultBox label="Next Birthday" value={nextBday} />
    </div>
  );
}
