
import React, { useState, useEffect } from 'react';
import { User, Language } from '../types';
import { translations } from '../utils/translations';
import { Truck, Lock, User as UserIcon, ArrowRight, ShieldCheck, AlertTriangle, Facebook, Twitter, Share2, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../utils/sound';

interface AuthScreenProps {
  onLogin: (user: User) => void;
  lang: Language;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, lang }) => {
  const [step, setStep] = useState<'auth' | 'verify'>('auth');
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  // We don't use email anymore for login, but keep the name to satisfy older data structures if needed
  // const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  
  const t = translations[lang];

  // Reset sound engine on mount
  useEffect(() => {
    soundEngine.playScan();
  }, []);

  const saveUserToLocal = (newUser: {name: string, password?: string}) => {
    const users = JSON.parse(localStorage.getItem('sm_registered_users') || '[]');
    // Check if user exists by name
    if (!users.find((u: any) => u.name === newUser.name)) {
      users.push(newUser);
      localStorage.setItem('sm_registered_users', JSON.stringify(users));
    }
  };

  const checkUserCredentials = (nameInput: string, passInput: string) => {
    const users = JSON.parse(localStorage.getItem('sm_registered_users') || '[]');
    // Find user by name
    const user = users.find((u: any) => u.name === nameInput);
    
    if (user) {
       if (user.password === passInput) return user;
    }
    return null;
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !password) {
      setError(t.fillAllFields);
      soundEngine.playError();
      return;
    }

    if (isRegister) {
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('sm_registered_users') || '[]');
      if (users.find((u: any) => u.name === name)) {
        setError(t.userExists);
        soundEngine.playError();
        return;
      }

      // Successful Registration Logic
      soundEngine.playSuccess();
      setStep('verify'); // Go to verification simulation
    } else {
      // Login Logic
      const validUser = checkUserCredentials(name, password);
      
      if (validUser) {
        soundEngine.playSuccess();
        setStep('verify');
      } else {
        setError(t.invalidCredentials);
        soundEngine.playError();
      }
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    soundEngine.playClick();

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playSuccess();
    
    // Save new user if registration
    if (isRegister) {
      saveUserToLocal({ name, password });
    }

    const user: User = {
      name: name || 'User',
      isRegistered: true
    };
    onLogin(user);
  };

  const handleSocialLogin = (provider: string) => {
    soundEngine.playClick();
    setSocialLoading(provider);
    
    // Simulate real handshake steps
    setStatusMessage(lang === 'ar' ? `جاري الاتصال بـ ${provider}...` : `Connecting to ${provider}...`);
    
    setTimeout(() => {
      setStatusMessage(lang === 'ar' ? 'طلب صلاحيات الوصول...' : 'Requesting access permissions...');
      soundEngine.playScan();
    }, 1500);

    setTimeout(() => {
      setStatusMessage(lang === 'ar' ? 'جلب الاسم والصورة الشخصية...' : 'Importing Name & Profile Photo...');
    }, 3000);
    
    // Define realistic mock profiles for simulation
    const mockProfiles: Record<string, Partial<User>> = {
      Facebook: {
        name: 'Moustafa Trucker',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
      },
      Twitter: {
        name: 'Diesel Expert',
        photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'
      },
      Apple: {
        name: 'User 847291',
      }
    };

    setTimeout(() => {
      soundEngine.playSuccess();
      const profile = mockProfiles[provider] || { name: `${provider} User` };
      
      // Save this user to local storage too so it persists
      saveUserToLocal({ name: profile.name!, password: 'social-login' });

      const user: User = {
        name: profile.name!,
        photoUrl: profile.photoUrl,
        isRegistered: true
      };
      
      setStatusMessage(lang === 'ar' ? 'تم تسجيل الدخول بنجاح!' : 'Login Successful!');
      
      setTimeout(() => {
        onLogin(user);
        setSocialLoading(null);
        setStatusMessage('');
      }, 800);
      
    }, 4500);
  };

  return (
    <div className="min-h-full flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-zinc-100 overflow-hidden relative">
        
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 animate-pulse"></div>

        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-zinc-900 rounded-3xl flex items-center justify-center transform shadow-xl border-4 border-zinc-50 relative group">
               <div className="absolute inset-0 bg-red-600/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
               {step === 'verify' ? (
                 <ShieldCheck className="w-12 h-12 text-emerald-500 animate-pulse" />
               ) : (
                 <Truck className="w-12 h-12 text-red-600" />
               )}
            </div>
          </div>

          {step === 'auth' ? (
            <div className="animate-in fade-in slide-in-from-left-8 duration-500">
              <h2 className="text-3xl font-black text-center text-zinc-900 mb-2 tracking-tight">
                {isRegister ? t.register : t.login}
              </h2>
              <p className="text-center text-zinc-500 text-sm mb-6 font-medium">{t.loginPrompt}</p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-bold text-center mb-4 flex items-center justify-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div className="group">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">{t.name}</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-4 pl-12 bg-zinc-50 border-2 border-zinc-100 rounded-xl focus:border-red-500 focus:bg-white outline-none transition-all font-bold text-zinc-800"
                      placeholder={t.name}
                      required
                    />
                    <UserIcon className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-red-500 transition-colors" />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">{t.password}</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-4 pl-12 bg-zinc-50 border-2 border-zinc-100 rounded-xl focus:border-red-500 focus:bg-white outline-none transition-all font-bold text-zinc-800 tracking-widest"
                      placeholder="••••••••"
                      required
                    />
                    <Lock className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-red-500 transition-colors" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-zinc-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all shadow-lg shadow-zinc-900/20 mt-4 flex items-center justify-center gap-3 group"
                >
                  {isRegister ? t.register : t.login}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
              
              {/* Social Login Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-zinc-500 font-bold text-xs uppercase tracking-wider">{t.orContinueWith}</span>
                </div>
              </div>
              
              {/* Status Message Overlay for Social Login */}
              {socialLoading && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 flex flex-col items-center justify-center animate-in fade-in rounded-3xl">
                  <div className="relative mb-6">
                     <div className="w-20 h-20 border-4 border-zinc-200 border-t-red-600 rounded-full animate-spin"></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                       {statusMessage && statusMessage.includes('بنجاح') ? (
                          <CheckCircle2 className="w-8 h-8 text-green-500 animate-in zoom-in" />
                       ) : (
                          <Share2 className="w-8 h-8 text-zinc-400 animate-pulse" />
                       )}
                     </div>
                  </div>
                  <h3 className="font-bold text-zinc-800 text-lg mb-2">{socialLoading}</h3>
                  <p className="text-zinc-500 text-sm font-medium animate-pulse text-center px-6">{statusMessage}</p>
                  
                  {/* Simulate Data being fetched visual */}
                  {statusMessage && !statusMessage.includes('بنجاح') && (
                    <div className="mt-8 w-48 space-y-2 opacity-50">
                       <div className="h-2 bg-zinc-200 rounded animate-pulse w-full"></div>
                       <div className="h-2 bg-zinc-200 rounded animate-pulse w-3/4 mx-auto"></div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Social Buttons */}
              <div className="grid grid-cols-3 gap-2">
                 {/* Facebook */}
                 <button 
                    onClick={() => handleSocialLogin('Facebook')}
                    disabled={socialLoading !== null}
                    className="flex items-center justify-center p-3 border-2 border-zinc-100 rounded-xl hover:bg-zinc-50 transition-colors hover:border-blue-100 group"
                 >
                    <Facebook className="w-5 h-5 text-[#1877F2]" fill="#1877F2" />
                 </button>

                 {/* Twitter / X */}
                 <button 
                    onClick={() => handleSocialLogin('Twitter')}
                    disabled={socialLoading !== null}
                    className="flex items-center justify-center p-3 border-2 border-zinc-100 rounded-xl hover:bg-zinc-50 transition-colors hover:border-black group"
                 >
                    <Twitter className="w-5 h-5 text-black" fill="black" />
                 </button>
                 
                 {/* Apple / ISO */}
                 <button 
                    onClick={() => handleSocialLogin('Apple')}
                    disabled={socialLoading !== null}
                    className="flex items-center justify-center p-3 border-2 border-zinc-100 rounded-xl hover:bg-zinc-50 transition-colors hover:border-zinc-300 group"
                 >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                       <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.62 3.5-1.62.66 0 2.22.18 3.12 1.38-3.23 1.77-2.6 6.35.79 7.74-.69 2.05-1.69 4.14-2.49 4.73zM12.03 5.4c.05-.09.11-.18.18-.27 1.05-1.39 2.68-1.96 2.68-1.96s-.19 1.63-1.07 2.72c-1.14 1.34-2.91 1.4-2.91 1.4s-.09-1.34 1.12-1.89z"/>
                    </svg>
                 </button>
              </div>

              <div className="mt-8 text-center border-t border-zinc-100 pt-6">
                <button
                  onClick={() => { 
                     soundEngine.playClick(); 
                     setIsRegister(!isRegister); 
                     setError('');
                  }}
                  className="text-zinc-500 text-sm hover:text-red-600 font-bold transition-colors"
                >
                  {isRegister ? 'لديك حساب بالفعل؟ تسجيل دخول' : 'ليس لديك حساب؟ إنشاء حساب جديد'}
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
               <h2 className="text-2xl font-black text-center text-zinc-900 mb-2">{t.securityCheck}</h2>
               <p className="text-center text-zinc-500 text-sm mb-6">{t.codeSent}</p>

               {/* Security Warning Box */}
               <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-800 font-bold leading-relaxed">
                    {t.securityWarning}
                  </p>
               </div>

               <form onSubmit={handleVerifySubmit}>
                 <div className="flex justify-between gap-2 mb-8" dir="ltr">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-12 h-14 border-2 border-zinc-200 rounded-lg text-center text-2xl font-bold text-zinc-800 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all"
                      />
                    ))}
                 </div>

                 <button
                  type="submit"
                  className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-3"
                >
                  <ShieldCheck className="w-5 h-5" />
                  {t.verify}
                </button>
               </form>

               <div className="mt-6 text-center">
                 <button 
                   onClick={() => setStep('auth')}
                   className="text-zinc-400 text-xs font-bold hover:text-zinc-600"
                 >
                   العودة لتسجيل الدخول
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
