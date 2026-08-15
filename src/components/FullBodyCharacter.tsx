import React from 'react';
import { CharacterType } from '../types/editor';

interface FullBodyCharacterProps {
  character: CharacterType;
  className?: string;
  isAnimated?: boolean;
  isWaving?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const FullBodyCharacter: React.FC<FullBodyCharacterProps> = ({
  character,
  className = '',
  isAnimated = false,
  isWaving = false,
  size = 'md',
}) => {
  const isAlex = character === 'alex';

  // Dimension scaling
  const sizeMap = {
    sm: 'w-10 h-20',
    md: 'w-16 h-32',
    lg: 'w-24 h-48',
    xl: 'w-32 h-64',
  };

  return (
    <div
      className={`relative inline-block image-pixelated select-none ${sizeMap[size]} ${className}`}
    >
      <svg
        viewBox="0 0 16 32"
        className={`w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] ${
          isAnimated ? 'animate-pulse' : ''
        } ${isWaving ? 'rotate-6 scale-105 transition-transform' : ''}`}
      >
        {isAlex ? (
          /* ALEX FULL BODY SKIN */
          <g id="alex-skin">
            {/* --- HEAD --- */}
            {/* Back Hair */}
            <rect x="2" y="0" width="12" height="8" fill="#d66828" />
            {/* Skin */}
            <rect x="3" y="2" width="10" height="6" fill="#e5b88f" />
            {/* Green Eyes */}
            <rect x="3" y="4" width="3" height="2" fill="#ffffff" />
            <rect x="4" y="4" width="2" height="2" fill="#3b9643" />
            <rect x="10" y="4" width="3" height="2" fill="#ffffff" />
            <rect x="10" y="4" width="2" height="2" fill="#3b9643" />
            {/* Nose & Lips */}
            <rect x="7" y="5" width="2" height="1" fill="#c99771" />
            <rect x="6" y="7" width="4" height="1" fill="#b86b53" />
            {/* Hair Bangs & Side Locks */}
            <rect x="2" y="0" width="12" height="2" fill="#e87833" />
            <rect x="2" y="2" width="2" height="5" fill="#d66828" />
            <rect x="12" y="2" width="2" height="4" fill="#d66828" />

            {/* --- TORSO & TUNIC --- */}
            <rect x="4" y="8" width="8" height="12" fill="#3d7a42" />
            {/* Tunic Collar/V-Neck */}
            <rect x="6" y="8" width="4" height="2" fill="#e5b88f" />
            {/* Dark Leather Belt & Gold Buckle */}
            <rect x="4" y="17" width="8" height="2" fill="#2d1c10" />
            <rect x="7" y="17" width="2" height="2" fill="#ffd700" />

            {/* --- ARMS (Slim Alex 3-pixel arms) --- */}
            {/* Left Arm (Green sleeve + skin hand) */}
            <g className={isWaving ? 'origin-top-left -rotate-45 transition-transform' : ''}>
              <rect x="1" y="8" width="3" height="8" fill="#3d7a42" />
              <rect x="1" y="16" width="3" height="4" fill="#e5b88f" />
            </g>

            {/* Right Arm */}
            <g id="right-arm">
              <rect x="12" y="8" width="3" height="8" fill="#3d7a42" />
              <rect x="12" y="16" width="3" height="4" fill="#e5b88f" />
            </g>

            {/* --- LEGS & BOOTS --- */}
            {/* Left Leg */}
            <rect x="4" y="20" width="4" height="8" fill="#2d2118" />
            <rect x="4" y="28" width="4" height="4" fill="#5c3d21" />

            {/* Right Leg */}
            <rect x="8" y="20" width="4" height="8" fill="#2d2118" />
            <rect x="8" y="28" width="4" height="4" fill="#5c3d21" />
          </g>
        ) : (
          /* STEVE FULL BODY SKIN */
          <g id="steve-skin">
            {/* --- HEAD --- */}
            {/* Dark Hair */}
            <rect x="2" y="0" width="12" height="8" fill="#321b0f" />
            {/* Skin */}
            <rect x="2" y="2" width="12" height="6" fill="#bc8e5f" />
            {/* Blue Eyes */}
            <rect x="3" y="4" width="3" height="2" fill="#ffffff" />
            <rect x="4" y="4" width="2" height="2" fill="#2d52bd" />
            <rect x="10" y="4" width="3" height="2" fill="#ffffff" />
            <rect x="10" y="4" width="2" height="2" fill="#2d52bd" />
            {/* Nose & Beard/Mouth */}
            <rect x="7" y="5" width="2" height="1" fill="#9c6d42" />
            <rect x="5" y="7" width="6" height="1" fill="#4d2f1d" />

            {/* --- TORSO & CYAN SHIRT --- */}
            <rect x="4" y="8" width="8" height="12" fill="#00a8a8" />
            {/* V-Neck Collar */}
            <rect x="6" y="8" width="4" height="2" fill="#bc8e5f" />

            {/* --- ARMS (Classic 4-pixel Steve arms) --- */}
            {/* Left Arm */}
            <g className={isWaving ? 'origin-top-left -rotate-45 transition-transform' : ''}>
              <rect x="0" y="8" width="4" height="7" fill="#00a8a8" />
              <rect x="0" y="15" width="4" height="5" fill="#bc8e5f" />
            </g>

            {/* Right Arm */}
            <g id="right-arm-steve">
              <rect x="12" y="8" width="4" height="7" fill="#00a8a8" />
              <rect x="12" y="15" width="4" height="5" fill="#bc8e5f" />
            </g>

            {/* --- LEGS & BLUE JEANS --- */}
            {/* Left Leg */}
            <rect x="4" y="20" width="4" height="9" fill="#1b2650" />
            <rect x="4" y="29" width="4" height="3" fill="#222222" />

            {/* Right Leg */}
            <rect x="8" y="20" width="4" height="9" fill="#1b2650" />
            <rect x="8" y="29" width="4" height="3" fill="#222222" />
          </g>
        )}
      </svg>
    </div>
  );
};
