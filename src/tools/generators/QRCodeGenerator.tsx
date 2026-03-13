import { useState, useCallback, useRef, useEffect } from 'react';
import { Select } from '../../components/ui/FormControls';
import { DownloadButton } from '../../components/ui/FileComponents';

export default function QRCodeGenerator() {
  const [text, setText] = useState('https://neetab.com');
  const [downloadSize, setDownloadSize] = useState('512');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [blob, setBlob] = useState<Blob | null>(null);
  const [imgUrl, setImgUrl] = useState('');
  const prevUrlRef = useRef('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = useCallback(async () => {
    if (!text.trim()) return;
    try {
      const QRCode = await import('qrcode');
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Preview always at 256px for fast, consistent display
      await QRCode.toCanvas(canvas, text, {
        width: 256,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: 'M',
      });
      setImgUrl('canvas');

      // Download blob at selected size (separate off-screen canvas)
      const dlCanvas = document.createElement('canvas');
      await QRCode.toCanvas(dlCanvas, text, {
        width: parseInt(downloadSize),
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: 'M',
      });
      dlCanvas.toBlob(b => {
        if (b) {
          if (prevUrlRef.current && prevUrlRef.current !== 'canvas') URL.revokeObjectURL(prevUrlRef.current);
          prevUrlRef.current = 'canvas';
          setBlob(b);
        }
      }, 'image/png');
    } catch {
      // Fallback: render via external API
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=${downloadSize}x${downloadSize}&data=${encodeURIComponent(text)}&color=${fgColor.slice(1)}&bgcolor=${bgColor.slice(1)}`;
      setImgUrl(url);
      try {
        const res = await fetch(url);
        const b = await res.blob();
        setBlob(b);
      } catch { /* offline */ }
    }
  }, [text, downloadSize, fgColor, bgColor]);

  useEffect(() => { generate(); }, [generate]);

  return (
    <div>
      <div className="mb-3">
        <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-1.5">Text or URL</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter text, URL, email, phone number, WiFi config..."
          className="input-field min-h-[64px] resize-none"
          maxLength={500}
        />
        <div className="text-right text-[10px] text-surface-400 mt-0.5">{text.length}/500</div>
      </div>

      {/* QR Preview - always 256px canvas, displayed at 180px */}
      <div className="flex justify-center mb-4">
        <div className="rounded-2xl border border-surface-200 dark:border-surface-700 p-3 inline-block" style={{ background: bgColor }}>
          <canvas ref={canvasRef} style={{ width: 180, height: 180, imageRendering: 'pixelated', display: imgUrl === 'canvas' ? 'block' : 'none' }} />
          {imgUrl && imgUrl !== 'canvas' && (
            <img src={imgUrl} alt="QR Code" style={{ width: 180, height: 180 }} />
          )}
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <Select label="Download Size" value={downloadSize} onChange={setDownloadSize} options={[
          { value: '256', label: '256px' }, { value: '512', label: '512px' },
          { value: '1024', label: '1024px' }, { value: '2048', label: '2048px' },
        ]} />
        <div>
          <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-1.5">Color</label>
          <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="w-full h-[42px] rounded-lg cursor-pointer" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-1.5">Background</label>
          <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full h-[42px] rounded-lg cursor-pointer" />
        </div>
      </div>

      {blob && <DownloadButton blob={blob} filename="qr-code.png" label="Download QR Code" />}
    </div>
  );
}
