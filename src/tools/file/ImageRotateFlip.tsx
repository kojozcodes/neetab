import { useState, useRef, useCallback, useEffect } from 'react';
import { PrivacyBadge } from '../../components/ui/FileComponents';

interface Transform {
  rotation: number; // 0, 90, 180, 270
  flipH: boolean;
  flipV: boolean;
}

const INITIAL_TRANSFORM: Transform = { rotation: 0, flipH: false, flipV: false };

export default function ImageRotateFlip() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState('image');
  const [transform, setTransform] = useState<Transform>(INITIAL_TRANSFORM);
  const [isDrag, setIsDrag] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = (files: FileList | null) => {
    const f = files?.[0];
    if (!f || !f.type.startsWith('image/')) return;
    setFileName(f.name.replace(/\.[^.]+$/, ''));
    setTransform(INITIAL_TRANSFORM);
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      setImageSrc(src);
      const img = new Image();
      img.onload = () => { imgRef.current = img; };
      img.src = src;
    };
    reader.readAsDataURL(f);
  };

  const drawCanvas = useCallback(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const { rotation, flipH, flipV } = transform;
    const rad = (rotation * Math.PI) / 180;
    const isRotated90 = rotation === 90 || rotation === 270;

    const srcW = img.naturalWidth;
    const srcH = img.naturalHeight;
    const outW = isRotated90 ? srcH : srcW;
    const outH = isRotated90 ? srcW : srcH;

    canvas.width = outW;
    canvas.height = outH;

    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, outW, outH);
    ctx.save();
    ctx.translate(outW / 2, outH / 2);
    ctx.rotate(rad);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img, -srcW / 2, -srcH / 2, srcW, srcH);
    ctx.restore();
  }, [transform]);

  useEffect(() => {
    if (imageSrc) drawCanvas();
  }, [drawCanvas, imageSrc]);

  const rotateCW = () =>
    setTransform(t => ({ ...t, rotation: (t.rotation + 90) % 360 }));
  const rotateCCW = () =>
    setTransform(t => ({ ...t, rotation: (t.rotation + 270) % 360 }));
  const rotate180 = () =>
    setTransform(t => ({ ...t, rotation: (t.rotation + 180) % 360 }));
  const flipH = () =>
    setTransform(t => ({ ...t, flipH: !t.flipH }));
  const flipV = () =>
    setTransform(t => ({ ...t, flipV: !t.flipV }));

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}-edited.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const reset = () => {
    setImageSrc(null);
    setTransform(INITIAL_TRANSFORM);
    imgRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const btnClass = 'flex-1 py-2 px-1 text-xs font-semibold rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:border-brand-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors';

  return (
    <div>
      {!imageSrc && (
        <>
          <PrivacyBadge />
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setIsDrag(true); }}
            onDragLeave={() => setIsDrag(false)}
            onDrop={e => { e.preventDefault(); setIsDrag(false); loadFile(e.dataTransfer.files); }}
            className={`border-2 border-dashed rounded-2xl py-5 px-4 text-center cursor-pointer transition-all duration-200 mb-3 ${
              isDrag
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                : 'border-surface-300 dark:border-surface-700 bg-surface-100 dark:bg-surface-800 hover:border-brand-400'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/*"
              className="hidden"
              onChange={e => loadFile(e.target.files)}
            />
            <div className="text-3xl mb-1">🖼️</div>
            <div className="text-sm font-semibold text-surface-900 dark:text-surface-100">
              Drop an image here or click to upload
            </div>
            <div className="text-[11px] text-surface-500 mt-0.5">PNG, JPG, WebP supported</div>
          </div>
        </>
      )}

      {imageSrc && (
        <div>
          {/* Canvas preview */}
          <div className="rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700 mb-3 bg-surface-100 dark:bg-surface-800 flex items-center justify-center min-h-[180px]">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-72 object-contain block"
              style={{ imageRendering: 'auto' }}
            />
          </div>

          {/* Transform buttons */}
          <div className="mb-3">
            <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-2">Rotate</label>
            <div className="flex gap-2">
              <button onClick={rotateCCW} className={btnClass}>
                <span className="mr-1">↺</span> 90 CCW
              </button>
              <button onClick={rotateCW} className={btnClass}>
                <span className="mr-1">↻</span> 90 CW
              </button>
              <button onClick={rotate180} className={btnClass}>
                180°
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-surface-600 dark:text-surface-500 mb-2">Flip</label>
            <div className="flex gap-2">
              <button onClick={flipH} className={btnClass}>
                Flip Horizontal
              </button>
              <button onClick={flipV} className={btnClass}>
                Flip Vertical
              </button>
            </div>
          </div>

          {/* Current transform info */}
          <div className="text-[11px] text-surface-500 dark:text-surface-400 mb-3 px-1">
            Rotation: {transform.rotation}° {transform.flipH ? '- Flipped H' : ''} {transform.flipV ? '- Flipped V' : ''}
          </div>

          <button
            onClick={download}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-bold text-sm text-white bg-brand-500 hover:bg-brand-600 active:bg-brand-700 shadow-[0_2px_10px_rgba(255,107,53,0.3)] transition-all duration-150 mb-2"
          >
            Download PNG
          </button>
          <button
            onClick={reset}
            className="w-full py-2 px-4 rounded-xl text-sm font-semibold text-surface-600 dark:text-surface-400 border border-surface-300 dark:border-surface-700 hover:border-brand-400 hover:text-brand-500 transition-colors duration-150"
          >
            Edit another image
          </button>
        </div>
      )}
    </div>
  );
}
