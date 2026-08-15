import React from 'react';
import { EditorMode } from '../types/editor';

interface ModeToggleProps {
  mode: EditorMode;
  onToggle: () => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onToggle }) => {
  const isCreative = mode === 'creative';

  return (
    <button
      onClick={onToggle}
      className={`px-4 py-2.5 rounded-none font-pixel text-xs tracking-wider flex items-center gap-2 cursor-pointer transition-transform active:scale-95 ${
        isCreative
          ? 'mc-enchanted-btn'
          : 'mc-button'
      }`}
      title={
        isCreative
          ? 'Switch to Survival Mode (Google Docs Style Linear Editor)'
          : 'Switch to Creative Mode (Notion Style Block Drag & Drop Editor)'
      }
    >
      <span className="text-sm">{isCreative ? '🧱' : '⚔️'}</span>
      <span>{isCreative ? 'CREATIVE' : 'SURVIVAL'}</span>
    </button>
  );
};
