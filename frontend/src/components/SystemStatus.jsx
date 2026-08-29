export default function SystemStatus({ helmet, socketConnected }) {
  const isOperational = socketConnected && helmet && !helmet.crash && !helmet.sos;
  const isCrash = helmet?.crash;
  const isSos = helmet?.sos;
  const incidentsActive = (isCrash ? 1 : 0) + (isSos ? 1 : 0);
  const hasGps = helmet?.location?.lat != null;

  return (
    <div className="tech-panel p-4 flex flex-col gap-3 border-border-subtle">
      <div className="flex justify-between items-center border-b border-border-subtle pb-3">
        <h3 className="font-mono text-m tracking-widest text-text-secondary uppercase flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">memory</span> System Status
        </h3>
        <div className="flex items-center gap-2">
          <div className={`status-dot ${isOperational ? "bg-status-ok" : "bg-status-warning"}`}></div>
          <span className={`font-mono text-[15px] tracking-widest uppercase ${isOperational ? "text-status-ok" : "text-status-warning"}`}>
            {isOperational ? "OPERATIONAL" : "WARNING"}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-end">
          <span className="font-mono text-[15px] text-text-secondary uppercase">Network</span>
          <span className={`font-mono text-m tracking-widest uppercase ${socketConnected ? "text-status-info text-glow-accent" : "text-text-secondary"}`}>
            {socketConnected ? "● CONNECTED" : "● OFFLINE"}
          </span>
        </div>
        
        <div className="flex justify-between items-end">
          <span className="font-mono text-[15px] text-text-secondary uppercase">GPS</span>
          <span className={`font-mono text-m tracking-widest uppercase ${hasGps ? "text-status-ok" : "text-text-secondary"}`}>
            {hasGps ? "● LOCKED" : "● SEARCHING"}
          </span>
        </div>

        <div className="flex justify-between items-end">
          <span className="font-mono text-[15px] text-text-secondary uppercase">Sensors</span>
          <span className={`font-mono text-m tracking-widest uppercase ${helmet ? "text-status-ok" : "text-text-secondary"}`}>
            {helmet ? "● ONLINE" : "● OFFLINE"}
          </span>
        </div>
        
        <div className="flex justify-between items-end">
          <span className="font-mono text-[15px] text-text-secondary uppercase">Incidents</span>
          <span className={`font-mono text-m tracking-widest uppercase ${incidentsActive > 0 ? "text-status-critical" : "text-text-primary"}`}>
            {incidentsActive < 10 ? `0${incidentsActive}` : incidentsActive} ACTIVE
          </span>
        </div>
      </div>
    </div>
  );
}
