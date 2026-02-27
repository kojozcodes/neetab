import { useState } from 'react';

// Simple markdown parser — no dependencies
function parseMarkdown(md: string): string {
  let html = md
    // Code blocks (must come before inline code)
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-surface-200 dark:bg-surface-900 rounded-lg p-3 overflow-x-auto text-xs font-mono my-2"><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-surface-200 dark:bg-surface-900 rounded px-1 py-0.5 text-xs font-mono">$1</code>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold mt-3 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold mt-4 mb-1">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold mt-4 mb-2">$1</h1>')
    // Bold & italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    // Links & images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg my-2" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-brand-500 underline" target="_blank" rel="noopener">$1</a>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-3 border-brand-300 pl-3 italic text-surface-500 my-2">$1</blockquote>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr class="border-surface-300 dark:border-surface-700 my-3" />')
    // Unordered lists
    .replace(/^[*-] (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    // Line breaks → paragraphs
    .replace(/\n\n/g, '</p><p class="my-1.5">')
    .replace(/\n/g, '<br />');

  return `<p class="my-1.5">${html}</p>`;
}

const SAMPLE = `# Hello World

This is a **Markdown** preview tool. Type on the left, see the result on the right.

## Features

- **Bold** and *italic* text
- ~~Strikethrough~~ text
- [Links](https://neetab.com)
- Inline \`code\` blocks

### Code Block

\`\`\`js
const greeting = "Hello!";
console.log(greeting);
\`\`\`

> This is a blockquote. It looks great.

---

1. First item
2. Second item
3. Third item
`;

export default function MarkdownPreview() {
  const [input, setInput] = useState(SAMPLE);
  const [view, setView] = useState<'split' | 'preview'>('split');

  return (
    <div>
      <div className="flex gap-1.5 mb-3">
        {(['split', 'preview'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              view === v
                ? 'bg-brand-500 text-white'
                : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'
            }`}
          >
            {v === 'split' ? '⬅ Split' : '👁 Preview'}
          </button>
        ))}
      </div>

      <div className={view === 'split' ? 'grid grid-cols-2 gap-2' : ''}>
        {view === 'split' && (
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            className="input-field min-h-[250px] resize-y font-mono text-xs"
            placeholder="Type Markdown here..."
          />
        )}
        <div
          className="bg-surface-100 dark:bg-surface-800 rounded-xl p-3 min-h-[250px] overflow-y-auto text-xs text-surface-800 dark:text-surface-200 leading-relaxed prose-sm"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(input) }}
        />
      </div>

      {view === 'preview' && (
        <button
          onClick={() => setView('split')}
          className="mt-3 text-xs text-brand-500 font-semibold hover:text-brand-600"
        >
          ← Back to editor
        </button>
      )}
    </div>
  );
}
