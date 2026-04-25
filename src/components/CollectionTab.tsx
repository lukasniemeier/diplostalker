import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, Trash2, Info } from 'lucide-react';
import { CollectionItem, Language } from '../types';
import { TranslationType } from '../constants';
import { AboutModal } from './AboutModal';
import { ConfirmModal } from './ConfirmModal';
import DIPLOMATIC_CODES_JSON from '../data.json';

const TOTAL_CODES = Object.keys(DIPLOMATIC_CODES_JSON).length;

interface CollectionTabProps {
  t: TranslationType;
  lang: Language;
  collection: CollectionItem[];
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
        <div className="absolute inset-y-0 right-0 w-8 bg-linear-to-l from-white dark:from-neutral-900 to-transparent pointer-events-none" />
      )}
    </div>
  );
};

export const CollectionTab: React.FC<CollectionTabProps> = ({ t, lang, collection, onClear }) => {
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
      key="collection"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="relative flex flex-col h-full min-h-0 overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-md z-20">
        <div className="flex items-center gap-6">
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-600">
                Collection
              </span>
              <span className="text-[10px] font-bold text-neutral-900 dark:text-neutral-100">
                {collection.length} / {TOTAL_CODES}
              </span>
            </div>
            <div className="h-1 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(collection.length / TOTAL_CODES) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full transition-colors duration-1000 ${
                  collection.length >= TOTAL_CODES 
                    ? "bg-linear-to-r from-amber-300 via-yellow-500 to-amber-300" 
                    : "bg-neutral-900 dark:bg-white"
                }`}
              />
              <motion.div
                key={collection.length}
                initial={{ opacity: 0 }}
                animate={collection.length > 0 ? { opacity: [0, 0.4, 0] } : { opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 bg-white pointer-events-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button 
              onClick={() => setIsAboutOpen(true)}
              className="text-neutral-300 dark:text-neutral-700 hover:text-neutral-900 dark:hover:text-white transition-colors p-2"
            >
              <Info className="w-5 h-5" />
            </button>
            {collection.length > 0 && (
              <button 
                onClick={() => setIsConfirmOpen(true)}
                className="text-neutral-300 dark:text-neutral-700 hover:text-red-500 transition-colors p-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pt-4 pb-24">
        <div className="space-y-6">

          {collection.length === 0 ? (
            <div className="text-center py-32 text-neutral-300 dark:text-neutral-800">
              <History className="w-16 h-16 mx-auto mb-6 opacity-10" />
              <p className="font-medium">{t.emptyCollection}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {collection.map((item) => (
                <div 
                  key={item.code}
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
                  <span className="flex flex-col items-end text-[10px] font-bold text-neutral-300 dark:text-neutral-700 whitespace-nowrap uppercase">
                    {item.firstSeen !== null && item.firstSeen !== item.lastSeen && (
                      <span className="text-neutral-400 dark:text-neutral-600 text-[9px] mb-0.5">
                        {t.firstSeen}: {formatTimeAgo(item.firstSeen)}
                      </span>
                    )}
                    <span>{item.firstSeen === item.lastSeen ? t.seen : t.lastSeen}: {formatTimeAgo(item.lastSeen ?? item.timestamp)}</span>

                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
