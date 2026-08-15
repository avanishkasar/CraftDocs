import React, { useState } from 'react';
import { UserProfile, CharacterType, ThemeMode } from '../types/editor';
import { FullBodyCharacter } from './FullBodyCharacter';

interface SettingsModalProps {
  isOpen: boolean;
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onClose: () => void;
  onResetData?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  profile,
  onSaveProfile,
  onClose,
  onResetData,
}) => {
  const [activeTab, setActiveTab] = useState<'avatar' | 'theme' | 'shortcuts' | 'data'>('avatar');
  const [name, setName] = useState(profile.name || 'Minecraftian');
  const [character, setCharacter] = useState<CharacterType>(profile.character || 'steve');
  const [theme, setTheme] = useState<ThemeMode>(profile.theme || 'day');

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveProfile({
      ...profile,
      name: name.trim() || 'Minecraftian',
      character,
      theme,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none font-pixel">
      <div className="mc-window-dark p-6 max-w-2xl w-full shadow-2xl border-4 border-[#FFD700] bg-[#1a1a2e] text-white flex flex-col gap-5 animate-achievement max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#3f3f5a] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <div>
              <h2 className="text-sm text-[#FFD700] uppercase font-bold tracking-widest text-shadow">
                CRAFTDOCS SETTINGS & AVATAR
              </h2>
              <p className="text-[10px] text-amber-200/80">
                Customize your Minecraft skin character, world theme, and editor preferences.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xs px-2 py-1 bg-[#2a2a40] border border-[#555]"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-2 border-b border-[#3f3f5a] pb-2 text-xs flex-wrap">
          <button
            onClick={() => setActiveTab('avatar')}
            className={`px-3 py-1.5 border-2 flex items-center gap-1.5 ${
              activeTab === 'avatar'
                ? 'bg-[#8B6914] text-[#FFFF55] border-[#FFD700]'
                : 'bg-[#181828] text-gray-400 border-[#444]'
            }`}
          >
            <span>🧍</span>
            <span>Avatar Skin</span>
          </button>
          <button
            onClick={() => setActiveTab('theme')}
            className={`px-3 py-1.5 border-2 flex items-center gap-1.5 ${
              activeTab === 'theme'
                ? 'bg-[#8B6914] text-[#FFFF55] border-[#FFD700]'
                : 'bg-[#181828] text-gray-400 border-[#444]'
            }`}
          >
            <span>☀️</span>
            <span>World Theme</span>
          </button>
          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`px-3 py-1.5 border-2 flex items-center gap-1.5 ${
              activeTab === 'shortcuts'
                ? 'bg-[#8B6914] text-[#FFFF55] border-[#FFD700]'
                : 'bg-[#181828] text-gray-400 border-[#444]'
            }`}
          >
            <span>⌨️</span>
            <span>Shortcuts</span>
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-3 py-1.5 border-2 flex items-center gap-1.5 ${
              activeTab === 'data'
                ? 'bg-[#8B6914] text-[#FFFF55] border-[#FFD700]'
                : 'bg-[#181828] text-gray-400 border-[#444]'
            }`}
          >
            <span>💾</span>
            <span>World Data</span>
          </button>
        </div>

        {/* TAB 1: AVATAR & FULL BODY SKIN SELECTION */}
        {activeTab === 'avatar' && (
          <div className="flex flex-col gap-4 text-xs">
            {/* Player Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-[#FFFF55]">PLAYER USERNAME:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#111122] border-2 border-[#555] px-3 py-2 text-xs text-amber-100 placeholder-gray-500 focus:outline-none focus:border-[#FFD700]"
                placeholder="Enter player name..."
              />
            </div>

            {/* Character Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-[#FFFF55]">
                SELECT FULL BODY SKIN CHARACTER:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* STEVE FULL BODY OPTION */}
                <button
                  type="button"
                  onClick={() => setCharacter('steve')}
                  className={`p-4 border-4 flex items-center gap-4 cursor-pointer transition-all ${
                    character === 'steve'
                      ? 'bg-[#2a3b5c] border-[#FFD700] shadow-[0_0_15px_#FFD700]'
                      : 'bg-[#181828] border-[#444] hover:border-gray-300'
                  }`}
                >
                  <div className="p-2 bg-[#111] border-2 border-[#00a8a8] flex items-center justify-center">
                    <FullBodyCharacter character="steve" size="lg" isWaving={character === 'steve'} />
                  </div>
                  <div className="flex flex-col text-left gap-1">
                    <span className="text-sm font-bold text-[#FFD700]">STEVE</span>
                    <span className="text-[9px] text-cyan-300">Classic Blue Shirt Hero</span>
                    <p className="text-[8px] text-gray-300 mt-1">
                      Full body skin featuring cyan tunic, blue jeans, and dark boots.
                    </p>
                  </div>
                </button>

                {/* ALEX FULL BODY OPTION */}
                <button
                  type="button"
                  onClick={() => setCharacter('alex')}
                  className={`p-4 border-4 flex items-center gap-4 cursor-pointer transition-all ${
                    character === 'alex'
                      ? 'bg-[#2a4d35] border-[#55FF55] shadow-[0_0_15px_#55FF55]'
                      : 'bg-[#181828] border-[#444] hover:border-gray-300'
                  }`}
                >
                  <div className="p-2 bg-[#111] border-2 border-[#3d7a42] flex items-center justify-center">
                    <FullBodyCharacter character="alex" size="lg" isWaving={character === 'alex'} />
                  </div>
                  <div className="flex flex-col text-left gap-1">
                    <span className="text-sm font-bold text-[#55FF55]">ALEX</span>
                    <span className="text-[9px] text-emerald-300">Green Tunic Explorer</span>
                    <p className="text-[8px] text-gray-300 mt-1">
                      Full body skin with orange ponytail hair, green tunic, belt, and leather boots.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WORLD THEME */}
        {activeTab === 'theme' && (
          <div className="flex flex-col gap-4 text-xs">
            <label className="text-[10px] text-[#FFFF55]">SELECT DOCUMENT ENVIRONMENT THEME:</label>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setTheme('day')}
                className={`p-4 border-4 flex flex-col gap-2 items-center text-center ${
                  theme === 'day'
                    ? 'bg-[#8B6914] text-[#FFFF55] border-[#FFD700]'
                    : 'bg-[#222] text-gray-400 border-[#444]'
                }`}
              >
                <span className="text-3xl">☀️</span>
                <span className="text-sm font-bold">Overworld Day</span>
                <span className="text-[9px] text-amber-200">
                  Light Oak Parchment paper style, optimal for standard writing.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('night')}
                className={`p-4 border-4 flex flex-col gap-2 items-center text-center ${
                  theme === 'night'
                    ? 'bg-[#3b185f] text-[#e082ff] border-[#c042da]'
                    : 'bg-[#222] text-gray-400 border-[#444]'
                }`}
              >
                <span className="text-3xl">🌙</span>
                <span className="text-sm font-bold">Nether Night</span>
                <span className="text-[9px] text-purple-300">
                  Dark Nether Obsidian Glass style, eye-safe low light mode.
                </span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: KEYBOARD SHORTCUTS GUIDE */}
        {activeTab === 'shortcuts' && (
          <div className="flex flex-col gap-2 text-xs">
            <div className="text-[10px] text-[#FFFF55] mb-1">CRAFTDOCS KEYBOARD & BLOCK COMMANDS:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 bg-[#111122] border border-[#555] flex justify-between items-center">
                <span className="text-amber-200">Bold Text</span>
                <span className="mc-kbd">Ctrl + B</span>
              </div>
              <div className="p-2 bg-[#111122] border border-[#555] flex justify-between items-center">
                <span className="text-amber-200">Italic Text</span>
                <span className="mc-kbd">Ctrl + I</span>
              </div>
              <div className="p-2 bg-[#111122] border border-[#555] flex justify-between items-center">
                <span className="text-amber-200">Underline Text</span>
                <span className="mc-kbd">Ctrl + U</span>
              </div>
              <div className="p-2 bg-[#111122] border border-[#555] flex justify-between items-center">
                <span className="text-amber-200">Block Slash Menu</span>
                <span className="mc-kbd">Type /</span>
              </div>
              <div className="p-2 bg-[#111122] border border-[#555] flex justify-between items-center">
                <span className="text-amber-200">Switch Editor Mode</span>
                <span className="mc-kbd">Top-Right Hotbar</span>
              </div>
              <div className="p-2 bg-[#111122] border border-[#555] flex justify-between items-center">
                <span className="text-amber-200">Add Block Below</span>
                <span className="mc-kbd">Enter Key</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DATA MANAGEMENT */}
        {activeTab === 'data' && (
          <div className="flex flex-col gap-4 text-xs">
            <div className="text-[10px] text-[#FFFF55]">DOCUMENT STORAGE & RESET:</div>
            <p className="text-[10px] text-gray-300">
              All your pages and notes are saved automatically in local storage every 30 seconds.
            </p>

            {onResetData && (
              <div className="p-3 bg-red-950/60 border-2 border-red-600 rounded flex flex-col gap-2">
                <span className="font-bold text-red-300 text-xs">⚠️ Reset All Documents to Default</span>
                <p className="text-[9px] text-red-200">
                  This will wipe custom pages and restore default Minecraft tutorial pages.
                </p>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to reset all document pages?')) {
                      onResetData();
                      onClose();
                    }
                  }}
                  className="mc-button-green bg-red-800 border-red-500 py-1.5 px-3 text-[10px] w-fit hover:bg-red-700"
                >
                  Reset Document Pages 💥
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-[#3f3f5a] mt-auto">
          <button onClick={onClose} className="mc-button px-4 py-2 text-xs">
            CANCEL
          </button>
          <button
            onClick={handleSave}
            className="mc-button-green px-6 py-2 text-xs flex items-center gap-2"
          >
            <span>💾</span>
            <span>SAVE SETTINGS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
