import { useState, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import { Select, Button } from '../../components/ui/FormControls';
import { FileUpload, PrivacyBadge, DownloadButton } from '../../components/ui/FileComponents';
import { ChevronUpIcon, ChevronDownIcon, XIcon } from '../../components/ui/Icons';

interface UploadedImage { src: string; name: string; w: number; h: number; size: number; }

export default function ImageToPDF() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pageSize, setPageSize] = useState('a4');
  const [orientation, setOrientation] = useState('portrait');
  const [fitMode, setFitMode] = useState('contain');

  const addImages = (files: File[]) => {
    files.filter(f => f.type.startsWith('image/')).forEach(f => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => setImages(prev => [...prev, { src: reader.result as string, name: f.name, w: img.width, h: img.height, size: f.size }]);
        img.src = reader.result as string;
      };
      reader.readAsDataURL(f);
    });
  };

  const removeImage = (i: number) => setImages(prev => prev.filter((_, j) => j !== i));
  const moveImage = (i: number, dir: number) => {
    setImages(prev => { const n = [...prev]; const ni = i + dir; if (ni < 0 || ni >= n.length) return n; [n[i], n[ni]] = [n[ni], n[i]]; return n; });
  };

  const generatePDF = useCallback(() => {
    if (!images.length) return;
    const doc = new jsPDF({ orientation: orientation as any, format: pageSize, unit: 'mm' });
    const pw = doc.internal.pageSize.getWidth();
    const ph = doc.internal.pageSize.getHeight();
    const margin = 10;

    images.forEach((img, i) => {
      if (i > 0) doc.addPage(pageSize as any, orientation as any);
      const aw = pw - margin * 2, ah = ph - margin * 2;
      let w: number, h: number;
      const ratio = img.w / img.h;
      if (fitMode === 'contain') { if (ratio > aw / ah) { w = aw; h = aw / ratio; } else { h = ah; w = ah * ratio; } }
      else { w = aw; h = ah; }
      const x = (pw - w) / 2, y = (ph - h) / 2;
      doc.addImage(img.src, 'JPEG', x, y, w, h);
    });

    setPdfBlob(doc.output('blob'));
  }, [images, pageSize, orientation, fitMode]);

  return (
    <div>
      <PrivacyBadge />
      <div className="grid grid-cols-3 gap-2 mb-3.5">
        <Select label="Page Size" value={pageSize} onChange={setPageSize} options={[{ value: 'a4', label: 'A4' }, { value: 'letter', label: 'Letter' }, { value: 'a3', label: 'A3' }]} />
        <Select label="Orientation" value={orientation} onChange={setOrientation} options={[{ value: 'portrait', label: 'Portrait' }, { value: 'landscape', label: 'Landscape' }]} />
        <Select label="Fit" value={fitMode} onChange={setFitMode} options={[{ value: 'contain', label: 'Contain' }, { value: 'stretch', label: 'Stretch' }]} />
      </div>

      <FileUpload accept="image/*" multiple onFiles={addImages} label="Drop images here" icon="🖼️" />

      {images.length > 0 && (
        <div className="mb-3.5">
          <div className="text-xs font-bold text-surface-600 dark:text-surface-500 mb-2">{images.length} image{images.length > 1 ? 's' : ''}</div>
          {images.map((img, i) => (
            <div key={i} className="flex items-center gap-2.5 p-2 rounded-xl bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 mb-1.5">
              <img src={img.src} alt="" className="w-10 h-10 object-cover rounded-lg" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-surface-900 dark:text-surface-100 truncate">{img.name}</div>
                <div className="text-[10px] text-surface-500">{img.w}×{img.h} • {(img.size / 1024).toFixed(0)}KB</div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => moveImage(i, -1)} className="p-1 rounded border border-surface-300 dark:border-surface-600 text-surface-500 hover:text-brand-500"><ChevronUpIcon /></button>
                <button onClick={() => moveImage(i, 1)} className="p-1 rounded border border-surface-300 dark:border-surface-600 text-surface-500 hover:text-brand-500"><ChevronDownIcon /></button>
                <button onClick={() => removeImage(i)} className="p-1 rounded border border-surface-300 dark:border-surface-600 text-red-500"><XIcon /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Button onClick={generatePDF} className="w-full" disabled={!images.length}>
        📄 Generate PDF ({images.length} page{images.length !== 1 ? 's' : ''})
      </Button>

      {pdfBlob && <DownloadButton blob={pdfBlob} filename="images-combined.pdf" label="⬇ Download PDF" />}
    </div>
  );
}
