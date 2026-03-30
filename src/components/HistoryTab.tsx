import React from 'react';
import { motion } from 'motion/react';
import { History, Trash2 } from 'lucide-react';
import { HistoryItem, Language } from '../types';
import { TranslationType } from '../constants';

interface HistoryTabProps {
  t: TranslationType;
  lang: Language;
  history: HistoryItem[];
  onClear: () => void;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ t, lang, history, onClear }) => {
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
        {history.length > 0 && (
          <button 
            onClick={onClear}
            className="text-neutral-300 dark:text-neutral-700 hover:text-red-500 transition-colors p-2"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
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
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xl">{item.result.flag}</span>
                  <h3 className="font-bold truncate text-lg dark:text-white">
                    {lang === 'de' ? item.result.nameDe : item.result.nameEn}
                  </h3>
                </div>
                <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                  {item.result.type === 'country' ? t.country : t.organization}
                </p>
              </div>
              <span className="text-[10px] font-bold text-neutral-300 dark:text-neutral-700 whitespace-nowrap uppercase">
                {formatTimeAgo(item.timestamp)}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
