
import React, { useEffect, useState } from 'react';
import { Truck, Trees, Cloud, Moon } from 'lucide-react';

interface DrivingSceneProps {
  onFinish: () => void;
}

const DrivingScene: React.FC<DrivingSceneProps> = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Automatically close after 4 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 500); // Wait for fade out
    }, 4000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-zinc-950 flex flex-col justify-end overflow-hidden transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={() => { setIsVisible(false); setTimeout(onFinish, 300); }}
    >
      {/* Sky & Moon */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-zinc-900 to-zinc-800">
        <div className="absolute top-10 right-10 animate-pulse">
           <Moon className="w-16 h-16 text-yellow-100/80 drop-shadow-[0_0_15px_rgba(254,240,138,0.5)]" />
        </div>
        
        {/* Moving Clouds */}
        <div className="absolute top-20 right-[-100px] animate-[float-clouds_20s_linear_infinite] opacity-20">
           <Cloud className="w-24 h-24 text-white" />
        </div>
        <div className="absolute top-40 right-[-300px] animate-[float-clouds_25s_linear_infinite_reverse] opacity-10">
           <Cloud className="w-32 h-32 text-white" />
        </div>
      </div>

      {/* Background Mountains/Hills */}
      <div className="absolute bottom-32 left-0 w-[200%] h-48 bg-zinc-800 rounded-[100%] blur-sm translate-y-20 animate-[drive-trees_20s_linear_infinite]"></div>

      {/* Moving Trees (Back Layer - Slower) */}
      <div className="absolute bottom-28 left-0 w-full flex gap-20 animate-[drive-trees_8s_linear_infinite] opacity-40">
         {Array.from({ length: 10 }).map((_, i) => (
            <Trees key={`tree-back-${i}`} className="w-24 h-24 text-zinc-600" />
         ))}
      </div>

      {/* Moving Trees (Front Layer - Faster) */}
      <div className="absolute bottom-24 left-0 w-full flex gap-32 animate-[drive-trees_3s_linear_infinite]">
         {Array.from({ length: 10 }).map((_, i) => (
            <div key={`tree-front-${i}`} className="transform scale-150">
               <Trees className="w-32 h-32 text-zinc-900 drop-shadow-lg" />
            </div>
         ))}
      </div>

      {/* Road */}
      <div className="relative h-32 bg-zinc-900 border-t-4 border-zinc-700 w-full z-10 overflow-hidden flex items-center">
         {/* Road Markings */}
         <div className="absolute top-1/2 w-full flex gap-16 animate-[drive-road_0.8s_linear_infinite]">
            {Array.from({ length: 20 }).map((_, i) => (
               <div key={`line-${i}`} className="w-12 h-2 bg-yellow-500/50 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.4)]"></div>
            ))}
         </div>
         
         {/* Asphalt Texture */}
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asphalt-dark.png')] opacity-30"></div>
      </div>

      {/* The Truck */}
      <div className="absolute bottom-16 left-10 md:left-20 z-20">
         <div className="relative animate-[bounce-truck_0.5s_ease-in-out_infinite]">
            {/* Wind/Speed Lines */}
            <div className="absolute -right-20 top-0 w-20 h-full flex flex-col justify-around opacity-50">
               <div className="w-full h-0.5 bg-white animate-[wind_0.5s_linear_infinite] delay-75"></div>
               <div className="w-3/4 h-0.5 bg-white animate-[wind_0.6s_linear_infinite] delay-150"></div>
               <div className="w-full h-0.5 bg-white animate-[wind_0.4s_linear_infinite]"></div>
            </div>

            {/* Truck Body */}
            <div className="relative z-10 transform scale-150 md:scale-[2]">
               <div className="text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.6)]">
                  <Truck className="w-20 h-20 fill-zinc-900" />
               </div>
               {/* Headlight Beam */}
               <div className="absolute top-10 right-0 w-64 h-24 bg-gradient-to-r from-yellow-200/50 to-transparent transform rotate-12 blur-md"></div>
            </div>
         </div>
      </div>

      {/* Instruction Overlay */}
      <div className="absolute bottom-8 w-full text-center z-50 animate-pulse">
         <p className="text-zinc-500 text-xs font-mono uppercase tracking-[0.3em]">Returning to HQ...</p>
      </div>

      <style>{`
        @keyframes float-clouds {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100vw); }
        }
        @keyframes drive-trees {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
        @keyframes drive-road {
          0% { transform: translateX(0); }
          100% { transform: translateX(-200px); }
        }
        @keyframes bounce-truck {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes wind {
          0% { transform: translateX(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(-50px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default DrivingScene;
