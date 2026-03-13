import { useState, useRef } from 'react';
import { PrivacyBadge } from '../../components/ui/FileComponents';

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    if (!line.trim()) continue;
    const cells: string[] = [];
    let cur = '';
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuote) {
        if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (ch === '"') { inQuote = false; }
        else { cur += ch; }
      } else {
        if (ch === '"') { inQuote = true; }
        else if (ch === ',') { cells.push(cur); cur = ''; }
        else { cur += ch; }
      }
    }
    cells.push(cur);
    rows.push(cells);
  }
  return rows;
}

export default function CSVtoExcel() {
  const [csvText, setCsvText] = useState('');
  const [sheetName, setSheetName] = useState('Sheet1');
  const [isDrag, setIsDrag] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const rows = csvText.trim() ? parseCSV(csvText) : [];
  const rowCount = rows.length;
  const colCount = rows[0]?.length ?? 0;
  const previewRows = rows.slice(0, 10);

  const handleFileUpload = (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setFileName(file.name.replace(/\.csv$/i, ''));
    const reader = new FileReader();
    reader.onload = e => {
      setCsvText((e.target?.result as string) ?? '');
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleDownload = async () => {
    if (!rows.length) return;
    const XLSX = await import('xlsx');
    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName || 'Sheet1');
    XLSX.writeFile(wb, `${fileName || 'export'}.xlsx`);
  };

  const handleReset = () => {
    setCsvText('');
    setFileName('');
    setSheetName('Sheet1');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
      {/* Input: paste or upload */}
      <div className="mb-3">
        <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-1.5">
          Paste CSV
        </label>
        <textarea
          value={csvText}
          onChange={e => { setCsvText(e.target.value); setFileName(''); }}
          placeholder={'name,age,city\nAlice,30,London\nBob,25,Paris'}
          className="input-field min-h-[100px] resize-y font-mono text-xs"
          spellCheck={false}
        />
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 h-px bg-surface-200 dark:bg-surface-700" />
        <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider">or upload .csv</span>
        <div className="flex-1 h-px bg-surface-200 dark:bg-surface-700" />
      </div>

      <label
        onDragOver={e => { e.preventDefault(); setIsDrag(true); }}
        onDragLeave={() => setIsDrag(false)}
        onDrop={e => {
          e.preventDefault();
          setIsDrag(false);
          const files = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.csv'));
          if (files.length) handleFileUpload(files);
        }}
        className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-5 cursor-pointer transition-colors mb-3 ${
          isDrag
            ? 'border-brand-500 bg-brand-500/5'
            : 'border-surface-200 dark:border-surface-700 hover:border-brand-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={e => {
            const f = e.target.files;
            if (f?.length) handleFileUpload(Array.from(f));
          }}
        />
        <div className="text-2xl">📄</div>
        <div className="text-sm font-semibold text-surface-900 dark:text-surface-100">
          {fileName ? fileName + '.csv' : 'Drop a .csv file here or click to upload'}
        </div>
        <div className="text-[11px] text-surface-500">.csv only</div>
      </label>

      <PrivacyBadge />

      {/* Preview */}
      {rows.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-semibold text-surface-400 uppercase tracking-wider">
              Preview (first {Math.min(10, rowCount)} rows)
            </span>
            <span className="px-2 py-0.5 rounded bg-surface-100 dark:bg-surface-800 text-[10px] font-semibold text-surface-500">
              {rowCount} rows
            </span>
            <span className="px-2 py-0.5 rounded bg-surface-100 dark:bg-surface-800 text-[10px] font-semibold text-surface-500">
              {colCount} columns
            </span>
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
      )}

      {/* Options */}
      {rows.length > 0 && (
        <div className="mb-3">
          <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-1.5">
            Sheet name
          </label>
          <input
            type="text"
            value={sheetName}
            onChange={e => setSheetName(e.target.value)}
            placeholder="Sheet1"
            maxLength={31}
            className="input-field"
          />
        </div>
      )}

      {/* Download */}
      <button
        onClick={handleDownload}
        disabled={rows.length === 0}
        className="w-full py-3.5 rounded-xl font-bold text-sm bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors mb-2"
      >
        Download .xlsx
      </button>

      {rows.length > 0 && (
        <button
          onClick={handleReset}
          className="w-full py-1.5 text-[11px] font-semibold text-surface-400 hover:text-brand-500 transition-colors"
        >
          Start over
        </button>
      )}
    </div>
  );
}
