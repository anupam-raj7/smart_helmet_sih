export default function StatusGrid({ helmet }) {
  if (!helmet) return null;

  const connected = helmet.connected;
  const crash = helmet.crash;
  const sos = helmet.sos;
  const alcohol = helmet.alcohol || {};

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-gutter">
      {/* Connection Card */}
      <div className="glass-panel p-6 rounded-lg flex flex-col justify-between hover:bg-surface-bright transition-colors relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <span className="material-symbols-outlined text-6xl text-primary">wifi</span>
        </div>
        <h3 className="font-label-caps text-on-surface-variant mb-4 uppercase tracking-widest flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">sensors</span> Connection
        </h3>
        <div className="flex items-end justify-between">
          <div className={`font-data-display text-3xl font-bold ${connected ? "text-on-surface" : "text-on-surface-variant"}`}>
            {connected ? "Connected" : "Offline"}
          </div>
          {connected ? (
            <div className="w-3 h-3 rounded-full bg-green-500 pulse-dot mb-1 border border-green-800"></div>
          ) : (
            <div className="w-3 h-3 rounded-full bg-outline-variant mb-1"></div>
          )}
        </div>
      </div>

      {/* Crash Card */}
      <div className={`glass-panel p-6 rounded-lg flex flex-col justify-between hover:bg-surface-bright transition-colors relative overflow-hidden group ${crash ? "border-error border-opacity-30" : ""}`}>
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <span className={`material-symbols-outlined text-6xl ${crash ? "text-error" : "text-primary"}`}>car_crash</span>
        </div>
        <h3 className="font-label-caps text-on-surface-variant mb-4 uppercase tracking-widest flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">warning</span> Crash Status
        </h3>
        <div className="flex items-end justify-between">
          <div className={`font-data-display text-3xl font-bold ${crash ? "text-error" : "text-on-surface"}`}>
            {crash ? `IMPACT ${helmet.lastImpactG ? `(${helmet.lastImpactG}g)` : ""}` : "NO CRASH"}
          </div>
          {crash ? (
            <div className="w-3 h-3 rounded-full bg-red-500 pulse-dot-emergency mb-1 border border-red-800"></div>
          ) : (
            <div className="w-3 h-3 rounded-full bg-green-500 mb-1 border border-green-800"></div>
          )}
        </div>
      </div>

      {/* SOS Card */}
      <div className={`glass-panel p-6 rounded-lg flex flex-col justify-between hover:bg-surface-bright transition-colors relative overflow-hidden group ${sos ? "border-error border-opacity-30" : ""}`}>
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <span className={`material-symbols-outlined text-6xl ${sos ? "text-error" : "text-tertiary"}`}>emergency</span>
        </div>
        <h3 className="font-label-caps text-on-surface-variant mb-4 uppercase tracking-widest flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">sos</span> SOS Signal
        </h3>
        <div className="flex items-end justify-between">
          <div className={`font-data-display text-3xl font-bold ${sos ? "text-error" : "text-on-surface-variant"}`}>
            {sos ? "ACTIVE" : "Inactive"}
          </div>
          {sos ? (
            <div className="w-3 h-3 rounded-full bg-red-500 pulse-dot-emergency mb-1 border border-red-800"></div>
          ) : (
            <div className="w-3 h-3 rounded-full bg-outline-variant mb-1"></div>
          )}
        </div>
      </div>

      {/* Alcohol Card */}
      <div className={`glass-panel p-6 rounded-lg flex flex-col justify-between hover:bg-surface-bright transition-colors relative overflow-hidden group ${alcohol.status === "flagged" ? "border-tertiary border-opacity-30" : ""}`}>
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <span className={`material-symbols-outlined text-6xl ${alcohol.status === "flagged" ? "text-tertiary" : "text-primary"}`}>local_bar</span>
        </div>
        <h3 className="font-label-caps text-on-surface-variant mb-4 uppercase tracking-widest flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">science</span> Alcohol Level
        </h3>
        <div className="flex items-end justify-between">
          <div className={`font-data-display text-3xl font-bold ${alcohol.status === "flagged" ? "text-tertiary" : "text-on-surface"}`}>
            {alcohol.status ? alcohol.status.toUpperCase() : "UNKNOWN"}
          </div>
          {alcohol.status === "flagged" ? (
            <div className="text-tertiary font-label-caps bg-tertiary-container px-2 py-1 rounded border border-tertiary">FLAGGED</div>
          ) : alcohol.status === "ok" ? (
            <div className="text-green-400 font-label-caps bg-green-900 bg-opacity-30 px-2 py-1 rounded">OK</div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
