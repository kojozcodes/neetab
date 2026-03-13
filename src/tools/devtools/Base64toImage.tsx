import { useState, useRef } from 'react';

const textareaClass = "w-full px-3 py-2 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/40 font-mono";

interface ImageInfo {
  dataUrl: string;
  format: string;
  width: number;
  height: number;
}

function extractDataUrl(input: string): { dataUrl: string; format: string } | null {
  const trimmed = input.trim();
  if (trimmed.startsWith('data:image/')) {
    const mimeMatch = trimmed.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,/);
    if (!mimeMatch) return null;
    const format = mimeMatch[1].split('/')[1].toUpperCase();
    return { dataUrl: trimmed, format };
  }
  // Treat as raw base64 - try common image formats by checking magic bytes
  try {
    const binary = atob(trimmed.replace(/\s/g, ''));
    const bytes = new Uint8Array(binary.length > 8 ? 8 : binary.length);
    for (let i = 0; i < bytes.length; i++) bytes[i] = binary.charCodeAt(i);

    let mime = 'image/png';
    let format = 'PNG';
    if (bytes[0] === 0xff && bytes[1] === 0xd8) { mime = 'image/jpeg'; format = 'JPEG'; }
    else if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) { mime = 'image/gif'; format = 'GIF'; }
    else if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) { mime = 'image/webp'; format = 'WEBP'; }
    else if (bytes[0] === 0x42 && bytes[1] === 0x4d) { mime = 'image/bmp'; format = 'BMP'; }

    return { dataUrl: `data:${mime};base64,${trimmed.replace(/\s/g, '')}`, format };
  } catch {
    return null;
  }
}

export default function Base64toImage() {
  const [input, setInput] = useState('');
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [error, setError] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);

  const process = () => {
    setError('');
    setImageInfo(null);
    if (!input.trim()) return;

    const extracted = extractDataUrl(input);
    if (!extracted) {
      setError('Invalid Base64 or data URL. Make sure you paste a valid Base64-encoded image.');
      return;
    }

    const img = new Image();
    img.onload = () => {
      setImageInfo({
        dataUrl: extracted.dataUrl,
        format: extracted.format,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.onerror = () => {
      setError('Could not decode image. The Base64 data may be corrupted or not an image.');
    };
    img.src = extracted.dataUrl;
  };

  const download = () => {
    if (!imageInfo) return;
    const a = document.createElement('a');
    a.href = imageInfo.dataUrl;
    const ext = imageInfo.format.toLowerCase();
    a.download = `image.${ext === 'jpeg' ? 'jpg' : ext}`;
    a.click();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-surface-600 dark:text-surface-400 mb-1.5">
          Base64 Input
        </label>
        <textarea
          className={textareaClass + " h-28"}
          placeholder="Paste Base64 string or data URL (data:image/png;base64,...) here..."
          value={input}
          onChange={e => setInput(e.target.value)}
          spellCheck={false}
        />
      </div>

      <button
        onClick={process}
        className="w-full py-2 text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors"
      >
        Decode Image
      </button>

      {error && (
        <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{error}</p>
      )}

      {imageInfo && (
        <div className="space-y-3">
          <div className="flex gap-4 text-xs">
            <div className="flex-1 bg-surface-100 dark:bg-surface-800 rounded-lg px-3 py-2 text-center">
              <div className="text-surface-500 mb-0.5">Format</div>
              <div className="font-bold text-surface-800 dark:text-surface-200">{imageInfo.format}</div>
            </div>
            <div className="flex-1 bg-surface-100 dark:bg-surface-800 rounded-lg px-3 py-2 text-center">
              <div className="text-surface-500 mb-0.5">Dimensions</div>
              <div className="font-bold text-surface-800 dark:text-surface-200">{imageInfo.width} x {imageInfo.height}px</div>
            </div>
            <div className="flex-1 bg-surface-100 dark:bg-surface-800 rounded-lg px-3 py-2 text-center">
              <div className="text-surface-500 mb-0.5">Approx Size</div>
              <div className="font-bold text-surface-800 dark:text-surface-200">
                {Math.round(imageInfo.dataUrl.length * 0.75 / 1024)} KB
              </div>
            </div>
          </div>

          <div className="border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden bg-surface-100 dark:bg-surface-800 flex items-center justify-center min-h-[160px] p-3">
            <img
              ref={imgRef}
              src={imageInfo.dataUrl}
              alt="Decoded preview"
              className="max-w-full max-h-64 object-contain rounded"
              style={{ imageRendering: 'auto' }}
            />
          </div>

          <button
            onClick={download}
            className="w-full py-2 text-xs font-bold border border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-white rounded-lg transition-colors"
          >
            Download Image
          </button>
        </div>
      )}

      {!imageInfo && !error && (
        <p className="text-xs text-surface-400 text-center py-2">Paste a Base64 string above to preview the image</p>
      )}
    </div>
  );
}
