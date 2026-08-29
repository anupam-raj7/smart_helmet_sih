export default function HeroVisual() {
  return (
    <div className="tech-panel p-5 flex flex-col items-start gap-4 shrink-0 overflow-hidden relative">
      {/* Background Graphic */}
      <div className="absolute -right-12 -top-12 w-40 h-40 opacity-10 pointer-events-none">
        <div className="w-full h-full rounded-full border-[10px] border-brand-accent animate-[spin_40s_linear_infinite]"></div>
        <div className="absolute inset-4 rounded-full border border-dashed border-brand-accent animate-[spin_30s_linear_infinite_reverse]"></div>
      </div>

      <div className="z-10">
        <h1 className="text-xl font-sans font-bold tracking-tight text-text-primary leading-tight">
          Intelligent <br />
          <span className="text-brand-accent text-glow-accent">Monitoring.</span>
        </h1>
        <p className="mt-2 text-text-secondary text-[10px] leading-relaxed tracking-wide uppercase font-mono max-w-[200px]">
          Real-time telemetry and safety operations.
        </p>
      </div>

      <div className="z-10 flex items-center gap-2 mt-2">
        <span className="material-symbols-outlined text-xl text-brand-accent">two_wheeler</span>
        <div className="h-[1px] w-12 bg-gradient-to-r from-brand-accent to-transparent"></div>
      </div>
    </div>
  );
}
