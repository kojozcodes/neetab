import { useState, useRef, useCallback, useEffect } from 'react';

type SimType = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

interface SimOption {
  id: SimType;
  label: string;
  desc: string;
}

const SIM_OPTIONS: SimOption[] = [
  { id: 'normal', label: 'Normal', desc: 'Standard vision' },
  { id: 'protanopia', label: 'Protanopia', desc: 'Red-blind' },
  { id: 'deuteranopia', label: 'Deuteranopia', desc: 'Green-blind' },
  { id: 'tritanopia', label: 'Tritanopia', desc: 'Blue-blind' },
  { id: 'achromatopsia', label: 'Achromatopsia', desc: 'Total color blindness' },
];

// Color transformation matrices (RGB)
const MATRICES: Record<Exclude<SimType, 'normal' | 'achromatopsia'>, number[][]> = {
  protanopia: [
    [0.567, 0.433, 0],
    [0.558, 0.442, 0],
    [0, 0.242, 0.758],
  ],
  deuteranopia: [
    [0.625, 0.375, 0],
    [0.7, 0.3, 0],
    [0, 0.3, 0.7],
  ],
  tritanopia: [
    [0.95, 0.05, 0],
    [0, 0.433, 0.567],
    [0, 0.475, 0.525],
  ],
};

function applyMatrix(r: number, g: number, b: number, m: number[][]): [number, number, number] {
  const nr = Math.round(m[0][0] * r + m[0][1] * g + m[0][2] * b);
  const ng = Math.round(m[1][0] * r + m[1][1] * g + m[1][2] * b);
  const nb = Math.round(m[2][0] * r + m[2][1] * g + m[2][2] * b);
  return [
    Math.max(0, Math.min(255, nr)),
    Math.max(0, Math.min(255, ng)),
    Math.max(0, Math.min(255, nb)),
  ];
}

function simulateImageData(src: ImageData, sim: SimType): ImageData {
  const dst = new ImageData(new Uint8ClampedArray(src.data), src.width, src.height);
  const d = dst.data;

  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2];

    if (sim === 'achromatopsia') {
      const lum = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
      d[i] = lum; d[i + 1] = lum; d[i + 2] = lum;
    } else if (sim !== 'normal') {
      const [nr, ng, nb] = applyMatrix(r, g, b, MATRICES[sim]);
      d[i] = nr; d[i + 1] = ng; d[i + 2] = nb;
    }
  }

  return dst;
}

export default function ColorBlindnessSimulator() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [simType, setSimType] = useState<SimType>('protanopia');
  const [isDrag, setIsDrag] = useState(false);
  const [error, setError] = useState('');

  const origCanvasRef = useRef<HTMLCanvasElement>(null);
  const simCanvasRef = useRef<HTMLCanvasElement>(null);
  const sourceImgRef = useRef<HTMLImageElement | null>(null);

  const drawSimulation = useCallback((sim: SimType) => {
    const img = sourceImgRef.current;
    const origCanvas = origCanvasRef.current;
    const simCanvas = simCanvasRef.current;
    if (!img || !origCanvas || !simCanvas) return;

    const MAX = 480;
    const scale = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.round(img.naturalWidth * scale);
    const h = Math.round(img.naturalHeight * scale);

    origCanvas.width = w; origCanvas.height = h;
    simCanvas.width = w; simCanvas.height = h;

    const origCtx = origCanvas.getContext('2d')!;
    origCtx.drawImage(img, 0, 0, w, h);

    const simCtx = simCanvas.getContext('2d')!;
    if (sim === 'normal') {
      simCtx.drawImage(img, 0, 0, w, h);
    } else {
      const srcData = origCtx.getImageData(0, 0, w, h);
      const dstData = simulateImageData(srcData, sim);
      simCtx.putImageData(dstData, 0, 0);
    }
  }, []);

  useEffect(() => {
    if (imageSrc) drawSimulation(simType);
  }, [simType, imageSrc, drawSimulation]);

  const handleFile = (file: File) => {
    setError('');
    if (!file.type.startsWith('image/')) {
      setError('Please upload a PNG or JPG image.');
      return;
    }
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    const img = new Image();
    img.onload = () => {
      sourceImgRef.current = img;
      drawSimulation(simType);
    };
    img.onerror = () => setError('Failed to load image.');
    img.src = url;
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDrag(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  if (!imageSrc) {
    return (
      <label
        className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-10 cursor-pointer transition-colors ${
          isDrag
            ? 'border-brand-500 bg-brand-500/5'
            : 'border-surface-200 dark:border-surface-700 hover:border-brand-400'
        }`}
        onDragOver={e => { e.preventDefault(); setIsDrag(true); }}
        onDragLeave={() => setIsDrag(false)}
        onDrop={onDrop}
      >
        <span className="text-3xl">👁</span>
        <div className="text-center">
          <p className="text-sm font-bold text-surface-700 dark:text-surface-300">Drop an image or click to upload</p>
          <p className="text-xs text-surface-400 mt-0.5">PNG, JPG supported</p>
        </div>
        <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" className="hidden" onChange={onFileChange} />
      </label>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{error}</p>
      )}

      {/* Simulation type tabs */}
      <div className="flex flex-wrap gap-1.5">
        {SIM_OPTIONS.map(opt => (
          <button
            key={opt.id}
            onClick={() => setSimType(opt.id)}
            title={opt.desc}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              simType === opt.id
                ? 'bg-brand-500 text-white'
                : 'bg-transparent border-[1.5px] border-surface-300 dark:border-surface-700 text-surface-500 dark:text-surface-400 hover:border-brand-400'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Sim description */}
      <p className="text-xs text-surface-500 dark:text-surface-400">
        Simulating: <strong className="text-surface-700 dark:text-surface-300">
          {SIM_OPTIONS.find(o => o.id === simType)?.label}
        </strong> - {SIM_OPTIONS.find(o => o.id === simType)?.desc}
      </p>

      {/* Side by side canvases */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-[11px] font-semibold text-surface-500 uppercase tracking-wide mb-1.5">Original</div>
          <div className="rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700 bg-surface-100 dark:bg-surface-800">
            <canvas ref={origCanvasRef} className="w-full h-auto block" />
          </div>
        </div>
        <div>
          <div className="text-[11px] font-semibold text-surface-500 uppercase tracking-wide mb-1.5">
            {simType === 'normal' ? 'Normal Vision' : SIM_OPTIONS.find(o => o.id === simType)?.label}
          </div>
          <div className="rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700 bg-surface-100 dark:bg-surface-800">
            <canvas ref={simCanvasRef} className="w-full h-auto block" />
          </div>
        </div>
      </div>

      {/* Upload another */}
      <label className="flex items-center justify-center gap-2 cursor-pointer text-xs text-brand-500 hover:text-brand-600 transition-colors py-1">
        <span>Upload another image</span>
        <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" className="hidden" onChange={onFileChange} />
      </label>

      <p className="text-[11px] text-surface-400">
        All processing is done locally in your browser. No image is uploaded to any server.
      </p>
    </div>
  );
}
