
import React, { useState } from 'react';
import { AppMode, TruckBrand, Language, User } from '../types';
import { Search, Code2, Github, Globe, ArrowRight, Download, Activity, Truck, Zap, Crown, Check, X, Smartphone, Share, Menu, Play, ScanLine, MonitorPlay, Star, Bluetooth, Settings2, ChevronDown, Info, Shield, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { translations } from '../utils/translations';
import { soundEngine } from '../utils/sound';
import PaymentModal from './PaymentModal';

interface HomeDashboardProps {
  onNavigate: (mode: AppMode) => void;
  onSearchRequest: (term: string) => void;
  selectedBrand?: TruckBrand;
  onSelectBrand: (brand: TruckBrand | undefined) => void;
  selectedModel: string;
  onSelectModel: (model: string) => void;
  lang: Language;
  user: User | null;
  onUpgrade?: () => void;
}

const brandLogos: Record<TruckBrand, string> = {
  Renault: 'https://cdn.simpleicons.org/renault/FFCC33',
  Volvo: 'https://cdn.simpleicons.org/volvo/14296C',
  Scania: 'https://cdn.simpleicons.org/scania/041E42',
  MAN: 'https://cdn.simpleicons.org/man/E40045',
  DAF: 'https://cdn.simpleicons.org/daf/005C94',
  Iveco: 'https://cdn.simpleicons.org/iveco/004899',
  Ford: 'https://cdn.simpleicons.org/ford/003399',
};

// Official & Documented Truck Models List
const truckModels: Record<TruckBrand, string[]> = {
  Renault: [
    // T-Series (Long Haul)
    'T High 520 Evolution', 'T High 480 Turbo Compound', 'T 480', 'T 460', 'T 440',
    'T E-Tech (Electric)',
    // K-Series (Heavy Construction)
    'K 520 Xtrem', 'K 480', 'K 440', 'K 380',
    // C-Series (Construction & Distribution)
    'C 520', 'C 480', 'C 460', 'C 380',
    // D-Series (Distribution)
    'D Wide', 'D 26', 'D 18', 'D 12',
    // Legacy (DXi / dCi - Common in Maintenance)
    'Magnum 520 DXi', 'Magnum 480 DXi', 'Magnum 460 DXi', 'Magnum 440',
    'Premium 460 DXi', 'Premium 450 DXi', 'Premium 440 DXi', 'Premium 380 DXi', 'Premium Lander',
    'Kerax 500 DXi', 'Kerax 450 DXi', 'Kerax 380 DXi', 'Kerax Classic',
    'Midlum 270 DXi', 'Midlum 220 DXi', 'Mascott'
  ],
  Volvo: [
    // FH Series (Long Haul)
    'FH16 780 Aero', 'FH16 750', 'FH16 650',
    'FH 540 I-Save', 'FH 500 I-Save', 'FH 460 I-Save', 'FH 420',
    'FH Aero', 'FH Electric',
    // FM Series (Regional/Distribution)
    'FM 500', 'FM 460', 'FM 420', 'FM 380', 'FM Electric',
    // FMX (Construction)
    'FMX 540', 'FMX 500', 'FMX 460', 'FMX 420', 'FMX 380',
    // Legacy
    'FH12 460 (Classic)', 'FH12 420 (Classic)', 'FM12', 'FM9',
    'FE 350', 'FE 320', 'FL 280', 'FL 250'
  ],
  Scania: [
    // S-Series (Long Haul Premium)
    'S770 V8', 'S730 V8', 'S660 V8', 'S650 V8', 'S590 V8', 'S580 V8',
    'S560 Super', 'S500 Super', 'S450',
    // R-Series (Long Haul)
    'R770 V8', 'R660 V8', 'R560 Super', 'R500 Super', 'R450', 'R410',
    // G-Series & P-Series
    'G500 XT', 'G440', 'G410',
    'P450 XT', 'P410', 'P360', 'P280',
    // Legacy (PGR Series)
    'R620 V8 (Old Gen)', 'R580 V8 (Old Gen)', 'R500 (Old Gen)', 'R420 (Old Gen)', 'R380'
  ],
  MAN: [
    // TGX (Long Haul - New Gen)
    'TGX 18.640 Individual Lion S', 'TGX 18.510', 'TGX 18.470', 'TGX 18.430',
    'TGX EfficientLine 3',
    // TGS (Construction/Distribution)
    'TGS 33.510', 'TGS 41.480', 'TGS 33.400', 'TGS 26.360',
    // TGM & TGL
    'TGM 18.290', 'TGM 15.290',
    'TGL 12.250', 'TGL 8.190',
    // Legacy (TGA)
    'TGA 41.480', 'TGA 33.400', 'TGA 18.480', 'TGA 18.430'
  ],
  DAF: [
    // New Generation
    'XG+ 530', 'XG+ 480',
    'XG 530', 'XG 480',
    'XF 480 (New Gen)', 'XF 450 (New Gen)',
    'XD 450', 'XD 410', 'XD 370',
    // XF Series (Euro 6 / Euro 5)
    'XF 530 Super Space Cab', 'XF 510', 'XF 480', 'XF 460', 'XF 105.510', 'XF 105.460',
    // CF Series
    'CF 480', 'CF 450', 'CF 410', 'CF 85.460', 'CF 85.410',
    // LF Series
    'LF 290', 'LF 260', 'LF 230'
  ],
  Iveco: [
    // S-Way (Long Haul)
    'S-Way 570', 'S-Way 530', 'S-Way 510', 'S-Way 490', 'S-Way 460',
    // T-Way (Heavy Construction)
    'T-Way 510', 'T-Way 450', 'T-Way 410',
    // X-Way (Construction/Road)
    'X-Way 480', 'X-Way 460',
    // Legacy
    'Stralis Hi-Way 560', 'Stralis Hi-Way 500', 'Stralis 480', 'Stralis 450', 'Stralis 420',
    'Trakker 450', 'Trakker 410', 'Trakker 380',
    'Eurocargo 180', 'Eurocargo 140'
  ],
  Ford: [
    // F-Line (New)
    'F-MAX Select', 'F-MAX 500', 'F-MAX L',
    // F-Line (Road/Construction)
    'F-Line 1845T', 'F-Line 4145', 'F-Line 3542',
    // Legacy Cargo
    'Cargo 1848T', 'Cargo 1842T', 'Cargo 1846T',
    'Cargo 4142', 'Cargo 3542', 'Cargo 2538', 'Cargo 3230'
  ],
};

const HomeDashboard: React.FC<HomeDashboardProps> = ({ 
  onNavigate, 
  onSearchRequest, 
  selectedBrand, 
  onSelectBrand,
  selectedModel,
  onSelectModel,
  lang,
  user,
  onUpgrade
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [planType, setPlanType] = useState<'monthly' | 'yearly'>('monthly');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showGuideToast, setShowGuideToast] = useState(false);

  const t = translations[lang];

  React.useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearchRequest(searchTerm);
    }
  };

  const handleCheckCode = () => {
    if (!selectedBrand) {
      soundEngine.playError();
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
      return;
    }
    soundEngine.playHover(); 
    onNavigate(AppMode.DECODER); 
  };

  const handleModelSelect = (model: string) => {
    soundEngine.playClick();
    onSelectModel(model);
    // DO NOT Navigate automatically
    // Show prompt instead
    setShowGuideToast(true);
    soundEngine.playSuccess();
    setTimeout(() => setShowGuideToast(false), 4000);
  };

  const openPrivacy = () => {
    window.dispatchEvent(new CustomEvent('open-privacy'));
  };

  const openTerms = () => {
    window.dispatchEvent(new CustomEvent('open-terms'));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 relative">
      
      {/* Custom Toast Notification: ERROR */}
      {showErrorToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl z-50 animate-in slide-in-from-top-4 fade-in flex items-center gap-3 border border-red-500">
           <div className="bg-white/20 p-1 rounded-full"><AlertTriangle className="w-4 h-4" /></div>
           <span className="font-bold text-sm">{t.selectBrandError}</span>
        </div>
      )}

      {/* Custom Toast Notification: GUIDE */}
      {showGuideToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-2xl z-50 animate-in slide-in-from-top-4 fade-in flex items-center gap-3 border border-green-500">
           <div className="bg-white/20 p-1 rounded-full"><CheckCircle2 className="w-4 h-4" /></div>
           <span className="font-bold text-sm">{t.clickCheckCode}</span>
        </div>
      )}
      
      {/* Hero Section - UPDATED BACKGROUND */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 h-64 md:h-72 group">
        {/* Background Image Scania */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=1600&auto=format&fit=crop" 
            alt="Scania Truck" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 p-8 h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
             <div>
               <div className="flex items-center gap-2 mb-3">
                 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white animate-pulse">ONLINE SYSTEM</span>
                 <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded border border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider">{t.connected}</span>
                 </div>
               </div>
               {/* APP NAME TITLE */}
               <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic">
                 SMART
                 <span className="text-red-600 block text-3xl md:text-4xl">MECHANIC</span>
               </h1>
             </div>
             
             {deferredPrompt && (
              <button 
                onClick={handleInstallClick}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-red-900/20"
              >
                <Download className="w-4 h-4" />
                {t.install}
              </button>
            )}
          </div>

          <form onSubmit={handleSearchSubmit} className="relative max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.quickSearch}
              className="w-full h-12 pl-12 pr-20 bg-white/10 border border-white/20 rounded-xl text-white placeholder-zinc-400 focus:border-red-500 focus:bg-black/40 outline-none transition-all backdrop-blur-md font-medium"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
            <button 
              type="submit"
              className="absolute right-1 top-1 bottom-1 bg-red-600 hover:bg-red-500 text-white px-4 rounded-lg text-xs font-bold transition-colors uppercase tracking-wider"
            >
              SEARCH
            </button>
          </form>
        </div>
      </div>

      {/* Brand & Model Selector */}
      <div className="space-y-4">
        <h3 className="font-bold text-white flex items-center gap-2 text-lg drop-shadow-md">
          <Truck className="w-5 h-5 text-red-600" />
          {t.selectBrand}
        </h3>
        
        {/* Brands Scroll */}
        <div className="flex gap-3 overflow-x-auto pb-4 pt-1 px-1 snap-x no-scrollbar">
          {(Object.keys(brandLogos) as TruckBrand[]).map((brand) => (
            <button
              key={brand}
              onClick={() => { 
                soundEngine.playClick();
                // Toggle Logic: If clicked same brand, deselect it (pass undefined)
                if (selectedBrand === brand) {
                  onSelectBrand(undefined);
                } else {
                  onSelectBrand(brand);
                }
              }}
              className={`flex-shrink-0 w-24 h-24 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all snap-start shadow-sm border-2 relative overflow-hidden group backdrop-blur-sm
                ${selectedBrand === brand 
                  ? 'bg-zinc-900/90 border-red-600 shadow-red-500/20 shadow-lg scale-105' 
                  : 'bg-white/90 border-zinc-100 hover:border-red-200 hover:shadow-md'}`}
            >
              <img 
                src={brandLogos[brand]} 
                alt={brand} 
                className={`w-10 h-10 object-contain transition-transform group-hover:scale-110 ${selectedBrand === brand ? 'brightness-100' : 'brightness-90 grayscale-[0.5]'}`}
              />
              <span className={`text-[10px] font-bold uppercase tracking-wider ${selectedBrand === brand ? 'text-white' : 'text-zinc-600'}`}>
                {brand}
              </span>
              
              {selectedBrand === brand && (
                <div className="absolute inset-0 border-4 border-red-600 rounded-2xl opacity-10 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>

        {/* Model Selector - Animated Reveal */}
        <div className={`transition-all duration-300 overflow-hidden ${selectedBrand ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-white/95 backdrop-blur-md border border-zinc-200 rounded-xl p-4 shadow-sm">
            <h4 className="text-xs font-bold text-zinc-500 uppercase mb-3 flex items-center gap-2">
              <Settings2 className="w-3 h-3" />
              {t.selectModel} {selectedBrand}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {selectedBrand && truckModels[selectedBrand]?.map((model) => (
                <button
                  key={model}
                  onClick={() => handleModelSelect(model)}
                  className={`px-3 py-2.5 rounded-lg text-xs font-bold border transition-all text-left truncate
                    ${selectedModel === model
                      ? 'bg-red-600 text-white border-red-600 shadow-md'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-red-300 hover:bg-red-50'}`}
                >
                  {model}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* CHECK CODE BUTTON (Static Modern Design) */}
        <button 
          onClick={handleCheckCode}
          className="bg-zinc-900/80 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-zinc-700 hover:border-red-500 hover:bg-zinc-900 hover:shadow-red-500/20 transition-all group flex flex-col items-start h-40 relative overflow-hidden col-span-1"
        >
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
             <Code2 className="w-24 h-24 text-red-500" />
          </div>
          
          <div className="w-12 h-12 bg-red-900/20 rounded-xl flex items-center justify-center text-red-500 mb-4 group-hover:scale-110 transition-transform shadow-sm border border-red-500/20">
             <Truck className="w-6 h-6" />
          </div>

          <div className="mt-auto">
             <h3 className="text-lg font-black text-white leading-none mb-1">{t.checkCode}</h3>
             <p className="text-[10px] text-zinc-400 font-bold group-hover:text-red-500 transition-colors">
               AI DIAGNOSTIC &rarr;
             </p>
          </div>
        </button>

        <button 
          onClick={() => { soundEngine.playHover(); onNavigate(AppMode.SENSORS); }}
          className="bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-zinc-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/10 transition-all group flex flex-col items-start h-40 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
            <Activity className="w-24 h-24" />
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform shadow-sm">
            <MonitorPlay className="w-6 h-6" />
          </div>
          <span className="font-black text-zinc-800 text-lg leading-none mt-auto">{t.sensors}</span>
          <span className="text-[10px] text-zinc-400 font-bold mt-1 group-hover:text-blue-500 transition-colors">GALLERY &rarr;</span>
        </button>

        <button 
          onClick={() => { soundEngine.playHover(); onNavigate(AppMode.CHAT); }}
          className="bg-gradient-to-br from-zinc-900/90 to-black/90 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-zinc-800 hover:border-zinc-600 transition-all group flex flex-col items-start h-32 col-span-2 relative overflow-hidden"
        >
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-30 transition-opacity">
            <Globe className="w-20 h-20 text-white animate-spin-slow" />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
               <Zap className="w-4 h-4 text-yellow-400" />
            </div>
            <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider">Beta Feature</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-auto">{t.assistant}</h3>
          <p className="text-zinc-400 text-xs mt-1">Chat with Gemini AI about your truck</p>
        </button>
      </div>

      {/* PRO Upgrade Card */}
      {!user?.isPro && (
        <div className="bg-gradient-to-r from-amber-200 to-yellow-400 p-1 rounded-3xl shadow-xl transform hover:scale-[1.02] transition-transform cursor-pointer" onClick={() => setShowPaymentModal(true)}>
          <div className="bg-white/90 backdrop-blur-sm rounded-[20px] p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4">
                <Crown className="w-12 h-12 text-amber-500/20 rotate-12" />
             </div>
             
             <div className="flex items-center gap-3 mb-3">
               <div className="bg-amber-100 p-2 rounded-lg">
                 <Crown className="w-6 h-6 text-amber-600 fill-amber-600" />
               </div>
               <div>
                 <h3 className="font-black text-lg text-zinc-900 leading-none">{t.proVersion}</h3>
                 <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider text-amber-600">{t.bestValue}</p>
               </div>
             </div>

             <ul className="space-y-2 mb-4">
               {[t.proFeature1, t.proFeature2, t.proFeature4].map((feat, i) => (
                 <li key={i} className="flex items-center gap-2 text-sm text-zinc-700 font-medium">
                   <Check className="w-4 h-4 text-green-500 shrink-0" />
                   {feat}
                 </li>
               ))}
             </ul>

             <button className="w-full bg-zinc-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg group">
                {t.upgradeToPro}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </div>
      )}
      
      {/* Quick Access Buttons for About & Privacy */}
      <div className="flex gap-4">
        <button 
          onClick={() => { soundEngine.playClick(); (document.querySelector('button[aria-label="Info"]') as HTMLElement)?.click(); }}
          className="flex-1 bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-2"
        >
          <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-600">
            <Info className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-zinc-700">{t.aboutApp}</span>
        </button>

        <button 
          onClick={() => { soundEngine.playClick(); openPrivacy(); }}
          className="flex-1 bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-2"
        >
          <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-600">
            <Shield className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-zinc-700">{t.privacyPolicy}</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-8 py-8 border-t border-white/10 bg-black/40 backdrop-blur-md rounded-t-3xl">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-500">
            <span className="font-black text-white text-xl">SM</span>
          </div>
          
          <div className="max-w-md mx-auto px-6">
             {/* Tech Giants Logos - Message removed */}
             <div className="flex justify-center gap-4 py-3 opacity-60 hover:opacity-100 transition-opacity">
                <img src="https://cdn.simpleicons.org/microsoft" alt="Microsoft" className="w-5 h-5 grayscale hover:grayscale-0 transition-all invert" />
                <img src="https://cdn.simpleicons.org/apple" alt="Apple" className="w-5 h-5 grayscale hover:grayscale-0 transition-all invert" />
                <img src="https://cdn.simpleicons.org/google" alt="Google" className="w-5 h-5 grayscale hover:grayscale-0 transition-all invert" />
                <img src="https://cdn.simpleicons.org/nvidia" alt="Nvidia" className="w-5 h-5 grayscale hover:grayscale-0 transition-all invert" />
                <img src="https://cdn.simpleicons.org/meta" alt="Meta" className="w-5 h-5 grayscale hover:grayscale-0 transition-all invert" />
             </div>

             <p className="text-xs text-zinc-400 font-bold tracking-widest mt-2">{t.greeting}</p>
          </div>

          <div className="flex gap-4 mt-2">
            <a href="#" className="p-2 bg-white rounded-full shadow-sm hover:text-red-600 transition-colors border border-zinc-100">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-white rounded-full shadow-sm hover:text-blue-600 transition-colors border border-zinc-100">
              <Globe className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-white rounded-full shadow-sm hover:text-green-600 transition-colors border border-zinc-100">
              <Share className="w-5 h-5" />
            </a>
          </div>
          
          <div className="text-[10px] text-zinc-400 max-w-xs leading-relaxed">
            &copy; 2024 Smart Mechanic v3.0.0<br/>
            All rights reserved.
          </div>
        </div>
      </footer>

      {showPaymentModal && (
        <PaymentModal 
          lang={lang}
          plan={planType}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            if (onUpgrade) onUpgrade();
          }}
        />
      )}
    </div>
  );
};

export default HomeDashboard;
