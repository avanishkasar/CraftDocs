import React, { useState } from 'react';

interface SpecialCharactersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertChar: (char: string) => void;
}

export const SpecialCharactersModal: React.FC<SpecialCharactersModalProps> = ({
  isOpen,
  onClose,
  onInsertChar,
}) => {
  const [activeTab, setActiveTab] = useState<'minecraft' | 'symbols' | 'arrows' | 'math'>('minecraft');

  if (!isOpen) return null;

  const charCategories = {
    minecraft: [
      '⚔️', '🛡️', '💎', '⛏️', '🏹', '📜', '🧱', '🧪', '🔮', '🌟', 
      '💀', '🍖', '🪙', '🎒', '📦', '🪨', '🪵', '🔥', '💧', '⚡', 
      '🟩', '🟦', '🟨', '🟧', '🟥', '🟪', '⬛', '⬜', '🧟', '🕷️',
      '🐷', '🐮', '🐑', '🐔', '🐎', '🐺', '🦊', '🐈', '🐝', '🎣'
    ],
    symbols: [
      '★', '☆', '✦', '✧', '♠', '♣', '♥', '♦', '✓', '✗',
      '©', '®', '™', '§', '¶', '•', '‣', '⁃', '▪', '▫',
      '◆', '◇', '○', '●', '◎', '◈', '✉', '✂', '✎', '⌛'
    ],
    arrows: [
      '←', '↑', '→', '↓', '↔', '↕', '↖', '↗', '↘', '↙',
      '⇐', '⇑', '⇒', '⇓', '⇔', '⇕', '➔', '➜', '➤', '➥',
      '↩', '↪', '🔄', '🔁', '🔼', '🔽', '◀', '▶', '▲', '▼'
    ],
    math: [
      '±', '×', '÷', '≠', '≈', '≤', '≥', '∞', '∑', '∏',
      '√', '∂', '∫', '∆', 'π', 'µ', '°', '‰', '¼', '½',
      '¾', '¹', '²', '³', '⁰', 'ⁿ', '∈', '∉', '⊂', '⊃'
    ],
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs select-none">
      <div className="mc-window max-w-lg w-full p-5 text-black relative flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#555] pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <h2 className="font-pixel text-xs uppercase tracking-wide text-gray-900 font-bold">
              Insert Special Characters
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black font-pixel text-sm px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 border-b border-gray-300 pb-1">
          {[
            { id: 'minecraft', label: 'Minecraft' },
            { id: 'symbols', label: 'Symbols' },
            { id: 'arrows', label: 'Arrows' },
            { id: 'math', label: 'Math' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1 text-xs font-pixel rounded-t transition-all ${
                activeTab === tab.id
                  ? 'bg-white border-t-2 border-x-2 border-blue-600 text-blue-900 font-bold -mb-1'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5 p-2 bg-white border border-gray-300 rounded max-h-56 overflow-y-auto">
          {charCategories[activeTab].map((char, index) => (
            <button
              key={index}
              onClick={() => {
                onInsertChar(char);
                onClose();
              }}
              className="w-9 h-9 flex items-center justify-center text-lg hover:bg-blue-100 hover:border-blue-500 border border-transparent rounded transition-all cursor-pointer select-none"
              title={`Insert ${char}`}
            >
              {char}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center border-t-2 border-[#555] pt-3 mt-1">
          <span className="text-[11px] text-gray-500 font-sans">
            Click any glyph or symbol to insert at cursor position.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="mc-button px-4 py-1.5 text-xs font-pixel"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
