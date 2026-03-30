import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DiplomaticCode, Language } from '../types';
import { TranslationType } from '../constants';
import { HUStickers } from './HUStickers';
import DIPLOMATIC_CODES_JSON from '../data.json';

const DIPLOMATIC_CODES = DIPLOMATIC_CODES_JSON as Record<string, DiplomaticCode>;

interface SearchTabProps {
  t: TranslationType;
  lang: Language;
  isDark: boolean;
  onResultFound: (code: string, result: DiplomaticCode) => void;
}

export const SearchTab: React.FC<SearchTabProps> = ({ t, lang, isDark, onResultFound }) => {
  const [searchCode, setSearchCode] = useState('');
  const [displayResult, setDisplayResult] = useState<DiplomaticCode | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isRejected, setIsRejected] = useState(false);

  const performSearch = useCallback((code: string) => {
    const found = DIPLOMATIC_CODES[code] || null;
    setDisplayResult(found);
    setIsSearching(false);

    if (found) {
      if (window.innerWidth < 768) {
        (document.activeElement as HTMLElement)?.blur();
      }
      onResultFound(code, found);
    }
  }, [onResultFound]);

  useEffect(() => {
    if (searchCode.length < 2) {
      setDisplayResult(null);
      setIsSearching(false);
      return;
    }

    if (searchCode.length === 3) {
      setIsSearching(false);
      performSearch(searchCode);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      performSearch(searchCode);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchCode, performSearch]);

  return (
    <motion.div
      key="search"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-12"
    >
      <div className="text-center space-y-3 pt-4">
        <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-[280px] mx-auto leading-relaxed">
          {t.hint}
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative group">
          <input
            type="number"
            inputMode="numeric"
            pattern="[1-9][0-9]*"
            value={searchCode}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              
              if (val.startsWith('0')) {
                setIsRejected(true);
                setTimeout(() => setIsRejected(false), 400);
                return;
              }

              if (val.length <= 3) {
                setSearchCode(val);
              }
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-text z-10"
            autoFocus
            onClick={() => {
              if (searchCode.length >= 2) {
                setSearchCode('');
              }
            }}
          />
          
          <div className="flex justify-center gap-3 sm:gap-4">
            <div className="w-16 h-20 sm:w-20 sm:h-24 flex items-center justify-center text-4xl sm:text-5xl font-plate font-bold rounded-2xl border-2 bg-white dark:bg-neutral-900 shadow-sm border-neutral-100 dark:border-neutral-800">
              0
            </div>

            <HUStickers />

            {[0, 1, 2].map((index) => {
              const digit = searchCode[index];
              const isOptional = index === 2;
              const isActive = searchCode.length === index && !(isOptional && (displayResult || isSearching));
              
              return (
                <motion.div
                  key={index}
                  animate={{
                    scale: isActive && !isRejected ? 1.05 : 1,
                    borderColor: isRejected && index === 0
                      ? '#ef4444'
                      : isActive 
                        ? (isDark ? '#ffffff' : '#171717') 
                        : (isDark ? '#262626' : '#f5f5f5'),
                    x: isRejected && index === 0 ? [0, -12, 12, -12, 12, 0] : 0,
                  }}
                  transition={{ x: { duration: 0.4 } }}
                  className={`
                    w-16 h-20 sm:w-20 sm:h-24 flex items-center justify-center text-4xl sm:text-5xl font-plate font-bold rounded-2xl border-2 transition-all
                    ${(isOptional && !digit)
                      ? 'bg-white dark:bg-neutral-900 border-dashed' 
                      : 'bg-white dark:bg-neutral-900 shadow-sm'
                    }
                    ${isActive ? 'shadow-xl ring-4 ring-neutral-900/10 dark:ring-white/10' : ''}
                    ${(isOptional && displayResult && !digit) ? 'opacity-70 scale-90 grayscale' : ''}
                  `}
                >
                  <AnimatePresence mode="wait">
                    {digit ? (
                      <motion.span
                        key="digit"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        {digit}
                      </motion.span>
                    ) : (
                      isOptional && !isActive && (
                        <motion.span
                          key="placeholder"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.2 }}
                          className="text-neutral-400 dark:text-neutral-600"
                        />
                      )
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {isSearching && (
              <motion.div 
                key={`progress-${searchCode}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute -bottom-8 left-12 right-12 h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden"
              >
                <motion.div 
                  className="h-full bg-neutral-900 dark:bg-white"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, ease: "linear" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {searchCode.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full"
          >
            {displayResult ? (
              <div className="bg-white dark:bg-neutral-900 p-10 rounded-3xl shadow-sm border border-neutral-100 dark:border-neutral-800 flex flex-col items-center text-center space-y-6">
                <span className="text-8xl" role="img" aria-label="Flag">
                  {displayResult.flag}
                </span>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-neutral-900 dark:text-white leading-tight">
                    {lang === 'de' ? displayResult.nameDe : displayResult.nameEn}
                  </h2>
                  <p className="text-sm font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.2em]">
                    {displayResult.type === 'country' ? t.country : t.organization}
                  </p>
                </div>
              </div>
            ) : (
              !isSearching && (
                <div className="p-12 text-center text-neutral-300 dark:text-neutral-700 italic text-lg">
                  {t.noResult}
                </div>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
