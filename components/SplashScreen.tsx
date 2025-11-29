
import React, { useState, useEffect, useRef } from 'react';
import { Truck, Cpu, Wifi, ShieldCheck, Fingerprint, Terminal, HardDrive, Download } from 'lucide-react';

const brands = [
  { name: 'Renault', color: '#FFCC33', icon: 'https://cdn.simpleicons.org/renault/FFCC33' },
  { name: 'Volvo', color: '#14296C', icon: 'https://cdn.simpleicons.org/volvo/ffffff' }, 
  { name: 'Scania', color: '#041E42', icon: 'https://cdn.simpleicons.org/scania/ffffff' }, 
  { name: 'MAN', color: '#E40045', icon: 'https://cdn.simpleicons.org/man/E40045' },
  { name: 'DAF', color: '#005C94', icon: 'https://cdn.simpleicons.org/daf/005C94' },
  { name: 'Iveco', color: '#004899', icon: 'https://cdn.simpleicons.org/iveco/ffffff' }, 
  { name: 'Ford', color: '#003399', icon: 'https://cdn.simpleicons.org/ford/ffffff' },
];

const terminalLines = [
  "INITIALIZING KERNEL...",
  "[OK] MOUNTING VIRTUAL FILESYSTEM",
  "[LOAD] LOADING ECU DRIVERS v4.5.2",
  "Downloading: /libs/obd2_protocol.lib [100%]",
  "Extracting: brand_database_2024.zip",
  "[OK] VERIFYING CHECKSUM: 0x4F8A2C",
  "CONNECTING TO AI ENGINE...",
  "[LOAD] NEURAL NETWORKS WEIGHTS",
  "Downloading: /assets/truck_blueprints.dat",
  "Extracting: sensor_maps_volvo.bin",
  "Extracting: sensor_maps_renault.bin",
  "Extracting: sensor_maps_scania.bin",
  "[OK] SECURITY TOKENS VERIFIED",
  "CALIBRATING DIAGNOSTICS MODULE...",
  "ESTABLISHING SECURE CONNECTION...",
  "[OK] DATABASE SYNC COMPLETE",
  "STARTING USER INTERFACE...",
  "SYSTEM READY."
];

