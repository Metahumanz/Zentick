
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
  
  // Language State with Persistence
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('chronos_language');
    if (saved === Language.EN || saved === Language.ZH) {
      return saved as Language;
    }
    const browserLang = navigator.language.slice(0, 2);
    return browserLang === 'zh' ? Language.ZH : Language.EN;
  });

  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const settingsBtnRef = useRef<HTMLButtonElement>(null);
  
  const defaultParticleConfig: ParticleConfig = {
      density: 1.0,
      speed: 1.0,
      size: 1.0,
      connections: 120,
  };

  // Particle Config State with Persistence
  const [particleConfig, setParticleConfig] = useState<ParticleConfig>(() => {
    const saved = localStorage.getItem('chronos_particle_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultParticleConfig;
      }
    }
    return defaultParticleConfig;
  });

  // Appearance State with Persistence
  const [fontWeight, setFontWeight] = useState<number>(() => {
    const saved = localStorage.getItem('chronos_font_weight');
    return saved ? parseInt(saved) : 900;
  });

  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const isInactive = useInactivity(5000); 

  // Keep UI visible if settings/menu are open
  const isUiVisible = (!isInactive || isFlashing || isSettingsOpen);

  // Type assertion to allow dynamic key access for settings
  const t = translations[language] as any;

  // Persist Settings
  useEffect(() => {
    localStorage.setItem('chronos_font_weight', fontWeight.toString());
  }, [fontWeight]);

  useEffect(() => {
    localStorage.setItem('chronos_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('chronos_particle_config', JSON.stringify(particleConfig));
  }, [particleConfig]);

  // System Theme
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setIsDark(false);
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

  // Click Outside for Settings Menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSettingsOpen &&
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node) &&
        settingsBtnRef.current &&
        !settingsBtnRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    };

    if (isSettingsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSettingsOpen]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'f') toggleFullscreen();
      if (e.key === 'Escape') {
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
      setFontWeight(900);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === Language.EN ? Language.ZH : Language.EN);
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
                ref={settingsBtnRef}
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`w-10 h-10 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all cursor-pointer ${isSettingsOpen ? 'bg-white text-slate-900' : ''}`}
                title={t.settings}
             >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
             </button>

             {/* Language Toggle (Simple Switch) */}
             <button 
                onClick={toggleLanguage} 
                className="w-10 h-10 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all cursor-pointer text-xs font-black"
                title="Switch Language"
             >
                {language === Language.ZH ? 'EN' : '中'}
             </button>

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
            <div 
              ref={settingsRef}
              className="absolute top-24 right-10 w-72 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl z-50 pointer-events-auto settings-modal animate-scale-up text-slate-800 dark:text-white max-h-[80vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">{t.settings}</h3>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={resetParticleSettings}
                            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 hover:text-indigo-500 transition-colors cursor-pointer"
                            title={t.restoreDefault}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        </button>
                        <button onClick={() => setIsSettingsOpen(false)} className="text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer">✕</button>
                    </div>
                </div>

                {/* Typography Settings */}
                <div className="mb-6 border-b border-white/10 pb-4">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-indigo-500 mb-3">{t.typography}</h4>
                     <div className="mb-4">
                        <div className="flex justify-between text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">
                            <span>{t.fontWeight}</span>
                            <span>{fontWeight}</span>
                        </div>
                        <input 
                            type="range" min="100" max="900" step="100"
                            value={fontWeight}
                            onChange={(e) => setFontWeight(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
                        />
                   </div>
                </div>
                
                {/* Particle Settings */}
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-indigo-500 mb-3">{t.particles}</h4>
                  {[
                    { labelKey: 'density', key: 'density', min: 0.1, max: 3, step: 0.1 },
                    { labelKey: 'speed', key: 'speed', min: 0, max: 3, step: 0.1 },
                    { labelKey: 'size', key: 'size', min: 0.5, max: 3, step: 0.1 },
                    { labelKey: 'connections', key: 'connections', min: 0, max: 300, step: 10 },
                  ].map((item) => (
                    <div key={item.key} className="mb-4">
                          <div className="flex justify-between text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">
                              <span>{t[item.labelKey]}</span>
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
            </div>
        )}

        {/* Main Content Area */}
        <main className="flex-grow flex items-center justify-center pointer-events-auto p-4 w-full relative">
           <div className={`w-full flex justify-center ${activeTab === AppMode.CLOCK ? 'block' : 'hidden'}`}>
             <ClockView 
               isUiVisible={isUiVisible} 
               language={language}
               fontWeight={fontWeight}
             />
           </div>
           
           <div className={`w-full flex justify-center ${activeTab === AppMode.COUNTDOWN ? 'block' : 'hidden'}`}>
             <CountdownView 
               onAlarmStart={() => setIsFlashing(true)} 
               onAlarmStop={() => setIsFlashing(false)} 
               isUiVisible={isUiVisible}
               language={language}
               fontWeight={fontWeight}
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
