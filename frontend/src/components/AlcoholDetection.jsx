export default function AlcoholDetection({ alcohol }) {
  const isFlagged = alcohol?.status === "flagged";
  const isOk = alcohol?.status === "normal" || alcohol?.status === "ok";
  const statusColor = isFlagged ? "text-status-critical" : isOk ? "text-status-ok" : "text-text-secondary";
  const borderColor = isFlagged ? "border-status-critical shadow-[0_0_15px_rgba(255,42,42,0.1)]" : "border-border-subtle";

  return (
    <div className={`tech-panel p-4 flex flex-col gap-4 ${borderColor}`}>
      <div className="flex justify-between items-center border-b border-border-subtle pb-3">
        <h3 className="font-mono text-m tracking-widest text-text-secondary uppercase flex items-center gap-2">
          <span className="material-symbols-outlined text-m">science</span> Alcohol Detection
        </h3>
        <div className="flex items-center gap-2">
          <div className={`status-dot ${isFlagged ? "bg-status-critical animate-pulse" : isOk ? "bg-status-ok" : "bg-text-secondary"}`}></div>
          <span className={`font-mono text-[15px] tracking-widest uppercase ${statusColor}`}>
            {isFlagged ? "WARNING" : isOk ? "SAFE" : "UNKNOWN"}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-end">
          <span className="font-mono text-[15px] text-text-secondary uppercase">Alcohol Level</span>
          <span className={`font-mono text-lg ${statusColor}`}>
            {alcohol?.value != null ? alcohol.value : "N/A"}
          </span>
        </div>
        
        <div className="flex justify-between items-end">
          <span className="font-mono text-[15px] text-text-secondary uppercase">Sensor Status</span>
          <span className="font-mono text-lg text-text-primary uppercase">
            {alcohol?.status || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}
