import { useState, useEffect, useCallback } from 'react';
import { Page, Block, BlockType, EditorMode, ToastMessage, PageSettings, ShareRole } from '../types/editor';
import {
  loadPagesFromStorage,
  savePagesToStorage,
  loadActivePageId,
  saveActivePageId,
  loadEditorMode,
  saveEditorMode,
} from '../utils/storage';
import { generateId, blocksToHtml, htmlToBlocks } from '../utils/converter';

export function useEditor() {
  const [pages, setPages] = useState<Page[]>(loadPagesFromStorage);
  const [activePageId, setActivePageId] = useState<string | null>(loadActivePageId);
  const [mode, setMode] = useState<EditorMode>(loadEditorMode);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Sync to localStorage
  useEffect(() => {
    savePagesToStorage(pages);
  }, [pages]);

  useEffect(() => {
    if (activePageId) {
      saveActivePageId(activePageId);
    }
  }, [activePageId]);

  useEffect(() => {
    saveEditorMode(mode);
  }, [mode]);

  // Active Page getter
  const activePage = pages.find((p) => p.id === activePageId) || pages[0] || null;

  // Show Toast / Achievement
  const showAchievement = useCallback((title: string, description: string, icon: string = '🏆') => {
    const id = Date.now().toString();
    setToast({ id, title, description, icon });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4000);
  }, []);

  // Mode Switcher with Seamless Content Conversion
  const toggleMode = useCallback(() => {
    setMode((prevMode) => {
      const nextMode = prevMode === 'survival' ? 'creative' : 'survival';

      // Show achievement popup
      if (nextMode === 'creative') {
        showAchievement('Achievement Unlocked!', 'Entered Creative Mode — Block Building Activated!', '🧱');
      } else {
        showAchievement('Achievement Unlocked!', 'Returned to Survival Mode — Linear Docs Active!', '⚔️');
      }

      return nextMode;
    });
  }, [showAchievement]);

  // Page Operations
  const selectPage = useCallback((pageId: string) => {
    setActivePageId(pageId);
  }, []);

  const createPage = useCallback((parentId: string | null = null, title: string = 'Untitled Note', icon: string = '📄', initialBlocks?: Block[]) => {
    const blocks: Block[] = (initialBlocks && initialBlocks.length > 0)
      ? initialBlocks.map((b) => ({ ...b, id: generateId() }))
      : [
          {
            id: generateId(),
            type: 'heading1',
            content: title,
          },
          {
            id: generateId(),
            type: 'text',
            content: 'Start typing your craft document...',
          },
        ];

    const newPage: Page = {
      id: generateId(),
      title,
      icon,
      parentId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      blocks,
    };

    setPages((prev) => [...prev, newPage]);
    setActivePageId(newPage.id);
    showAchievement('Crafting Complete!', `Created page: "${title}"`, '✨');
    return newPage;
  }, [showAchievement]);

  const updatePageShareSettings = useCallback((pageId: string, isPublic: boolean, publicRole: ShareRole) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== pageId) return p;
        return {
          ...p,
          isShared: isPublic,
          shareSettings: {
            ...p.shareSettings,
            isPublic,
            publicRole,
            sharedWith: p.shareSettings?.sharedWith || [],
            allowCopy: p.shareSettings?.allowCopy ?? true,
          },
          updatedAt: Date.now(),
        };
      })
    );
  }, []);

  const updatePageTitle = useCallback((pageId: string, newTitle: string) => {
    setPages((prev) =>
      prev.map((p) => (p.id === pageId ? { ...p, title: newTitle, updatedAt: Date.now() } : p))
    );
  }, []);

  const updatePageIcon = useCallback((pageId: string, icon: string) => {
    setPages((prev) =>
      prev.map((p) => (p.id === pageId ? { ...p, icon, updatedAt: Date.now() } : p))
    );
  }, []);

  const deletePage = useCallback((pageId: string) => {
    setPages((prevPages) => {
      // Delete page and any children attached to it
      const remaining = prevPages.filter((p) => p.id !== pageId && p.parentId !== pageId);
      if (activePageId === pageId) {
        setActivePageId(remaining[0]?.id || null);
      }
      return remaining;
    });
    showAchievement('Item Destroyed', 'Page moved to lava pit', '🔥');
  }, [activePageId, showAchievement]);

  const duplicatePage = useCallback((pageId: string) => {
    const target = pages.find((p) => p.id === pageId);
    if (!target) return;

    const dupPage: Page = {
      ...target,
      id: generateId(),
      title: `${target.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      blocks: target.blocks.map((b) => ({ ...b, id: generateId() })),
    };

    setPages((prev) => [...prev, dupPage]);
    setActivePageId(dupPage.id);
    showAchievement('Item Duplicated!', `Cloned "${target.title}"`, '📋');
  }, [pages, showAchievement]);

  const movePage = useCallback((pageId: string, newParentId: string | null) => {
    // Prevent nesting inside self
    if (pageId === newParentId) return;

    setPages((prev) =>
      prev.map((p) => (p.id === pageId ? { ...p, parentId: newParentId, updatedAt: Date.now() } : p))
    );
    showAchievement('Inventory Reordered', 'Updated page structure in inventory', '🎒');
  }, [showAchievement]);

  // Creative Mode Block Operations
  const updateBlockContent = useCallback((blockId: string, content: string) => {
    if (!activePageId) return;

    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== activePageId) return p;
        const newBlocks = p.blocks.map((b) => (b.id === blockId ? { ...b, content } : b));
        return { ...p, blocks: newBlocks, updatedAt: Date.now() };
      })
    );
  }, [activePageId]);

  const updateBlockType = useCallback((blockId: string, newType: BlockType) => {
    if (!activePageId) return;

    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== activePageId) return p;
        const newBlocks = p.blocks.map((b) => (b.id === blockId ? { ...b, type: newType } : b));
        return { ...p, blocks: newBlocks, updatedAt: Date.now() };
      })
    );
  }, [activePageId]);

  const addBlockBelow = useCallback((targetBlockId: string, newType: BlockType = 'text', content: string = '') => {
    if (!activePageId) return;

    const newBlock: Block = {
      id: generateId(),
      type: newType,
      content,
    };

    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== activePageId) return p;
        const index = p.blocks.findIndex((b) => b.id === targetBlockId);
        const newBlocks = [...p.blocks];
        if (index >= 0) {
          newBlocks.splice(index + 1, 0, newBlock);
        } else {
          newBlocks.push(newBlock);
        }
        return { ...p, blocks: newBlocks, updatedAt: Date.now() };
      })
    );

    return newBlock.id;
  }, [activePageId]);

  const deleteBlock = useCallback((blockId: string) => {
    if (!activePageId) return;

    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== activePageId) return p;
        if (p.blocks.length <= 1) {
          // Keep at least one empty block
          return {
            ...p,
            blocks: [{ id: generateId(), type: 'text', content: '' }],
            updatedAt: Date.now(),
          };
        }
        return {
          ...p,
          blocks: p.blocks.filter((b) => b.id !== blockId),
          updatedAt: Date.now(),
        };
      })
    );
  }, [activePageId]);

  const reorderBlocks = useCallback((dragIndex: number, hoverIndex: number) => {
    if (!activePageId) return;

    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== activePageId) return p;
        const reordered = [...p.blocks];
        const [moved] = reordered.splice(dragIndex, 1);
        reordered.splice(hoverIndex, 0, moved);
        return { ...p, blocks: reordered, updatedAt: Date.now() };
      })
    );
  }, [activePageId]);

  // Survival Mode HTML Syncing
  const updatePageFromHtml = useCallback((html: string) => {
    if (!activePageId) return;

    const parsedBlocks = htmlToBlocks(html);

    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== activePageId) return p;
        return {
          ...p,
          blocks: parsedBlocks,
          updatedAt: Date.now(),
        };
      })
    );
  }, [activePageId]);

  // Derived HTML content for Survival Editor
  const activePageHtml = activePage ? blocksToHtml(activePage.blocks) : '';

  const updatePageSettings = useCallback((settings: PageSettings) => {
    if (!activePageId) return;

    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== activePageId) return p;
        return {
          ...p,
          pageSettings: settings,
          updatedAt: Date.now(),
        };
      })
    );
    showAchievement('Page Setup Updated', `Applied ${settings.pageSize.toUpperCase()} (${settings.pageColor}) layout`, '📄');
  }, [activePageId, showAchievement]);

  const toggleStarPage = useCallback((pageId?: string) => {
    const targetId = pageId || activePageId;
    if (!targetId) return;

    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== targetId) return p;
        const isStarred = !p.isStarred;
        return { ...p, isStarred, updatedAt: Date.now() };
      })
    );
  }, [activePageId]);

  // Find occurrences in active page blocks
  const findInPage = useCallback((searchTerm: string, matchCase: boolean): number => {
    if (!activePage || !searchTerm) return 0;
    let count = 0;
    const regex = new RegExp(
      searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      matchCase ? 'g' : 'gi'
    );

    activePage.blocks.forEach((b) => {
      const matches = b.content.match(regex);
      if (matches) count += matches.length;
    });

    return count;
  }, [activePage]);

  // Replace first match in active page
  const replaceInPage = useCallback((searchTerm: string, replaceWith: string, matchCase: boolean) => {
    if (!activePageId || !searchTerm) return;
    let replaced = false;

    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== activePageId) return p;
        const newBlocks = p.blocks.map((b) => {
          if (replaced) return b;
          const regex = new RegExp(
            searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
            matchCase ? '' : 'i'
          );
          if (regex.test(b.content)) {
            replaced = true;
            return { ...b, content: b.content.replace(regex, replaceWith) };
          }
          return b;
        });
        return { ...p, blocks: newBlocks, updatedAt: Date.now() };
      })
    );
  }, [activePageId]);

  // Replace all matches in active page
  const replaceAllInPage = useCallback((searchTerm: string, replaceWith: string, matchCase: boolean) => {
    if (!activePageId || !searchTerm) return;

    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== activePageId) return p;
        const regex = new RegExp(
          searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          matchCase ? 'g' : 'gi'
        );
        const newBlocks = p.blocks.map((b) => ({
          ...b,
          content: b.content.replace(regex, replaceWith),
        }));
        return { ...p, blocks: newBlocks, updatedAt: Date.now() };
      })
    );
    showAchievement('Replace Complete', `Replaced all instances of "${searchTerm}"`, '✨');
  }, [activePageId, showAchievement]);

  const clearActivePage = useCallback(() => {
    if (!activePageId) return;

    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== activePageId) return p;
        return {
          ...p,
          blocks: [
            {
              id: generateId(),
              type: 'heading1',
              content: '💥 Document Detonated by Creeper!',
            },
            {
              id: generateId(),
              type: 'text',
              content: 'A wild Creeper spawned and blew up this page. Type here to rebuild your document block by block...',
            },
          ],
          updatedAt: Date.now(),
        };
      })
    );
    showAchievement('BOOM! Crater Created', 'Creeper blew up your active page!', '💥');
  }, [activePageId, showAchievement]);

  const updateBlockProps = useCallback((blockId: string, updatedProps: Partial<Block>) => {
    if (!activePageId) return;

    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== activePageId) return p;
        const newBlocks = p.blocks.map((b) => (b.id === blockId ? { ...b, ...updatedProps } : b));
        return { ...p, blocks: newBlocks, updatedAt: Date.now() };
      })
    );
  }, [activePageId]);

  return {
    pages,
    activePage,
    activePageId,
    mode,
    toast,
    toggleMode,
    selectPage,
    createPage,
    updatePageTitle,
    updatePageIcon,
    deletePage,
    duplicatePage,
    movePage,
    updateBlockContent,
    updateBlockType,
    updateBlockProps,
    addBlockBelow,
    deleteBlock,
    reorderBlocks,
    updatePageFromHtml,
    activePageHtml,
    updatePageSettings,
    updatePageShareSettings,
    toggleStarPage,
    findInPage,
    replaceInPage,
    replaceAllInPage,
    clearActivePage,
    showAchievement,
  };
}
