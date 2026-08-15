import React, { useState } from 'react';
import { UserProfile, ThemeMode } from '../types/editor';
import { FullBodyCharacter } from './FullBodyCharacter';

interface MinecraftCompanionProps {
  profile: UserProfile;
  onToggleTheme: (theme: ThemeMode) => void;
  onTriggerCreeper: () => void;
  onOpenSettings: () => void;
}

const MINECRAFT_TIPS = [
  'Did you know? Pressing "/" in Creative Mode opens the Crafting Block Menu!',
  'Tip: Redstone code blocks highlight your JavaScript like powered dust!',
  'Trivia: Nether Night Mode turns your parchment into obsidian dark glass!',
  'Guide: Survival Mode lets you type continuous Google Docs style text.',
  'Trivia: Diamonds spawn below Y-16, but -58 is the sweetest spot!',
  'Tip: You can drag blocks around in Creative Mode just like hotbar items.',
  'Warning: Clicking "Spawn Creeper" will detonate and clear your document!',
];

export const MinecraftCompanion: React.FC<MinecraftCompanionProps> = ({
  profile,
  onToggleTheme,
  onTriggerCreeper,
  onOpenSettings,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'menu' | 'tutorial' | 'tip'>('menu');
  const [tutorialStep, setTutorialStep] = useState(0);
  const [currentTip, setCurrentTip] = useState(MINECRAFT_TIPS[0]);
  const [isWaving, setIsWaving] = useState(false);

  const characterName = profile.character === 'alex' ? 'Alex' : 'Steve';

  const tutorialSteps = [
    {
      title: '⚔️ Welcome to CraftDocs!',
      desc: `Hi ${profile.name}! I am your ${characterName} AI Companion. I will help you craft documentation, switch themes, and navigate editor modes.`,
    },
    {
      title: '🛠️ Survival vs Creative Mode',
      desc: 'Use the top-right mode switch! Survival Mode gives you a Google Docs continuous document. Creative Mode unlocks Notion drag-and-drop blocks!',
    },
    {
      title: '📦 Hotbar Toolbar & Colors',
      desc: 'Our enhanced toolbar features Google Docs tools: Dye colors (Redstone Red, Gold Yellow, Emerald Green, Diamond Cyan), text alignments, and tables.',
    },
    {
      title: '⌨️ Slash (/) Block Commands',
      desc: 'Type "/" inside Creative Mode to spawn Minecraft Callout Boxes, Crafting Table grids, Checkboxes, and Code blocks!',
    },
    {
      title: '🌙 Overworld Day & Nether Night',
      desc: 'Ask me anytime to toggle between Overworld Day Parchment and Dark Nether Obsidian themes!',
    },
  ];

  const handleNextTip = () => {
    const random = MINECRAFT_TIPS[Math.floor(Math.random() * MINECRAFT_TIPS.length)];
    setCurrentTip(random);
  };

  const isAlex = profile.character === 'alex';

  return (
    <div className="fixed bottom-0 right-4 z-40 flex flex-col items-end select-none pointer-events-auto font-pixel">
      {/* Speech Bubble / Dialog Popup */}
      {isOpen && (
        <div className="mb-3 w-80 mc-window-dark p-4 text-white border-4 border-[#FFD700] shadow-2xl animate-achievement flex flex-col gap-3 bg-[#1a1a2e]/95 backdrop-blur-md">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-[#3f3f5a] pb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">{isAlex ? '🟩' : '🟦'}</span>
              <span className="text-xs text-[#FFD700] uppercase tracking-wider font-bold">
                {characterName} AI Helper
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white text-xs px-1.5 py-0.5 bg-[#2a2a40] border border-[#555]"
            >
              ✕
            </button>
          </div>

          {/* Dialog Body Content */}
          {activeTab === 'menu' && (
            <div className="flex flex-col gap-2 text-xs">
              <p className="text-[10px] text-amber-200">
                Hey {profile.name}! What would you like to craft today?
              </p>

              {/* Action Buttons */}
              <button
                onClick={() => {
                  setActiveTab('tutorial');
                  setTutorialStep(0);
                }}
                className="mc-button py-2 px-3 text-left flex items-center gap-2 text-amber-100 hover:text-yellow-300"
              >
                <span>🎓</span>
                <span>Take Interactive Tutorial</span>
              </button>

              <button
                onClick={() => onToggleTheme(profile.theme === 'day' ? 'night' : 'day')}
                className="mc-button py-2 px-3 text-left flex items-center gap-2 text-amber-100 hover:text-yellow-300"
              >
                <span>{profile.theme === 'day' ? '🌙' : '☀️'}</span>
                <span>
                  Switch to {profile.theme === 'day' ? 'Nether Night' : 'Overworld Day'} Mode
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('tip');
                  handleNextTip();
                }}
                className="mc-button py-2 px-3 text-left flex items-center gap-2 text-amber-100 hover:text-yellow-300"
              >
                <span>💡</span>
                <span>Minecraft Pro Tip / Reference</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onTriggerCreeper();
                }}
                className="mc-button-green py-2 px-3 text-left flex items-center gap-2 bg-[#7c2828] border-red-500 hover:bg-red-700 text-white"
              >
                <span>💣</span>
                <span>SPAWN CREEPER (Detonate Page)</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenSettings();
                }}
                className="mc-button py-2 px-3 text-left flex items-center gap-2 text-gray-300 hover:text-white"
              >
                <span>⚙️</span>
                <span>Change Avatar / Character</span>
              </button>
            </div>
          )}

          {/* Tutorial Tab */}
          {activeTab === 'tutorial' && (
            <div className="flex flex-col gap-3 text-xs">
              <div className="bg-[#111122] p-3 border-2 border-[#555] rounded">
                <div className="text-[#FFFF55] font-bold mb-1">
                  {tutorialSteps[tutorialStep].title}
                </div>
                <div className="text-[10px] text-gray-200 leading-relaxed">
                  {tutorialSteps[tutorialStep].desc}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] pt-1">
                <span className="text-gray-400">
                  Step {tutorialStep + 1} / {tutorialSteps.length}
                </span>
                <div className="flex gap-2">
                  {tutorialStep > 0 && (
                    <button
                      onClick={() => setTutorialStep((prev) => prev - 1)}
                      className="mc-button px-2 py-1"
                    >
                      Prev
                    </button>
                  )}
                  {tutorialStep < tutorialSteps.length - 1 ? (
                    <button
                      onClick={() => setTutorialStep((prev) => prev + 1)}
                      className="mc-button-green px-3 py-1"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('menu')}
                      className="mc-button-green px-3 py-1"
                    >
                      Done!
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tip Generator Tab */}
          {activeTab === 'tip' && (
            <div className="flex flex-col gap-3 text-xs">
              <div className="bg-[#111122] p-3 border-2 border-[#8B6914] text-amber-200 text-[11px] leading-relaxed">
                "{currentTip}"
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setActiveTab('menu')}
                  className="mc-button px-3 py-1 text-[10px]"
                >
                  Back
                </button>
                <button
                  onClick={handleNextTip}
                  className="mc-button-green px-3 py-1 text-[10px]"
                >
                  Another Tip 🎲
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Animated Character Avatar Peeking from Bottom Right */}
      <div
        onClick={() => {
          setIsOpen(!isOpen);
          setIsWaving(true);
          setTimeout(() => setIsWaving(false), 1000);
        }}
        className="relative group cursor-pointer flex flex-col items-center transform transition-transform duration-300 hover:-translate-y-2"
        title={`Click to talk to ${characterName}`}
      >
        {/* Floating Callout Badge */}
        {!isOpen && (
          <div className="mb-1 bg-[#111] text-[#FFFF55] border-2 border-[#FFD700] px-2 py-0.5 text-[9px] shadow-lg animate-bounce flex items-center gap-1">
            <span>{characterName} Helper</span>
            <span className="text-[#55FF55]">💬</span>
          </div>
        )}

        {/* Full Body Character Standing Peeking Box */}
        <div
          className={`w-20 h-32 bg-[#1c1c28]/90 border-4 border-[#111] flex flex-col items-center justify-end overflow-hidden shadow-2xl relative p-1 rounded-t-md ${
            isAlex ? 'border-[#3b9643]' : 'border-[#2d52bd]'
          }`}
        >
          {/* Standing Full Body Skin */}
          <div className="flex flex-col items-center h-full justify-end">
            <FullBodyCharacter
              character={profile.character}
              size="md"
              isAnimated={!isOpen}
              isWaving={isWaving}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
