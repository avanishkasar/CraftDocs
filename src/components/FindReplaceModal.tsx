import React, { useState } from 'react';

interface FindReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFind: (search: string, matchCase: boolean) => number; // returns match count
  onReplace: (search: string, replaceWith: string, matchCase: boolean) => void;
  onReplaceAll: (search: string, replaceWith: string, matchCase: boolean) => void;
}

export const FindReplaceModal: React.FC<FindReplaceModalProps> = ({
  isOpen,
  onClose,
  onFind,
  onReplace,
  onReplaceAll,
}) => {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [matchCount, setMatchCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!findText) {
      setMatchCount(null);
      return;
    }
    const count = onFind(findText, matchCase);
    setMatchCount(count);
  };

  const handleReplaceSingle = () => {
    if (!findText) return;
    onReplace(findText, replaceText, matchCase);
    const count = onFind(findText, matchCase);
    setMatchCount(count);
  };

  const handleReplaceAllAction = () => {
    if (!findText) return;
    onReplaceAll(findText, replaceText, matchCase);
    setMatchCount(0);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs select-none">
      <div className="mc-window max-w-md w-full p-5 text-black relative flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#555] pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔍</span>
            <h2 className="font-pixel text-xs uppercase tracking-wide text-gray-900 font-bold">
              Find and Replace
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black font-pixel text-sm px-2"
          >
            ✕
          </button>
        </div>

        {/* Inputs */}
        <form onSubmit={handleSearch} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-sans font-semibold text-gray-700">Find</label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={findText}
                onChange={(e) => {
                  setFindText(e.target.value);
                  setMatchCount(null);
                }}
                placeholder="Search document text..."
                autoFocus
                className="w-full bg-white border-2 border-gray-400 p-2 text-xs font-sans text-black focus:border-blue-600 focus:outline-none"
              />
              {matchCount !== null && (
                <span className="absolute right-2 text-[10px] text-gray-500 font-pixel">
                  {matchCount > 0 ? `${matchCount} found` : 'No match'}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-sans font-semibold text-gray-700">Replace with</label>
            <input
              type="text"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              placeholder="Replacement text..."
              className="w-full bg-white border-2 border-gray-400 p-2 text-xs font-sans text-black focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              id="matchCaseCheckbox"
              checked={matchCase}
              onChange={(e) => setMatchCase(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label htmlFor="matchCaseCheckbox" className="text-xs text-gray-700 cursor-pointer">
              Match case
            </label>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex items-center justify-between border-t-2 border-[#555] pt-3 mt-1">
          <button
            type="button"
            onClick={handleSearch}
            className="mc-button px-3 py-1.5 text-xs font-pixel text-yellow-300"
          >
            Find Next
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReplaceSingle}
              disabled={!findText}
              className="mc-button px-3 py-1.5 text-xs font-pixel disabled:opacity-50"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleReplaceAllAction}
              disabled={!findText}
              className="mc-button-green px-3 py-1.5 text-xs font-pixel text-white disabled:opacity-50"
            >
              Replace All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
