import { useState, useRef } from 'react';
import { FileUpload, PrivacyBadge } from '../../components/ui/FileComponents';

interface SheetData {
  name: string;
  rows: string[][];
}

export default function ExcelToCSV() {
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [activeSheet, setActiveSheet] = useState(0);
  const [fileName, setFileName] = useState('');
  const [isDrag, setIsDrag] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setFileName(file.name.replace(/\.[^.]+$/, ''));

    const XLSX = await import('xlsx');
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: 'array' });

    const parsed: SheetData[] = wb.SheetNames.map(name => {
      const ws = wb.Sheets[name];
      const raw: unknown[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
      return { name, rows: raw.map(r => r.map(c => String(c ?? ''))) };
    });

    setSheets(parsed);
    setActiveSheet(0);
    setCopied(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDrag(false);
    const files = Array.from(e.dataTransfer.files).filter(
      f => f.name.endsWith('.xlsx') || f.name.endsWith('.xls')
    );
    if (files.length) processFile(files);
  };

  const sheet = sheets[activeSheet];

  const toCSV = (rows: string[][]): string => {
    return rows
      .map(row =>
        row.map(cell => {
          const s = String(cell);
          if (s.includes(',') || s.includes('"') || s.includes('\n')) {
            return '"' + s.replace(/"/g, '""') + '"';
          }
          return s;
        }).join(',')
      )
      .join('\n');
  };

  const csvText = sheet ? toCSV(sheet.rows) : '';

  const handleCopy = async () => {
    if (!csvText) return;
    await navigator.clipboard.writeText(csvText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!csvText) return;
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName || 'export'}${sheets.length > 1 ? '-' + sheet.name : ''}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setSheets([]);
    setActiveSheet(0);
    setFileName('');
    setCopied(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  if (sheets.length === 0) {
    return (
      <div>
        <label
          onDragOver={e => { e.preventDefault(); setIsDrag(true); }}
          onDragLeave={() => setIsDrag(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors ${
            isDrag
              ? 'border-brand-500 bg-brand-500/5'
              : 'border-surface-200 dark:border-surface-700 hover:border-brand-400'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={e => {
              const f = e.target.files;
              if (f?.length) processFile(Array.from(f));
            }}
          />
          <div className="text-3xl">📊</div>
          <div className="text-sm font-semibold text-surface-900 dark:text-surface-100">
            Drop your Excel file here or click to upload
          </div>
          <div className="text-[11px] text-surface-500">.xlsx, .xls</div>
        </label>
        <PrivacyBadge />
      </div>
    );
  }

  const previewRows = sheet.rows.slice(0, 10);
  const colCount = sheet.rows[0]?.length ?? 0;
  const rowCount = sheet.rows.length;

  return (
    <div>
      {/* Sheet tabs */}
      {sheets.length > 1 && (
        <div className="flex gap-1 mb-3 overflow-x-auto pb-1">
          {sheets.map((s, i) => (
            <button
              key={s.name}
              onClick={() => { setActiveSheet(i); setCopied(false); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                activeSheet === i
                  ? 'bg-brand-500 text-white'
                  : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="flex gap-2 mb-3">
        <span className="px-2.5 py-1 rounded-lg bg-surface-100 dark:bg-surface-800 text-[11px] font-semibold text-surface-500 dark:text-surface-400">
          {rowCount} rows
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-surface-100 dark:bg-surface-800 text-[11px] font-semibold text-surface-500 dark:text-surface-400">
          {colCount} columns
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-surface-100 dark:bg-surface-800 text-[11px] font-semibold text-surface-500 dark:text-surface-400">
          {fileName || 'file'}{sheets.length > 1 ? ' - ' + sheet.name : ''}
        </span>
      </div>

      {/* Preview table */}
      <div className="mb-3">
        <div className="text-[10px] font-semibold text-surface-400 uppercase tracking-wider mb-1.5">
          Preview (first {Math.min(10, rowCount)} rows)
        </div>
        <div className="overflow-x-auto rounded-xl border border-surface-200 dark:border-surface-700">
          <table className="text-xs w-full">
            <thead>
              <tr className="bg-surface-100 dark:bg-surface-800">
                {(previewRows[0] ?? []).map((cell, ci) => (
                  <th
                    key={ci}
                    className="px-2.5 py-2 text-left font-semibold text-surface-600 dark:text-surface-300 whitespace-nowrap border-b border-surface-200 dark:border-surface-700"
                  >
                    {cell || <span className="text-surface-300 dark:text-surface-600">col {ci + 1}</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.slice(1).map((row, ri) => (
                <tr
                  key={ri}
                  className="border-b border-surface-100 dark:border-surface-800 last:border-0 hover:bg-surface-50 dark:hover:bg-surface-800/50"
                >
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="px-2.5 py-1.5 text-surface-700 dark:text-surface-300 whitespace-nowrap max-w-[160px] overflow-hidden text-ellipsis"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rowCount > 10 && (
          <p className="text-[10px] text-surface-400 mt-1 text-center">
            {rowCount - 10} more rows not shown in preview
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={handleCopy}
          className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
        >
          {copied ? 'Copied!' : 'Copy CSV'}
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-brand-500 hover:bg-brand-600 text-white transition-colors"
        >
          Download CSV
        </button>
      </div>

      <button
        onClick={handleReset}
        className="w-full py-1.5 text-[11px] font-semibold text-surface-400 hover:text-brand-500 transition-colors"
      >
        Convert another file
      </button>
    </div>
  );
}
