import { useState } from 'react';
import ResultBox from '../../components/ui/ResultBox';

export default function WordCounter() {
  const [text, setText] = useState('');
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div>
      <div className="mb-3.5">
        <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-1.5">Your Text</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste or type your text here..."
          className="input-field min-h-[140px] resize-y leading-relaxed"
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <ResultBox label="Words" value={words} copyable={false} large={false} />
        <ResultBox label="Characters" value={text.length} copyable={false} large={false} />
        <ResultBox label="No Spaces" value={text.replace(/\s/g, '').length} copyable={false} large={false} />
        <ResultBox label="Sentences" value={text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0} copyable={false} large={false} />
        <ResultBox label="Paragraphs" value={text.trim() ? text.split(/\n\n+/).filter(Boolean).length : 0} copyable={false} large={false} />
        <ResultBox label="Read Time" value={words ? `~${Math.max(1, Math.ceil(words / 200))}m` : '0m'} copyable={false} large={false} />
      </div>
    </div>
  );
}
