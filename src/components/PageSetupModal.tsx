import React, { useState } from 'react';
import { PageSettings, PageSize, PageOrientation, PageColor, MarginOption } from '../types/editor';

interface PageSetupModalProps {
  isOpen: boolean;
  settings: PageSettings;
  onSave: (newSettings: PageSettings) => void;
  onClose: () => void;
}

export const PageSetupModal: React.FC<PageSetupModalProps> = ({
  isOpen,
  settings,
  onSave,
  onClose,
}) => {
  const [pageSize, setPageSize] = useState<PageSize>(settings.pageSize || 'a4');
  const [orientation, setOrientation] = useState<PageOrientation>(
    settings.orientation || 'portrait'
  );
  const [pageColor, setPageColor] = useState<PageColor>(settings.pageColor || 'white');
  const [margins, setMargins] = useState<MarginOption>(settings.margins || 'normal');

  if (!isOpen) return null;

  const handleApply = () => {
    onSave({
      ...settings,
      pageSize,
      orientation,
      pageColor,
      margins,
    });
    onClose();
  };

  const handleSetAsDefault = () => {
    const updated = {
      ...settings,
      pageSize,
      orientation,
      pageColor,
      margins,
    };
    localStorage.setItem('craftdocs_default_page_settings', JSON.stringify(updated));
    onSave(updated);
    onClose();
  };

  const pageColors: { id: PageColor; name: string; bg: string; border: string; desc: string }[] = [
    { id: 'white', name: 'White (Default)', bg: '#ffffff', border: '#d1d5db', desc: 'Clean standard white document' },
    { id: 'ivory', name: 'Ivory Warm', bg: '#faf8f5', border: '#e5e7eb', desc: 'Gentle warm cream' },
    { id: 'parchment', name: 'Parchment', bg: '#fdf6e3', border: '#8B6914', desc: 'Minecraft Book & Quill' },
    { id: 'obsidian', name: 'Obsidian Night', bg: '#121224', border: '#c042da', desc: 'Nether portal dark' },
    { id: 'void', name: 'Ender Void', bg: '#0b1120', border: '#0284c7', desc: 'Deep cosmic cyan' },
  ];

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm select-none">
      <div className="mc-window max-w-xl w-full p-6 text-black relative flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#555] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📄</span>
            <div>
              <h2 className="font-pixel text-sm uppercase tracking-wide text-gray-900 font-bold">
                Page Setup
              </h2>
              <p className="text-[11px] text-gray-600 font-sans">
                Configure document paper dimensions, orientation, margins & paper background.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black font-pixel text-base px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Orientation */}
        <div className="flex flex-col gap-2">
          <label className="font-pixel text-xs text-gray-800 uppercase font-bold">
            Orientation
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setOrientation('portrait')}
              className={`p-3 border-2 flex items-center gap-3 transition-all ${
                orientation === 'portrait'
                  ? 'bg-blue-50 border-blue-600 text-blue-900 shadow'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              <div className="w-6 h-8 bg-white border border-gray-400 rounded-sm shadow-inner flex items-center justify-center text-[10px]">
                📄
              </div>
              <div className="text-left">
                <div className="font-bold text-xs">Portrait (Default)</div>
                <div className="text-[10px] text-gray-500">Vertical orientation</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setOrientation('landscape')}
              className={`p-3 border-2 flex items-center gap-3 transition-all ${
                orientation === 'landscape'
                  ? 'bg-blue-50 border-blue-600 text-blue-900 shadow'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              <div className="w-8 h-6 bg-white border border-gray-400 rounded-sm shadow-inner flex items-center justify-center text-[10px]">
                📜
              </div>
              <div className="text-left">
                <div className="font-bold text-xs">Landscape</div>
                <div className="text-[10px] text-gray-500">Horizontal orientation</div>
              </div>
            </button>
          </div>
        </div>

        {/* Paper Size */}
        <div className="flex flex-col gap-2">
          <label className="font-pixel text-xs text-gray-800 uppercase font-bold">
            Paper Size
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'a4', name: 'A4 (210 × 297 mm)', badge: 'Default', desc: 'Standard international document' },
              { id: 'letter', name: 'Letter (8.5 × 11 in)', desc: 'Standard North American' },
              { id: 'legal', name: 'Legal (8.5 × 14 in)', desc: 'Extended length document' },
              { id: 'book', name: 'Book & Quill (Square)', desc: 'Minecraft square book view' },
              { id: 'pageless', name: 'Pageless (Infinite)', desc: 'Continuous canvas, no page edges' },
              { id: 'tabloid', name: 'Tabloid (11 × 17 in)', desc: 'Large poster / spreadsheet view' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPageSize(p.id as PageSize)}
                className={`p-2.5 border-2 text-left flex flex-col justify-center transition-all ${
                  pageSize === p.id
                    ? 'bg-blue-50 border-blue-600 text-blue-950 shadow-sm'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">{p.name}</span>
                  {p.badge && (
                    <span className="bg-green-600 text-white font-pixel text-[8px] px-1.5 py-0.5 rounded">
                      {p.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-gray-500 mt-0.5">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Margins */}
        <div className="flex flex-col gap-2">
          <label className="font-pixel text-xs text-gray-800 uppercase font-bold">
            Margins
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'normal', name: 'Normal', desc: '1.0 inch / 48px' },
              { id: 'narrow', name: 'Narrow', desc: '0.5 inch / 24px' },
              { id: 'wide', name: 'Wide', desc: '1.5 inch / 72px' },
              { id: 'compact', name: 'Compact', desc: 'Pixel mode' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMargins(m.id as MarginOption)}
                className={`p-2 border text-center transition-all ${
                  margins === m.id
                    ? 'bg-blue-50 border-blue-600 font-bold text-blue-900'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                <div className="text-xs font-medium">{m.name}</div>
                <div className="text-[9px] text-gray-500">{m.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Page Background Color */}
        <div className="flex flex-col gap-2">
          <label className="font-pixel text-xs text-gray-800 uppercase font-bold">
            Page Color
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {pageColors.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setPageColor(c.id)}
                className={`p-2.5 border-2 rounded flex items-center gap-2.5 transition-all text-left ${
                  pageColor === c.id
                    ? 'ring-2 ring-blue-600 border-blue-600'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: c.bg }}
              >
                <div
                  className="w-5 h-5 rounded-full border shadow-sm shrink-0"
                  style={{ backgroundColor: c.bg, borderColor: c.border }}
                />
                <div>
                  <div
                    className="text-xs font-bold"
                    style={{ color: c.id === 'obsidian' || c.id === 'void' ? '#ffffff' : '#111827' }}
                  >
                    {c.name}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between border-t-2 border-[#555] pt-4 mt-2">
          <button
            type="button"
            onClick={handleSetAsDefault}
            className="mc-button px-3 py-2 text-xs font-pixel text-gray-200 hover:text-white"
            title="Make these settings default for all new documents"
          >
            Set as default
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="mc-button px-3 py-2 text-xs font-pixel"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="mc-button-green px-4 py-2 text-xs font-pixel text-white font-bold"
            >
              OK (Apply)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
