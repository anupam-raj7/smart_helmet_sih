const LABELS = {
  crash: "CRASH DETECTED",
  sos: "SOS SIGNAL",
  cancel: "ALERT CANCELLED",
  location: "LOCATION UPDATE",
  alcohol: "ALCOHOL CHECK",
};

const DESC = {
  crash: "High impact detected",
  sos: "Manual emergency signal",
  cancel: "False alarm marked",
  location: "GPS position updated",
  alcohol: "Sensor reading received",
};

const EVENT_STYLES = {
  crash: {
    color: "text-status-critical",
    border: "border-status-critical",
    icon: "warning",
    tag: "CRITICAL"
  },
  sos: {
    color: "text-status-critical",
    border: "border-status-critical",
    icon: "emergency",
    tag: "CRITICAL"
  },
  cancel: {
    color: "text-text-primary",
    border: "border-border-subtle",
    icon: "cancel",
    tag: "INFO"
  },
  location: {
    color: "text-status-info",
    border: "border-status-info",
    icon: "my_location",
    tag: "INFO"
  },
  alcohol: {
    color: "text-brand-accent",
    border: "border-brand-accent",
    icon: "science",
    tag: "DATA"
  },
};

export default function EventLog({ events }) {
  return (
    <div className="tech-panel flex flex-col overflow-hidden h-full">
      <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-black/10">
        <h3 className="font-mono text-m text-text-secondary uppercase tracking-widest flex items-center gap-2">
          <span className="material-symbols-outlined text-m">subject</span> Event Log
        </h3>
        <span className="font-mono text-[15px] text-text-secondary">{events.length} ENTRIES</span>
      </div>

      <div className="flex flex-col overflow-y-auto flex-1 min-h-0 p-2 custom-scrollbar">
        {!events || events.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-12 text-text-secondary opacity-50">
            <span className="material-symbols-outlined text-4xl mb-2">history</span>
            <p className="font-mono text-m tracking-widest uppercase">No data received</p>
          </div>
        ) : (
          events.map((e) => {
            const style = EVENT_STYLES[e.event] || EVENT_STYLES.cancel;
            return (
              <div key={e.id} className="flex flex-col gap-1 p-4 border-b border-border-subtle last:border-b-0 hover:bg-white/5 transition-colors">
                <span className="font-mono text-[15px] text-text-secondary tracking-widest">
                  {new Date(e.timestamp).toLocaleString([], { hour12: false })}
                </span>
                <div className={`font-mono text-m font-bold tracking-wide uppercase ${style.color}`}>
                  {LABELS[e.event] || e.event}
                </div>
                <div className="font-sans text-m text-text-primary opacity-80">
                  {DESC[e.event] || "System event recorded"}
                </div>
                <div className={`font-mono text-[15px] mt-1 tracking-widest uppercase opacity-80 ${style.color}`}>
                  {style.tag}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
