import React, { useState, useEffect, useRef } from 'react';
import ParticleBackground from './components/ParticleBackground';
import ClockView from './components/ClockView';
import CountdownView from './components/CountdownView';
import { AppMode, Language, ParticleConfig } from './types';
import { useFullscreen } from './hooks/useFullscreen';
import { useInactivity } from './hooks/useInactivity';
import { translations } from './utils/translations';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppMode>(AppMode.CLOCK);
  const [isDark, setIsDark] = useState(true);
  const [isFlashing, setIsFlashing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const defaultParticleConfig: ParticleConfig = {
      density: 1.0,
      speed: 1.0,
      size: 1.0,
      connections: 120,
  };
  const [particleConfig, setParticleConfig] = useState<ParticleConfig>(defaultParticleConfig);

  const langMenuRef = useRef<HTMLDivElement>(null);

  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const isInactive = useInactivity(5000); 

  // Keep UI visible if settings/menu are open
  const isUiVisible = (!isInactive || isFlashing || isLangMenuOpen || isSettingsOpen);

  const t = translations[language];

  // System Theme & Language
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setIsDark(false);
    }
    const browserLang = navigator.language.slice(0, 2);
    const supportedLangs = Object.values(Language) as string[];
    if (supportedLangs.includes(browserLang)) {
        setLanguage(browserLang as Language);
    }
  }, []);

  // Theme Class Toggle
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Click Outside for Language Menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    if (isLangMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLangMenuOpen]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'f') toggleFullscreen();
      if (e.key === 'Escape') {
          setIsLangMenuOpen(false);
          setIsSettingsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFullscreen]);

  // Notifications
  useEffect(() => {
    if (isFullscreen) showNotification(t.enterZen);
  }, [isFullscreen, language]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('select') || target.closest('a') || target.closest('.settings-modal')) {
        return;
    }
    toggleFullscreen();
    if (isFullscreen) showNotification(t.exitZen);
  };

  const resetParticleSettings = () => {
      setParticleConfig(defaultParticleConfig);
  };

  const languageLabels: Record<Language, string> = {
      [Language.EN]: 'English',
      [Language.ZH]: '中文',
      [Language.DE]: 'Deutsch',
      [Language.ES]: 'Español',
      [Language.FR]: 'Français',
      [Language.JA]: '日本語',
  };

  return (
    <div 
      className={`relative w-full h-screen overflow-hidden transition-colors duration-500 ease-in-out font-sans select-none
        ${isDark ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'}
      `}
      onDoubleClick={handleDoubleTap}
    >
      <div className={`absolute inset-0 pointer-events-none z-40 bg-red-500/20 mix-blend-overlay transition-opacity duration-100 ${isFlashing ? 'opacity-100 animate-pulse' : 'opacity-0'}`} />

      <div className="absolute inset-0 z-0">
        <ParticleBackground 
            isDark={isDark} 
            isAlarming={isFlashing}
            config={particleConfig}
            onDoubleClick={() => {}} 
        />
      </div>

      <div className="relative z-10 flex flex-col h-full pointer-events-none">
        
        {/* Header */}
        <header 
          className={`flex justify-between items-center p-6 md:p-10 pointer-events-auto transition-all duration-1000 transform ${isUiVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}
        >
          {/* Tabs */}
          <nav className="flex bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-full p-1 border border-white/20 shadow-lg cursor-pointer">
            <button
              onClick={() => setActiveTab(AppMode.CLOCK)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer ${
                activeTab === AppMode.CLOCK 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {t.clock}
            </button>
            <button
              onClick={() => setActiveTab(AppMode.COUNTDOWN)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer ${
                activeTab === AppMode.COUNTDOWN 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {t.timer}
            </button>
          </nav>

          <div className="flex gap-4 items-center relative">
             
             {/* Settings Toggle */}
             <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`w-10 h-10 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all cursor-pointer ${isSettingsOpen ? 'bg-white text-slate-900' : ''}`}
                title="Particle Settings"
             >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
             </button>

             {/* Language Toggle (Globe) */}
             <div className="relative" ref={langMenuRef}>
                <button 
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} 
                  className="w-10 h-10 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                >
                    <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
                
                {isLangMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-40 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-slide-down z-50 pointer-events-auto">
                        {Object.values(Language).map((lang) => (
                            <button
                                key={lang}
                                onClick={() => {
                                    setLanguage(lang);
                                    setIsLangMenuOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${language === lang ? 'bg-indigo-500 text-white' : 'hover:bg-black/5 dark:hover:bg-white/5 text-slate-800 dark:text-slate-200'}`}
                            >
                                {languageLabels[lang]}
                            </button>
                        ))}
                    </div>
                )}
             </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="w-10 h-10 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/20 hover:scale-110 transition-transform active:rotate-90 cursor-pointer"
              aria-label="Toggle Theme"
            >
              {isDark ? (
                <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
          </div>
        </header>

        {/* Settings Modal */}
        {isSettingsOpen && (
            <div className="absolute top-24 right-10 w-72 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl z-50 pointer-events-auto settings-modal animate-scale-up text-slate-800 dark:text-white">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">Particles</h3>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={resetParticleSettings}
                            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 hover:text-indigo-500 transition-colors cursor-pointer"
                            title="Restore Default"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        </button>
                        <button onClick={() => setIsSettingsOpen(false)} className="text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer">✕</button>
                    </div>
                </div>
                
                {[
                  { label: 'Density', key: 'density', min: 0.1, max: 3, step: 0.1 },
                  { label: 'Speed', key: 'speed', min: 0, max: 3, step: 0.1 },
                  { label: 'Size', key: 'size', min: 0.5, max: 3, step: 0.1 },
                  { label: 'Connections', key: 'connections', min: 0, max: 300, step: 10 },
                ].map((item) => (
                   <div key={item.key} className="mb-4">
                        <div className="flex justify-between text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">
                            <span>{item.label}</span>
                            <span>
                                {item.key === 'connections' 
                                 ? `${particleConfig[item.key as keyof ParticleConfig]}px` 
                                 : `${Math.round(particleConfig[item.key as keyof ParticleConfig] * 100)}%`}
                            </span>
                        </div>
                        <input 
                            type="range" min={item.min} max={item.max} step={item.step}
                            value={particleConfig[item.key as keyof ParticleConfig]}
                            onChange={(e) => setParticleConfig({...particleConfig, [item.key]: parseFloat(e.target.value)})}
                            className="w-full h-1.5 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
                        />
                   </div>
                ))}
            </div>
        )}

        {/* Main Content Area */}
        <main className="flex-grow flex items-center justify-center pointer-events-auto p-4 w-full relative">
           <div className={`w-full flex justify-center ${activeTab === AppMode.CLOCK ? 'block' : 'hidden'}`}>
             <ClockView 
               isUiVisible={isUiVisible} 
               language={language}
             />
           </div>
           
           <div className={`w-full flex justify-center ${activeTab === AppMode.COUNTDOWN ? 'block' : 'hidden'}`}>
             <CountdownView 
               onAlarmStart={() => setIsFlashing(true)} 
               onAlarmStop={() => setIsFlashing(false)} 
               isUiVisible={isUiVisible}
               language={language}
             />
           </div>
        </main>
        
        {/* GitHub Link */}
        <a 
            href="https://github.com/Metahumanz/timecount2.0" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`fixed bottom-6 left-6 z-50 pointer-events-auto p-3 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 text-slate-600 dark:text-slate-300 shadow-lg hover:scale-110 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-1000 ${isUiVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
            aria-label="View Source on GitHub"
        >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
        </a>

        {/* Footer Hint */}
        <footer className={`p-6 text-center text-xs font-mono tracking-widest pointer-events-none transition-opacity duration-1000 ${isUiVisible ? 'opacity-40' : 'opacity-0'}`}>
          {t.zenModeHint}
        </footer>
      </div>

      {/* Toast Notification */}
      <div 
        className={`fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-slate-900/80 dark:bg-white/90 text-white dark:text-slate-900 backdrop-blur-lg rounded-2xl shadow-2xl z-50 transition-all duration-500 transform ${notification ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}
      >
        <span className="text-sm font-semibold flex items-center gap-2">
          {notification}
        </span>
      </div>
    </div>
  );
};

export default App;