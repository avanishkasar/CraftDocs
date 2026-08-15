import React, { useState } from 'react';
import { Page, SidebarMode } from '../types/editor';
import { ChevronLeft, ChevronRight, Plus, Search, Layers, MoreVertical, Trash2, Copy, Edit2, Minimize2, Maximize2 } from 'lucide-react';

interface SidebarProps {
  pages: Page[];
  activePageId: string | null;
  onSelectPage: (id: string) => void;
  onCreatePage: (parentId?: string | null, title?: string, icon?: string) => void;
  onRenamePage: (id: string, title: string) => void;
  onDuplicatePage: (id: string) => void;
  onDeletePage: (id: string) => void;
  onMovePage: (id: string, newParentId: string | null) => void;
  isOpen?: boolean;
  sidebarMode: SidebarMode;
  onChangeSidebarMode: (mode: SidebarMode) => void;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  pages,
  activePageId,
  onSelectPage,
  onCreatePage,
  onRenamePage,
  onDuplicatePage,
  onDeletePage,
  onMovePage,
  sidebarMode,
  onChangeSidebarMode,
  onCloseMobile,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [collapsedIds, setCollapsedIds] = useState<Record<string, boolean>>({});
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const [draggedPageId, setDraggedPageId] = useState<string | null>(null);
  const [isRailSearchOpen, setIsRailSearchOpen] = useState(false);

  // Group pages by parentId
  const rootPages = pages.filter((p) => !p.parentId && !p.isTrash);

  const getChildren = (parentId: string) => pages.filter((p) => p.parentId === parentId && !p.isTrash);

  const toggleCollapse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStartRename = (page: Page, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingId(page.id);
    setEditingTitle(page.title);
    setContextMenu(null);
  };

