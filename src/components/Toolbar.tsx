import React, { useState } from 'react';
import { EditorMode, PageSettings, UiDensity } from '../types/editor';
import { Sparkles, Maximize2, Zap, LayoutGrid, Eye, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Indent, Outdent, Link, Image, Trash2, Printer, Undo, Redo, Bold, Italic, Underline, Strikethrough, Palette, Highlighter } from 'lucide-react';

interface ToolbarProps {
  mode: EditorMode;
  onToggleMode: () => void;
  onFormat: (command: string, value?: string) => void;
  activeFormats?: Record<string, boolean>;
  pageSettings?: PageSettings;
  onOpenPageSetup?: () => void;
  onOpenFindReplace?: () => void;
  onOpenSpecialCharacters?: () => void;
  onSidebarToggle?: () => void;
  isSidebarOpen?: boolean;
  uiDensity: UiDensity;
  onChangeUiDensity: (density: UiDensity) => void;
}

const MINECRAFT_COLORS = [
  { name: 'Obsidian Black', color: '#1a1a1a' },
  { name: 'Redstone Red', color: '#dc2626' },
  { name: 'Gold Bar', color: '#d97706' },
  { name: 'Emerald Green', color: '#16a34a' },
  { name: 'Diamond Blue', color: '#0284c7' },
  { name: 'Lapis Blue', color: '#2563eb' },
  { name: 'Nether Purple', color: '#9333ea' },
  { name: 'Charcoal Gray', color: '#4b5563' },
];

const HIGHLIGHT_COLORS = [
  { name: 'Glowstone Yellow', color: '#fef08a', icon: '🟡' },
  { name: 'Emerald Aura', color: '#bbf7d0', icon: '🟢' },
  { name: 'Diamond Shimmer', color: '#bae6fd', icon: '🔷' },
  { name: 'Pink Petal', color: '#fbcfe8', icon: '🌸' },
  { name: 'Torch Orange', color: '#fed7aa', icon: '🟠' },
  { name: 'None (Clear)', color: 'transparent', icon: '🚫' },
];

