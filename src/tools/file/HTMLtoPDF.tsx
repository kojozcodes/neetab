import { useState, useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Select } from '../../components/ui/FormControls';

type PageSize = 'a4' | 'letter';

const PAGE_SIZES: Record<PageSize, { w: number; h: number; label: string }> = {
  a4: { w: 210, h: 297, label: 'A4 (210x297mm)' },
  letter: { w: 216, h: 279, label: 'Letter (8.5x11in)' },
};

const SAMPLE_HTML = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; padding: 32px; color: #111; }
    h1 { color: #ff6b35; }
    p { line-height: 1.6; }
    ul { margin: 12px 0; }
  </style>
</head>
<body>
  <h1>Hello from Neetab</h1>
  <p>This is a sample HTML document that will be converted to PDF.</p>
  <ul>
    <li>Paste your own HTML below</li>
    <li>Preview it in the iframe</li>
    <li>Click Convert to PDF</li>
  </ul>
  <p>Supports any valid HTML including inline styles and images.</p>
</body>
</html>`;

export default function HTMLtoPDF() {
  const [html, setHtml] = useState(SAMPLE_HTML);
  const [pageSize, setPageSize] = useState<PageSize>('a4');
  const [previewHtml, setPreviewHtml] = useState(SAMPLE_HTML);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const updatePreview = useCallback(() => {
    setPreviewHtml(html);
    setError('');
  }, [html]);

  const convertToPDF = useCallback(async () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    setLoading(true);
    setError('');
    try {
      // Wait for iframe to be fully loaded with latest content
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) throw new Error('Cannot access iframe content.');

      // Update iframe content synchronously
      iframeDoc.open();
      iframeDoc.write(previewHtml);
      iframeDoc.close();

      // Wait for images/fonts inside iframe to load
      await new Promise(r => setTimeout(r, 600));

      const body = iframeDoc.body;
      if (!body) throw new Error('Iframe body not found.');

      const canvas = await html2canvas(body, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        width: body.scrollWidth,
        height: body.scrollHeight,
        windowWidth: body.scrollWidth,
        windowHeight: body.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const { w: pageW, h: pageH } = PAGE_SIZES[pageSize];
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: pageSize === 'a4' ? 'a4' : 'letter' });

      const pxPerMm = canvas.width / pageW;
      const contentHeightMm = canvas.height / pxPerMm;
      const pagesNeeded = Math.ceil(contentHeightMm / pageH);

      for (let i = 0; i < pagesNeeded; i++) {
        if (i > 0) pdf.addPage();
        const srcY = i * pageH * pxPerMm;
        const sliceH = Math.min(pageH * pxPerMm, canvas.height - srcY);

        // Slice the canvas for this page
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = sliceH;
        const sliceCtx = sliceCanvas.getContext('2d')!;
        sliceCtx.drawImage(canvas, 0, -srcY);
        const sliceData = sliceCanvas.toDataURL('image/jpeg', 0.95);
        const sliceHeightMm = sliceH / pxPerMm;
        pdf.addImage(sliceData, 'JPEG', 0, 0, pageW, sliceHeightMm);
      }

      pdf.save('converted.pdf');
    } catch (e) {
      setError(`Conversion failed: ${e instanceof Error ? e.message : 'Unknown error'}. Check that your HTML is valid.`);
    }
    setLoading(false);
  }, [previewHtml, pageSize]);

  return (
    <div>
      {/* HTML input */}
      <div className="mb-3">
        <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-1.5">
          HTML Code
        </label>
        <textarea
          value={html}
          onChange={e => setHtml(e.target.value)}
          spellCheck={false}
          rows={8}
          className="w-full px-3 py-2 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40 font-mono resize-y"
          placeholder="Paste your HTML here..."
        />
      </div>

      <div className="flex gap-2 mb-3">
        <div className="flex-1">
          <Select
            label="Page Size"
            value={pageSize}
            onChange={v => setPageSize(v as PageSize)}
            options={[
              { value: 'a4', label: PAGE_SIZES.a4.label },
              { value: 'letter', label: PAGE_SIZES.letter.label },
            ]}
          />
        </div>
        <div className="flex items-end pb-3.5">
          <button
            onClick={updatePreview}
            className="py-2 px-4 text-xs font-semibold rounded-lg border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:border-brand-400 hover:text-brand-500 transition-colors whitespace-nowrap"
          >
            Update Preview
          </button>
        </div>
      </div>

      {/* Iframe preview */}
      <div className="mb-3">
        <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-1.5">
          Preview
        </label>
        <div className="rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700 bg-white">
          <iframe
            ref={iframeRef}
            srcDoc={previewHtml}
            sandbox="allow-same-origin"
            className="w-full"
            style={{ height: '240px', display: 'block', border: 'none' }}
            title="HTML Preview"
          />
        </div>
        <div className="text-[11px] text-surface-500 dark:text-surface-400 mt-1 px-1">
          Preview shown in a sandboxed iframe. Click "Update Preview" after editing HTML.
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-xs mb-3 px-1">{error}</div>
      )}

      <button
        onClick={convertToPDF}
        disabled={loading || !html.trim()}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-bold text-sm text-white bg-brand-500 hover:bg-brand-600 active:bg-brand-700 disabled:opacity-40 disabled:pointer-events-none shadow-[0_2px_10px_rgba(255,107,53,0.3)] transition-all duration-150"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Converting...
          </>
        ) : (
          'Convert to PDF'
        )}
      </button>

      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-[11px] text-surface-500 dark:text-surface-400 mt-3">
        <span>🛡️</span>
        <span>
          <strong className="text-surface-600 dark:text-surface-300">Private:</strong> Conversion runs entirely in your browser
        </span>
      </div>
    </div>
  );
}
