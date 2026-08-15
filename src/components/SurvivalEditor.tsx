import React, { useRef, useEffect } from 'react';
import { Page, PageSettings } from '../types/editor';
import { DocumentRuler } from './DocumentRuler';

interface SurvivalEditorProps {
  activePage: Page | null;
  activePageHtml: string;
  pageSettings: PageSettings;
  onUpdateHtml: (html: string) => void;
  onUpdateTitle: (title: string) => void;
  editorRef: React.RefObject<HTMLDivElement | null>;
  theme?: 'day' | 'night';
}

export const SurvivalEditor: React.FC<SurvivalEditorProps> = ({
  activePage,
  activePageHtml,
  pageSettings,
  onUpdateHtml,
  onUpdateTitle,
  editorRef,
  theme = 'day',
}) => {
  const isUpdatingRef = useRef(false);

  // Sync incoming HTML without resetting cursor unless changed externally
  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      if (editorRef.current.innerHTML !== activePageHtml) {
        editorRef.current.innerHTML = activePageHtml;
      }
    }
  }, [activePageHtml, editorRef]);

  if (!activePage) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center font-pixel text-amber-300">
        ⚔️ Select or craft a page from your inventory.
      </div>
    );
  }

  const handleInput = () => {
    if (!editorRef.current) return;
    isUpdatingRef.current = true;
    const html = editorRef.current.innerHTML;
    onUpdateHtml(html);
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 50);
  };

  // Determine paper dimensions based on pageSize & orientation
  const isLandscape = pageSettings.orientation === 'landscape';
  let widthClass = 'max-w-[794px] min-h-[1123px]'; // Default A4 Portrait

  if (pageSettings.pageSize === 'a4') {
    widthClass = isLandscape
      ? 'max-w-[1123px] min-h-[794px]'
      : 'max-w-[794px] min-h-[1123px]';
  } else if (pageSettings.pageSize === 'letter') {
    widthClass = isLandscape
      ? 'max-w-[1056px] min-h-[816px]'
      : 'max-w-[816px] min-h-[1056px]';
  } else if (pageSettings.pageSize === 'legal') {
    widthClass = isLandscape
      ? 'max-w-[1344px] min-h-[816px]'
      : 'max-w-[816px] min-h-[1344px]';
  } else if (pageSettings.pageSize === 'book') {
    widthClass = 'max-w-[620px] min-h-[620px]';
  } else if (pageSettings.pageSize === 'tabloid') {
    widthClass = isLandscape
      ? 'max-w-[1632px] min-h-[1056px]'
      : 'max-w-[1056px] min-h-[1632px]';
  } else if (pageSettings.pageSize === 'pageless') {
    widthClass = 'max-w-4xl min-h-[85vh]';
  }

  // Margin padding
  let paddingClass = 'p-10 md:p-16';
  if (pageSettings.margins === 'narrow') paddingClass = 'p-6 md:p-8';
  else if (pageSettings.margins === 'wide') paddingClass = 'p-16 md:p-24';
  else if (pageSettings.margins === 'compact') paddingClass = 'p-4 md:p-6';

  // Page Color Theme Class
  let pageColorClass = 'mc-page-white';
  if (pageSettings.pageColor === 'parchment') pageColorClass = 'mc-page-parchment';
  else if (pageSettings.pageColor === 'ivory') pageColorClass = 'mc-page-ivory';
  else if (pageSettings.pageColor === 'obsidian') pageColorClass = 'mc-page-obsidian';
  else if (pageSettings.pageColor === 'void') pageColorClass = 'mc-page-void';

  const zoomScale = (pageSettings.zoomLevel || 100) / 100;

  return (
    <div className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6 flex flex-col items-center custom-scrollbar bg-[#202028]">
      {/* Google Docs Style Horizontal Ruler */}
      {pageSettings.showRuler !== false && (
        <div className="mb-3 w-full flex justify-center no-print">
          <DocumentRuler
            pageSize={pageSettings.pageSize}
            orientation={pageSettings.orientation}
            theme={theme}
          />
        </div>
      )}

      {/* Scaled Document Sheet */}
      <div
        className="w-full flex justify-center transition-transform origin-top"
        style={{ transform: `scale(${zoomScale})` }}
      >
        <div
          className={`${pageColorClass} ${widthClass} ${paddingClass} w-full shadow-2xl relative transition-all rounded-xs flex flex-col`}
          id="craftdocs-print-page"
        >
          {/* Document Header with Editable Title */}
          <div className="mb-6 border-b border-gray-300 pb-3 flex items-center gap-3">
            <span className="text-2xl">{activePage.icon || '📜'}</span>
            <input
              type="text"
              value={activePage.title}
              onChange={(e) => onUpdateTitle(e.target.value)}
              placeholder="Untitled document..."
              className="w-full bg-transparent font-sans font-bold text-xl md:text-2xl focus:outline-none placeholder-gray-400"
            />
          </div>

          {/* Continuous WYSIWYG Contenteditable Document Area */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            className="flex-1 font-sans text-sm md:text-base leading-relaxed outline-none min-h-[600px] mc-caret"
            style={{
              lineHeight: pageSettings.lineSpacing || '1.15',
            }}
          />

          {/* Document Footer (Google Docs Page Number & Info) */}
          <div className="mt-12 pt-3 border-t border-gray-200 text-[10px] text-gray-400 font-pixel flex items-center justify-between no-print select-none">
            <span>
              PAGE 1 OF 1 • {pageSettings.pageSize.toUpperCase()} ({pageSettings.orientation})
            </span>
            <span className="text-gray-500">⚔️ SURVIVAL DOCS FLOW</span>
          </div>
        </div>
      </div>
    </div>
  );
};
