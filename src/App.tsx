import React, { useState, useRef, useCallback } from 'react';
import { useEditor } from './hooks/useEditor';
import { useAutoSave } from './hooks/useAutoSave';
import {
  savePagesToStorage,
  loadUserProfile,
  saveUserProfile,
} from './utils/storage';
import {
  calculateWordCountFromBlocks,
  calculateWordCountFromHtml,
} from './utils/converter';
import {
  UserProfile,
  ThemeMode,
  DEFAULT_PAGE_SETTINGS,
  PageSettings,
  Page,
  DocumentTemplate,
  UiDensity,
  SidebarMode,
} from './types/editor';

import { GoogleDocsMenuBar } from './components/GoogleDocsMenuBar';
import { Toolbar } from './components/Toolbar';
import { Sidebar } from './components/Sidebar';
import { StatusBar } from './components/StatusBar';
import { CreativeEditor } from './components/CreativeEditor';
import { SurvivalEditor } from './components/SurvivalEditor';
import { Toast } from './components/Toast';
import { SignupModal } from './components/SignupModal';
import { SettingsModal } from './components/SettingsModal';
import { PageSetupModal } from './components/PageSetupModal';
import { FindReplaceModal } from './components/FindReplaceModal';
import { WordCountModal } from './components/WordCountModal';
import { SpecialCharactersModal } from './components/SpecialCharactersModal';
import { MinecraftCompanion } from './components/MinecraftCompanion';
import { CreeperExplosion } from './components/CreeperExplosion';
import { HomePage } from './components/HomePage';
import { ShareModal } from './components/ShareModal';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { GeminiEnchantmentModal } from './components/GeminiEnchantmentModal';

