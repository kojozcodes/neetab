import { useState } from 'react';

const textareaClass = "w-full px-3 py-2 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/40 font-mono";

type Operation =
  | 'dedupe'
  | 'sort-az'
  | 'sort-za'
  | 'reverse-text'
  | 'reverse-lines'
  | 'trim'
  | 'remove-empty'
  | 'remove-extra-spaces';

const OPERATIONS: { id: Operation; label: string }[] = [
  { id: 'dedupe', label: 'Remove Duplicate Lines' },
  { id: 'sort-az', label: 'Sort Lines A-Z' },
  { id: 'sort-za', label: 'Sort Lines Z-A' },
  { id: 'reverse-text', label: 'Reverse Text' },
  { id: 'reverse-lines', label: 'Reverse Line Order' },
  { id: 'trim', label: 'Trim Whitespace' },
  { id: 'remove-empty', label: 'Remove Empty Lines' },
  { id: 'remove-extra-spaces', label: 'Remove Extra Spaces' },
];

function applyOperation(text: string, op: Operation, caseInsensitive: boolean): string {
  const lines = text.split('\n');
  switch (op) {
    case 'dedupe': {
      const seen = new Set<string>();
      return lines.filter(line => {
        const key = caseInsensitive ? line.toLowerCase() : line;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      }).join('\n');
    }
    case 'sort-az':
      return [...lines].sort((a, b) =>
        caseInsensitive ? a.toLowerCase().localeCompare(b.toLowerCase()) : a.localeCompare(b)
      ).join('\n');
    case 'sort-za':
      return [...lines].sort((a, b) =>
        caseInsensitive ? b.toLowerCase().localeCompare(a.toLowerCase()) : b.localeCompare(a)
      ).join('\n');
    case 'reverse-text':
      return text.split('').reverse().join('');
    case 'reverse-lines':
      return [...lines].reverse().join('\n');
    case 'trim':
      return lines.map(l => l.trim()).join('\n');
    case 'remove-empty':
      return lines.filter(l => l.trim() !== '').join('\n');
    case 'remove-extra-spaces':
      return lines.map(l => l.replace(/\s+/g, ' ').trim()).join('\n');
    default:
      return text;
  }
}

export default function TextUtilities() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [selectedOp, setSelectedOp] = useState<Operation>('dedupe');
  const [caseInsensitive, setCaseInsensitive] = useState(true);
  const [copied, setCopied] = useState(false);

  const apply = () => {
    if (!input.trim()) return;
    setOutput(applyOperation(input, selectedOp, caseInsensitive));
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const showCaseOption = selectedOp === 'dedupe' || selectedOp === 'sort-az' || selectedOp === 'sort-za';

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">Input Text</label>
        <textarea
          className={textareaClass + " h-36"}
          placeholder="Paste or type your text here..."
          value={input}
          onChange={e => setInput(e.target.value)}
          spellCheck={false}
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">Operation</label>
        <div className="grid grid-cols-2 gap-1.5">
          {OPERATIONS.map(op => (
            <button
              key={op.id}
              onClick={() => setSelectedOp(op.id)}
              className={`py-1.5 px-2 text-xs rounded-lg text-left transition-colors ${
                selectedOp === op.id
                  ? 'bg-brand-500 text-white font-semibold'
                  : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>

      {showCaseOption && (
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <div
            onClick={() => setCaseInsensitive(v => !v)}
            className={`relative inline-flex w-8 h-4 rounded-full transition-colors ${caseInsensitive ? 'bg-brand-500' : 'bg-surface-300 dark:bg-surface-600'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${caseInsensitive ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
          <span className="text-xs text-surface-600 dark:text-surface-400">Case-insensitive</span>
        </label>
      )}

      <button
        onClick={apply}
        className="w-full py-2 text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors"
      >
        Apply
      </button>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-surface-600 dark:text-surface-400">Output</label>
            <button
              onClick={copy}
              className="text-xs text-surface-500 hover:text-brand-500 transition-colors"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            readOnly
            className={textareaClass + " h-36"}
            value={output}
            spellCheck={false}
          />
        </div>
      )}
    </div>
  );
}
