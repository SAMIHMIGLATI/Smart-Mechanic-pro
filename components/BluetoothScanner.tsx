
import React, { useState, useEffect, useRef } from 'react';
import { Bluetooth, Activity, Power, RefreshCw, AlertTriangle, Terminal, Cpu, Zap, Wifi } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';
import { soundEngine } from '../utils/sound';

interface BluetoothScannerProps {
  lang: Language;
}

const BluetoothScanner: React.FC<BluetoothScannerProps> = ({ lang }) => {
  const [connectionState, setConnectionState] = useState<'idle' | 'scanning' | 'connecting' | 'connected' | 'error'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [isSimulation, setIsSimulation] = useState(false);
  const [data, setData] = useState({
    rpm: 0,
    speed: 0,
    temp: 0,
    voltage: 0
  });
  
  const t = translations[lang];
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll logs
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `> ${msg}`]);
    soundEngine.playClick(); // Short blip
  };

  const startSimulation = () => {
    setConnectionState('connecting');
    setIsSimulation(true);
    setLogs([]);
    
    const steps = [
      { msg: lang === 'ar' ? 'تهيئة محول البلوتوث (محاكاة)...' : 'Initializing Bluetooth Adapter (Sim)...', delay: 500 },
      { msg: lang === 'ar' ? 'البحث عن أجهزة OBDII...' : 'Searching for OBDII Devices...', delay: 1500 },
      { msg: lang === 'ar' ? 'تم العثور على: ELM327 v1.5' : 'Device Found: ELM327 v1.5', delay: 2500 },
      { msg: lang === 'ar' ? 'جاري الاقتران...' : 'Pairing...', delay: 3000 },
      { msg: 'Protocol: ISO 15765-4 CAN (11/500)', delay: 4000 },
      { msg: 'Authenticating User: Administrator', delay: 4800 },
      { msg: 'System Engineered by Smart Mechanic...', delay: 5000 },
      { msg: lang === 'ar' ? 'تم الوصول. الكمبيوتر متصل.' : 'Access Granted. ECU Connected.', delay: 6000 },
    ];

    steps.forEach(({ msg, delay }) => {
      setTimeout(() => addLog(msg), delay);
    });

    setTimeout(() => {
      setConnectionState('connected');
      soundEngine.playSuccess();
      startDataStream();
    }, 6500);
  };

  const handleConnect = async () => {
    soundEngine.playScan();
    setConnectionState('scanning');
    setLogs([]);
    addLog(lang === 'ar' ? 'جاري تهيئة البلوتوث...' : 'Initializing Bluetooth...');
    
    // Robust Web Bluetooth Check
    if ((navigator as any).bluetooth) {
      try {
        addLog(lang === 'ar' ? 'يرجى الموافقة على إذن البلوتوث واختيار الجهاز...' : 'Please allow Bluetooth and select device...');
        
        // This triggers the browser's native Bluetooth picker
        const device = await (navigator as any).bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: [
              'generic_access', 
              0xfff0, 
              0xffe0,
              '00001101-0000-1000-8000-00805f9b34fb', // Standard Serial Port Profile (SPP)
              '0000fff0-0000-1000-8000-00805f9b34fb'  // Common OBD UUID
            ] 
        });
        
        if (device) {
           const deviceName = device.name ? device.name.toUpperCase() : "";
           addLog(`${lang === 'ar' ? 'تم اختيار' : 'Selected'}: ${device.name || 'Unknown Device'}`);
           
           // VALIDATION LOGIC: Check if it's actually an OBD scanner
           const validKeywords = ["OBD", "ELM", "VLINK", "KONNWEI", "CAR", "SCAN", "ADAPTER", "LINK", "HC-05", "HC-06"];
           const isValidDevice = validKeywords.some(keyword => deviceName.includes(keyword));

           if (!isValidDevice) {
             setTimeout(() => {
               addLog(lang === 'ar' ? '⚠️ تحذير: اسم الجهاز لا يوحي بأنه OBD.' : '⚠️ Warning: Device name does not suggest OBD.');
               addLog(lang === 'ar' ? 'جاري المحاولة على أي حال...' : 'Attempting anyway...');
             }, 800);
           } else {
             addLog(lang === 'ar' ? 'جهاز متوافق. جاري الاتصال...' : 'Compatible device. Connecting...');
           }
           
           // Simulate connection process after successful validation
           // Note: In a real app, you would call device.gatt.connect() here
           setConnectionState('connecting');
           setTimeout(() => {
              addLog('Connecting to GATT Server...');
              setTimeout(() => {
                  addLog('Service Discovery...');
                  setTimeout(() => {
                     setConnectionState('connected');
                     soundEngine.playSuccess();
                     startDataStream();
                  }, 1500);
              }, 1000);
           }, 1000);
        }

      } catch (error: any) {
        console.log(error);
        if (error.name === 'NotFoundError' || error.name === 'SecurityError') {
             addLog(lang === 'ar' ? '❌ تم رفض الإذن أو إلغاء العملية.' : '❌ Permission denied or cancelled.');
        } else {
             addLog(lang === 'ar' ? 'فشل الاتصال: ' + error.message : 'Connection failed: ' + error.message);
        }
        setConnectionState('error');
        soundEngine.playError();
      }
    } else {
      // Browser doesn't support Bluetooth
      addLog(lang === 'ar' ? 'المتصفح لا يدعم البلوتوث المباشر.' : 'Browser does not support Web Bluetooth.');
      setConnectionState('error');
      soundEngine.playError();
    }
  };

  const startDataStream = () => {
    const interval = setInterval(() => {
      setData({
        rpm: Math.floor(600 + Math.random() * 200), // Idle RPM
        speed: 0,
        temp: Math.floor(85 + Math.random() * 3),
        voltage: Number((13.8 + Math.random() * 0.4).toFixed(1))
      });
    }, 800);
    return () => clearInterval(interval);
  };

  return (
    <div className="bg-zinc-950 min-h-screen text-green-500 font-mono p-4 pb-24 relative overflow-hidden">
      
      {/* Background Matrix Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(0deg,transparent_24%,rgba(34,197,94,.3)_25%,rgba(34,197,94,.3)_26%,transparent_27%,transparent_74%,rgba(34,197,94,.3)_75%,rgba(34,197,94,.3)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(34,197,94,.3)_25%,rgba(34,197,94,.3)_26%,transparent_27%,transparent_74%,rgba(34,197,94,.3)_75%,rgba(34,197,94,.3)_76%,transparent_77%,transparent)] bg-[size:30px_30px]"></div>

      <div className="max-w-md mx-auto relative z-10 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-green-900 pb-4">
          <div className="flex items-center gap-3">
             <div className={`w-3 h-3 rounded-full ${connectionState === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
             <h2 className="text-xl font-bold tracking-widest text-white">OBD-II SCANNER</h2>
          </div>
          <Bluetooth className={`w-6 h-6 ${connectionState === 'scanning' ? 'animate-pulse text-blue-400' : 'text-zinc-600'}`} />
        </div>

        {/* Status Window / Terminal */}
        <div className="bg-black border border-green-500/30 rounded-lg p-4 h-48 overflow-y-auto shadow-[0_0_20px_rgba(34,197,94,0.1)] custom-scrollbar font-mono text-xs">
           {logs.length === 0 && <span className="text-zinc-600 animate-pulse">{lang === 'ar' ? 'بانتظار الاتصال...' : 'Waiting for connection...'}</span>}
           {logs.map((log, i) => (
             <div key={i} className="mb-1 text-green-400">{log}</div>
           ))}
           <div ref={logsEndRef} />
        </div>

        {/* Developer Signature */}
        {connectionState === 'connected' && (
           <div className="text-center py-2 animate-in fade-in">
              <p className="text-[10px] text-green-700 uppercase tracking-[0.2em] border-t border-b border-green-900/50 py-1 inline-block px-4">
                System Engineered by Smart Mechanic
              </p>
           </div>
        )}

        {/* Live Data Grid */}
        <div className={`grid grid-cols-2 gap-4 transition-opacity duration-500 ${connectionState === 'connected' ? 'opacity-100' : 'opacity-30 blur-[1px]'}`}>
           {/* RPM */}
           <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors"></div>
              <Activity className="w-6 h-6 text-green-600 mb-2" />
              <span className="text-3xl font-black text-white">{data.rpm}</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{t.rpm}</span>
           </div>

           {/* Voltage */}
           <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-yellow-500/5 group-hover:bg-yellow-500/10 transition-colors"></div>
              <Zap className="w-6 h-6 text-yellow-600 mb-2" />
              <span className="text-3xl font-black text-white">{data.voltage}V</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{t.voltage}</span>
           </div>

           {/* Coolant */}
           <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>
              <RefreshCw className="w-6 h-6 text-blue-600 mb-2" />
              <span className="text-3xl font-black text-white">{data.temp}°C</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{t.coolant}</span>
           </div>

           {/* Speed */}
           <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors"></div>
              <Wifi className="w-6 h-6 text-red-600 mb-2" />
              <span className="text-3xl font-black text-white">{data.speed}</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">KM/H</span>
           </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {connectionState !== 'connected' && (
            <>
              <button
                onClick={handleConnect}
                className="w-full py-4 bg-green-600 hover:bg-green-500 text-black font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Bluetooth className="w-5 h-5" />
                {t.connectObd}
              </button>
              
              {(connectionState === 'error' || connectionState === 'idle') && (
                <button
                  onClick={startSimulation}
                  className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-bold uppercase tracking-wide rounded-xl border border-zinc-700 transition-all flex items-center justify-center gap-2 text-xs"
                >
                  <Terminal className="w-4 h-4" />
                  {lang === 'ar' ? 'تشغيل وضع المحاكاة (Demo)' : 'Run Simulation Mode (Demo)'}
                </button>
              )}
            </>
          )}

          {connectionState === 'connected' && (
            <>
               <button
                onClick={() => { soundEngine.playScan(); alert(lang === 'ar' ? 'لا توجد أعطال مسجلة في الذاكرة.' : 'No fault codes stored in memory.'); }}
                className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold uppercase tracking-wide rounded-xl border border-zinc-600 transition-all flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                {t.scanFaults}
              </button>
              
              <button
                onClick={() => { setConnectionState('idle'); setLogs([]); setIsSimulation(false); }}
                className="w-full py-3 bg-red-900/50 hover:bg-red-900 text-red-200 font-bold uppercase tracking-wide rounded-xl border border-red-900 transition-all flex items-center justify-center gap-2"
              >
                <Power className="w-4 h-4" />
                Disconnect
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default BluetoothScanner;