const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lineIndex = 0;
    
    // Progress Timer
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setTimeout(onFinish, 800); 
          return 100;
        }
        return prev + 1; 
      });
    }, 40);

    // Terminal Logs Timer (Faster)
    const logsTimer = setInterval(() => {
      if (lineIndex < terminalLines.length) {
        setLogs(prev => [...prev.slice(-4), terminalLines[lineIndex]]); // Keep last 5 lines
        lineIndex++;
      } else {
        // Add random hex dumps if lines run out
        const randomHex = Math.random().toString(16).substr(2, 8).toUpperCase();
        setLogs(prev => [...prev.slice(-4), `MEM_ALLOC: 0x${randomHex} [OK]`]);
      }
    }, 150);

    return () => {
      clearInterval(progressTimer);
      clearInterval(logsTimer);
    };
  }, [onFinish]);

  // Auto scroll terminal
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center font-mono select-none overflow-hidden text-red-600">
      
      {/* Digital Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.05)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20"></div>
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/80 to-black pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center justify-center scale-90 md:scale-100 w-full max-w-md px-6">
        
        {/* Main HUD System */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mb-10">
          
          {/* Outer Rotating Dashed Ring */}
          <div className="absolute inset-0 rounded-full border border-dashed border-red-900/50 animate-[spin_10s_linear_infinite]"></div>
          
          {/* Inner Counter-Rotating Ring */}
          <div className="absolute inset-4 rounded-full border-2 border-t-red-600 border-b-transparent border-l-transparent border-r-red-600 opacity-50 animate-[spin_3s_linear_infinite_reverse]"></div>
          
          {/* Scanning Radar Effect */}
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(220,38,38,0.2)_360deg)] animate-[spin_2s_linear_infinite] z-0"></div>

          {/* Rotating Ring of Brands */}
          <div className="absolute inset-0 animate-[spin_12s_linear_infinite] z-10">
             {brands.map((brand, index) => {
              const angle = (index * 360) / brands.length;
              return (
                <div
                  key={brand.name}
                  className="absolute top-1/2 left-1/2 w-10 h-10 -ml-5 -mt-5 flex items-center justify-center bg-black/80 rounded-full border border-red-900/50 shadow-[0_0_10px_rgba(220,38,38,0.3)] transform-gpu transition-all"
                  style={{
                    transform: `rotate(${angle}deg) translate(9.5rem) rotate(-${angle}deg)`, 
                  }}
                >
                   <img 
                     src={brand.icon} 
                     alt={brand.name} 
                     className="w-5 h-5 object-contain opacity-80" 
                   />
                </div>
              );
            })}
          </div>

          {/* Central Hub */}
          <div className="absolute z-20 flex flex-col items-center justify-center bg-black rounded-full w-44 h-44 border border-red-900/60 shadow-[0_0_30px_rgba(220,38,38,0.15)] overflow-hidden">
            {/* Background Glitch Lines */}
            <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#ef4444_3px)]"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 bg-red-600/10 rounded-lg flex items-center justify-center border border-red-500/30 mb-2 animate-pulse">
                 <Truck className="w-6 h-6 text-red-500" />
              </div>
              <h1 className="text-white font-black text-xl tracking-tighter leading-none relative mt-1">
                SMART
                <span className="absolute -top-1 -right-2 w-1 h-1 bg-green-500 rounded-full animate-ping"></span>
              </h1>
              <h1 className="text-white font-black text-xs tracking-wide leading-none relative mt-1">
                MECHANIC
              </h1>
              <div className="flex items-center gap-1 mt-2">
                <span className="h-0.5 w-3 bg-red-600"></span>
                <p className="text-red-500 text-[8px] font-bold tracking-[0.2em] uppercase">SYSTEM V3.0</p>
                <span className="h-0.5 w-3 bg-red-600"></span>
              </div>
            </div>
          </div>

          {/* Decorative HUD Elements */}
          <Cpu className="absolute -top-8 left-1/2 -translate-x-1/2 w-4 h-4 text-red-900 animate-pulse" />
          <Wifi className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4 h-4 text-red-900 animate-pulse" />
          <div className="absolute top-1/2 -left-8 -translate-y-1/2 w-1 h-8 bg-red-900/50"></div>
          <div className="absolute top-1/2 -right-8 -translate-y-1/2 w-1 h-8 bg-red-900/50"></div>

        </div>

        {/* Boot Sequence Terminal */}
        <div className="w-full max-w-sm relative z-20">
           {/* Progress Bar */}
           <div className="flex justify-between items-center mb-1">
             <span className="text-[10px] text-zinc-500 flex items-center gap-1">
               <HardDrive className="w-3 h-3" />
               SYSTEM LOADING
             </span>
             <span className="text-xs text-white font-black">{progress}%</span>
           </div>
           
           <div className="h-1.5 w-full bg-zinc-900 rounded-none overflow-hidden border border-red-900/30 mb-4 relative">
             <div 
               className="h-full bg-red-600 transition-all duration-75 ease-out shadow-[0_0_10px_rgba(220,38,38,0.8)]"
               style={{ width: `${progress}%` }}
             ></div>
             {/* Scanning glare on bar */}
             <div className="absolute inset-0 bg-white/20 w-20 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
           </div>

           {/* Terminal Window */}
           <div className="bg-black/80 border border-zinc-800 rounded-lg p-3 font-mono text-[10px] md:text-xs h-32 relative overflow-hidden shadow-inner">
             <div className="absolute top-2 right-2 flex gap-1">
               <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
               <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
               <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
             </div>
             
             <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[size:100%_2px,3px_100%]"></div>
             
             <div ref={scrollRef} className="h-full overflow-hidden flex flex-col justify-end">
                {logs.map((log, i) => (
                  <div key={i} className="flex items-start gap-2 mb-1 animate-in slide-in-from-left-2 duration-100">
                    <span className="text-zinc-600 shrink-0 select-none">root@sys:~#</span>
                    <span className={`${
                      log && log.includes('[OK]') ? 'text-green-500' : 
                      log && log.includes('Extracting') ? 'text-amber-500' :
                      log && log.includes('Downloading') ? 'text-blue-400' :
                      log && log.includes('ERROR') ? 'text-red-500' : 'text-zinc-300'
                    } break-all`}>
                      {log}
                    </span>
                  </div>
                ))}
                <div className="w-2 h-4 bg-green-500 animate-pulse mt-1"></div>
             </div>
           </div>

           {/* Bottom Details */}
           <div className="flex justify-between mt-4 px-2 opacity-50 text-[8px] text-zinc-500">
             <div className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>SECURE BOOT</span>
             </div>
             <div className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                <span>PACKETS: {Math.floor(progress * 12.5)}/1250</span>
             </div>
             <div className="flex items-center gap-1">
                <Fingerprint className="w-3 h-3" />
                <span>ID: 847-XF</span>
             </div>
           </div>
        </div>

      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
