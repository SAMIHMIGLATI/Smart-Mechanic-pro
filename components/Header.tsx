
import React, { useState, useEffect } from 'react';
import { Truck, Globe, User, LogOut, Info, X, Crown, Code2, AlertOctagon, ArrowRight, ArrowLeft, Mic, MicOff, ChevronDown } from 'lucide-react';
import { TruckBrand, Language, User as UserType } from '../types';
import { translations } from '../utils/translations';
import { soundEngine } from '../utils/sound.ts';

interface HeaderProps {
  selectedBrand?: TruckBrand;
  selectedModel?: string;
  lang: Language;
  onLangChange: (lang: Language) => void;
  user: UserType | null;
  onLogout: () => void;
  onLoginClick: () => void;
  onLogoClick: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
  isListening?: boolean;
  onVoiceToggle?: () => void;
  voiceSupported?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  selectedBrand, 
  lang, 
  onLangChange, 
  user, 
  onLogout, 
  onLoginClick, 
  onLogoClick,
  showBackButton = false,
  onBack,
  isListening = false,
  onVoiceToggle,
  voiceSupported = false
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const t = translations[lang];

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowLangMenu(false);
      setShowUserMenu(false);
    };
    
    // Only add listener if a menu is open
    if (showLangMenu || showUserMenu) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showLangMenu, showUserMenu]);

  return (
    <>
      {/* Main Header Container */}
      <header className="relative z-50">
        <div className="bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 shadow-2xl transition-all duration-300">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              
              {/* Left Section: Back Button & Logo */}
              <div className="flex items-center gap-4">
                
                {/* Back Button */}
                {showBackButton && (
                  <button
                    onClick={(e) => { 
                      e.stopPropagation();
                      soundEngine.playClick(); 
                      if (onBack) onBack(); 
                    }}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white flex items-center justify-center border border-white/5 transition-all active:scale-95 animate-in slide-in-from-left-2 fade-in duration-300"
                    aria-label="Back"
                  >
                    {lang === 'ar' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                  </button>
                )}

                {/* Logo Area */}
                <div 
                  onClick={(e) => { 
                    e.stopPropagation();
                    soundEngine.playSuccess(); 
                    onLogoClick(); 
                  }}
                  className="flex items-center gap-3 cursor-pointer group select-none"
                >
                  <div className="relative w-11 h-11 bg-gradient-to-br from-red-600 to-black rounded-xl flex items-center justify-center shadow-lg shadow-red-900/20 border border-red-500/30 group-hover:border-red-500/60 transition-all duration-300 group-hover:scale-105">
                     <div className="absolute inset-0 bg-red-500/20 blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <Truck className="w-6 h-6 text-white relative z-10 drop-shadow-md" />
                  </div>

                  <div className="hidden xs:flex flex-col">
                    <h1 className="text-xl font-black tracking-tighter uppercase leading-none text-white group-hover:text-red-50 transition-colors">
                      SMART<span className="text-red-600">.</span>
                    </h1>
                    <div className="flex items-center gap-1.5">
                       <span className="text-[10px] text-zinc-400 font-bold tracking-[0.25em] uppercase group-hover:text-red-400 transition-colors">
                         MECHANIC
                       </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Section: Actions */}
              <div className="flex items-center gap-2 md:gap-3">
                
                {/* Voice Command Button */}
                {voiceSupported && (
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation();
                      if (onVoiceToggle) onVoiceToggle(); 
                    }}
                    className={`relative p-2.5 rounded-full transition-all duration-300 border active:scale-95
                      ${isListening 
                        ? 'bg-red-600/20 text-red-500 border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.3)]' 
                        : 'bg-white/5 text-zinc-400 hover:text-white border-white/5 hover:bg-white/10'}`}
                    aria-label="Voice Command"
                  >
                    {isListening ? (
                      <>
                        <Mic className="w-5 h-5 animate-pulse" />
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                      </>
                    ) : (
                      <MicOff className="w-5 h-5" />
                    )}
                  </button>
                )}

                {/* About Button (Desktop) */}
                <button 
                  onClick={(e) => { 
                    e.stopPropagation();
                    soundEngine.playClick(); 
                    setShowAboutModal(true); 
                  }}
                  className="hidden sm:flex p-2.5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-full transition-all border border-white/5 active:scale-95"
                >
                  <Info className="w-5 h-5" />
                </button>

                {/* Language Selector */}
                <div className="relative">
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation();
                      soundEngine.playClick(); 
                      setShowLangMenu(!showLangMenu); 
                      setShowUserMenu(false);
                    }}
                    className={`h-10 px-3 rounded-full flex items-center gap-2 transition-all border active:scale-95
                      ${showLangMenu 
                        ? 'bg-zinc-800 text-white border-zinc-700' 
                        : 'bg-white/5 text-zinc-400 hover:text-white border-white/5 hover:bg-white/10'}`}
                  >
                    <Globe className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">{lang}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showLangMenu ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showLangMenu && (
                    <div className="absolute top-full right-0 mt-2 w-36 bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200 origin-top-right">
                      <div className="p-1.5 space-y-0.5">
                        {['ar', 'en', 'fr'].map((l) => (
                          <button 
                            key={l}
                            onClick={() => { onLangChange(l as Language); setShowLangMenu(false); }}
                            className={`w-full text-right px-4 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-between
                              ${lang === l ? 'bg-red-600/10 text-red-500' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
                          >
                            <span>{l === 'ar' ? 'العربية' : l === 'en' ? 'English' : 'Français'}</span>
                            {lang === l && <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation();
                      soundEngine.playClick(); 
                      user ? setShowUserMenu(!showUserMenu) : onLoginClick(); 
                      setShowLangMenu(false);
                    }}
                    className="group relative"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 overflow-hidden
                      ${user 
                        ? (user.isPro ? 'border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'border-zinc-700 hover:border-zinc-500') 
                        : 'border-white/10 hover:border-white/30 bg-white/5'}`}
                    >
                      {user ? (
                        user.photoUrl ? (
                          <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-black text-xs text-white bg-zinc-800 w-full h-full flex items-center justify-center">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        )
                      ) : <User className="w-4 h-4 text-zinc-400" />}
                    </div>
                    
                    {user?.isPro && (
                      <div className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-400 to-amber-600 text-[8px] font-black text-black px-1.5 py-0.5 rounded-full shadow-lg border border-white/20 z-10 scale-90">
                        PRO
                      </div>
                    )}
                  </button>

                  {showUserMenu && user && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200 origin-top-right">
                      <div className="p-4 border-b border-white/5 bg-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-lg font-bold text-zinc-400 border border-white/5">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className="flex items-center gap-2">
                               <p className="text-sm font-bold text-white truncate">{user.name}</p>
                               {user.isPro && <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />}
                             </div>
                             {user.email && <p className="text-xs text-zinc-500 truncate">{user.email}</p>}
                          </div>
                        </div>
                      </div>
                      <div className="p-1.5">
                        <button 
                          onClick={() => { onLogout(); setShowUserMenu(false); }}
                          className="w-full text-right px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl text-sm flex items-center justify-end gap-2 font-bold transition-all"
                        >
                          {t.logout}
                          <LogOut className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* About Modal - Modernized */}
      {showAboutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowAboutModal(false)}></div>
          
          <div className="relative bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-3xl w-full max-w-md shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            
            {/* Modal Header */}
            <div className="p-6 pb-8 bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden rounded-t-3xl shrink-0">
               <button onClick={() => setShowAboutModal(false)} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors z-20">
                  <X className="w-5 h-5" />
               </button>
               
               <div className="flex flex-col items-center relative z-10">
                 <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-black rounded-3xl flex items-center justify-center shadow-2xl shadow-red-900/30 mb-4 border border-white/10 rotate-3 hover:rotate-0 transition-transform duration-500">
                    <Truck className="w-10 h-10 text-white drop-shadow-md" />
                 </div>
                 <h2 className="text-3xl font-black text-white tracking-tighter uppercase">SMART<span className="text-red-500">.</span> MECHANIC</h2>
                 <div className="flex items-center gap-2 mt-2">
                   <div className="px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded text-[10px] font-bold text-green-400 uppercase tracking-wide">Stable</div>
                   <p className="text-zinc-500 text-xs font-mono">v3.0.0 Ultimate</p>
                 </div>
               </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
              <div className="space-y-6">
                
                {/* Description Box - Only show if there is text */}
                {t.aboutAppDesc && (
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                    <h3 className="font-bold text-white mb-3 text-sm flex items-center gap-2">
                      <AlertOctagon className="w-4 h-4 text-amber-500" />
                      {t.aboutTitle}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">
                      {t.aboutAppDesc}
                    </p>
                  </div>
                )}

                {/* Developer Box */}
                <div className="relative group">
                   <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent rounded-2xl blur-lg group-hover:opacity-100 opacity-50 transition-opacity"></div>
                   <div className="relative bg-black/40 p-5 rounded-2xl border border-white/10">
                      <h3 className="font-bold text-zinc-300 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <Code2 className="w-4 h-4 text-red-500" />
                        Powered By
                      </h3>
                      
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center font-black text-white border border-zinc-700 shadow-lg">
                           SM
                         </div>
                         <div>
                            <h4 className="font-bold text-lg text-white">Smart Mechanic</h4>
                            <p className="text-xs text-zinc-500">{t.developerBio}</p>
                         </div>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={() => setShowAboutModal(false)}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-red-900/20 active:scale-[0.98] uppercase tracking-wider text-sm"
                >
                  {t.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
