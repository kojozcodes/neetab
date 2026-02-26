import { useEffect, useRef } from 'react';

interface AdSlotProps {
  slot: string;        // AdSense ad slot ID
  format?: 'auto' | 'horizontal' | 'rectangle' | 'vertical';
  className?: string;
}

/**
 * Google AdSense ad slot component.
 *
 * Placement strategy (non-intrusive):
 * 1. Below hero on home page (1 ad)
 * 2. Between tool categories on home page (1 ad)
 * 3. Below tool results (1 ad per tool page)
 * 4. Never: mid-tool, covering inputs, or blocking workflow
 *
 * Replace 'ca-pub-XXXXXXXXXX' with your publisher ID
 * Replace slot IDs with your actual ad unit IDs
 */
export default function AdSlot({ slot, format = 'auto', className = '' }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded (dev mode or ad blocker)
    }
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
      {/* Fallback for development / ad blockers */}
      <noscript>
        <div className="text-xs text-surface-400 text-center py-4">Ad space</div>
      </noscript>
    </div>
  );
}
