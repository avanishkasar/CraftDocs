import React, { useRef, useEffect, useState } from 'react';
import { Block as BlockType, BlockType as TypeEnum } from '../types/editor';

interface BlockProps {
  block: BlockType;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onChangeContent: (content: string) => void;
  onChangeType: (type: TypeEnum) => void;
  onUpdateBlockProps?: (updated: Partial<BlockType>) => void;
  onAddBlockBelow: (type?: TypeEnum) => void;
  onDeleteBlock: () => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
  onOpenSlashMenu: (blockId: string, position: { top: number; left: number }) => void;
  onFocusPrevious?: () => void;
  onFocusNext?: () => void;
}

export const Block: React.FC<BlockProps> = ({
  block,
  index,
  isSelected,
  onSelect,
  onChangeContent,
  onChangeType,
  onUpdateBlockProps,
  onAddBlockBelow,
  onDeleteBlock,
  onReorder,
  onOpenSlashMenu,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [showInlineToolbar, setShowInlineToolbar] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState(block.content);
  const [isExpanded, setIsExpanded] = useState(block.expanded !== false);
  const [isChecked, setIsChecked] = useState(!!block.checked);

  // Keep content editable synced without cursor jump
  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== block.content) {
      if (block.type !== 'image' && block.type !== 'table') {
        contentRef.current.innerHTML = block.content;
      }
    }
  }, [block.content, block.type]);

  const handleInput = () => {
    if (!contentRef.current) return;
    const text = contentRef.current.innerHTML;

    // Check for slash menu trigger
    if (text === '/' || text.endsWith(' /')) {
      const rect = contentRef.current.getBoundingClientRect();
      onOpenSlashMenu(block.id, { top: rect.bottom + 4, left: rect.left });
    }

    onChangeContent(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && block.type !== 'code' && block.type !== 'table') {
      e.preventDefault();
      onAddBlockBelow(block.type === 'todoList' ? 'todoList' : 'text');
    } else if (
      e.key === 'Backspace' &&
      (contentRef.current?.innerText.trim() === '' || block.content === '')
    ) {
      e.preventDefault();
      onDeleteBlock();
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      setShowInlineToolbar(true);
    } else {
      setShowInlineToolbar(false);
    }
  };

  const applyFormatting = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (contentRef.current) {
      onChangeContent(contentRef.current.innerHTML);
    }
  };

  // Drag and Drop
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dragIndexStr = e.dataTransfer.getData('text/plain');
    if (dragIndexStr !== '') {
      const dragIndex = parseInt(dragIndexStr, 10);
      if (!isNaN(dragIndex) && dragIndex !== index) {
        onReorder(dragIndex, index);
      }
    }
  };

  const toggleChecked = () => {
    const nextChecked = !isChecked;
    setIsChecked(nextChecked);
    if (onUpdateBlockProps) {
      onUpdateBlockProps({ checked: nextChecked });
    }
  };

  const toggleAccordion = () => {
    const nextExp = !isExpanded;
    setIsExpanded(nextExp);
    if (onUpdateBlockProps) {
      onUpdateBlockProps({ expanded: nextExp });
    }
  };

  const renderBlockElement = () => {
    switch (block.type) {
      case 'heading1':
        return (
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onMouseUp={handleTextSelection}
            className="text-2xl font-bold font-doc text-[#3c2a0f] outline-none my-1"
          />
        );
      case 'heading2':
        return (
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onMouseUp={handleTextSelection}
            className="text-xl font-bold font-doc text-[#4a3618] outline-none my-1"
          />
        );
      case 'heading3':
        return (
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onMouseUp={handleTextSelection}
            className="text-lg font-bold font-doc text-[#5c4521] outline-none my-1"
          />
        );
      case 'bulletList':
        return (
          <div className="flex items-start gap-2 my-1">
            <span className="text-[#8B6914] font-pixel text-xs mt-1 shrink-0">▪</span>
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onMouseUp={handleTextSelection}
              className="flex-1 font-doc text-base text-[#2c2211] outline-none"
            />
          </div>
        );
      case 'numberedList':
        return (
          <div className="flex items-start gap-2 my-1">
            <span className="text-[#8B6914] font-pixel text-xs mt-1 shrink-0">
              {index + 1}.
            </span>
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onMouseUp={handleTextSelection}
              className="flex-1 font-doc text-base text-[#2c2211] outline-none"
            />
          </div>
        );

      /* NOTION BLOCK: To-Do List Checkbox */
      case 'todoList':
        return (
          <div className="flex items-start gap-2.5 my-1">
            <button
              onClick={toggleChecked}
              className={`w-5 h-5 mt-0.5 flex items-center justify-center font-pixel text-xs border-2 cursor-pointer transition-all ${
                isChecked
                  ? 'bg-[#3a963e] border-[#123e15] text-white'
                  : 'bg-[#f5ebd2] border-[#8B6914] text-transparent hover:border-[#3a963e]'
              }`}
              title="Toggle Minecraft Quest Checkbox"
            >
              ✓
            </button>
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onMouseUp={handleTextSelection}
              className={`flex-1 font-doc text-base outline-none ${
                isChecked ? 'line-through text-gray-500 opacity-70' : 'text-[#2c2211]'
              }`}
            />
          </div>
        );

      /* NOTION BLOCK: Toggle Accordion List */
      case 'toggleList':
        return (
          <div className="my-1 border-l-2 border-[#8B6914] pl-2">
            <div className="flex items-start gap-2">
              <button
                onClick={toggleAccordion}
                className="mc-button px-1.5 py-0.5 text-[9px] mt-0.5 font-pixel cursor-pointer"
                title="Expand / Collapse Toggle"
              >
                {isExpanded ? '▼' : '▶'}
              </button>
              <div
                ref={contentRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                onMouseUp={handleTextSelection}
                className="flex-1 font-doc text-base font-semibold text-[#2c2211] outline-none"
              />
            </div>
            {isExpanded && (
              <div className="mt-2 pl-6 text-xs font-doc text-[#423112] border-l border-dashed border-[#8B6914]">
                <p className="text-gray-500 italic text-xs">(Toggle details content - press enter to add block)</p>
              </div>
            )}
          </div>
        );

      /* NOTION BLOCK: Minecraft Callout Box */
      case 'callout':
        return (
          <div className="my-2 p-3 bg-[#f5ebd2] border-2 border-[#8B6914] shadow-sm flex items-start gap-3">
            <span className="text-xl shrink-0 select-none">
              {block.icon || '📦'}
            </span>
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onMouseUp={handleTextSelection}
              className="flex-1 font-doc text-base text-[#3c2a0f] outline-none"
            />
          </div>
        );

      /* NOTION BLOCK: 3x3 Crafting Table Grid */
      case 'table':
        return (
          <div className="my-3 overflow-x-auto">
            <div className="text-[10px] font-pixel text-[#8B6914] mb-1 uppercase font-bold flex items-center gap-1">
              <span>🧱 Crafting Table Grid</span>
            </div>
            <table className="w-full border-collapse border-2 border-[#8B6914] bg-[#fdf6e3] text-xs font-doc">
              <thead>
                <tr className="bg-[#e0d6be] border-b-2 border-[#8B6914]">
                  <th className="p-2 border border-[#8B6914] text-left">Recipe Item</th>
                  <th className="p-2 border border-[#8B6914] text-left">Quantity</th>
                  <th className="p-2 border border-[#8B6914] text-left">Material Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border border-[#8B6914]" contentEditable>Diamond Gem</td>
                  <td className="p-2 border border-[#8B6914]" contentEditable>64x</td>
                  <td className="p-2 border border-[#8B6914]" contentEditable>Mined at Y-58</td>
                </tr>
                <tr>
                  <td className="p-2 border border-[#8B6914]" contentEditable>Redstone Dust</td>
                  <td className="p-2 border border-[#8B6914]" contentEditable>32x</td>
                  <td className="p-2 border border-[#8B6914]" contentEditable>Powered wiring</td>
                </tr>
                <tr>
                  <td className="p-2 border border-[#8B6914]" contentEditable>Oak Wood Planks</td>
                  <td className="p-2 border border-[#8B6914]" contentEditable>128x</td>
                  <td className="p-2 border border-[#8B6914]" contentEditable>Chest crafting</td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case 'quote':
        return (
          <div className="border-l-4 border-[#8B6914] bg-[#f5ebd2] p-3 my-2 italic font-doc text-[#423112]">
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onMouseUp={handleTextSelection}
              className="outline-none"
            />
          </div>
        );
      case 'code':
        return (
          <div className="bg-[#1e1e1e] border-2 border-[#333] p-3 my-2 font-pixel text-xs text-[#55FF55] shadow-inner rounded-none relative">
            <div className="absolute top-1 right-2 text-[8px] text-gray-500 uppercase">Redstone Code</div>
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              className="outline-none whitespace-pre-wrap font-vt323 text-base"
            />
          </div>
        );
      case 'divider':
        return (
          <div className="py-3 flex items-center justify-center cursor-pointer">
            <hr className="w-full border-t-2 border-dashed border-[#8B6914]" />
          </div>
        );
      case 'image':
        return (
          <div className="my-2 flex flex-col items-center gap-2 border-2 border-[#8B6914] bg-[#f4e8c8] p-3">
            {block.content ? (
              <img
                src={block.content}
                alt="Minecraft Texture / Asset"
                className="max-w-full max-h-96 object-contain border border-[#5c4521] shadow-md"
              />
            ) : (
              <div className="p-4 text-center font-pixel text-xs text-[#5c4521]">
                🗺️ No Image URL Provided
              </div>
            )}
            <div className="flex items-center gap-2 w-full max-w-md">
              <input
                type="text"
                placeholder="Enter image URL..."
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 bg-[#fdf6e3] border border-[#8B6914] px-2 py-1 font-pixel text-[10px] text-[#2c2211] focus:outline-none"
              />
              <button
                onClick={() => onChangeContent(imageUrlInput)}
                className="mc-button px-3 py-1 font-pixel text-[10px]"
              >
                Set
              </button>
            </div>
          </div>
        );
      case 'text':
      default:
        return (
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onMouseUp={handleTextSelection}
            className="font-doc text-base text-[#2c2211] outline-none leading-relaxed min-h-[24px]"
          />
        );
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={onSelect}
      className={`group relative flex items-start gap-2 py-1 px-2 my-0.5 rounded transition-all ${
        isSelected ? 'bg-[#f5ead0] shadow-sm' : 'hover:bg-[#f8f0dc]'
      }`}
    >
      {/* Block Drag Handle & Action Trigger */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 cursor-grab active:cursor-grabbing text-[#8B6914] pt-1 shrink-0">
        <span className="font-pixel text-xs" title="Drag to reorder block">
          ⋮⋮
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteBlock();
          }}
          className="hover:text-red-600 font-pixel text-[10px] p-0.5"
          title="Delete Block"
        >
          ✕
        </button>
      </div>

      {/* Floating Inline Formatting Toolbar */}
      {showInlineToolbar && isSelected && (
        <div className="absolute top-[-38px] left-10 z-40 mc-window-dark px-2 py-1 flex items-center gap-1 text-xs shadow-xl">
          <button
            onClick={() => applyFormatting('bold')}
            className="mc-button px-2 py-0.5 text-[10px]"
            title="Bold"
          >
            ⚔️ B
          </button>
          <button
            onClick={() => applyFormatting('italic')}
            className="mc-button px-2 py-0.5 text-[10px]"
            title="Italic"
          >
            📜 I
          </button>
          <button
            onClick={() => {
              const url = prompt('Enter link URL:');
              if (url) applyFormatting('createLink', url);
            }}
            className="mc-button px-2 py-0.5 text-[10px]"
            title="Link"
          >
            💎 Link
          </button>
          <div className="h-4 w-0.5 bg-[#444] my-0.5" />
          <button
            onClick={() => onChangeType('heading1')}
            className="mc-button px-1.5 py-0.5 text-[9px]"
          >
            H1
          </button>
          <button
            onClick={() => onChangeType('todoList')}
            className="mc-button px-1.5 py-0.5 text-[9px]"
          >
            Check
          </button>
          <button
            onClick={() => onChangeType('text')}
            className="mc-button px-1.5 py-0.5 text-[9px]"
          >
            Txt
          </button>
        </div>
      )}

      {/* Main Block Element */}
      <div className="flex-1 min-w-0">{renderBlockElement()}</div>
    </div>
  );
};
