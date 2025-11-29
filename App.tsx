
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import CodeInput from './components/CodeInput';
import DiagnosisResultCard from './components/DiagnosisResult';
import ChatAssistant from './components/ChatAssistant';
import HomeDashboard from './components/HomeDashboard';
import SensorGuide from './components/SensorGuide';
import MaintenanceLog from './components/MaintenanceLog';
import AuthScreen from './components/AuthScreen';
import SplashScreen from './components/SplashScreen';
import CookieConsent from './components/CookieConsent';
import { LegalModals } from './components/LegalModals';
import { AppMode, DiagnosisResult, FaultCodeData, TruckBrand, Language, User } from './types';
import { analyzeFaultCode } from './services/geminiService';
import { Home, Search, FileText, Wrench, MessageSquareText } from 'lucide-react';
import { translations } from './utils/translations';
import { useVoiceNavigation } from './hooks/useVoiceNavigation';

export const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  const [selectedBrand, setSelectedBrand] = useState<TruckBrand | undefined>(undefined);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  
  const [lang, setLang] = useState<Language>('ar');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('sm_lang');
      if (savedLang && (savedLang === 'ar' || savedLang === 'en' || savedLang === 'fr')) {
        setLang(savedLang as Language);
      } else {
        setLang('ar');
      }

      const savedUser = localStorage.getItem('sm_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error("Error loading initial state:", e);
      setLang('ar');
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const handleLangChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('sm_lang', newLang);
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('sm_user', JSON.stringify(newUser));
    setMode(AppMode.HOME);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('sm_user');
    setMode(AppMode.AUTH);
  };

  const handleUpgradeToPro = () => {
    if (!user) return;
    const upgradedUser = { ...user, isPro: true };
    setUser(upgradedUser);
    localStorage.setItem('sm_user', JSON.stringify(upgradedUser));
    alert('Congratulations! You are now a PRO member.');
  };

  const handleBrandSelect = (brand: TruckBrand | undefined) => {
    setSelectedBrand(brand);
    setSelectedModel('');
  };

  const handleFaultSearch = async (data: FaultCodeData) => {
    setIsLoading(true);
    setDiagnosis(null);
    try {
      const brandToUse = selectedBrand || 'Renault';
      const result = await analyzeFaultCode(data, brandToUse, selectedModel, lang);
      setDiagnosis(result);
    } catch (error) {
      console.error(error);
      alert("Error analyzing code");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleImageDiagnosis = (result: DiagnosisResult) => {
    setDiagnosis(result);
  };

  // Handle Reset with 3s Delay
  const handleReset = useCallback(() => {
    // Diagnosis disappears after 3 seconds
    setTimeout(() => {
      setDiagnosis(null);
    }, 3000);
  }, []);

  const handleGlobalSearch = useCallback((term: string) => {
    if (!term || typeof term !== 'string') return;
    
    const isNumber = /\d/.test(term);
    
    if (isNumber) {
      if (term.toUpperCase().includes('PID') || term.toUpperCase().includes('SID')) {
         setGlobalSearchTerm(term);
         setMode(AppMode.SENSORS);
         return;
      }
      setMode(AppMode.DECODER);
    } else {
      setGlobalSearchTerm(term);
      setMode(AppMode.SENSORS);
    }
  }, []);

  const { isListening, toggleListening, isSupported } = useVoiceNavigation({
    lang,
    setMode,
    onSearch: handleGlobalSearch
  });

  const renderContent = () => {
    switch (mode) {
      case AppMode.AUTH:
        return <AuthScreen onLogin={handleLogin} lang={lang} />;
      case AppMode.HOME:
        return (
          <HomeDashboard 
            onNavigate={setMode} 
            onSearchRequest={handleGlobalSearch} 
            selectedBrand={selectedBrand}
            onSelectBrand={handleBrandSelect}
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
            lang={lang}
            user={user}
            onUpgrade={handleUpgradeToPro}
          />
        );
      case AppMode.DECODER:
        return (
          <div className="pb-4">
            <CodeInput 
              onSearch={handleFaultSearch} 
              isLoading={isLoading} 
              setIsLoading={setIsLoading}
              selectedBrand={selectedBrand || 'Renault'} 
              selectedModel={selectedModel}
              lang={lang}
              onImageAnalysis={handleImageDiagnosis}
              onReset={handleReset}
            />
            <DiagnosisResultCard result={diagnosis} />
          </div>
        );
      case AppMode.SENSORS:
        return <SensorGuide initialSearch={globalSearchTerm} />;
      case AppMode.MAINTENANCE:
        return <MaintenanceLog user={user} lang={lang} />;
      case AppMode.CHAT:
        return <div className="h-full"><ChatAssistant selectedBrand={selectedBrand || 'Renault'} selectedModel={selectedModel} lang={lang} /></div>;
      default:
        return (
          <HomeDashboard 
            onNavigate={setMode} 
            onSearchRequest={handleGlobalSearch}
            selectedBrand={selectedBrand}
            onSelectBrand={handleBrandSelect}
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
            lang={lang}
            user={user}
            onUpgrade={handleUpgradeToPro}
          />
        );
    }
  };

  const t = translations[lang] || translations['ar'];

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans relative selection:bg-red-500 selection:text-white" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1598555845577-d336940d9082?q=80&w=1920&auto=format&fit=crop" 
          alt="Scania Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent"></div>
      </div>

      <div className="sticky top-0 z-30 flex flex-col">
        <Header 
          selectedBrand={selectedBrand} 
          selectedModel={selectedModel} 
          lang={lang} 
          onLangChange={handleLangChange}
          user={user}
          onLogout={handleLogout}
          onLoginClick={() => setMode(AppMode.AUTH)}
          onLogoClick={() => {}}
          showBackButton={mode !== AppMode.HOME && mode !== AppMode.AUTH}
          onBack={() => setMode(AppMode.HOME)}
          isListening={isListening}
          onVoiceToggle={toggleListening}
          voiceSupported={isSupported}
        />
        
        {mode !== AppMode.AUTH && mode !== AppMode.HOME && (
          <div className="bg-black/40 backdrop-blur-md border-b border-white/10 shadow-sm overflow-x-auto no-scrollbar">
            <div className="flex justify-around items-center px-2 max-w-xl mx-auto min-w-max md:min-w-0 md:w-full">
              <NavButton 
                active={mode === AppMode.HOME} 
                onClick={() => setMode(AppMode.HOME)} 
                icon={<Home size={20} />} 
                label={t.home} 
              />
              <NavButton 
                active={mode === AppMode.DECODER} 
                onClick={() => setMode(AppMode.DECODER)} 
                icon={<Search size={20} />} 
                label={t.diagnostics} 
              />
              <NavButton 
                active={mode === AppMode.SENSORS} 
                onClick={() => {
                  setGlobalSearchTerm('');
                  setMode(AppMode.SENSORS);
                }} 
                icon={<FileText size={20} />} 
                label={t.sensors} 
              />
              <NavButton 
                active={mode === AppMode.MAINTENANCE} 
                onClick={() => setMode(AppMode.MAINTENANCE)} 
                icon={<Wrench size={20} />} 
                label={t.maintenance} 
              />
              <NavButton 
                active={mode === AppMode.CHAT} 
                onClick={() => setMode(AppMode.CHAT)} 
                icon={<MessageSquareText size={20} />} 
                label={t.assistant} 
              />
            </div>
          </div>
        )}
      </div>

      <main className="flex-1 container mx-auto px-4 py-6 max-w-xl relative z-10">
        {renderContent()}
      </main>

      <CookieConsent lang={lang} />
      <LegalModals lang={lang} />
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 py-3 px-3 md:px-6 transition-all relative group
      ${active ? 'text-red-500' : 'text-zinc-400 hover:text-zinc-300'}`}
  >
    <div className={`p-1 rounded-lg transition-all duration-300 ${active ? 'bg-red-500/10 -translate-y-1' : 'bg-transparent'}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-bold truncate transition-colors ${active ? 'text-red-500' : 'text-zinc-500'}`}>{label}</span>
    {active && (
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-red-600 rounded-full shadow-[0_0_8px_rgba(220,38,38,0.5)]"></div>
    )}
  </button>
);
