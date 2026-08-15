import React, { useEffect, useRef } from 'react';
import { SlashMenuItem, BlockType } from '../types/editor';

interface SlashMenuProps {
  isOpen: boolean;
  items: SlashMenuItem[];
  selectedIndex: number;
  query: string;
  onSelect: (type: BlockType) => void;
  onClose: () => void;
  position?: { top: number; left: number };
}

export const SlashMenu: React.FC<SlashMenuProps> = ({
  isOpen,
  items,
  selectedIndex,
  onSelect,
  onClose,
  position,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      style={{
        top: position ? `${position.top}px` : 'auto',
        left: position ? `${position.left}px` : 'auto',
      }}
      className="fixed z-50 mc-window-dark p-2 w-72 max-h-80 overflow-y-auto shadow-2xl font-pixel text-xs border-2 border-[#555]"
    >
      <div className="px-2 py-1 text-[9px] text-[#FFFF55] border-b border-[#3f3f5a] mb-1">
        CRAFT BLOCK TYPE
      </div>

      {items.length === 0 ? (
        <div className="p-3 text-amber-300 text-[10px]">No crafting recipes found.</div>
      ) : (
        <div className="flex flex-col gap-0.5">
          {items.map((item, index) => {
            const isSelected = index === selectedIndex;
            return (
              <button
                key={item.type}
                onClick={() => onSelect(item.type)}
                className={`w-full text-left px-2.5 py-2 flex items-center gap-2.5 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#3a5fcd] text-white border-l-2 border-[#FFFF55]'
                    : 'text-amber-100 hover:bg-[#2a2a40]'
                }`}
              >
                <span className="text-base shrink-0">{item.icon}</span>
                <div className="flex flex-col flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="font-pixel text-[10px] truncate">{item.label}</span>
                    <span className="text-[8px] text-amber-300/80 uppercase">/{item.shortcut}</span>
                  </div>
                  <span className="text-[8px] text-gray-300/70 truncate">{item.description}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
