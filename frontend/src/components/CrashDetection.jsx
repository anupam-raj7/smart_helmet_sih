import { useState } from "react";
import { simulateCancel } from "../api";

export default function CrashDetection({ helmet }) {
  const [cancelling, setCancelling] = useState(false);
  const isCrash = helmet?.crash;
  const isSos = helmet?.sos;
  const isAlert = isCrash || isSos;
  
  async function handleCancel() {
    setCancelling(true);
    try {
      await simulateCancel(helmet.helmetId);
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className={`tech-panel p-4 flex flex-col gap-4 ${isAlert ? "tech-panel-critical" : "border-border-subtle"}`}>
      <div className="flex justify-between items-center border-b border-border-subtle pb-3 gap-18">
        <h3 className="font-mono text-m tracking-widest text-text-secondary uppercase flex items-center gap-2">
          <span className={`material-symbols-outlined text-m ${isAlert ? "text-status-critical" : "text-text-secondary"}`}>
            {isCrash ? "car_crash" : isSos ? "emergency" : "gpp_good"}
          </span> 
          Emergency Detection
        </h3>
        <div className="flex items-center gap-2">
          <div className={`status-dot ${isAlert ? "bg-status-critical animate-pulse" : "bg-status-ok"}`}></div>
          <span className={`font-mono text-[15px] tracking-widest uppercase ${isAlert ? "text-status-critical text-glow-critical" : "text-status-ok"}`}>
            {isCrash && isSos ? "⚠ CRASH + SOS DETECTED" : isCrash ? "⚠ CRASH DETECTED" : isSos ? "⚠ SOS DETECTED" : "NO CRASH DETECTED"}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 flex-1">
        <div className="flex justify-between items-end">
          <span className="font-mono text-[15px] text-text-secondary uppercase">Severity</span>
          <span className={`font-mono text-m ${isAlert ? "text-status-critical" : "text-text-primary"}`}>
            {isAlert ? "CRITICAL" : "N/A"}
          </span>
        </div>
        
        <div className="flex justify-between items-end">
          <span className="font-mono text-[15px] text-text-secondary uppercase">Impact</span>
          <span className="font-mono text-m text-text-primary">
            {isCrash && helmet?.lastImpactG != null ? `${helmet.lastImpactG}g` : "N/A"}
          </span>
        </div>

        <div className="flex justify-between items-end">
          <span className="font-mono text-[15px] text-text-secondary uppercase">Time</span>
          <span className="font-mono text-m text-text-primary">
            {isAlert && helmet?.lastUpdate ? new Date(helmet.lastUpdate).toLocaleTimeString([], {hour12: false}) : "N/A"}
          </span>
        </div>
        
        <div className="flex justify-between items-end">
          <span className="font-mono text-[15px] text-text-secondary uppercase">Location</span>
          <span className="font-mono text-m text-brand-accent">
            {isAlert && helmet?.location?.lat != null ? `${helmet.location.lat.toFixed(4)}, ${helmet.location.lon.toFixed(4)}` : "N/A"}
          </span>
        </div>
      </div>

      {isAlert && (
        <button 
          onClick={handleCancel}
          disabled={cancelling}
          className="mt-2 w-full py-2 bg-transparent border border-status-critical text-status-critical hover:bg-status-critical hover:text-brand-bg transition-colors font-mono text-xs tracking-widest uppercase cursor-pointer disabled:opacity-50"
        >
          {cancelling ? "CANCELLING..." : "MARK AS FALSE ALARM"}
        </button>
      )}
    </div>
  );
}