export const Toolbar: React.FC<ToolbarProps> = ({
  mode,
  onToggleMode,
  onFormat,
  activeFormats = {},
  pageSettings,
  onOpenPageSetup,
  onOpenFindReplace,
  onOpenSpecialCharacters,
  uiDensity,
  onChangeUiDensity,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [fontSize, setFontSize] = useState(pageSettings?.fontSize || 11);
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif');

  const handleFontSizeChange = (delta: number) => {
    const nextSize = Math.max(8, Math.min(72, fontSize + delta));
    setFontSize(nextSize);
    onFormat('fontSize', nextSize.toString());
  };

  const handleFontFamilySelect = (family: string) => {
    setFontFamily(family);
    onFormat('fontName', family);
  };

  // If in Zen mode, toolbar is hidden (or shown as a floating pill)
  if (uiDensity === 'zen') {
    return null;
  }

  const isCompact = uiDensity === 'compact';

  return (
    <header className={`mc-stone-bg w-full ${isCompact ? 'py-1 px-2 min-h-[34px]' : 'py-1.5 px-3 min-h-[44px]'} flex items-center justify-between shadow-sm relative z-30 select-none font-sans text-xs border-b border-[#111] overflow-x-auto custom-scrollbar no-print gap-1`}>
      {/* Main Single-Row Toolstrip */}
      <div className="flex items-center gap-1 shrink-0 flex-nowrap">
        {/* History Group */}
        <div className="flex items-center bg-[#252525]/70 p-0.5 border border-[#444]/80 gap-0.5">
          <button
            onClick={() => onFormat('undo')}
            className={`mc-button ${isCompact ? 'w-6 h-6 p-0' : 'w-7 h-7 p-1'} flex items-center justify-center cursor-pointer`}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-3.5 h-3.5 text-gray-200" />
          </button>
          <button
            onClick={() => onFormat('redo')}
            className={`mc-button ${isCompact ? 'w-6 h-6 p-0' : 'w-7 h-7 p-1'} flex items-center justify-center cursor-pointer`}
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-3.5 h-3.5 text-gray-200" />
          </button>
          <button
            onClick={() => window.print()}
            className={`mc-button ${isCompact ? 'w-6 h-6 p-0' : 'w-7 h-7 p-1'} flex items-center justify-center cursor-pointer`}
            title="Print (Ctrl+P)"
          >
            <Printer className="w-3.5 h-3.5 text-gray-200" />
          </button>
        </div>

        {/* Zoom, Style, Font Dropdowns */}
        <div className="flex items-center bg-[#252525]/70 p-0.5 border border-[#444]/80 gap-1">
          {/* Zoom */}
          <select
            value={pageSettings?.zoomLevel || 100}
            onChange={(e) => onFormat('zoom', e.target.value)}
            className="bg-[#2d2d2d] border border-[#555] text-gray-200 text-[11px] px-1 py-0.5 h-6 rounded-none focus:outline-none focus:border-[#FFD700] cursor-pointer"
            title="Zoom Level"
          >
            <option value="75">75%</option>
            <option value="90">90%</option>
            <option value="100">100%</option>
            <option value="125">125%</option>
            <option value="150">150%</option>
          </select>

          {/* Paragraph Style */}
          <select
            onChange={(e) => onFormat('formatBlock', e.target.value)}
            className="bg-[#2d2d2d] border border-[#555] text-gray-200 text-[11px] px-1 py-0.5 h-6 rounded-none focus:outline-none focus:border-[#FFD700] max-w-[95px] cursor-pointer"
            title="Paragraph Style"
            defaultValue="<p>"
          >
            <option value="<p>">Normal</option>
            <option value="<h1>">Heading 1</option>
            <option value="<h2>">Heading 2</option>
            <option value="<h3>">Heading 3</option>
            <option value="<blockquote>">Quote</option>
            <option value="<pre>">Code</option>
          </select>

          {/* Font Family */}
          <select
            value={fontFamily}
            onChange={(e) => handleFontFamilySelect(e.target.value)}
            className="bg-[#2d2d2d] border border-[#555] text-gray-200 text-[11px] px-1 py-0.5 h-6 rounded-none focus:outline-none focus:border-[#FFD700] max-w-[85px] cursor-pointer"
            title="Font Family"
          >
            <option value="Arial, sans-serif">Arial</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="'Courier Prime', monospace">Courier</option>
            <option value="'Press Start 2P', monospace">Minecraft</option>
            <option value="'Times New Roman', serif">Times</option>
          </select>

          {/* Font Size Stepper */}
          <div className="flex items-center bg-[#2d2d2d] border border-[#555] h-6 px-0.5">
            <button
              onClick={() => handleFontSizeChange(-1)}
              className="w-3.5 h-full flex items-center justify-center text-gray-300 hover:text-white font-bold cursor-pointer text-xs"
              title="Decrease Font Size"
            >
              -
            </button>
            <span className="w-4 text-center text-[10px] text-amber-200 font-pixel">
              {fontSize}
            </span>
            <button
              onClick={() => handleFontSizeChange(1)}
              className="w-3.5 h-full flex items-center justify-center text-gray-300 hover:text-white font-bold cursor-pointer text-xs"
              title="Increase Font Size"
            >
              +
            </button>
          </div>
        </div>

        {/* Text Style (B, I, U, S) */}
        <div className="flex items-center bg-[#252525]/70 p-0.5 border border-[#444]/80 gap-0.5">
          <button
            onClick={() => onFormat('bold')}
            className={`mc-button ${isCompact ? 'w-6 h-6 p-0' : 'w-7 h-7 p-1'} flex items-center justify-center cursor-pointer ${
              activeFormats?.['bold'] ? 'border-yellow-400 bg-[#444]' : ''
            }`}
            title="Bold (Ctrl+B)"
          >
            <span className="font-bold text-xs">B</span>
          </button>
          <button
            onClick={() => onFormat('italic')}
            className={`mc-button ${isCompact ? 'w-6 h-6 p-0' : 'w-7 h-7 p-1'} flex items-center justify-center cursor-pointer ${
              activeFormats?.['italic'] ? 'border-yellow-400 bg-[#444]' : ''
            }`}
            title="Italic (Ctrl+I)"
          >
            <span className="italic text-xs">I</span>
          </button>
          <button
            onClick={() => onFormat('underline')}
            className={`mc-button ${isCompact ? 'w-6 h-6 p-0' : 'w-7 h-7 p-1'} flex items-center justify-center cursor-pointer ${
              activeFormats?.['underline'] ? 'border-yellow-400 bg-[#444]' : ''
            }`}
            title="Underline (Ctrl+U)"
          >
            <span className="underline text-xs">U</span>
          </button>
          <button
            onClick={() => onFormat('strikeThrough')}
            className={`mc-button ${isCompact ? 'w-6 h-6 p-0' : 'w-7 h-7 p-1'} flex items-center justify-center cursor-pointer ${
              activeFormats?.['strikethrough'] ? 'border-yellow-400 bg-[#444]' : ''
            }`}
            title="Strikethrough"
          >
            <span className="line-through text-xs">S</span>
          </button>
        </div>

        {/* Text Color & Highlight */}
        <div className="flex items-center bg-[#252525]/70 p-0.5 border border-[#444]/80 gap-0.5 relative">
          {/* Color */}
          <div className="relative">
            <button
              onClick={() => {
                setShowColorPicker(!showColorPicker);
                setShowHighlightPicker(false);
              }}
              className={`mc-button ${isCompact ? 'w-6 h-6 p-0' : 'w-7 h-7 p-1'} flex flex-col items-center justify-center cursor-pointer`}
              title="Text Color"
            >
              <div className="flex items-center gap-0.5">
                <span className="font-bold text-xs">A</span>
                <div className="w-2 h-0.5 bg-red-500 rounded-full" />
              </div>
            </button>

            {showColorPicker && (
              <div className="absolute top-8 left-0 bg-[#222] border-2 border-[#FFD700] p-1.5 shadow-2xl z-50 grid grid-cols-4 gap-1 w-36">
                {MINECRAFT_COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      onFormat('foreColor', c.color);
                      setShowColorPicker(false);
                    }}
                    className="p-1 hover:scale-110 flex items-center justify-center border border-[#555] hover:border-white bg-[#333] cursor-pointer"
                    title={c.name}
                  >
                    <div
                      className="w-3.5 h-3.5 border border-black"
                      style={{ backgroundColor: c.color }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Highlight */}
          <div className="relative">
            <button
              onClick={() => {
                setShowHighlightPicker(!showHighlightPicker);
                setShowColorPicker(false);
              }}
              className={`mc-button ${isCompact ? 'w-6 h-6 p-0' : 'w-7 h-7 p-1'} flex items-center justify-center cursor-pointer`}
              title="Highlight Color"
            >
              <Highlighter className="w-3 h-3 text-yellow-300" />
            </button>

            {showHighlightPicker && (
              <div className="absolute top-8 left-0 bg-[#222] border-2 border-[#FFD700] p-1.5 shadow-2xl z-50 flex flex-col gap-0.5 w-36">
                {HIGHLIGHT_COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      onFormat('hiliteColor', c.color);
                      setShowHighlightPicker(false);
                    }}
                    className="p-1 hover:bg-[#444] text-left flex items-center gap-1.5 text-xs text-white cursor-pointer"
                  >
                    <span className="text-xs">{c.icon}</span>
                    <span className="text-[10px]">{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Alignment Group */}
        <div className="flex items-center bg-[#252525]/70 p-0.5 border border-[#444]/80 gap-0.5">
          <button
            onClick={() => onFormat('justifyLeft')}
            className={`mc-button ${isCompact ? 'w-6 h-6 p-0' : 'w-7 h-7 p-1'} flex items-center justify-center cursor-pointer`}
            title="Align Left"
          >
            <AlignLeft className="w-3 h-3" />
          </button>
          <button
            onClick={() => onFormat('justifyCenter')}
            className={`mc-button ${isCompact ? 'w-6 h-6 p-0' : 'w-7 h-7 p-1'} flex items-center justify-center cursor-pointer`}
            title="Align Center"
          >
            <AlignCenter className="w-3 h-3" />
          </button>
          <button
            onClick={() => onFormat('justifyRight')}
            className={`mc-button ${isCompact ? 'w-6 h-6 p-0' : 'w-7 h-7 p-1'} flex items-center justify-center cursor-pointer`}
            title="Align Right"
          >
            <AlignRight className="w-3 h-3" />
          </button>
          <button
            onClick={() => onFormat('justifyFull')}
            className={`mc-button ${isCompact ? 'w-6 h-6 p-0' : 'w-7 h-7 p-1'} flex items-center justify-center cursor-pointer`}
            title="Justify"
          >
            <AlignJustify className="w-3 h-3" />
          </button>
        </div>

        {/* Lists & Indents */}
        <div className="flex items-center bg-[#252525]/70 p-0.5 border border-[#444]/80 gap-0.5">
          <button
            onClick={() => onFormat('insertUnorderedList')}
            className={`mc-button ${isCompact ? 'w-6 h-6 p-0' : 'w-7 h-7 p-1'} flex items-center justify-center cursor-pointer`}
            title="Bulleted List"
          >
            <List className="w-3 h-3" />
          </button>
          <button
            onClick={() => onFormat('insertOrderedList')}
            className={`mc-button ${isCompact ? 'w-6 h-6 p-0' : 'w-7 h-7 p-1'} flex items-center justify-center cursor-pointer`}
            title="Numbered List"
          >
            <ListOrdered className="w-3 h-3" />
          </button>
          <button
            onClick={() => onFormat('outdent')}
            className={`mc-button ${isCompact ? 'w-6 h-6 p-0' : 'w-7 h-7 p-1'} flex items-center justify-center cursor-pointer`}
            title="Decrease Indent"
          >
            <Outdent className="w-3 h-3" />
          </button>
          <button
            onClick={() => onFormat('indent')}
            className={`mc-button ${isCompact ? 'w-6 h-6 p-0' : 'w-7 h-7 p-1'} flex items-center justify-center cursor-pointer`}
            title="Increase Indent"
          >
            <Indent className="w-3 h-3" />
          </button>
        </div>

        {/* Media & Insert */}
        <div className="flex items-center bg-[#252525]/70 p-0.5 border border-[#444]/80 gap-0.5">
          <button
            onClick={() => {
              const url = prompt('Enter link URL:', 'https://');
              if (url) onFormat('createLink', url);
            }}
            className={`mc-button ${isCompact ? 'w-6 h-6 p-0' : 'w-7 h-7 p-1'} flex items-center justify-center cursor-pointer`}
            title="Insert Link (Ctrl+K)"
          >
            <Link className="w-3 h-3 text-cyan-300" />
          </button>
          <button
            onClick={() => {
              const url = prompt(
                'Enter image URL:',
                'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=800&auto=format&fit=crop&q=80'
              );
              if (url) onFormat('insertImage', url);
            }}
            className={`mc-button ${isCompact ? 'w-6 h-6 p-0' : 'w-7 h-7 p-1'} flex items-center justify-center cursor-pointer`}
            title="Insert Image"
          >
            <Image className="w-3 h-3 text-green-300" />
          </button>
          {onOpenSpecialCharacters && (
            <button
              onClick={onOpenSpecialCharacters}
              className={`mc-button ${isCompact ? 'w-6 h-6 p-0' : 'w-7 h-7 p-1'} flex items-center justify-center cursor-pointer`}
              title="Insert Minecraft Glyph or Special Symbol"
            >
              <Sparkles className="w-3 h-3 text-yellow-300" />
            </button>
          )}
          <button
            onClick={() => onFormat('removeFormat')}
            className={`mc-button ${isCompact ? 'w-6 h-6 p-0' : 'w-7 h-7 p-1'} flex items-center justify-center cursor-pointer`}
            title="Clear Formatting"
          >
            <Trash2 className="w-3 h-3 text-red-300" />
          </button>
        </div>
      </div>

      {/* Right Controls: UI Density Switcher (Compact / Standard / Zen) & Page Setup */}
      <div className="flex items-center gap-1.5 ml-auto shrink-0">
        {/* UI Density Segmented Switcher */}
        <div className="flex items-center bg-[#1d1d1d] border border-[#555] p-0.5 gap-0.5 text-[10px] font-pixel">
          <button
            onClick={() => onChangeUiDensity('compact')}
            className={`px-1.5 py-0.5 flex items-center gap-1 cursor-pointer transition-colors ${
              uiDensity === 'compact'
                ? 'bg-[#3d3d3d] text-[#55FF55] font-bold border border-[#55FF55]'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Compact UI: Sleek minimal toolbars for maximum document area"
          >
            <Zap className="w-3 h-3" />
            <span className="hidden sm:inline">COMPACT</span>
          </button>

          <button
            onClick={() => onChangeUiDensity('standard')}
            className={`px-1.5 py-0.5 flex items-center gap-1 cursor-pointer transition-colors ${
              uiDensity === 'standard'
                ? 'bg-[#3d3d3d] text-yellow-300 font-bold border border-yellow-400'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Standard UI: Full Google Docs multi-tier menus"
          >
            <LayoutGrid className="w-3 h-3" />
            <span className="hidden sm:inline">STANDARD</span>
          </button>

          <button
            onClick={() => onChangeUiDensity('zen')}
            className="px-1.5 py-0.5 flex items-center gap-1 cursor-pointer text-gray-400 hover:text-cyan-300 hover:bg-[#333]"
            title="Zen Fullscreen Focus: Hide toolbars completely for pure parchment writing"
          >
            <Eye className="w-3 h-3" />
            <span className="hidden md:inline">ZEN</span>
          </button>
        </div>

        {/* Page Setup Quick Button */}
        {onOpenPageSetup && (
          <button
            onClick={onOpenPageSetup}
            className="mc-button px-2 py-0.5 text-xs font-pixel flex items-center gap-1 text-yellow-300 border-amber-400/60 cursor-pointer h-6"
            title="Page Size & Layout (A4, Margins)"
          >
            <span className="text-[9px] uppercase">
              {pageSettings?.pageSize?.toUpperCase() || 'A4'}
            </span>
          </button>
        )}
      </div>
    </header>
  );
};
