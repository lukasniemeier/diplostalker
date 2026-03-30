import React from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { RefreshCw, X } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { TranslationType } from '../constants';

interface ReloadPromptProps {
  t: TranslationType;
}

const containerVariants: Variants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const ReloadPrompt: React.FC<ReloadPromptProps> = ({ t }) => {
  const {
    offlineReady: [isOfflineReady, setOfflineReady],
    needRefresh: [needsUpdate, setNeedsUpdate],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl: string, registration: ServiceWorkerRegistration | undefined) {
      if (!registration) return;

      const checkUpdateInterval = 120 * 1000;
      
      setInterval(async () => {
        if (!navigator.onLine || registration.installing) return;

        try {
          const response = await fetch(swUrl, {
            cache: 'no-store',
            headers: {
              'cache': 'no-store',
              'cache-control': 'no-cache',
            },
          });

          if (response.status === 200) {
            await registration.update();
          }
        } catch (error) {
          console.error('PWA: Failed to check for update', error);
        }
      }, checkUpdateInterval);
    },
  });

  const handleDismiss = () => {
    setOfflineReady(false);
    setNeedsUpdate(false);
  };

  const isVisible = isOfflineReady || needsUpdate;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed bottom-24 left-0 right-0 max-w-md mx-auto px-6 z-50"
        >
          <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 p-4 rounded-2xl shadow-2xl flex items-center gap-4 transition-colors duration-300">
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 leading-tight">
                {isOfflineReady ? t.pwaReady : t.pwaUpdate}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {needsUpdate && (
                <button
                  type="button"
                  onClick={() => updateServiceWorker(true)}
                  className="p-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:scale-105 active:scale-95 transition-all shadow-sm"
                  aria-label={t.pwaReload}
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={handleDismiss}
                className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};