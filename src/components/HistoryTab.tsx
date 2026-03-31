import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, Trash2, Info } from 'lucide-react';
import { HistoryItem, Language } from '../types';
import { TranslationType } from '../constants';
import { AboutModal } from './AboutModal';
import { ConfirmModal } from './ConfirmModal';

interface HistoryTabProps {
  t: TranslationType;
  lang: Language;
  history: HistoryItem[];
  onClear: () => void;
}

const NameMarquee: React.FC<{ name: string }> = ({ name }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const [scrollDist, setScrollDist] = useState(0);

  useEffect(() => {
    if (containerRef.current && textRef.current) {
      // Calculate if the text is wider than its container
      const overflow = textRef.current.scrollWidth - containerRef.current.offsetWidth;
      setScrollDist(overflow > 0 ? overflow : 0);
    }
  }, [name]);

  return (
    <div ref={containerRef} className="overflow-hidden flex-1 relative">
      <motion.h3
        ref={textRef}
        className="font-bold whitespace-nowrap text-lg dark:text-white inline-block"
        animate={scrollDist > 0 ? { x: [0, -(scrollDist + 24), 0] } : { x: 0 }}
        transition={{
          duration: scrollDist > 0 ? (scrollDist + 24) * 0.06 : 0,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "linear",
          delay: 1
        }}
      >
        {name}
      </motion.h3>
      {scrollDist > 0 && (
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white dark:from-neutral-900 to-transparent pointer-events-none" />
      )}
    </div>
  );
};

export const HistoryTab: React.FC<HistoryTabProps> = ({ t, lang, history, onClear }) => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return t.justNow;
    if (minutes < 60) return `${minutes}${t.minutesAgo}`;
    if (hours < 24) return `${hours}${t.hoursAgo}`;
    return `${days}${t.daysAgo}`;
  };

  return (
    <motion.div
      key="history"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center pt-4">
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600">
          {history.length} {t.history}
        </span>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsAboutOpen(true)}
            className="text-neutral-300 dark:text-neutral-700 hover:text-neutral-900 dark:hover:text-white transition-colors p-2"
          >
            <Info className="w-5 h-5" />
          </button>
          {history.length > 0 && (
            <button 
              onClick={() => setIsConfirmOpen(true)}
              className="text-neutral-300 dark:text-neutral-700 hover:text-red-500 transition-colors p-2"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-32 text-neutral-300 dark:text-neutral-800">
          <History className="w-16 h-16 mx-auto mb-6 opacity-10" />
          <p className="font-medium">{t.emptyHistory}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div 
              key={item.timestamp}
              className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 flex items-center gap-5 shadow-sm"
            >
              <div className="w-14 h-14 bg-neutral-50 dark:bg-neutral-800 rounded-2xl flex items-center justify-center text-2xl font-plate font-black text-neutral-900 dark:text-white shrink-0">
                {item.code}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 overflow-hidden">
                  <span className="text-xl shrink-0">{item.result.flag}</span>
                  <NameMarquee name={lang === 'de' ? item.result.nameDe : item.result.nameEn} />
                </div>
                <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                  {item.result.type === 'mission' ? t.mission : t.organization}
                </p>
              </div>
              <span className="text-[10px] font-bold text-neutral-300 dark:text-neutral-700 whitespace-nowrap uppercase">
                {formatTimeAgo(item.timestamp)}
              </span>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isAboutOpen && (
          <AboutModal 
            t={t} 
            onClose={() => setIsAboutOpen(false)} 
          />
        )}
        {isConfirmOpen && (
          <ConfirmModal 
            t={t} 
            onConfirm={() => {
              onClear();
              setIsConfirmOpen(false);
            }}
            onCancel={() => setIsConfirmOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
