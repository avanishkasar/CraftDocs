import React, { useState } from 'react';
import { UserProfile, CharacterType, ThemeMode } from '../types/editor';
import { FullBodyCharacter } from './FullBodyCharacter';

interface SignupModalProps {
  isOpen: boolean;
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onClose?: () => void;
}

export const SignupModal: React.FC<SignupModalProps> = ({
  isOpen,
  profile,
  onSaveProfile,
  onClose,
}) => {
  const [name, setName] = useState(profile.name || '');
  const [character, setCharacter] = useState<CharacterType>(profile.character || 'steve');
  const [theme, setTheme] = useState<ThemeMode>(profile.theme || 'day');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      name: name.trim() || 'Minecraftian',
      character,
      theme,
      isSignedUp: true,
    });
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none">
      <div className="mc-window-dark p-6 max-w-lg w-full shadow-2xl border-4 border-[#FFD700] bg-[#1a1a2e] text-white font-pixel flex flex-col gap-6 animate-achievement">
        {/* Title */}
        <div className="text-center border-b-2 border-[#3f3f5a] pb-3">
          <div className="text-[#FFD700] text-sm tracking-widest uppercase text-shadow mb-1">
            ⚔️ WELCOME TO CRAFTDOCS ⚔️
          </div>
          <p className="text-[10px] text-amber-200/80">
            Choose your Minecraft Avatar companion and personalize your environment.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Player Username */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-[#FFFF55]">1. PLAYER USERNAME:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Notch, Alex, DiamondMiner99"
              required
              className="bg-[#111122] border-2 border-[#555] px-3 py-2 text-xs text-amber-100 placeholder-gray-500 focus:outline-none focus:border-[#FFD700]"
            />
          </div>

          {/* Character Selection (Steve vs Alex) */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-[#FFFF55]">2. CHOOSE YOUR AVATAR COMPANION:</label>
            <div className="grid grid-cols-2 gap-4">
              {/* STEVE OPTION */}
              <button
                type="button"
                onClick={() => setCharacter('steve')}
                className={`p-3 border-4 flex flex-col items-center gap-2 cursor-pointer transition-all ${
                  character === 'steve'
                    ? 'bg-[#2a3b5c] border-[#FFD700] shadow-[0_0_15px_#FFD700]'
                    : 'bg-[#181828] border-[#444] hover:border-gray-300'
                }`}
              >
                {/* Full Body Steve Character */}
                <div className="w-20 h-36 bg-[#111] border-2 border-[#00a8a8] p-2 flex items-center justify-center shadow-md">
                  <FullBodyCharacter character="steve" size="lg" isWaving={character === 'steve'} />
                </div>
                <span className="text-xs text-[#FFD700] font-bold">STEVE</span>
                <span className="text-[8px] text-gray-300 text-center">Blue Shirt Classic Hero Skin</span>
              </button>

              {/* ALEX OPTION */}
              <button
                type="button"
                onClick={() => setCharacter('alex')}
                className={`p-3 border-4 flex flex-col items-center gap-2 cursor-pointer transition-all ${
                  character === 'alex'
                    ? 'bg-[#2a4d35] border-[#55FF55] shadow-[0_0_15px_#55FF55]'
                    : 'bg-[#181828] border-[#444] hover:border-gray-300'
                }`}
              >
                {/* Full Body Alex Character */}
                <div className="w-20 h-36 bg-[#111] border-2 border-[#3d7a42] p-2 flex items-center justify-center shadow-md">
                  <FullBodyCharacter character="alex" size="lg" isWaving={character === 'alex'} />
                </div>
                <span className="text-xs text-[#55FF55] font-bold">ALEX</span>
                <span className="text-[8px] text-gray-300 text-center">Green Tunic Explorer Skin</span>
              </button>
            </div>
          </div>

          {/* Initial Environment Theme */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-[#FFFF55]">3. ENVIRONMENT WORLD THEME:</label>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setTheme('day')}
                className={`py-2 px-3 border-2 flex items-center justify-center gap-2 ${
                  theme === 'day'
                    ? 'bg-[#8B6914] text-[#FFFF55] border-[#FFD700]'
                    : 'bg-[#222] text-gray-400 border-[#444]'
                }`}
              >
                <span>☀️ Overworld Day</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('night')}
                className={`py-2 px-3 border-2 flex items-center justify-center gap-2 ${
                  theme === 'night'
                    ? 'bg-[#3b185f] text-[#e082ff] border-[#c042da]'
                    : 'bg-[#222] text-gray-400 border-[#444]'
                }`}
              >
                <span>🌙 Nether Night</span>
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-between pt-3 border-t border-[#3f3f5a]">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="mc-button px-4 py-2 text-xs"
              >
                CANCEL
              </button>
            )}
            <button
              type="submit"
              className="mc-button-green px-6 py-2.5 text-xs flex items-center gap-2 ml-auto"
            >
              <span>🚀</span>
              <span>START CRAFTING</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
