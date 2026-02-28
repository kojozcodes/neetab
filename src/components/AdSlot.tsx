import { useEffect, useRef } from 'react';

interface AdSlotProps {
  slot: string;
  format?: 'auto' | 'horizontal' | 'rectangle' | 'vertical';
  className?: string;
}

/**
 * Google AdSense ad slot component.
 * GA/AdSense scripts are deferred in index.html via requestIdleCallback.
 * This component retries pushing ads until adsbygoogle is available.
 */
export default function AdSlot({ slot, format = 'auto', className = '' }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;

    const tryPush = () => {
      try {
        // @ts-ignore
        if (window.adsbygoogle) {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          pushed.current = true;
        } else {
          // AdSense not loaded yet (deferred), retry
          setTimeout(tryPush, 3000);
        }
      } catch {
        // Ad blocker or AdSense error — silently ignore
      }
    };

    // Wait a bit for deferred scripts to load
    setTimeout(tryPush, 2500);
  }, []);

  return (
    <div className={`ad-slot my-6 ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8140528818926560"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      <noscript>
        <div className="text-xs text-surface-400 text-center py-4">Ad space</div>
      </noscript>
    </div>
  );
}
