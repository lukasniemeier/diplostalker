import React from 'react';

export const HUStickers: React.FC = () => {
  return (
    <div className="flex flex-col justify-center gap-1.5 sm:gap-2 px-0.5 sm:px-1">
      {/* HU Sticker (Top) */}
      <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-blue-500/90 dark:bg-blue-600/90 border border-blue-600/50 dark:border-blue-700/50 shadow-inner flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.2)_100%)]" />
        <span className="text-[6px] sm:text-[8px] font-black text-white/60 select-none">
          {new Date().getFullYear().toString().slice(-2)}
        </span>
      </div>
      {/* State Seal (Bottom) */}
      <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-neutral-200/90 dark:bg-neutral-800/90 border border-neutral-300/50 dark:border-neutral-700/50 shadow-inner flex items-center justify-center relative overflow-hidden text-neutral-400/50 dark:text-neutral-600/50">
        <svg viewBox="0 0 24 24" className="w-3 h-3 sm:w-4 sm:h-4 fill-current">
          <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" />
        </svg>
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.1)_100%)]" />
      </div>
    </div>
  );
};
