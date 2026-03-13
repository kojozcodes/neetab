import { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserQRCodeReader, BrowserCodeReader } from '@zxing/browser';
import type { IScannerControls } from '@zxing/browser';
import { FileUpload, PrivacyBadge } from '../../components/ui/FileComponents';
import { Button } from '../../components/ui/FormControls';

type Tab = 'camera' | 'upload';
type CameraState = 'idle' | 'requesting' | 'active' | 'denied' | 'unsupported';

export default function QRCodeScanner() {
  const [activeTab, setActiveTab] = useState<Tab>('camera');
  const [cameraState, setCameraState] = useState<CameraState>('idle');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const readerRef = useRef<BrowserQRCodeReader | null>(null);

  const stopCamera = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraState('idle');
  }, []);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState('unsupported');
      return;
    }

    setError('');
    setResult('');
    setCameraState('requesting');

    try {
      const reader = new BrowserQRCodeReader();
      readerRef.current = reader;

      // Use environment-facing camera on mobile when available
      const devices = await BrowserCodeReader.listVideoInputDevices();
      const deviceId = devices.length > 0 ? undefined : undefined; // use default (environment-facing preferred by browsers)
      void deviceId; // resolved by passing undefined to decodeFromVideoDevice

      const controls = await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current ?? undefined,
        (scanResult, err) => {
          if (scanResult) {
            setResult(scanResult.getText());
            stopCamera();
          }
          // Suppress "not found" errors that fire continuously
          if (err && !(err.message?.includes('No MultiFormat Readers'))) {
            // only surface real, unexpected errors
          }
        }
      );

      controlsRef.current = controls;
      setCameraState('active');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('Permission denied') || msg.includes('NotAllowedError')) {
        setCameraState('denied');
      } else if (msg.includes('NotFoundError') || msg.includes('DevicesNotFoundError')) {
        setError('No camera found on this device.');
        setCameraState('idle');
      } else {
        setError('Could not start camera. ' + msg);
        setCameraState('idle');
      }
    }
  }, [stopCamera]);

  // Stop camera when switching tabs or on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleTabSwitch = (tab: Tab) => {
    if (tab !== activeTab) {
      stopCamera();
      setResult('');
      setError('');
      setCopied(false);
      setActiveTab(tab);
    }
  };

  const handleUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setError('');
    setResult('');
    setCopied(false);

    try {
      const reader = new BrowserQRCodeReader();
      const objectUrl = URL.createObjectURL(file);
      try {
        const scanResult = await reader.decodeFromImageUrl(objectUrl);
        setResult(scanResult.getText());
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    } catch {
      setError('No QR code found in this image.');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = result;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleScanAnother = () => {
    setResult('');
    setError('');
    setCopied(false);
    setCameraState('idle');
  };

  const isUrl = result.startsWith('http://') || result.startsWith('https://');

  const isHttpPage =
    typeof window !== 'undefined' && window.location.protocol === 'http:' && window.location.hostname !== 'localhost';

  return (
    <div>
      <PrivacyBadge />

      {/* Tab switcher */}
      <div className="flex gap-1.5 mb-4">
        {(['camera', 'upload'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => handleTabSwitch(tab)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === tab
                ? 'bg-brand-500 text-white'
                : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:text-brand-500'
            }`}
          >
            {tab === 'camera' ? '📷 Camera' : '🖼️ Upload Image'}
          </button>
        ))}
      </div>

      {/* Result display (shown above tab content once we have a result) */}
      {result && (
        <div className="mb-4">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                QR Code Detected
              </span>
            </div>
            {isUrl ? (
              <a
                href={result}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-brand-500 hover:underline break-all"
              >
                {result}
              </a>
            ) : (
              <p className="text-sm font-semibold text-surface-900 dark:text-surface-100 break-all">{result}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCopy} className="flex-1">
              {copied ? '✓ Copied!' : '📋 Copy'}
            </Button>
            <Button variant="secondary" onClick={handleScanAnother}>
              Scan Another
            </Button>
          </div>
        </div>
      )}

      {/* Camera tab */}
      {activeTab === 'camera' && !result && (
        <div>
          {isHttpPage && (
            <div className="mb-3 px-3 py-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-xs text-amber-700 dark:text-amber-400">
              Camera requires HTTPS. Switch to a secure connection to use this feature.
            </div>
          )}

          {cameraState === 'idle' && (
            <div className="text-center py-6">
              <div className="text-4xl mb-3">📷</div>
              <p className="text-sm text-surface-600 dark:text-surface-400 mb-4">
                Point your camera at a QR code to scan it instantly.
              </p>
              <Button onClick={startCamera}>Start Camera</Button>
            </div>
          )}

          {cameraState === 'requesting' && (
            <div className="text-center py-6">
              <div className="text-4xl mb-3 animate-pulse">📷</div>
              <p className="text-sm text-surface-500">Requesting camera permission...</p>
            </div>
          )}

          {cameraState === 'denied' && (
            <div className="text-center py-6">
              <div className="text-4xl mb-3">🚫</div>
              <p className="text-sm font-semibold text-red-500 mb-1">Camera permission denied</p>
              <p className="text-xs text-surface-500 mb-4">
                Allow camera access in your browser settings, then try again.
              </p>
              <Button onClick={startCamera}>Try Again</Button>
            </div>
          )}

          {cameraState === 'unsupported' && (
            <div className="text-center py-6">
              <div className="text-4xl mb-3">😕</div>
              <p className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1">
                Camera not supported
              </p>
              <p className="text-xs text-surface-500">
                Your browser does not support camera access. Use the Upload Image tab instead.
              </p>
            </div>
          )}

          {cameraState === 'active' && (
            <div>
              {/* Camera preview */}
              <div
                className="relative rounded-xl overflow-hidden bg-black mb-3"
                style={{ aspectRatio: '4/3' }}
              >
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  playsInline
                />
                {/* Scanning reticle */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border-2 border-brand-500 rounded-xl opacity-70" />
                </div>
                {/* Scanning indicator */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                  <span className="bg-black/60 text-white text-[11px] px-2.5 py-1 rounded-full">
                    Scanning...
                  </span>
                </div>
              </div>
              <Button variant="secondary" onClick={stopCamera} className="w-full">
                Stop Camera
              </Button>
            </div>
          )}

          {error && cameraState === 'idle' && (
            <p className="mt-2 text-xs text-red-500 text-center">{error}</p>
          )}
        </div>
      )}

      {/* Upload tab */}
      {activeTab === 'upload' && !result && (
        <div>
          <FileUpload
            accept="image/*"
            onFiles={handleUpload}
            label="Upload QR code image"
            icon="🖼️"
          />
          {error && (
            <div className="mt-2 px-3 py-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-xs text-red-500">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