export default function App() {
  const {
    pages,
    activePage,
    mode,
    toast,
    toggleMode,
    selectPage,
    createPage,
    updatePageTitle,
    deletePage,
    duplicatePage,
    movePage,
    updateBlockContent,
    updateBlockType,
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
  } = useEditor();

  const [currentView, setCurrentView] = useState<'home' | 'editor'>('editor');
  const [uiDensity, setUiDensity] = useState<UiDensity>(() => {
    return (localStorage.getItem('craftdocs_ui_density') as UiDensity) || 'compact';
  });
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>(() => {
    return (localStorage.getItem('craftdocs_sidebar_mode') as SidebarMode) || 'rail';
  });
  const [profile, setProfile] = useState<UserProfile>(loadUserProfile);
  const [isSignupOpen, setIsSignupOpen] = useState(!profile.isSignedUp);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPageSetupOpen, setIsPageSetupOpen] = useState(false);
  const [isFindReplaceOpen, setIsFindReplaceOpen] = useState(false);
  const [isWordCountOpen, setIsWordCountOpen] = useState(false);
  const [isSpecialCharsOpen, setIsSpecialCharsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isDriveOpen, setIsDriveOpen] = useState(false);
  const [isGeminiOpen, setIsGeminiOpen] = useState(false);
  const [isCreeperActive, setIsCreeperActive] = useState(false);
  const [selectedSharePage, setSelectedSharePage] = useState<Page | null>(null);

  const survivalEditorRef = useRef<HTMLDivElement | null>(null);

  // Active page settings fallback
  const currentSettings: PageSettings = activePage?.pageSettings || DEFAULT_PAGE_SETTINGS;

  // Save profile changes
  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    saveUserProfile(newProfile);
    showAchievement(
      'Profile Updated!',
      `Playing as ${newProfile.name} (${newProfile.character.toUpperCase()})`,
      newProfile.character === 'alex' ? '🟩' : '🟦'
    );
  };

  const handleToggleTheme = (nextTheme: ThemeMode) => {
    const updated = { ...profile, theme: nextTheme };
    setProfile(updated);
    saveUserProfile(updated);
    showAchievement(
      nextTheme === 'night' ? 'Nether Night Active' : 'Overworld Day Active',
      nextTheme === 'night' ? 'Obsidian Glass Theme Engaged' : 'Parchment Sun Theme Engaged',
      nextTheme === 'night' ? '🌙' : '☀️'
    );
  };

  const handleSignOut = () => {
    const defaultProfile: UserProfile = {
      name: 'Steve',
      character: 'steve',
      theme: 'day',
      isSignedUp: false,
    };
    setProfile(defaultProfile);
    saveUserProfile(defaultProfile);
    setIsSignupOpen(true);
    showAchievement('Signed Out', 'Choose your character to sign in', '👋');
  };

  // Auto save hook
  const { statusText: saveStatusText } = useAutoSave(pages, savePagesToStorage, 30000);

  // Calculate word & character metrics
  const wordCount = activePage
    ? mode === 'creative'
      ? calculateWordCountFromBlocks(activePage.blocks)
      : calculateWordCountFromHtml(activePageHtml)
    : 0;

  const rawText = activePage
    ? activePage.blocks.map((b) => b.content).join(' ')
    : '';
  const charCount = rawText.length;
  const charNoSpaceCount = rawText.replace(/\s+/g, '').length;

  // Template document creation
  const handleCreateDocument = (template?: DocumentTemplate) => {
    if (!template || template.id === 'blank') {
      createPage(null, 'Untitled document', '📄');
    } else {
      createPage(null, template.name, template.icon, template.blocks);
    }
    setCurrentView('editor');
    showAchievement('World Scroll Created', template ? template.name : 'Blank Parchment', '📜');
  };

  // Open specific document and switch view
  const handleOpenDocument = (pageId: string) => {
    selectPage(pageId);
    setCurrentView('editor');
  };

  // Open share modal
  const handleOpenShare = (page?: Page) => {
    setSelectedSharePage(page || activePage);
    setIsShareOpen(true);
  };

  // Google Drive import and sync handler
  const handleImportDrivePage = (newPage: Page) => {
    createPage(null, newPage.title, newPage.icon, newPage.blocks);
    setCurrentView('editor');
  };

  const handleDrivePageSynced = (pageId: string, driveFileId: string, syncedAt: number) => {
    if (activePage && activePage.id === pageId) {
      updatePageSettings({
        ...currentSettings,
      });
    }
  };

  // Gemini AI Text replacement and insert
  const handleGeminiApplyReplacement = (newContent: string) => {
    if (mode === 'survival') {
      const formattedHtml = newContent
        .split('\n\n')
        .map((p) => `<p>${p}</p>`)
        .join('');
      updatePageFromHtml(formattedHtml);
      if (survivalEditorRef.current) {
        survivalEditorRef.current.innerHTML = formattedHtml;
      }
    } else if (activePage && activePage.blocks.length > 0) {
      const firstBlockId = activePage.blocks[0].id;
      updateBlockContent(firstBlockId, newContent);
    }
  };

  const handleGeminiInsertBelow = (newContent: string) => {
    if (mode === 'survival') {
      const appendHtml = `<p>${newContent}</p>`;
      const full = (activePageHtml || '') + appendHtml;
      updatePageFromHtml(full);
      if (survivalEditorRef.current) {
        survivalEditorRef.current.innerHTML = full;
      }
    } else if (activePage && activePage.blocks.length > 0) {
      const lastBlockId = activePage.blocks[activePage.blocks.length - 1].id;
      addBlockBelow(lastBlockId, 'text', newContent);
    }
    showAchievement('Enchantment Inscribed', 'AI content added to parchment', '✨');
  };

  // Formatting actions from Toolbar & MenuBar
  const handleFormat = useCallback(
    (command: string, value: string = '') => {
      if (command === 'zoom') {
        const nextZoom = parseInt(value, 10) || 100;
        updatePageSettings({ ...currentSettings, zoomLevel: nextZoom });
        return;
      }
      if (command === 'lineSpacing') {
        updatePageSettings({ ...currentSettings, lineSpacing: value });
        return;
      }

      if (mode === 'survival') {
        if (survivalEditorRef.current) {
          survivalEditorRef.current.focus();
          document.execCommand(command, false, value);
          updatePageFromHtml(survivalEditorRef.current.innerHTML);
        }
      } else {
        // Creative mode block level formatting
        if (activePage && activePage.blocks.length > 0) {
          const firstBlockId = activePage.blocks[0].id;
          if (command === 'formatBlock') {
            if (value === '<h1>') updateBlockType(firstBlockId, 'heading1');
            else if (value === '<h2>') updateBlockType(firstBlockId, 'heading2');
            else if (value === '<h3>') updateBlockType(firstBlockId, 'heading3');
            else if (value === '<blockquote>') updateBlockType(firstBlockId, 'quote');
            else if (value === '<pre>') updateBlockType(firstBlockId, 'code');
          } else if (command === 'insertUnorderedList') {
            updateBlockType(firstBlockId, 'bulletList');
          } else if (command === 'insertOrderedList') {
            updateBlockType(firstBlockId, 'numberedList');
          } else if (command === 'insertImage') {
            addBlockBelow(firstBlockId, 'image', value);
          } else if (command === 'insertText') {
            updateBlockContent(firstBlockId, activePage.blocks[0].content + value);
          }
        }
      }
    },
    [
      mode,
      activePage,
      currentSettings,
      updatePageSettings,
      updatePageFromHtml,
      updateBlockType,
      addBlockBelow,
      updateBlockContent,
    ]
  );

  // Export handlers
  const handleExport = (format: 'pdf' | 'txt' | 'md' | 'html' | 'json') => {
    if (!activePage) return;
    const title = activePage.title || 'craftdocs-document';

    if (format === 'pdf') {
      window.print();
      return;
    }

    let fileContent = '';
    let mimeType = 'text/plain';
    let fileExt = 'txt';

    if (format === 'txt') {
      fileContent = activePage.blocks.map((b) => b.content).join('\n\n');
      mimeType = 'text/plain';
      fileExt = 'txt';
    } else if (format === 'md') {
      fileContent = `# ${activePage.title}\n\n` + activePage.blocks.map((b) => {
        if (b.type === 'heading1') return `# ${b.content}`;
        if (b.type === 'heading2') return `## ${b.content}`;
        if (b.type === 'heading3') return `### ${b.content}`;
        if (b.type === 'bulletList') return `* ${b.content}`;
        if (b.type === 'numberedList') return `1. ${b.content}`;
        if (b.type === 'quote') return `> ${b.content}`;
        if (b.type === 'code') return `\`\`\`\n${b.content}\n\`\`\``;
        return b.content;
      }).join('\n\n');
      mimeType = 'text/markdown';
      fileExt = 'md';
    } else if (format === 'html') {
      fileContent = `<!DOCTYPE html><html><head><title>${activePage.title}</title><meta charset="utf-8"/></head><body style="max-width:800px;margin:40px auto;font-family:sans-serif;line-height:1.6;padding:20px;"><h1>${activePage.title}</h1>${activePageHtml}</body></html>`;
      mimeType = 'text/html';
      fileExt = 'html';
    } else if (format === 'json') {
      fileContent = JSON.stringify(activePage, null, 2);
      mimeType = 'application/json';
      fileExt = 'json';
    }

    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]/gi, '_')}.${fileExt}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showAchievement('Export Successful', `Exported as .${fileExt}`, '📥');
  };

  const handleInsertSpecialChar = (char: string) => {
    if (mode === 'survival') {
      if (survivalEditorRef.current) {
        survivalEditorRef.current.focus();
        document.execCommand('insertText', false, char);
        updatePageFromHtml(survivalEditorRef.current.innerHTML);
      }
    } else {
      if (activePage && activePage.blocks.length > 0) {
        const firstBlockId = activePage.blocks[0].id;
        updateBlockContent(firstBlockId, activePage.blocks[0].content + char);
      }
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#121212] text-gray-100 overflow-hidden font-doc selection:bg-[#FFD700] selection:text-[#000]">
      {currentView === 'home' ? (
        /* Minecraft Home Page Hub */
        <HomePage
          pages={pages}
          profile={profile}
          onOpenDocument={handleOpenDocument}
          onCreateNewDocument={handleCreateDocument}
          onDuplicateDocument={duplicatePage}
          onDeleteDocument={deletePage}
          onToggleStar={(id) => toggleStarPage(id)}
          onOpenShareModal={handleOpenShare}
          onOpenGoogleDriveModal={() => setIsDriveOpen(true)}
          onOpenSettingsModal={() => setIsSettingsOpen(true)}
          onOpenSignupModal={() => setIsSignupOpen(true)}
          onToggleTheme={handleToggleTheme}
          onSignOut={handleSignOut}
        />
      ) : (
        /* Full Minecraft Google Docs & Notion Editor */
        <>
          {/* Top Google Docs Menu Bar */}
          <GoogleDocsMenuBar
            activePage={activePage}
            mode={mode}
            pageSettings={currentSettings}
            profile={profile}
            isSidebarOpen={sidebarMode !== 'hidden'}
            onGoHome={() => setCurrentView('home')}
            onUpdateTitle={(title) => activePage && updatePageTitle(activePage.id, title)}
            onToggleStar={() => toggleStarPage(activePage?.id)}
            onNewPage={() => handleCreateDocument()}
            onDuplicatePage={() => activePage && duplicatePage(activePage.id)}
            onDeletePage={() => activePage && deletePage(activePage.id)}
            onToggleSidebar={() =>
              setSidebarMode((prev) => (prev === 'hidden' ? 'rail' : prev === 'rail' ? 'expanded' : 'hidden'))
            }
            onToggleMode={toggleMode}
            onOpenPageSetup={() => setIsPageSetupOpen(true)}
            onOpenFindReplace={() => setIsFindReplaceOpen(true)}
            onOpenWordCount={() => setIsWordCountOpen(true)}
            onOpenSpecialCharacters={() => setIsSpecialCharsOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenShareModal={() => handleOpenShare()}
            onOpenGeminiModal={() => setIsGeminiOpen(true)}
            onOpenGoogleDriveModal={() => setIsDriveOpen(true)}
            onFormat={handleFormat}
            onExport={handleExport}
            onZoomChange={(zoom) => updatePageSettings({ ...currentSettings, zoomLevel: zoom })}
            onTriggerCreeper={() => setIsCreeperActive(true)}
            uiDensity={uiDensity}
            onChangeUiDensity={(d) => {
              setUiDensity(d);
              localStorage.setItem('craftdocs_ui_density', d);
              showAchievement(
                d === 'compact' ? 'Compact UI Active' : d === 'zen' ? 'Zen Full Focus Active' : 'Standard UI Active',
                d === 'compact' ? 'Streamlined single-row toolbar for max document view' : d === 'zen' ? 'Distraction free writing canvas' : 'Google Docs multi-tier view',
                '⚡'
              );
            }}
          />

          {/* Formatted Action Toolbar */}
          <Toolbar
            mode={mode}
            onToggleMode={toggleMode}
            onFormat={handleFormat}
            pageSettings={currentSettings}
            onOpenPageSetup={() => setIsPageSetupOpen(true)}
            onOpenFindReplace={() => setIsFindReplaceOpen(true)}
            onOpenSpecialCharacters={() => setIsSpecialCharsOpen(true)}
            onSidebarToggle={() =>
              setSidebarMode((prev) => (prev === 'hidden' ? 'rail' : prev === 'rail' ? 'expanded' : 'hidden'))
            }
            isSidebarOpen={sidebarMode !== 'hidden'}
            uiDensity={uiDensity}
            onChangeUiDensity={(d) => {
              setUiDensity(d);
              localStorage.setItem('craftdocs_ui_density', d);
              showAchievement(
                d === 'compact' ? 'Compact UI Active' : d === 'zen' ? 'Zen Full Focus Active' : 'Standard UI Active',
                d === 'compact' ? 'Streamlined single-row toolbar for max document view' : d === 'zen' ? 'Distraction free writing canvas' : 'Google Docs multi-tier view',
                '⚡'
              );
            }}
          />

          {/* Main Container */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* Inventory Sidebar */}
            <Sidebar
              pages={pages}
              activePageId={activePage?.id || null}
              onSelectPage={selectPage}
              onCreatePage={(parentId, title, icon) => createPage(parentId, title, icon)}
              onRenamePage={(id, title) => updatePageTitle(id, title)}
              onDuplicatePage={duplicatePage}
              onDeletePage={deletePage}
              onMovePage={movePage}
              sidebarMode={sidebarMode}
              onChangeSidebarMode={(mode) => {
                setSidebarMode(mode);
                localStorage.setItem('craftdocs_sidebar_mode', mode);
              }}
              onCloseMobile={() => setSidebarMode('hidden')}
            />

            {/* Main Editor View (Survival Google Docs vs Creative Notion Blocks) */}
            <main className="flex-1 flex flex-col bg-[#1a1a1a] overflow-hidden relative">
              {mode === 'creative' ? (
                <CreativeEditor
                  activePage={activePage}
                  pageSettings={currentSettings}
                  onUpdateBlockContent={updateBlockContent}
                  onUpdateBlockType={updateBlockType}
                  onAddBlockBelow={addBlockBelow}
                  onDeleteBlock={deleteBlock}
                  onReorderBlocks={reorderBlocks}
                  onUpdateTitle={(title) => activePage && updatePageTitle(activePage.id, title)}
                  theme={profile.theme}
                />
              ) : (
                <SurvivalEditor
                  activePage={activePage}
                  activePageHtml={activePageHtml}
                  pageSettings={currentSettings}
                  onUpdateHtml={updatePageFromHtml}
                  onUpdateTitle={(title) => activePage && updatePageTitle(activePage.id, title)}
                  editorRef={survivalEditorRef}
                  theme={profile.theme}
                />
              )}
            </main>
          </div>

          {/* XP Status Bar */}
          <StatusBar
            wordCount={wordCount}
            mode={mode}
            saveStatusText={saveStatusText}
          />
        </>
      )}

      {/* Steve or Alex Peeking Companion Assistant in Bottom Right */}
      <MinecraftCompanion
        profile={profile}
        onToggleTheme={handleToggleTheme}
        onTriggerCreeper={() => setIsCreeperActive(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Creeper Explosion Screen Event */}
      <CreeperExplosion
        active={isCreeperActive}
        onExploded={() => {
          setIsCreeperActive(false);
          clearActivePage();
        }}
      />

      {/* Google Drive Integration Modal */}
      <GoogleDriveModal
        isOpen={isDriveOpen}
        onClose={() => setIsDriveOpen(false)}
        activePage={activePage}
        profile={profile}
        onImportPage={handleImportDrivePage}
        onPageSynced={handleDrivePageSynced}
        showToast={showAchievement}
      />

      {/* Share Realm Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        page={selectedSharePage || activePage}
        profile={profile}
        onUpdateShareSettings={(pageId, isPublic, publicRole) => {
          updatePageShareSettings(pageId, isPublic, publicRole);
          showAchievement(
            'Realm Link Updated',
            isPublic ? `Public link (${publicRole}) active` : 'Document restricted',
            '🔗'
          );
        }}
      />

      {/* Gemini AI Spellcheck & Scribe Wizard Modal */}
      <GeminiEnchantmentModal
        isOpen={isGeminiOpen}
        onClose={() => setIsGeminiOpen(false)}
        activePage={activePage}
        activePageHtml={activePageHtml}
        mode={mode}
        onApplyTextReplacement={handleGeminiApplyReplacement}
        onInsertBelow={handleGeminiInsertBelow}
        showToast={showAchievement}
      />

      {/* Page Setup Modal (A4 Default, White Paper, Margins, Orientation) */}
      <PageSetupModal
        isOpen={isPageSetupOpen}
        settings={currentSettings}
        onSave={updatePageSettings}
        onClose={() => setIsPageSetupOpen(false)}
      />

      {/* Find and Replace Modal */}
      <FindReplaceModal
        isOpen={isFindReplaceOpen}
        onClose={() => setIsFindReplaceOpen(false)}
        onFind={(query, matchCase) => findInPage(query, matchCase)}
        onReplace={(query, replaceWith, matchCase) => replaceInPage(query, replaceWith, matchCase)}
        onReplaceAll={(query, replaceWith, matchCase) => replaceAllInPage(query, replaceWith, matchCase)}
      />

      {/* Word Count Dialog */}
      <WordCountModal
        isOpen={isWordCountOpen}
        onClose={() => setIsWordCountOpen(false)}
        documentTitle={activePage?.title || 'Untitled document'}
        wordCount={wordCount}
        charCount={charCount}
        charNoSpaceCount={charNoSpaceCount}
        pageCount={1}
        pageSizeName={currentSettings.pageSize.toUpperCase()}
      />

      {/* Special Characters & Glyphs Modal */}
      <SpecialCharactersModal
        isOpen={isSpecialCharsOpen}
        onClose={() => setIsSpecialCharsOpen(false)}
        onInsertChar={handleInsertSpecialChar}
      />

      {/* Character Choice / Signup Modal */}
      <SignupModal
        isOpen={isSignupOpen}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        onClose={() => setIsSignupOpen(false)}
      />

      {/* Full Settings Window Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        onClose={() => setIsSettingsOpen(false)}
        onResetData={() => {
          localStorage.clear();
          window.location.reload();
        }}
      />

      {/* Minecraft Easter Egg: Creeper Explosion */}
      <CreeperExplosion
        active={isCreeperActive}
        onExploded={() => {
          setIsCreeperActive(false);
          clearActivePage();
        }}
      />

      {/* Minecraft Achievement Toast */}
      <Toast toast={toast} />
    </div>
  );
}
