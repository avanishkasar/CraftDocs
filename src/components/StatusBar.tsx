import React from 'react';
import { EditorMode } from '../types/editor';

interface StatusBarProps {
  wordCount: number;
  mode: EditorMode;
  saveStatusText: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  wordCount,
  mode,
  saveStatusText,
}) => {
  // Calculate XP percentage (0 to 100% based on 1000 word target)
  const xpPercentage = Math.min(100, Math.round((wordCount / 1000) * 100));

  return (
    <footer className="mc-stone-bg w-full h-11 px-4 flex items-center justify-between border-t-2 border-[#1a1a1a] select-none z-30 shrink-0">
      {/* Left: XP Bar & Word Count */}
      <div className="flex items-center gap-3 max-w-md w-full">
        {/* XP Level Badge */}
        <div className="bg-[#111111] border border-[#555] px-2 py-0.5 text-[#55FF55] font-pixel text-xs text-shadow shrink-0">
          LVL {Math.floor(wordCount / 100)}
        </div>

        {/* Green XP Bar Track */}
        <div className="mc-xp-track flex-1 h-3.5 relative overflow-hidden flex items-center">
          <div
            className="mc-xp-fill h-full transition-all duration-300"
            style={{ width: `${xpPercentage}%` }}
          />
        </div>

        {/* Word Count Text */}
        <div className="font-pixel text-[10px] text-amber-200 shrink-0 whitespace-nowrap">
          {wordCount} WORDS
        </div>
      </div>

      {/* Right: Save Status, Mode, Creeper Icon */}
      <div className="flex items-center gap-4 text-[10px] font-pixel text-amber-100/90 shrink-0">
        <span className="hidden sm:inline text-amber-300">{saveStatusText}</span>
        
        <div className="hidden md:flex items-center gap-1.5 bg-[#1e1e1e] px-2 py-1 border border-[#444]">
          <span>{mode === 'creative' ? '🧱 CREATIVE' : '⚔️ SURVIVAL'}</span>
        </div>

        <span className="text-base animate-bounce" title="Creeper watching your code">
          🟩
        </span>
      </div>
    </footer>
  );
};
