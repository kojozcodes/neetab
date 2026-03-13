import { useState, useEffect, useRef, useCallback } from 'react';
import JsBarcode from 'jsbarcode';
import { PrivacyBadge } from '../../components/ui/FileComponents';
import { Button, Select, Toggle } from '../../components/ui/FormControls';

interface BarcodeFormat {
  value: string;
  label: string;
  hint: string;
  validate: (text: string) => string | null;
}

const FORMATS: BarcodeFormat[] = [
  {
    value: 'CODE128',
    label: 'Code 128',
    hint: 'Alphanumeric - most versatile',
    validate: (t) => (t.trim().length === 0 ? 'Enter some text to encode.' : null),
  },
  {
    value: 'CODE39',
    label: 'Code 39',
    hint: 'Uppercase letters and numbers only',
    validate: (t) => {
      if (!t.trim()) return 'Enter some text to encode.';
      if (/[a-z]/.test(t)) return 'Code 39 does not support lowercase letters.';
      if (/[^A-Z0-9 \-\.\/\+\%\$]/.test(t)) return 'Code 39 supports: A-Z, 0-9, space, - . / + % $';
      return null;
    },
  },
  {
    value: 'EAN13',
    label: 'EAN-13',
    hint: '12 digits (check digit auto-added)',
    validate: (t) => {
      if (!/^\d+$/.test(t)) return 'EAN-13 requires digits only.';
      if (t.length !== 12 && t.length !== 13) return 'EAN-13 requires exactly 12 digits (13 with check digit).';
      return null;
    },
  },
  {
    value: 'EAN8',
    label: 'EAN-8',
    hint: '7 digits (check digit auto-added)',
    validate: (t) => {
      if (!/^\d+$/.test(t)) return 'EAN-8 requires digits only.';
      if (t.length !== 7 && t.length !== 8) return 'EAN-8 requires exactly 7 digits (8 with check digit).';
      return null;
    },
  },
  {
    value: 'UPC',
    label: 'UPC-A',
    hint: '11 digits (check digit auto-added)',
    validate: (t) => {
      if (!/^\d+$/.test(t)) return 'UPC-A requires digits only.';
      if (t.length !== 11 && t.length !== 12) return 'UPC-A requires exactly 11 digits (12 with check digit).';
      return null;
    },
  },
  {
    value: 'ITF14',
    label: 'ITF-14',
    hint: '13 digits (check digit auto-added)',
    validate: (t) => {
      if (!/^\d+$/.test(t)) return 'ITF-14 requires digits only.';
      if (t.length !== 13 && t.length !== 14) return 'ITF-14 requires exactly 13 digits (14 with check digit).';
      return null;
    },
  },
  {
    value: 'MSI',
    label: 'MSI',
    hint: 'Numbers only',
    validate: (t) => {
      if (!t.trim()) return 'Enter a number to encode.';
      if (!/^\d+$/.test(t)) return 'MSI supports digits only.';
      return null;
    },
  },
];

const FORMAT_OPTIONS = FORMATS.map(f => ({ value: f.value, label: f.label }));

const LINE_COLOR_OPTIONS = [
  { value: '#1a1a1a', label: 'Dark (default)' },
  { value: '#ff6b35', label: 'Brand orange' },
  { value: '#2563eb', label: 'Blue' },
  { value: '#16a34a', label: 'Green' },
];

export default function BarcodeGenerator() {
  const [text, setText] = useState('123456789012');
  const [format, setFormat] = useState('CODE128');
  const [showText, setShowText] = useState(true);
  const [lineColor, setLineColor] = useState('#1a1a1a');
  const [error, setError] = useState('');
  const svgRef = useRef<SVGSVGElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentFormat = FORMATS.find(f => f.value === format) ?? FORMATS[0];

  const generateBarcode = useCallback(() => {
    if (!svgRef.current) return;

    const validationError = currentFormat.validate(text);
    if (validationError) {
      setError(validationError);
      // Clear SVG content on error
      while (svgRef.current.firstChild) {
        svgRef.current.removeChild(svgRef.current.firstChild);
      }
      svgRef.current.removeAttribute('width');
      svgRef.current.removeAttribute('height');
      return;
    }

    try {
      JsBarcode(svgRef.current, text, {
        format: format,
        displayValue: showText,
        fontSize: 13,
        margin: 12,
        lineColor: lineColor,
        background: '#ffffff',
        width: 2,
        height: 80,
      });
      setError('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || 'Invalid input for this barcode format.');
    }
  }, [text, format, showText, lineColor, currentFormat]);

  // Debounced regeneration on input changes
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      generateBarcode();
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [generateBarcode]);

  const downloadPNG = () => {
    if (!svgRef.current || error) return;

    const svg = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(blob => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `barcode-${format.toLowerCase()}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    };

    // btoa may fail on non-latin chars, use encodeURIComponent as fallback
    try {
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } catch {
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
    }
  };

  const hasSvgContent = !error && text.trim().length > 0;

  return (
    <div>
      <PrivacyBadge />

      {/* Input */}
      <div className="mb-3">
        <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-1.5">
          Barcode Content
        </label>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter text or number..."
          className="input-field"
          maxLength={200}
        />
        {currentFormat.hint && (
          <p className="text-[11px] text-surface-400 mt-1">{currentFormat.hint}</p>
        )}
      </div>

      {/* Format + line color */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <Select
          label="Format"
          value={format}
          onChange={(v) => {
            setFormat(v);
            setError('');
          }}
          options={FORMAT_OPTIONS}
        />
        <Select
          label="Color"
          value={lineColor}
          onChange={setLineColor}
          options={LINE_COLOR_OPTIONS}
        />
      </div>

      {/* Show text toggle */}
      <div className="mb-4">
        <Toggle label="Show text below barcode" checked={showText} onChange={setShowText} />
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-3 px-3 py-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-xs text-red-500">
          {error}
        </div>
      )}

      {/* SVG Preview */}
      <div
        className={`rounded-xl border border-surface-200 dark:border-surface-700 bg-white flex items-center justify-center mb-4 overflow-hidden transition-opacity ${
          hasSvgContent ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ minHeight: 130 }}
      >
        <svg ref={svgRef} className="max-w-full" />
      </div>

      {/* Placeholder when no valid barcode */}
      {!hasSvgContent && !error && (
        <div
          className="rounded-xl border border-dashed border-surface-300 dark:border-surface-700 bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4"
          style={{ minHeight: 130 }}
        >
          <p className="text-xs text-surface-400">Barcode preview will appear here</p>
        </div>
      )}

      {/* Download button */}
      <Button
        onClick={downloadPNG}
        disabled={!hasSvgContent}
        className="w-full"
      >
        Download PNG
      </Button>
    </div>
  );
}
