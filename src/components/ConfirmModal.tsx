import React from 'react';
import { motion } from 'motion/react';
import { TranslationType } from '../constants';

interface ConfirmModalProps {
  t: TranslationType;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ t, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="absolute inset-0 bg-neutral-950/40 backdrop-blur-md"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-xs bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-8 text-center overflow-hidden"
      >
        <div className="space-y-3">
          <button
            onClick={onConfirm}
            className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-red-500/20 active:scale-[0.98]"
          >
            {t.clearHistory}
          </button>
          <button
            onClick={onCancel}
            className="w-full py-4 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 rounded-2xl font-bold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all active:scale-[0.98]"
          >
            {t.cancel}
          </button>
        </div>
      </motion.div>
    </div>
  );
};