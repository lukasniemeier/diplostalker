import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { TranslationType } from '../constants';

interface AboutModalProps {
  t: TranslationType;
  onClose: () => void;
}

declare const __BUILD_TIME__: string;

const GithubIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const AboutModal: React.FC<AboutModalProps> = ({ t, onClose }) => {
  const buildTime = typeof __BUILD_TIME__ !== 'undefined' 
    ? new Date(__BUILD_TIME__).toLocaleString(undefined, {
        dateStyle: 'short', 
        timeStyle: 'short' 
      })
    : "unknown";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-950/40 backdrop-blur-md"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-xs bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-8 overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6 text-center">
          <div className="space-y-2 pt-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
              {t.builtOn}
            </p>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {buildTime}
            </p>
          </div>
          
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <a 
              href="https://github.com/lukasniemeier/diplostalker" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-[10px] text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors font-medium uppercase tracking-widest"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              GitHub Repository
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};