export default function LiveLocation({ helmet }) {
  const hasLocation = helmet?.location?.lat != null;
  const lat = hasLocation ? helmet.location.lat.toFixed(6) : "N/A";
  const lon = hasLocation ? helmet.location.lon.toFixed(6) : "N/A";

  return (
    <div className="tech-panel p-4 flex flex-col gap-3 border-border-subtle h-full">
      <div className="flex justify-between items-center border-b border-border-subtle pb-3">
        <h3 className="font-mono text-m tracking-widest text-text-secondary uppercase flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">my_location</span> Live Location
        </h3>
        <div className="flex items-center gap-2">
          <div className={`status-dot ${hasLocation ? "bg-status-ok animate-pulse" : "bg-text-secondary"}`}></div>
          <span className={`font-mono text-[15px] tracking-widest uppercase ${hasLocation ? "text-status-ok" : "text-text-secondary"}`}>
            {hasLocation ? "ACTIVE" : "UNAVAILABLE"}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-5 flex-1 justify-center">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[15px] text-text-secondary uppercase tracking-widest">Latitude</span>
          <span className="font-mono text-2xl text-brand-accent text-glow-accent">
            {lat}
          </span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[15px] text-text-secondary uppercase tracking-widest">Longitude</span>
          <span className="font-mono text-2xl text-brand-accent text-glow-accent">
            {lon}
          </span>
        </div>

      </div>
    </div>
  );
}
