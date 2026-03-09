import { useState, useCallback } from 'react';
import { Button } from '../../components/ui/FormControls';

const WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis', 'unde',
  'omnis', 'iste', 'natus', 'error', 'voluptatem', 'accusantium', 'doloremque',
  'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo',
  'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta',
  'explicabo', 'nemo', 'ipsam', 'voluptas', 'aspernatur', 'aut', 'odit',
  'fugit', 'consequuntur', 'magni', 'dolores', 'eos', 'ratione', 'sequi',
  'nesciunt', 'neque', 'porro', 'quisquam', 'numquam', 'corporis', 'suscipit',
];

const FIRST_SENTENCE = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function generateSentence(minWords = 6, maxWords = 15): string {
  const len = minWords + Math.floor(Math.random() * (maxWords - minWords));
  const words = Array.from({ length: len }, randomWord);
  words[0] = words[0][0].toUpperCase() + words[0].slice(1);
  return words.join(' ') + '.';
}

function generateParagraph(sentences = 4): string {
  return Array.from({ length: sentences }, () => generateSentence()).join(' ');
}

function generate(type: string, count: number, startWithLorem: boolean): string {
  if (type === 'paragraphs') {
    const paras = Array.from({ length: count }, () => generateParagraph(3 + Math.floor(Math.random() * 3)));
    if (startWithLorem) paras[0] = FIRST_SENTENCE + ' ' + paras[0];
    return paras.join('\n\n');
  }
  if (type === 'sentences') {
    const sents = Array.from({ length: count }, () => generateSentence());
    if (startWithLorem) sents[0] = FIRST_SENTENCE;
    return sents.join(' ');
  }
  // words
  const words = Array.from({ length: count }, randomWord);
  if (startWithLorem && count >= 2) { words[0] = 'lorem'; words[1] = 'ipsum'; }
  return words.join(' ');
}

export default function LoremIpsumGenerator() {
  const [type, setType] = useState('paragraphs');
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(() => {
    setOutput(generate(type, count, startWithLorem));
    setCopied(false);
  }, [type, count, startWithLorem]);

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        <div>
          <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-1.5">Type</label>
          <select value={type} onChange={e => setType(e.target.value)} className="input-field cursor-pointer">
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-1.5">Count</label>
          <input
            type="number"
            value={count}
            onChange={e => setCount(Math.max(1, Math.min(100, Number(e.target.value))))}
            min={1}
            max={100}
            className="input-field"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-xs text-surface-600 dark:text-surface-400 mb-3 cursor-pointer">
        <input
          type="checkbox"
          checked={startWithLorem}
          onChange={e => setStartWithLorem(e.target.checked)}
          className="rounded border-surface-300 text-brand-500 w-3.5 h-3.5"
        />
        Start with "Lorem ipsum..."
      </label>

      <Button onClick={handleGenerate} className="w-full mb-3">
        Generate Lorem Ipsum
      </Button>

      {output && (
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-surface-400">
              {output.split(/\s+/).length} words
            </span>
            <button onClick={copy} className="text-xs font-semibold text-brand-500 hover:text-brand-600">
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <div className="bg-surface-100 dark:bg-surface-800 rounded-xl p-3 max-h-[360px] overflow-y-auto text-xs text-surface-700 dark:text-surface-300 leading-relaxed whitespace-pre-wrap">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}
