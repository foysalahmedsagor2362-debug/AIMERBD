import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  dataAdClient: string;
  dataAdSlot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  responsive?: boolean;
  className?: string;
  isTestMode?: boolean; // Set to true to see where the ad will be during development
}

export const AdBanner: React.FC<AdBannerProps> = ({ 
  dataAdClient, 
  dataAdSlot, 
  format = 'auto', 
  responsive = true,
  className = "",
  isTestMode = false 
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent double injection in React 18 strict mode
    if (initialized.current) return;
    initialized.current = true;

    try {
      // @ts-ignore
      const adsbygoogle = window.adsbygoogle || [];
      if (adRef.current && !isTestMode) {
         adsbygoogle.push({});
      }
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, [isTestMode]);

  if (isTestMode) {
    return (
      <div className={`w-full bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center text-slate-400 my-6 ${className}`}>
        <span className="font-bold text-xs uppercase tracking-widest mb-1">AdSense Banner Placeholder</span>
        <span className="text-xs">Client: {dataAdClient} | Slot: {dataAdSlot}</span>
        <span className="text-[10px] mt-2 text-slate-400/60">(Set isTestMode=false in code to load real ad)</span>
      </div>
    );
  }

  return (
    <div className={`text-center my-6 overflow-hidden ${className}`}>
       <span className="text-[10px] text-slate-300 uppercase tracking-widest mb-1 block">Advertisement</span>
       <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={dataAdClient}
          data-ad-slot={dataAdSlot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
          ref={adRef}
        />
    </div>
  );
};