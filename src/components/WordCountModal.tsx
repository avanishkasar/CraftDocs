import React from 'react';

interface WordCountModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  wordCount: number;
  charCount: number;
  charNoSpaceCount: number;
  pageCount: number;
  pageSizeName: string;
}

export const WordCountModal: React.FC<WordCountModalProps> = ({
  isOpen,
  onClose,
  documentTitle,
  wordCount,
  charCount,
  charNoSpaceCount,
  pageCount,
  pageSizeName,
}) => {
  if (!isOpen) return null;

  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs select-none">
      <div className="mc-window max-w-sm w-full p-5 text-black relative flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#555] pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h2 className="font-pixel text-xs uppercase tracking-wide text-gray-900 font-bold">
              Word Count
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black font-pixel text-sm px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Stats Table */}
        <div className="flex flex-col gap-2 font-sans text-xs">
          <div className="text-[11px] text-gray-500 font-pixel truncate mb-1">
            {documentTitle || 'Untitled Document'}
          </div>

          <div className="flex justify-between py-1.5 border-b border-gray-300">
            <span className="text-gray-600 font-medium">Pages ({pageSizeName}):</span>
            <span className="font-bold text-gray-900 font-pixel">{pageCount}</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-gray-300">
            <span className="text-gray-600 font-medium">Words:</span>
            <span className="font-bold text-green-700 font-pixel">{wordCount}</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-gray-300">
            <span className="text-gray-600 font-medium">Characters:</span>
            <span className="font-bold text-gray-900 font-pixel">{charCount}</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-gray-300">
            <span className="text-gray-600 font-medium">Characters (no spaces):</span>
            <span className="font-bold text-gray-900 font-pixel">{charNoSpaceCount}</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-gray-300">
            <span className="text-gray-600 font-medium">Estimated Reading Time:</span>
            <span className="font-bold text-blue-700 font-pixel">~{readingTimeMin} min</span>
          </div>

          <div className="flex justify-between py-1.5">
            <span className="text-gray-600 font-medium">Minecraft Redstone XP:</span>
            <span className="font-bold text-amber-600 font-pixel">LVL {Math.floor(wordCount / 100)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t-2 border-[#555] pt-3 mt-1">
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
