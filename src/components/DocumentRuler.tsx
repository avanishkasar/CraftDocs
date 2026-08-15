import React, { useState } from 'react';
import { PageSize, PageOrientation } from '../types/editor';

interface DocumentRulerProps {
  pageSize: PageSize;
  orientation: PageOrientation;
  theme?: 'day' | 'night';
}

export const DocumentRuler: React.FC<DocumentRulerProps> = ({
  pageSize,
  orientation,
  theme = 'day',
}) => {
  const [leftMargin, setLeftMargin] = useState(48); // px from left
  const [rightMargin, setRightMargin] = useState(48); // px from right

  // Calculate approximate width of the ruler depending on page size & orientation
  let baseWidth = 794; // Default A4
  if (pageSize === 'letter') baseWidth = 816;
  if (pageSize === 'legal') baseWidth = 816;
  if (pageSize === 'book') baseWidth = 620;
  if (pageSize === 'tabloid') baseWidth = 1056;
  if (pageSize === 'pageless') baseWidth = 900;

  if (orientation === 'landscape' && pageSize !== 'book' && pageSize !== 'pageless') {
    if (pageSize === 'a4') baseWidth = 1123;
    else if (pageSize === 'letter') baseWidth = 1056;
    else if (pageSize === 'legal') baseWidth = 1344;
  }

  // Generate tick marks (each inch is ~96px)
  const ticksCount = Math.floor(baseWidth / 12);
  const inchesCount = Math.floor(baseWidth / 96);

  return (
    <div
      className="w-full flex justify-center select-none overflow-x-hidden no-print"
      style={{ maxWidth: `${baseWidth}px` }}
    >
      <div
        className={`w-full h-5 relative flex items-end border-b text-[9px] font-pixel ${
          theme === 'night'
            ? 'bg-[#1e1e30] border-[#555] text-purple-300'
            : 'bg-[#e5e7eb] border-[#9ca3af] text-gray-700'
        }`}
        title="Google Docs Minecraft Ruler"
      >
        {/* Ticks */}
        <div className="absolute inset-0 flex items-end">
          {Array.from({ length: ticksCount }).map((_, i) => {
            const isInch = i % 8 === 0;
            const isHalfInch = i % 4 === 0;
            const height = isInch ? 'h-3.5' : isHalfInch ? 'h-2' : 'h-1';
            const inchNum = i / 8;

            return (
              <div
                key={i}
                className="flex-1 flex flex-col justify-end items-center relative"
              >
                <div
                  className={`w-px ${height} ${
                    isInch
                      ? theme === 'night'
                        ? 'bg-purple-400'
                        : 'bg-gray-800'
                      : theme === 'night'
                      ? 'bg-purple-900/50'
                      : 'bg-gray-400'
                  }`}
                />
                {isInch && inchNum > 0 && inchNum < inchesCount && (
                  <span className="absolute bottom-1 text-[8px] font-sans font-bold leading-none select-none">
                    {inchNum}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Left Margin Slider Pin (Google Docs Blue/Gold Triangle) */}
        <div
          className="absolute bottom-0 flex flex-col items-center cursor-ew-resize z-10 transition-transform group"
          style={{ left: `${leftMargin}px` }}
          title={`Left Margin: ${Math.round(leftMargin / 96 * 10) / 10} in`}
        >
          <div className="w-2.5 h-1.5 bg-[#2563eb] border border-[#1d4ed8]" />
          <div className="w-0 h-0 border-x-[5px] border-x-transparent border-t-[6px] border-t-[#2563eb]" />
        </div>

        {/* Right Margin Slider Pin */}
        <div
          className="absolute bottom-0 flex flex-col items-center cursor-ew-resize z-10 transition-transform group"
          style={{ right: `${rightMargin}px` }}
          title={`Right Margin: ${Math.round(rightMargin / 96 * 10) / 10} in`}
        >
          <div className="w-0 h-0 border-x-[5px] border-x-transparent border-t-[6px] border-t-[#2563eb]" />
        </div>
      </div>
    </div>
  );
};