  const handleSaveRename = (id: string) => {
    if (editingTitle.trim()) {
      onRenamePage(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  const handleKeyDownRename = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleSaveRename(id);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setContextMenu({ id, x: e.clientX, y: e.clientY });
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.stopPropagation();
    setDraggedPageId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnPage = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedPageId && draggedPageId !== targetId) {
      onMovePage(draggedPageId, targetId);
    }
    setDraggedPageId(null);
  };

  const handleDropOnRoot = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedPageId) {
      onMovePage(draggedPageId, null);
    }
    setDraggedPageId(null);
  };

  // Filter pages by search term
  const filteredPages = pages.filter(
    (p) => !p.isTrash && p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderPageTree = (pageList: Page[], depth: number = 0) => {
    return pageList.map((page) => {
      const children = getChildren(page.id);
      const hasChildren = children.length > 0;
      const isCollapsed = collapsedIds[page.id];
      const isActive = page.id === activePageId;
      const isEditing = editingId === page.id;

      return (
        <div key={page.id} className="flex flex-col">
          <div
            draggable={!isEditing}
            onDragStart={(e) => handleDragStart(e, page.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDropOnPage(e, page.id)}
            onContextMenu={(e) => handleContextMenu(e, page.id)}
            onClick={() => {
              onSelectPage(page.id);
              if (onCloseMobile) onCloseMobile();
            }}
            style={{ paddingLeft: `${depth * 12 + 6}px` }}
            className={`group py-1.5 pr-2 flex items-center justify-between cursor-pointer border-b border-[#1f1407]/50 transition-colors select-none text-xs ${
              isActive
                ? 'bg-[#3d2b17] text-[#FFFF55] border-l-2 border-l-[#FFD700] font-bold shadow-inner'
                : 'text-amber-100/80 hover:bg-[#382613] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-1.5 overflow-hidden flex-1 min-w-0">
              {/* Collapse Arrow */}
              {hasChildren ? (
                <button
                  onClick={(e) => toggleCollapse(page.id, e)}
                  className="w-3.5 h-3.5 flex items-center justify-center text-[9px] text-amber-400/80 hover:text-white font-pixel shrink-0"
                >
                  {isCollapsed ? '▶' : '▼'}
                </button>
              ) : (
                <span className="w-3.5 h-3.5 shrink-0" />
              )}

              {/* Page Icon */}
              <span className="text-sm shrink-0">{page.icon || '📄'}</span>

              {/* Title / Edit input */}
              {isEditing ? (
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onBlur={() => handleSaveRename(page.id)}
                  onKeyDown={(e) => handleKeyDownRename(e, page.id)}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                  className="bg-[#120b04] text-amber-200 border border-[#FFD700] px-1 py-0.5 text-[11px] font-pixel w-full focus:outline-none"
                />
              ) : (
                <span className="text-[11px] truncate font-pixel leading-tight">
                  {page.title}
                </span>
              )}
            </div>

            {/* Quick Actions Menu Trigger */}
            <div className="hidden group-hover:flex items-center gap-0.5 shrink-0 ml-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCreatePage(page.id, 'Sub-Note', '📜');
                }}
                className="text-[10px] text-amber-300 hover:text-white p-0.5"
                title="Add Sub-Page"
              >
                ➕
              </button>
              <button
                onClick={(e) => handleContextMenu(e, page.id)}
                className="text-[10px] text-amber-300 hover:text-white p-0.5"
                title="Options"
              >
                ⋮
              </button>
            </div>
          </div>

          {/* Child Pages */}
          {hasChildren && !isCollapsed && (
            <div className="flex flex-col">
              {renderPageTree(children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  // If Hidden Mode
  if (sidebarMode === 'hidden') {
    return (
      <div className="relative z-20">
        <button
          onClick={() => onChangeSidebarMode('rail')}
          className="absolute top-3 left-0 bg-[#2d1e11] hover:bg-[#3d2b17] border border-l-0 border-[#555] hover:border-[#FFD700] text-amber-300 p-1.5 rounded-r shadow-lg z-30 flex items-center justify-center cursor-pointer transition-colors"
          title="Open Inventory Sidebar (Mini Rail)"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // If Mini Rail Mode (~44px width)
  if (sidebarMode === 'rail') {
    return (
      <aside className="mc-oak-wood-bg w-11 h-full flex flex-col items-center py-2 shrink-0 relative z-20 border-r border-[#120b04] select-none no-print">
        {/* Top: Expand Drawer Button */}
        <button
          onClick={() => onChangeSidebarMode('expanded')}
          className="w-7 h-7 flex items-center justify-center text-amber-300 hover:text-white bg-[#2a1b0d] hover:bg-[#3d2814] border border-[#4a3219] hover:border-[#FFD700] mb-2 cursor-pointer shadow-sm"
          title="Expand Inventory (Full Tree)"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Quick New Page Button */}
        <button
          onClick={() => onCreatePage(null, 'New Craft Note', '📄')}
          className="w-7 h-7 flex items-center justify-center text-[#55FF55] hover:text-white bg-[#1e2e1a] hover:bg-[#273d22] border border-[#55FF55] mb-2 cursor-pointer shadow-sm active:scale-95"
          title="Create New Page (+)"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        {/* Search Toggle */}
        <div className="relative mb-2">
          <button
            onClick={() => setIsRailSearchOpen(!isRailSearchOpen)}
            className={`w-7 h-7 flex items-center justify-center text-amber-300 hover:text-white border cursor-pointer ${
              isRailSearchOpen
                ? 'bg-[#3d2814] border-[#FFD700]'
                : 'bg-[#2a1b0d] border-[#4a3219] hover:border-amber-400'
            }`}
            title="Search Notes"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {/* Mini Search Flyout */}
          {isRailSearchOpen && (
            <div className="absolute left-9 top-0 w-56 bg-[#2a1b0d] border-2 border-[#FFD700] p-2 shadow-2xl z-50 flex flex-col gap-1.5 font-pixel text-xs">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                className="w-full bg-[#120b04] border border-[#555] px-2 py-1 text-amber-200 text-[11px] focus:outline-none focus:border-[#FFD700]"
              />
              <div className="max-h-48 overflow-y-auto custom-scrollbar flex flex-col gap-0.5">
                {filteredPages.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectPage(p.id);
                      setIsRailSearchOpen(false);
                    }}
                    className={`text-left px-2 py-1 text-[10px] flex items-center gap-1.5 truncate ${
                      p.id === activePageId
                        ? 'bg-[#3d2b17] text-[#FFFF55]'
                        : 'text-amber-200 hover:bg-[#3a2512]'
                    }`}
                  >
                    <span>{p.icon || '📄'}</span>
                    <span className="truncate">{p.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mini Document Icon Rail List */}
        <div className="flex-1 w-full overflow-y-auto custom-scrollbar flex flex-col items-center gap-1.5 py-1 px-1">
          {pages
            .filter((p) => !p.isTrash)
            .map((page) => {
              const isActive = page.id === activePageId;
              return (
                <button
                  key={page.id}
                  onClick={() => onSelectPage(page.id)}
                  className={`w-7 h-7 flex items-center justify-center text-sm border cursor-pointer transition-transform hover:scale-105 relative group ${
                    isActive
                      ? 'bg-[#3d2b17] border-[#FFD700] shadow-sm ring-1 ring-[#FFD700]'
                      : 'bg-[#22150a] border-[#382310] hover:border-amber-400'
                  }`}
                  title={page.title}
                >
                  <span>{page.icon || '📄'}</span>
                  {/* Tooltip on hover */}
                  <div className="hidden group-hover:block absolute left-9 top-0 px-2 py-1 bg-[#120b04] border border-[#FFD700] text-amber-200 text-[10px] font-pixel whitespace-nowrap shadow-xl z-50 pointer-events-none">
                    {page.title}
                  </div>
                </button>
              );
            })}
        </div>

        {/* Bottom: Collapse Completely Button */}
        <button
          onClick={() => onChangeSidebarMode('hidden')}
          className="w-7 h-7 flex items-center justify-center text-amber-400/70 hover:text-white bg-[#1a1006] hover:bg-[#2e1c0c] border border-[#382310] mt-auto cursor-pointer"
          title="Hide Sidebar"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      </aside>
    );
  }

  // Full Expanded Mode (~220px width - slim & compact)
  return (
    <>
      <aside className="mc-oak-wood-bg w-56 sm:w-60 h-full flex flex-col shrink-0 relative z-20 border-r-2 border-[#120b04] select-none no-print">
        {/* Header with compact switcher controls */}
        <div className="px-3 py-2 border-b-2 border-[#120b04] flex items-center justify-between bg-[#24170b]/90">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">📚</span>
            <h2 className="font-pixel text-xs text-[#FFD700] tracking-wider text-shadow">
              INVENTORY
            </h2>
          </div>

          <div className="flex items-center gap-1">
            {/* Switch to Mini Rail Mode */}
            <button
              onClick={() => onChangeSidebarMode('rail')}
              className="p-1 text-amber-300 hover:text-white hover:bg-[#3d2814] border border-transparent hover:border-[#555] cursor-pointer"
              title="Shrink to Mini Rail (Compact Icons)"
            >
              <Minimize2 className="w-3 h-3" />
            </button>
            {/* Hide completely */}
            <button
              onClick={() => onChangeSidebarMode('hidden')}
              className="p-1 text-amber-300 hover:text-white hover:bg-[#3d2814] border border-transparent hover:border-[#555] cursor-pointer"
              title="Hide Sidebar"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Compact Crafting Button: + NEW PAGE */}
        <div className="p-2 border-b border-[#1f1407]">
          <button
            onClick={() => onCreatePage(null, 'New Craft Note', '📄')}
            className="w-full py-1.5 px-2 bg-[#1e2e1a] border border-[#55FF55] hover:bg-[#273d22] text-[#55FF55] font-pixel text-[11px] flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow active:scale-98 transition-all"
          >
            <span>✨</span>
            <span>+ NEW PAGE</span>
          </button>
        </div>

        {/* Slim Search Bar */}
        <div className="px-2 py-1.5 border-b border-[#1f1407]">
          <div className="relative flex items-center">
            <Search className="w-3 h-3 text-amber-600 absolute left-2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#171008] border border-[#3d2812] text-amber-100 font-pixel text-[10px] pl-6 pr-2 py-1 placeholder-amber-700 focus:outline-none focus:border-[#FFD700]"
            />
          </div>
        </div>

        {/* Page Tree Container */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDropOnRoot}
          className="flex-1 overflow-y-auto custom-scrollbar"
        >
          {searchTerm ? (
            <div className="py-1">
              {filteredPages.map((page) => (
                <div
                  key={page.id}
                  onClick={() => onSelectPage(page.id)}
                  className={`px-2.5 py-1.5 text-xs font-pixel cursor-pointer flex items-center gap-1.5 ${
                    page.id === activePageId
                      ? 'bg-[#3d2b17] text-[#FFFF55]'
                      : 'text-amber-100/80 hover:bg-[#382613]'
                  }`}
                >
                  <span className="text-sm">{page.icon || '📄'}</span>
                  <span className="truncate text-[11px]">{page.title}</span>
                </div>
              ))}
            </div>
          ) : (
            renderPageTree(rootPages, 0)
          )}
        </div>

        {/* Slim Footer */}
        <div className="px-2.5 py-1.5 border-t border-[#120b04] bg-[#1a1208] text-[9px] font-pixel text-amber-500/70 flex items-center justify-between">
          <span>PAGES: {pages.filter((p) => !p.isTrash).length}</span>
          <button
            onClick={() => onChangeSidebarMode('rail')}
            className="text-amber-400 hover:underline cursor-pointer"
          >
            Mini Rail
          </button>
        </div>
      </aside>

      {/* Context Menu Popup */}
      {contextMenu && (
        <div
          className="fixed inset-0 z-50 bg-black/20"
          onClick={() => setContextMenu(null)}
        >
          <div
            style={{ top: contextMenu.y, left: contextMenu.x }}
            className="fixed mc-window-dark p-1.5 w-44 shadow-2xl font-pixel text-[11px] z-50 flex flex-col gap-0.5"
          >
            <button
              onClick={() => {
                const target = pages.find((p) => p.id === contextMenu.id);
                if (target) handleStartRename(target);
              }}
              className="text-left px-2.5 py-1.5 text-amber-200 hover:bg-[#3a5fcd] hover:text-white flex items-center gap-2"
            >
              <Edit2 className="w-3 h-3" />
              <span>Rename</span>
            </button>
            <button
              onClick={() => {
                onCreatePage(contextMenu.id, 'Child Note', '📜');
                setContextMenu(null);
              }}
              className="text-left px-2.5 py-1.5 text-amber-200 hover:bg-[#3a5fcd] hover:text-white flex items-center gap-2"
            >
              <Plus className="w-3 h-3" />
              <span>Add Child Page</span>
            </button>
            <button
              onClick={() => {
                onDuplicatePage(contextMenu.id);
                setContextMenu(null);
              }}
              className="text-left px-2.5 py-1.5 text-amber-200 hover:bg-[#3a5fcd] hover:text-white flex items-center gap-2"
            >
              <Copy className="w-3 h-3" />
              <span>Duplicate</span>
            </button>
            <div className="h-0.5 bg-[#3f3f5a] my-0.5" />
            <button
              onClick={() => {
                onDeletePage(contextMenu.id);
                setContextMenu(null);
              }}
              className="text-left px-2.5 py-1.5 text-red-400 hover:bg-red-900/80 hover:text-white flex items-center gap-2"
            >
              <Trash2 className="w-3 h-3" />
              <span>Drop in Lava</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
