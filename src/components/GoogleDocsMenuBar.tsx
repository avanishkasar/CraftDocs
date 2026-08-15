import React, { useState, useRef, useEffect } from 'react';
import { Page, PageSettings, EditorMode, UserProfile, UiDensity } from '../types/editor';
import {
  Home,
  Cloud,
  Share2,
  Sparkles,
  Settings,
  Star,
  Plus,
  Copy,
  Printer,
  FileText,
  Search,
  Check,
  Zap,
  LayoutGrid,
  Eye,
  Menu,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';

interface GoogleDocsMenuBarProps {
  activePage: Page | null;
  mode: EditorMode;
  pageSettings: PageSettings;
  profile?: UserProfile;
  isSidebarOpen: boolean;
  onGoHome?: () => void;
  onUpdateTitle: (title: string) => void;
  onToggleStar?: () => void;
  onNewPage: () => void;
  onDuplicatePage: () => void;
  onDeletePage: () => void;
  onToggleSidebar: () => void;
  onToggleMode: () => void;
  onOpenPageSetup: () => void;
  onOpenFindReplace: () => void;
  onOpenWordCount: () => void;
  onOpenSpecialCharacters: () => void;
  onOpenSettings: () => void;
  onOpenShareModal?: () => void;
  onOpenGeminiModal?: () => void;
  onOpenGoogleDriveModal?: () => void;
  onFormat: (cmd: string, value?: string) => void;
  onExport: (format: 'pdf' | 'txt' | 'md' | 'html' | 'json') => void;
  onZoomChange?: (zoom: number) => void;
  onTriggerCreeper?: () => void;
  uiDensity: UiDensity;
  onChangeUiDensity: (density: UiDensity) => void;
}

export const GoogleDocsMenuBar: React.FC<GoogleDocsMenuBarProps> = ({
  activePage,
  mode,
  pageSettings,
  profile,
  isSidebarOpen,
  onGoHome,
  onUpdateTitle,
  onToggleStar,
  onNewPage,
  onDuplicatePage,
  onDeletePage,
  onToggleSidebar,
  onToggleMode,
  onOpenPageSetup,
  onOpenFindReplace,
  onOpenWordCount,
  onOpenSpecialCharacters,
  onOpenSettings,
  onOpenShareModal,
  onOpenGeminiModal,
  onOpenGoogleDriveModal,
  onFormat,
  onExport,
  onZoomChange,
  onTriggerCreeper,
  uiDensity,
  onChangeUiDensity,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (menu: string) => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  const handleItemClick = (action: () => void) => {
    action();
    setActiveMenu(null);
  };

  // If in Zen mode, show a sleek floating top bar
  if (uiDensity === 'zen') {
    return (
      <div className="w-full bg-[#181818]/90 backdrop-blur-sm border-b border-[#333] px-3 py-1 flex items-center justify-between z-40 select-none no-print">
        <div className="flex items-center gap-2">
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="text-gray-400 hover:text-yellow-400 p-1"
              title="Home"
            >
              <Home className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="text-xs">{activePage?.icon || '📜'}</span>
          <span className="font-pixel text-xs text-amber-200 font-bold">
            {activePage?.title || 'Untitled document'}
          </span>
          <span className="text-[10px] bg-cyan-900/60 text-cyan-300 px-1.5 py-0.2 border border-cyan-500 font-pixel">
            ZEN FOCUS MODE
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onChangeUiDensity('compact')}
            className="mc-button px-2 py-0.5 text-xs font-pixel text-[#55FF55] flex items-center gap-1 cursor-pointer"
            title="Exit Zen Mode to Compact Toolbar"
          >
            <Zap className="w-3 h-3" />
            <span className="text-[10px]">EXIT ZEN</span>
          </button>
        </div>
      </div>
    );
  }

  const isCompact = uiDensity === 'compact';

  // Shared dropdown menus content
  const renderMenus = () => (
    <>
      {/* FILE MENU */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('file')}
          className={`px-1.5 py-0.5 rounded text-[11px] hover:bg-[#555] cursor-pointer flex items-center gap-0.5 ${
            activeMenu === 'file' ? 'bg-[#555] text-white font-bold' : 'text-gray-200'
          }`}
        >
          File <ChevronDown className="w-2.5 h-2.5 opacity-60" />
        </button>
        {activeMenu === 'file' && (
          <div className="absolute top-full left-0 mt-1 w-52 bg-[#2d2d2d] border-2 border-[#555] shadow-2xl py-1 z-50 text-gray-100 font-sans text-xs flex flex-col">
            <button
              onClick={() => handleItemClick(onNewPage)}
              className="px-3 py-1.5 text-left hover:bg-[#444] flex items-center justify-between"
            >
              <span>📄 New document</span>
              <span className="text-[10px] text-gray-400">Ctrl+N</span>
            </button>
            <button
              onClick={() => handleItemClick(onDuplicatePage)}
              className="px-3 py-1.5 text-left hover:bg-[#444] flex items-center justify-between"
            >
              <span>📋 Make a copy</span>
            </button>
            <div className="border-t border-[#444] my-1" />
            <div className="px-3 py-0.5 text-[9px] font-pixel text-yellow-400 uppercase">
              Download / Export:
            </div>
            <button
              onClick={() => handleItemClick(() => onExport('pdf'))}
              className="px-3 py-1 text-left hover:bg-[#444] flex items-center justify-between"
            >
              <span>📑 PDF Document (.pdf)</span>
            </button>
            <button
              onClick={() => handleItemClick(() => onExport('txt'))}
              className="px-3 py-1 text-left hover:bg-[#444] flex items-center justify-between"
            >
              <span>📝 Plain Text (.txt)</span>
            </button>
            <button
              onClick={() => handleItemClick(() => onExport('md'))}
              className="px-3 py-1 text-left hover:bg-[#444] flex items-center justify-between"
            >
              <span>📦 Markdown (.md)</span>
            </button>
            <button
              onClick={() => handleItemClick(() => onExport('html'))}
              className="px-3 py-1 text-left hover:bg-[#444] flex items-center justify-between"
            >
              <span>🌐 Web Page (.html)</span>
            </button>
            <button
              onClick={() => handleItemClick(() => onExport('json'))}
              className="px-3 py-1 text-left hover:bg-[#444] flex items-center justify-between"
            >
              <span>💾 JSON Backup (.json)</span>
            </button>
            <div className="border-t border-[#444] my-1" />
            <button
              onClick={() => handleItemClick(onOpenPageSetup)}
              className="px-3 py-1.5 text-left hover:bg-[#444] flex items-center justify-between text-yellow-300"
            >
              <span>⚙️ Page setup (A4 / Margins)</span>
            </button>
            <button
              onClick={() => handleItemClick(() => window.print())}
              className="px-3 py-1.5 text-left hover:bg-[#444] flex items-center justify-between"
            >
              <span>🖨️ Print</span>
              <span className="text-[10px] text-gray-400">Ctrl+P</span>
            </button>
          </div>
        )}
      </div>

      {/* EDIT MENU */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('edit')}
          className={`px-1.5 py-0.5 rounded text-[11px] hover:bg-[#555] cursor-pointer flex items-center gap-0.5 ${
            activeMenu === 'edit' ? 'bg-[#555] text-white font-bold' : 'text-gray-200'
          }`}
        >
          Edit <ChevronDown className="w-2.5 h-2.5 opacity-60" />
        </button>
        {activeMenu === 'edit' && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-[#2d2d2d] border-2 border-[#555] shadow-2xl py-1 z-50 text-gray-100 font-sans text-xs flex flex-col">
            <button
              onClick={() => handleItemClick(() => onFormat('undo'))}
              className="px-3 py-1.5 text-left hover:bg-[#444] flex items-center justify-between"
            >
              <span>↩️ Undo</span>
              <span className="text-[10px] text-gray-400">Ctrl+Z</span>
            </button>
            <button
              onClick={() => handleItemClick(() => onFormat('redo'))}
              className="px-3 py-1.5 text-left hover:bg-[#444] flex items-center justify-between"
            >
              <span>↪️ Redo</span>
              <span className="text-[10px] text-gray-400">Ctrl+Y</span>
            </button>
            <div className="border-t border-[#444] my-1" />
            <button
              onClick={() => handleItemClick(onOpenFindReplace)}
              className="px-3 py-1.5 text-left hover:bg-[#444] flex items-center justify-between text-yellow-300"
            >
              <span>🔍 Find and replace</span>
              <span className="text-[10px] text-gray-400">Ctrl+H</span>
            </button>
            <button
              onClick={() => handleItemClick(() => onFormat('selectAll'))}
              className="px-3 py-1.5 text-left hover:bg-[#444] flex items-center justify-between"
            >
              <span>Select all</span>
              <span className="text-[10px] text-gray-400">Ctrl+A</span>
            </button>
            <button
              onClick={() => handleItemClick(onDeletePage)}
              className="px-3 py-1.5 text-left hover:bg-red-900/50 text-red-300 flex items-center justify-between"
            >
              <span>🔥 Drop in lava (Delete)</span>
            </button>
          </div>
        )}
      </div>

      {/* VIEW MENU */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('view')}
          className={`px-1.5 py-0.5 rounded text-[11px] hover:bg-[#555] cursor-pointer flex items-center gap-0.5 ${
            activeMenu === 'view' ? 'bg-[#555] text-white font-bold' : 'text-gray-200'
          }`}
        >
          View <ChevronDown className="w-2.5 h-2.5 opacity-60" />
        </button>
        {activeMenu === 'view' && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-[#2d2d2d] border-2 border-[#555] shadow-2xl py-1 z-50 text-gray-100 font-sans text-xs flex flex-col">
            <button
              onClick={() => handleItemClick(() => onChangeUiDensity('compact'))}
              className="px-3 py-1.5 text-left hover:bg-[#444] flex items-center justify-between text-[#55FF55]"
            >
              <span>⚡ Compact Mode</span>
              {uiDensity === 'compact' && <Check className="w-3 h-3 text-[#55FF55]" />}
            </button>
            <button
              onClick={() => handleItemClick(() => onChangeUiDensity('standard'))}
              className="px-3 py-1.5 text-left hover:bg-[#444] flex items-center justify-between"
            >
              <span>📐 Standard Mode</span>
              {uiDensity === 'standard' && <Check className="w-3 h-3 text-yellow-300" />}
            </button>
            <button
              onClick={() => handleItemClick(() => onChangeUiDensity('zen'))}
              className="px-3 py-1.5 text-left hover:bg-[#444] flex items-center justify-between text-cyan-300"
            >
              <span>👁️ Zen Full Focus</span>
            </button>
            <div className="border-t border-[#444] my-1" />
            <button
              onClick={() => handleItemClick(onToggleSidebar)}
              className="px-3 py-1.5 text-left hover:bg-[#444] flex items-center justify-between"
            >
              <span>📚 Show inventory</span>
              {isSidebarOpen && <Check className="w-3 h-3 text-yellow-400" />}
            </button>
            <button
              onClick={() => handleItemClick(onToggleMode)}
              className="px-3 py-1.5 text-left hover:bg-[#444] flex items-center justify-between"
            >
              <span>Mode: {mode === 'survival' ? '⚔️ Survival' : '🧱 Creative'}</span>
            </button>
            <div className="border-t border-[#444] my-1" />
            <div className="px-3 py-0.5 text-[9px] font-pixel text-yellow-400 uppercase">
              Zoom:
            </div>
            {[75, 100, 125, 150].map((z) => (
              <button
                key={z}
                onClick={() => handleItemClick(() => onZoomChange && onZoomChange(z))}
                className="px-3 py-1 text-left hover:bg-[#444] flex items-center justify-between"
              >
                <span>{z}%</span>
                {pageSettings.zoomLevel === z && <Check className="w-3 h-3 text-yellow-400" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* INSERT MENU */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('insert')}
          className={`px-1.5 py-0.5 rounded text-[11px] hover:bg-[#555] cursor-pointer flex items-center gap-0.5 ${
            activeMenu === 'insert' ? 'bg-[#555] text-white font-bold' : 'text-gray-200'
          }`}
        >
          Insert <ChevronDown className="w-2.5 h-2.5 opacity-60" />
        </button>
        {activeMenu === 'insert' && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-[#2d2d2d] border-2 border-[#555] shadow-2xl py-1 z-50 text-gray-100 font-sans text-xs flex flex-col">
            <button
              onClick={() =>
                handleItemClick(() => {
                  const url = prompt(
                    'Image URL:',
                    'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=800&auto=format&fit=crop&q=80'
                  );
                  if (url) onFormat('insertImage', url);
                })
              }
              className="px-3 py-1.5 text-left hover:bg-[#444] flex items-center gap-2"
            >
              <span>🗺️ Image</span>
            </button>
            <button
              onClick={() =>
                handleItemClick(() => {
                  const url = prompt('Link URL:', 'https://');
                  if (url) onFormat('createLink', url);
                })
              }
              className="px-3 py-1.5 text-left hover:bg-[#444] flex items-center gap-2"
            >
              <span>💎 Link</span>
            </button>
            <button
              onClick={() => handleItemClick(onOpenSpecialCharacters)}
              className="px-3 py-1.5 text-left hover:bg-[#444] flex items-center gap-2 text-yellow-300"
            >
              <span>✨ Minecraft Glyphs</span>
            </button>
            <button
              onClick={() => handleItemClick(() => onFormat('insertHorizontalRule'))}
              className="px-3 py-1.5 text-left hover:bg-[#444] flex items-center gap-2"
            >
              <span>➖ Horizontal line</span>
            </button>
          </div>
        )}
      </div>

      {/* FORMAT MENU */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('format')}
          className={`px-1.5 py-0.5 rounded text-[11px] hover:bg-[#555] cursor-pointer flex items-center gap-0.5 ${
            activeMenu === 'format' ? 'bg-[#555] text-white font-bold' : 'text-gray-200'
          }`}
        >
          Format <ChevronDown className="w-2.5 h-2.5 opacity-60" />
        </button>
        {activeMenu === 'format' && (
          <div className="absolute top-full left-0 mt-1 w-44 bg-[#2d2d2d] border-2 border-[#555] shadow-2xl py-1 z-50 text-gray-100 font-sans text-xs flex flex-col">
            <button
              onClick={() => handleItemClick(() => onFormat('bold'))}
              className="px-3 py-1.5 text-left hover:bg-[#444]"
            >
              <b>Bold (Ctrl+B)</b>
            </button>
            <button
              onClick={() => handleItemClick(() => onFormat('italic'))}
              className="px-3 py-1.5 text-left hover:bg-[#444]"
            >
              <i>Italic (Ctrl+I)</i>
            </button>
            <button
              onClick={() => handleItemClick(() => onFormat('underline'))}
              className="px-3 py-1.5 text-left hover:bg-[#444]"
            >
              <u>Underline (Ctrl+U)</u>
            </button>
            <button
              onClick={() => handleItemClick(() => onFormat('strikeThrough'))}
              className="px-3 py-1.5 text-left hover:bg-[#444]"
            >
              <s>Strikethrough</s>
            </button>
            <div className="border-t border-[#444] my-1" />
            <button
              onClick={() => handleItemClick(() => onFormat('removeFormat'))}
              className="px-3 py-1.5 text-left hover:bg-[#444] text-red-300"
            >
              🧹 Clear formatting
            </button>
          </div>
        )}
      </div>

      {/* TOOLS MENU */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('tools')}
          className={`px-1.5 py-0.5 rounded text-[11px] hover:bg-[#555] cursor-pointer flex items-center gap-0.5 ${
            activeMenu === 'tools' ? 'bg-[#555] text-white font-bold' : 'text-gray-200'
          }`}
        >
          Tools <ChevronDown className="w-2.5 h-2.5 opacity-60" />
        </button>
        {activeMenu === 'tools' && (
          <div className="absolute top-full left-0 mt-1 w-52 bg-[#2d2d2d] border-2 border-[#555] shadow-2xl py-1 z-50 text-gray-100 font-sans text-xs flex flex-col">
            {onOpenGeminiModal && (
              <button
                onClick={() => handleItemClick(onOpenGeminiModal)}
                className="px-3 py-1.5 text-left hover:bg-[#444] flex items-center gap-2 text-yellow-300"
              >
                <span>✨ Gemini AI Spellcheck</span>
              </button>
            )}
            <button
              onClick={() => handleItemClick(onOpenWordCount)}
              className="px-3 py-1.5 text-left hover:bg-[#444] flex items-center justify-between"
            >
              <span>📊 Word count</span>
              <span className="text-[10px] text-gray-400">Ctrl+Shift+C</span>
            </button>
            {onOpenGoogleDriveModal && (
              <button
                onClick={() => handleItemClick(onOpenGoogleDriveModal)}
                className="px-3 py-1.5 text-left hover:bg-[#444] flex items-center gap-2 text-blue-300"
              >
                <span>☁️ Google Drive Sync</span>
              </button>
            )}
            {onTriggerCreeper && (
              <button
                onClick={() => handleItemClick(onTriggerCreeper)}
                className="px-3 py-1.5 text-left hover:bg-green-950 text-green-400 flex items-center gap-2"
              >
                <span>🧨 Summon Creeper (Troll)</span>
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );

  // In COMPACT Mode: Single Sleek 34px Bar containing Everything!
  if (isCompact) {
    return (
      <div
        ref={menuBarRef}
        className="mc-stone-bg w-full px-2 py-1 flex items-center justify-between border-b border-[#111] z-40 select-none no-print gap-1.5"
      >
        {/* Left: Home, Title, Star, Menus */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {/* Home */}
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="bg-[#2a2a2a] hover:bg-[#383838] border border-[#555] hover:border-[#FFD700] p-1 text-white flex items-center gap-1 cursor-pointer shrink-0"
              title="Home Hub"
            >
              <Home className="w-3.5 h-3.5 text-yellow-400" />
            </button>
          )}

          {/* Title & Star */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-xs">{activePage?.icon || '📜'}</span>
            <input
              type="text"
              value={activePage?.title || ''}
              onChange={(e) => onUpdateTitle(e.target.value)}
              placeholder="Untitled document"
              className="bg-transparent text-white font-pixel text-xs font-bold hover:bg-black/30 px-1 py-0.5 border border-transparent hover:border-[#555] focus:border-[#FFD700] focus:bg-black/50 focus:outline-none max-w-[120px] sm:max-w-[180px] truncate"
            />
            <button
              onClick={onToggleStar}
              className="text-xs text-yellow-400 hover:scale-110 transition-transform cursor-pointer"
              title={activePage?.isStarred ? 'Unstar' : 'Star'}
            >
              {activePage?.isStarred ? '⭐' : '☆'}
            </button>
          </div>

          <div className="h-4 w-px bg-[#444] mx-0.5 hidden sm:block shrink-0" />

          {/* Dropdown Menus Strip Inline */}
          <div className="hidden md:flex items-center gap-0.5 shrink-0 font-sans">
            {renderMenus()}
          </div>
        </div>

        {/* Right: AI Enchant, Share, Mode, Settings */}
        <div className="flex items-center gap-1 shrink-0 ml-auto">
          {onOpenGeminiModal && (
            <button
              onClick={onOpenGeminiModal}
              className="mc-enchanted-btn px-2 py-0.5 text-xs font-pixel flex items-center gap-1 cursor-pointer shadow-sm"
              title="Gemini AI Spellcheck & Proofreader"
            >
              <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
              <span className="text-[9px] hidden lg:inline">AI ENCHANT</span>
            </button>
          )}

          {onOpenShareModal && (
            <button
              onClick={onOpenShareModal}
              className="mc-button-green px-2 py-0.5 text-xs font-pixel text-white flex items-center gap-1 cursor-pointer shadow-sm"
              title="Share Realm Document"
            >
              <Share2 className="w-3 h-3" />
              <span className="text-[9px] hidden sm:inline">SHARE</span>
            </button>
          )}

          <button
            onClick={onToggleMode}
            className="mc-button px-1.5 py-0.5 text-xs font-pixel flex items-center gap-1 cursor-pointer"
            title="Switch Editor Mode"
          >
            <span className="text-[9px]">
              {mode === 'creative' ? '🧱 CREATIVE' : '⚔️ SURVIVAL'}
            </span>
          </button>

          <button
            onClick={onOpenSettings}
            className="mc-button p-1 text-xs font-pixel text-gray-300 hover:text-white flex items-center cursor-pointer"
            title="Settings"
          >
            <Settings className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  // STANDARD Mode: Classic 2-Row Google Docs Menu Bar
  return (
    <div
      ref={menuBarRef}
      className="mc-stone-bg w-full px-3 py-1.5 flex flex-col border-b border-[#111] z-40 select-none no-print"
    >
      {/* Top Row: Title, Star, AI Wizard, Share, Mode */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="bg-[#2a2a2a] hover:bg-[#383838] border border-[#555] hover:border-[#FFD700] p-1.5 text-white flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              title="Return to Hub"
            >
              <Home className="w-4 h-4 text-yellow-400" />
              <span className="font-pixel text-[9px] hidden sm:inline text-gray-200">HOME</span>
            </button>
          )}

          <button
            onClick={onToggleSidebar}
            className="mc-slot w-7 h-7 flex items-center justify-center text-xs shrink-0 cursor-pointer"
            title={isSidebarOpen ? 'Close Inventory' : 'Open Inventory'}
          >
            <span>{activePage?.icon || '📜'}</span>
          </button>

          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={activePage?.title || ''}
              onChange={(e) => onUpdateTitle(e.target.value)}
              placeholder="Untitled document"
              className="bg-transparent text-white font-pixel text-xs sm:text-sm font-bold hover:bg-black/30 px-1.5 py-0.5 border border-transparent hover:border-[#555] focus:border-[#FFD700] focus:bg-black/50 focus:outline-none max-w-[140px] sm:max-w-xs md:max-w-md truncate"
            />
            <button
              onClick={onToggleStar}
              className="text-sm text-yellow-400 hover:scale-110 transition-transform cursor-pointer p-0.5"
              title={activePage?.isStarred ? 'Unstar' : 'Star'}
            >
              {activePage?.isStarred ? '⭐' : '☆'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          {onOpenGeminiModal && (
            <button
              onClick={onOpenGeminiModal}
              className="mc-enchanted-btn px-2.5 py-1 text-xs font-pixel flex items-center gap-1.5 cursor-pointer shadow-md"
              title="Gemini AI Spellcheck"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span className="text-[9px] hidden sm:inline">AI ENCHANT</span>
            </button>
          )}

          {onOpenShareModal && (
            <button
              onClick={onOpenShareModal}
              className="mc-button-green px-3 py-1 text-xs font-pixel text-white flex items-center gap-1.5 cursor-pointer shadow-md"
              title="Share Realm Document"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="text-[9px]">SHARE</span>
            </button>
          )}

          <button
            onClick={onToggleMode}
            className="mc-button px-2.5 py-1 text-xs font-pixel flex items-center gap-1.5 cursor-pointer"
          >
            <span className="text-[9px]">
              {mode === 'creative' ? '🧱 CREATIVE' : '⚔️ SURVIVAL'}
            </span>
          </button>

          <button
            onClick={onOpenSettings}
            className="mc-button p-1.5 text-xs font-pixel text-gray-300 hover:text-white flex items-center cursor-pointer"
            title="Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Row: Dropdown Menus */}
      <div className="flex items-center gap-1 mt-1 text-xs font-sans text-gray-200 relative flex-wrap">
        {renderMenus()}
      </div>
    </div>
  );
};
