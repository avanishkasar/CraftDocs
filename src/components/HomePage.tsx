import React, { useState, useMemo } from 'react';
import { Page, UserProfile, ThemeMode, HomeTab, DocumentTemplate } from '../types/editor';
import { DOCUMENT_TEMPLATES } from '../utils/templates';
import { MinecraftBackground } from './MinecraftBackground';
import {
  Search,
  Plus,
  FileText,
  Clock,
  Star,
  Users,
  Cloud,
  Trash2,
  MoreVertical,
  Share2,
  Copy,
  FolderOpen,
  LayoutGrid,
  List,
  Sparkles,
  ArrowUpDown,
  Upload,
  BookOpen,
  Settings,
  LogOut,
  User,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface HomePageProps {
  pages: Page[];
  profile: UserProfile;
  onOpenDocument: (pageId: string) => void;
  onCreateNewDocument: (template?: DocumentTemplate) => void;
  onDuplicateDocument: (pageId: string) => void;
  onDeleteDocument: (pageId: string) => void;
  onToggleStar: (pageId: string) => void;
  onOpenShareModal: (page: Page) => void;
  onOpenGoogleDriveModal: (page?: Page) => void;
  onOpenSettingsModal: () => void;
  onOpenSignupModal: () => void;
  onToggleTheme: (theme: ThemeMode) => void;
  onSignOut: () => void;
}

const SPLASH_TEXTS = [
  'Now with Google Drive Sync!',
  'Gemini 3.7 Flash Enchanted!',
  'Dual Survival & Creative Modes!',
  '100% Netherite Proof!',
  'A4 Standard Parchment!',
  'Steve & Alex AI Companions!',
  'Type / for block crafting!',
  'Never dig straight down!',
  'Save your words in the Overworld!',
];

export const HomePage: React.FC<HomePageProps> = ({
  pages,
  profile,
  onOpenDocument,
  onCreateNewDocument,
  onDuplicateDocument,
  onDeleteDocument,
  onToggleStar,
  onOpenShareModal,
  onOpenGoogleDriveModal,
  onOpenSettingsModal,
  onOpenSignupModal,
  onToggleTheme,
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = useState<HomeTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'modified' | 'title' | 'created'>('modified');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Pick splash text randomly
  const splashText = useMemo(() => {
    return SPLASH_TEXTS[Math.floor(Math.random() * SPLASH_TEXTS.length)];
  }, []);

  // Filter and sort pages
  const filteredPages = useMemo(() => {
    return pages
      .filter((p) => {
        if (activeTab === 'trash') return p.isTrash;
        if (p.isTrash) return false;

        if (activeTab === 'starred') return p.isStarred;
        if (activeTab === 'drive') return p.driveFileId;
        if (activeTab === 'shared') return p.isShared;
        if (activeTab === 'recent') {
          // within last 7 days
          return Date.now() - p.updatedAt < 7 * 86400000;
        }
        return true;
      })
      .filter((p) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        const titleMatch = p.title.toLowerCase().includes(q);
        const contentMatch = p.blocks.some((b) => b.content.toLowerCase().includes(q));
        return titleMatch || contentMatch;
      })
      .sort((a, b) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'created') return b.createdAt - a.createdAt;
        return b.updatedAt - a.updatedAt;
      });
  }, [pages, activeTab, searchQuery, sortBy]);

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col bg-[#121212] text-gray-100 font-doc select-none">
      {/* Live Animated Minecraft Panoramic Background */}
      <MinecraftBackground theme={profile.theme} />

      {/* Top Header Bar */}
      <header className="relative z-20 bg-[#1c1c1c]/90 backdrop-blur-md border-b-4 border-[#111111] px-4 sm:px-8 py-3 flex items-center justify-between shadow-lg">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#4c7c3c] border-2 border-[#7eb063] flex items-center justify-center text-white shadow-md">
            <span className="font-pixel text-sm">CD</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-pixel text-sm sm:text-base text-[#FFD700] tracking-wider drop-shadow-md">
                CRAFTDOCS
              </h1>
              <span className="bg-[#2a2a2a] text-[10px] text-green-400 px-1.5 py-0.5 border border-[#444] font-pixel">
                OVERWORLD HUB
              </span>
            </div>
            <div className="text-[11px] text-gray-300 font-sans">
              Google Docs & Notion in the Minecraft Universe
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents, scrolls, and archives..."
              className="w-full bg-[#111111]/80 border-2 border-[#444] hover:border-[#666] focus:border-[#FFD700] pl-9 pr-4 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-hidden transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Navigation & Profile Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Day / Night Theme Toggle */}
          <button
            onClick={() => onToggleTheme(profile.theme === 'day' ? 'night' : 'day')}
            className="mc-button p-2 text-xs flex items-center gap-1.5"
            title={`Switch to ${profile.theme === 'day' ? 'Night (Nether)' : 'Day (Overworld)'} mode`}
          >
            <span className="text-base">{profile.theme === 'day' ? '☀️' : '🌙'}</span>
            <span className="hidden sm:inline font-pixel text-[10px]">
              {profile.theme === 'day' ? 'DAY' : 'NIGHT'}
            </span>
          </button>

          {/* Google Drive Status Link */}
          <button
            onClick={() => onOpenGoogleDriveModal()}
            className="bg-[#1e2a38] hover:bg-[#283b50] border-2 border-[#4285F4] px-3 py-1.5 text-xs font-pixel text-white flex items-center gap-1.5 shadow-sm transition-colors"
            title="Google Drive Cloud Storage"
          >
            <Cloud className="w-3.5 h-3.5 text-[#4285F4]" />
            <span className="hidden sm:inline">DRIVE</span>
          </button>

          {/* User Account / Character Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="mc-slot w-9 h-9 p-0 flex items-center justify-center cursor-pointer border-2 hover:border-[#FFD700]"
            >
              <div
                className={`w-full h-full flex items-center justify-center font-pixel text-xs text-white font-bold ${
                  profile.character === 'alex' ? 'bg-[#e28a58]' : 'bg-[#5c8bbf]'
                }`}
              >
                {profile.character === 'alex' ? 'A' : 'S'}
              </div>
            </button>

            {userDropdownOpen && (
              <div
                className="absolute right-0 top-11 w-64 bg-[#222222] border-4 border-[#555555] shadow-2xl z-50 p-3 font-sans text-xs space-y-3 animate-in fade-in duration-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 pb-2 border-b border-[#444]">
                  <div
                    className={`w-10 h-10 border-2 border-black flex items-center justify-center font-pixel text-sm text-white ${
                      profile.character === 'alex' ? 'bg-[#e28a58]' : 'bg-[#5c8bbf]'
                    }`}
                  >
                    {profile.character === 'alex' ? 'ALEX' : 'STEVE'}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{profile.name}</div>
                    <div className="text-[11px] text-gray-400">
                      {profile.email || `${profile.name.toLowerCase()}@craftdocs.world`}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenSignupModal();
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-[#333] text-gray-200 flex items-center gap-2 transition-colors font-pixel text-[10px]"
                  >
                    <User className="w-3.5 h-3.5 text-yellow-400" />
                    SWITCH CHARACTER / LOGIN
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenGoogleDriveModal();
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-[#333] text-gray-200 flex items-center gap-2 transition-colors font-pixel text-[10px]"
                  >
                    <Cloud className="w-3.5 h-3.5 text-blue-400" />
                    GOOGLE DRIVE ACCOUNT
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenSettingsModal();
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-[#333] text-gray-200 flex items-center gap-2 transition-colors font-pixel text-[10px]"
                  >
                    <Settings className="w-3.5 h-3.5 text-gray-400" />
                    SETTINGS & PREFERENCES
                  </button>
                </div>

                <div className="pt-2 border-t border-[#444]">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onSignOut();
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-red-950/50 text-red-400 flex items-center gap-2 transition-colors font-pixel text-[10px]"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    SIGN OUT / RESET
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div
        className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-8"
        onClick={() => {
          setMenuOpenId(null);
          setUserDropdownOpen(false);
        }}
      >
        {/* Minecraft Title & Yellow Splash Text */}
        <div className="text-center pt-2 pb-4">
          <div className="inline-block relative">
            <h2 className="font-pixel text-2xl sm:text-4xl text-[#c6c6c6] tracking-wider drop-shadow-[0_4px_0_#000000] uppercase">
              CRAFTDOCS
            </h2>
            {/* Animated Bouncing Yellow Splash */}
            <div className="absolute -bottom-3 -right-6 sm:-right-12 transform rotate-[-12deg] bg-[#000000]/60 px-2 py-0.5 border border-yellow-500 shadow-md">
              <span className="font-pixel text-[10px] sm:text-xs text-[#FFFF00] animate-pulse whitespace-nowrap">
                {splashText}
              </span>
            </div>
          </div>
        </div>

        {/* Start a new document / Template Bar */}
        <section className="bg-[#1e1e1e]/85 backdrop-blur-md border-4 border-[#333333] p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <h3 className="font-pixel text-xs text-white uppercase tracking-wider">
                Start a New Document
              </h3>
            </div>
            <button
              onClick={() => onOpenGoogleDriveModal()}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-sans"
            >
              <Upload className="w-3 h-3" />
              Import from Drive
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {/* Blank Document Card */}
            <button
              onClick={() => onCreateNewDocument(DOCUMENT_TEMPLATES[0])}
              className="group bg-[#2a2a2a] hover:bg-[#353535] border-2 border-[#444] hover:border-[#FFD700] p-3 text-left transition-all flex flex-col items-center justify-center space-y-2 aspect-3/4 shadow-md active:translate-y-0.5"
            >
              <div className="w-12 h-16 bg-white border border-gray-400 shadow-sm flex items-center justify-center text-gray-800 group-hover:scale-105 transition-transform">
                <Plus className="w-6 h-6 text-red-500" />
              </div>
              <div className="text-center">
                <div className="font-pixel text-[10px] text-white group-hover:text-[#FFD700]">
                  BLANK DOC
                </div>
                <div className="text-[10px] text-gray-400 font-sans">A4 Standard</div>
              </div>
            </button>

            {/* Minecraft Themed Templates */}
            {DOCUMENT_TEMPLATES.slice(1).map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => onCreateNewDocument(tpl)}
                className="group bg-[#2a2a2a] hover:bg-[#353535] border-2 border-[#444] hover:border-[#FFD700] p-3 text-left transition-all flex flex-col items-center justify-between aspect-3/4 shadow-md active:translate-y-0.5"
              >
                <div className="w-12 h-16 bg-[#fdf6e3] border-2 border-[#8B6914] p-1.5 flex flex-col justify-between group-hover:scale-105 transition-transform shadow-xs">
                  <span className="text-base">{tpl.icon}</span>
                  <div className="space-y-0.5">
                    <div className="w-full h-1 bg-amber-800/30" />
                    <div className="w-3/4 h-1 bg-amber-800/30" />
                  </div>
                </div>
                <div className="text-center w-full">
                  <div className="font-pixel text-[9px] text-white truncate group-hover:text-[#FFD700]">
                    {tpl.name}
                  </div>
                  <div className="text-[9px] text-gray-400 font-sans truncate">{tpl.category}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Documents Hub Navigation & Filter Bar */}
        <section className="space-y-4">
          <div className="bg-[#1c1c1c]/90 backdrop-blur-md border-b-2 border-[#333] p-2 flex flex-wrap items-center justify-between gap-3">
            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 text-xs font-pixel flex items-center gap-1.5 transition-colors ${
                  activeTab === 'all'
                    ? 'bg-[#333] text-[#FFD700] border-b-2 border-[#FFD700]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                ALL DOCS ({pages.filter((p) => !p.isTrash).length})
              </button>

              <button
                onClick={() => setActiveTab('recent')}
                className={`px-3 py-1.5 text-xs font-pixel flex items-center gap-1.5 transition-colors ${
                  activeTab === 'recent'
                    ? 'bg-[#333] text-[#FFD700] border-b-2 border-[#FFD700]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                RECENT
              </button>

              <button
                onClick={() => setActiveTab('starred')}
                className={`px-3 py-1.5 text-xs font-pixel flex items-center gap-1.5 transition-colors ${
                  activeTab === 'starred'
                    ? 'bg-[#333] text-[#FFD700] border-b-2 border-[#FFD700]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Star className="w-3.5 h-3.5 text-yellow-400" />
                STARRED
              </button>

              <button
                onClick={() => setActiveTab('shared')}
                className={`px-3 py-1.5 text-xs font-pixel flex items-center gap-1.5 transition-colors ${
                  activeTab === 'shared'
                    ? 'bg-[#333] text-[#FFD700] border-b-2 border-[#FFD700]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-green-400" />
                SHARED
              </button>

              <button
                onClick={() => setActiveTab('drive')}
                className={`px-3 py-1.5 text-xs font-pixel flex items-center gap-1.5 transition-colors ${
                  activeTab === 'drive'
                    ? 'bg-[#333] text-[#FFD700] border-b-2 border-[#FFD700]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Cloud className="w-3.5 h-3.5 text-blue-400" />
                GOOGLE DRIVE
              </button>

              <button
                onClick={() => setActiveTab('trash')}
                className={`px-3 py-1.5 text-xs font-pixel flex items-center gap-1.5 transition-colors ${
                  activeTab === 'trash'
                    ? 'bg-[#333] text-red-400 border-b-2 border-red-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                TRASH
              </button>
            </div>

            {/* Sort and View controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-[#111] px-2 py-1 border border-[#333] text-xs font-sans">
                <ArrowUpDown className="w-3 h-3 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-gray-200 focus:outline-hidden text-xs"
                >
                  <option value="modified">Last Modified</option>
                  <option value="title">Title (A-Z)</option>
                  <option value="created">Created Date</option>
                </select>
              </div>

              <div className="flex border border-[#333]">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 ${
                    viewMode === 'grid' ? 'bg-[#333] text-[#FFD700]' : 'text-gray-400 hover:text-white'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 ${
                    viewMode === 'list' ? 'bg-[#333] text-[#FFD700]' : 'text-gray-400 hover:text-white'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Document Cards Grid / List */}
          {filteredPages.length === 0 ? (
            <div className="bg-[#1e1e1e]/80 border-4 border-[#333] p-12 text-center space-y-4">
              <div className="w-14 h-14 mx-auto bg-[#2a2a2a] border-2 border-[#555] flex items-center justify-center text-gray-400">
                <FileText className="w-8 h-8" />
              </div>
              <div className="font-pixel text-sm text-gray-300">NO DOCUMENTS FOUND</div>
              <p className="text-xs text-gray-400 max-w-sm mx-auto font-sans">
                {searchQuery
                  ? `No documents matching "${searchQuery}".`
                  : 'Start crafting your first scroll by selecting a template above.'}
              </p>
              <button
                onClick={() => onCreateNewDocument(DOCUMENT_TEMPLATES[0])}
                className="mc-button-green px-5 py-2 font-pixel text-xs text-white inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                CREATE DOCUMENT
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredPages.map((page) => {
                const previewSnippet =
                  page.blocks.map((b) => b.content).join(' ').slice(0, 140) ||
                  'Blank document ready for crafting.';

                return (
                  <div
                    key={page.id}
                    onClick={() => onOpenDocument(page.id)}
                    className="group bg-[#1e1e1e]/90 hover:bg-[#252525] border-3 border-[#3a3a3a] hover:border-[#FFD700] rounded-none shadow-lg transition-all flex flex-col cursor-pointer overflow-hidden relative"
                  >
                    {/* Top Thumbnail Preview */}
                    <div className="h-40 bg-[#f9f9f9] text-gray-800 p-3 overflow-hidden border-b-2 border-[#333] relative flex flex-col justify-between select-none">
                      <div className="space-y-1.5 pointer-events-none">
                        <div className="font-bold text-xs font-serif text-gray-900 truncate flex items-center gap-1">
                          <span>{page.icon || '📄'}</span>
                          <span>{page.title || 'Untitled document'}</span>
                        </div>
                        <p className="text-[10px] text-gray-600 font-serif leading-relaxed line-clamp-4">
                          {previewSnippet}
                        </p>
                      </div>

                      {/* Badges on Thumbnail */}
                      <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                        <div className="flex items-center gap-1">
                          {page.driveFileId && (
                            <span
                              className="bg-blue-100 text-blue-800 px-1 py-0.5 text-[9px] font-sans flex items-center gap-0.5"
                              title="Google Drive Linked"
                            >
                              <Cloud className="w-2.5 h-2.5" />
                              Drive
                            </span>
                          )}
                          {page.isShared && (
                            <span
                              className="bg-green-100 text-green-800 px-1 py-0.5 text-[9px] font-sans flex items-center gap-0.5"
                              title="Shared"
                            >
                              <Users className="w-2.5 h-2.5" />
                              Shared
                            </span>
                          )}
                        </div>

                        <span className="text-[9px] text-gray-500 font-mono">
                          {page.blocks.length} blocks
                        </span>
                      </div>

                      {/* Star Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleStar(page.id);
                        }}
                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-yellow-500"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            page.isStarred
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'hover:text-yellow-400'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Bottom Metadata & Menu */}
                    <div className="p-3 bg-[#242424] flex items-center justify-between">
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="font-semibold text-xs text-white truncate font-sans group-hover:text-[#FFD700]">
                          {page.title || 'Untitled document'}
                        </div>
                        <div className="text-[10px] text-gray-400 flex items-center gap-2 mt-0.5">
                          <span>
                            {new Date(page.updatedAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          <span>•</span>
                          <span className="font-pixel text-[8px] text-yellow-500 uppercase">
                            {page.authorCharacter || profile.character}
                          </span>
                        </div>
                      </div>

                      {/* Dropdown Options */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpenId(menuOpenId === page.id ? null : page.id);
                          }}
                          className="p-1 text-gray-400 hover:text-white hover:bg-[#333]"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {menuOpenId === page.id && (
                          <div
                            className="absolute right-0 bottom-8 w-44 bg-[#1e1e1e] border-2 border-[#555] shadow-2xl z-50 py-1 text-xs font-sans space-y-0.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => {
                                setMenuOpenId(null);
                                onOpenDocument(page.id);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-[#333] text-gray-200 flex items-center gap-2"
                            >
                              <FolderOpen className="w-3.5 h-3.5 text-yellow-400" />
                              Open Document
                            </button>

                            <button
                              onClick={() => {
                                setMenuOpenId(null);
                                onOpenShareModal(page);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-[#333] text-gray-200 flex items-center gap-2"
                            >
                              <Share2 className="w-3.5 h-3.5 text-green-400" />
                              Share Realm
                            </button>

                            <button
                              onClick={() => {
                                setMenuOpenId(null);
                                onOpenGoogleDriveModal(page);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-[#333] text-gray-200 flex items-center gap-2"
                            >
                              <Cloud className="w-3.5 h-3.5 text-blue-400" />
                              Sync to Google Drive
                            </button>

                            <button
                              onClick={() => {
                                setMenuOpenId(null);
                                onDuplicateDocument(page.id);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-[#333] text-gray-200 flex items-center gap-2"
                            >
                              <Copy className="w-3.5 h-3.5 text-purple-400" />
                              Duplicate
                            </button>

                            <button
                              onClick={() => {
                                setMenuOpenId(null);
                                onDeleteDocument(page.id);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-red-950/40 text-red-400 flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="bg-[#1e1e1e]/90 border-2 border-[#333] divide-y divide-[#2a2a2a]">
              {filteredPages.map((page) => (
                <div
                  key={page.id}
                  onClick={() => onOpenDocument(page.id)}
                  className="p-3.5 flex items-center justify-between hover:bg-[#282828] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-xl">{page.icon || '📄'}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-xs text-white truncate flex items-center gap-2">
                        {page.title || 'Untitled document'}
                        {page.driveFileId && (
                          <Cloud className="w-3.5 h-3.5 text-blue-400 inline" title="Drive Synced" />
                        )}
                        {page.isShared && (
                          <Users className="w-3.5 h-3.5 text-green-400 inline" title="Shared" />
                        )}
                      </div>
                      <div className="text-[11px] text-gray-400 font-sans truncate">
                        {page.blocks[0]?.content?.replace(/<[^>]*>/g, '') || 'No content yet'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-400 font-sans">
                    <span className="hidden sm:inline">
                      {new Date(page.updatedAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStar(page.id);
                      }}
                      className="p-1 text-gray-400 hover:text-yellow-400"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          page.isStarred ? 'fill-yellow-400 text-yellow-400' : ''
                        }`}
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenShareModal(page);
                      }}
                      className="p-1 text-gray-400 hover:text-green-400"
                      title="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Bottom Status / Footer Bar */}
      <footer className="relative z-20 bg-[#161616] border-t-2 border-[#2c2c2c] px-6 py-2 flex items-center justify-between text-[11px] text-gray-400 font-sans">
        <div className="flex items-center gap-3">
          <span className="font-pixel text-[9px] text-[#FFD700]">CRAFTDOCS v2.4</span>
          <span>•</span>
          <span>{pages.length} World Documents Total</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Logged in as <b>{profile.name}</b> ({profile.character.toUpperCase()})</span>
        </div>
      </footer>
    </div>
  );
};
