import { useEffect, useState } from 'react';

export default function TechBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMouseMove(e) {
      // Normalize mouse coordinates from -1 to 1 for parallax
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y, clientX: e.clientX, clientY: e.clientY });
    }
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden text-brand-accent opacity-30 font-mono text-[10px]">
      
      {/* Top right geometric ring/radar - Moves opposite to mouse, increased range */}
      <div 
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full border border-current opacity-40 flex items-center justify-center transition-transform duration-1000 ease-out"
        style={{ transform: `translate(${mousePos.x * -80}px, ${mousePos.y * -80}px)` }}
      >
        <div className="w-[400px] h-[400px] rounded-full border border-dashed border-current animate-[spin_60s_linear_infinite]"></div>
        <div className="absolute w-[300px] h-[300px] rounded-full border border-current opacity-50"></div>
        <div className="absolute w-[500px] h-[1px] bg-current opacity-30 transform rotate-45"></div>
      </div>

      {/* Bottom left abstract circuit/nodes - Moves with mouse strongly */}
      <svg 
        className="absolute bottom-0 left-0 w-[600px] h-[400px] opacity-50 transition-transform duration-700 ease-out" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: `translate(${mousePos.x * 100}px, ${mousePos.y * 100}px)` }}
      >
        <path d="M 0 350 L 150 350 L 200 300 L 400 300 L 450 250 L 600 250" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="200" cy="300" r="5" fill="currentColor" className="animate-pulse" />
        <circle cx="450" cy="250" r="5" fill="currentColor" className="animate-pulse" style={{ animationDelay: '1s' }} />
        
        <path d="M 50 400 L 50 280 L 100 230 L 100 150" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
        <rect x="97" y="144" width="6" height="6" fill="none" stroke="currentColor" />
      </svg>

      {/* Hexagonal structure center-left - Moves fastest */}
      <svg 
        className="absolute top-[30%] left-[10%] w-[200px] h-[200px] opacity-40 transition-transform duration-300 ease-out" 
        viewBox="0 0 100 100"
        style={{ transform: `translate(${mousePos.x * 150}px, ${mousePos.y * 150}px)` }}
      >
        <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="none" stroke="currentColor" strokeWidth="1" />
        <polygon points="50,15 85,32.5 85,67.5 50,85 15,67.5 15,32.5" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </svg>

      {/* Background data/annotations */}
      <div className="absolute top-[20%] left-[8%] select-none tracking-widest leading-loose text-text-secondary opacity-60">
        <div>LAT 28.6139</div>
        <div>LON 77.2090</div>
        <div className="text-brand-accent font-bold">NODE_04</div>
      </div>
      
      <div className="absolute top-[40%] right-[5%] select-none text-right tracking-widest leading-loose text-text-secondary opacity-60">
        <div className="text-brand-accent font-bold">SIGNAL 98%</div>
        <div>SENSOR LINK</div>
        <div>ΔT 0.024s</div>
      </div>

      <div className="absolute bottom-[25%] right-[10%] select-none text-right tracking-widest leading-loose text-text-secondary opacity-50">
        <div>θ = atan2(y,x)</div>
        <div>Σ ∫ x(t)</div>
      </div>

      {/* Sharp Interactive Cursor Core */}
      <div 
        className="absolute w-4 h-4 rounded-full bg-brand-accent shadow-[0_0_20px_#0ea5e9] pointer-events-none transition-transform duration-75 ease-out z-[-1]"
        style={{ 
          left: -8, 
          top: -8,
          transform: `translate(${mousePos.clientX || window.innerWidth/2}px, ${mousePos.clientY || window.innerHeight/2}px)`
        }}
      ></div>

      {/* Massive Interactive Spotlight */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full blur-[60px] pointer-events-none transition-transform duration-150 ease-out z-[-1]"
        style={{ 
          background: 'radial-gradient(circle, rgba(14,165,233,0.7) 0%, rgba(139,92,246,0.5) 30%, transparent 70%)',
          left: -300, 
          top: -300,
          transform: `translate(${mousePos.clientX || window.innerWidth/2}px, ${mousePos.clientY || window.innerHeight/2}px)`
        }}
      ></div>
    </div>
  );
}
