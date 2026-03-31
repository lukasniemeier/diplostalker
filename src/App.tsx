import { useState } from 'react';
import { Search, History } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

import { Tab, Language } from './types';
import { translations } from './constants';
import { useTheme } from './hooks/useTheme';
import { useHistory } from './hooks/useHistory';
import { SearchTab } from './components/SearchTab';
import { HistoryTab } from './components/HistoryTab';
import { ReloadPrompt } from './components/ReloadPrompt';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('search');
  const [lang] = useState<Language>(() => {
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'de' ? 'de' : 'en';
  });

  const { isDark } = useTheme();
  const { history, addToHistory, clearHistory } = useHistory();

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans flex flex-col max-w-md mx-auto shadow-xl border-x border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 pt-4 pb-24">
        <AnimatePresence mode="wait">
          {activeTab === 'search' ? (
            <SearchTab 
              t={t} 
              lang={lang} 
              isDark={isDark} 
              onResultFound={addToHistory} 
            />
          ) : (
            <HistoryTab 
              t={t} 
              lang={lang} 
              history={history} 
              onClear={clearHistory} 
            />
          )}
        </AnimatePresence>
      </main>
      <ReloadPrompt t={t} />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg border-t border-neutral-100 dark:border-neutral-800 p-4 flex justify-around items-center z-50 transition-colors duration-300">
        <button
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'search' ? 'text-neutral-900 dark:text-white' : 'text-neutral-300 dark:text-neutral-700'}`}
        >
          <Search className={`w-6 h-6 ${activeTab === 'search' ? 'fill-neutral-900/10 dark:fill-white/10' : ''}`} />
          <span className="text-[10px] font-bold uppercase tracking-widest">{t.search}</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'history' ? 'text-neutral-900 dark:text-white' : 'text-neutral-300 dark:text-neutral-700'}`}
        >
          <History className={`w-6 h-6 ${activeTab === 'history' ? 'fill-neutral-900/10 dark:fill-white/10' : ''}`} />
          <span className="text-[10px] font-bold uppercase tracking-widest">{t.history}</span>
        </button>
      </nav>
    </div>
  );
}
