import React from 'react';
import { ToastMessage } from '../types/editor';

interface ToastProps {
  toast: ToastMessage | null;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  if (!toast) return null;

  return (
    <div className="fixed top-20 right-6 z-50 animate-achievement pointer-events-none">
      <div className="mc-window-dark p-3.5 max-w-sm flex items-center gap-3 shadow-2xl border-2 border-[#FFAA00] bg-[#212121]">
        {/* Icon Slot */}
        <div className="w-10 h-10 bg-[#3a3a3a] border-2 border-[#555555] flex items-center justify-center text-xl shrink-0">
          {toast.icon || '🏆'}
        </div>

        {/* Text Details */}
        <div className="flex flex-col gap-1 overflow-hidden">
          <span className="font-pixel text-[10px] text-[#FFFF55] tracking-wider uppercase">
            Achievement Get!
          </span>
          <span className="font-pixel text-xs text-white truncate">
            {toast.title}
          </span>
          <span className="font-pixel text-[9px] text-amber-200/80 truncate">
            {toast.description}
          </span>
        </div>
      </div>
    </div>
  );
};
