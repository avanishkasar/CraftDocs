import React, { useState } from 'react';
import { Page, ShareRole, UserProfile } from '../types/editor';
import {
  Share2,
  Copy,
  Check,
  Globe,
  Lock,
  UserPlus,
  Trash2,
  X,
  ExternalLink,
  QrCode,
  Sparkles,
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  page: Page | null;
  profile: UserProfile;
  onUpdateShareSettings: (pageId: string, isPublic: boolean, publicRole: ShareRole) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  page,
  profile,
  onUpdateShareSettings,
}) => {
  const [copied, setCopied] = useState(false);
  const [isPublic, setIsPublic] = useState(page?.shareSettings?.isPublic ?? true);
  const [publicRole, setPublicRole] = useState<ShareRole>(page?.shareSettings?.publicRole ?? 'viewer');
  const [inviteInput, setInviteInput] = useState('');
  const [inviteRole, setInviteRole] = useState<ShareRole>('editor');
  const [showQr, setShowQr] = useState(false);

  const [collaborators, setCollaborators] = useState([
    {
      name: profile.name,
      emailOrTag: profile.email || `${profile.name.toLowerCase()}@craftdocs.world`,
      role: 'Owner' as const,
      character: profile.character,
    },
    {
      name: profile.character === 'steve' ? 'Alex' : 'Steve',
      emailOrTag: profile.character === 'steve' ? 'alex@overworld.net' : 'steve@overworld.net',
      role: 'Editor' as const,
      character: profile.character === 'steve' ? ('alex' as const) : ('steve' as const),
    },
  ]);

  if (!isOpen || !page) return null;

  const shareUrl = `${window.location.origin}/#doc=${page.id}&realm=${page.driveFileId || 'local'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAddCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteInput.trim()) return;
    setCollaborators((prev) => [
      ...prev,
      {
        name: inviteInput.split('@')[0],
        emailOrTag: inviteInput.trim(),
        role: inviteRole === 'editor' ? 'Editor' : inviteRole === 'commenter' ? 'Editor' : 'Editor',
        character: Math.random() > 0.5 ? 'steve' : 'alex',
      },
    ]);
    setInviteInput('');
  };

  const handleRemoveCollaborator = (index: number) => {
    if (index === 0) return; // cannot remove owner
    setCollaborators((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSavePublicAccess = (newPublic: boolean, newRole: ShareRole) => {
    setIsPublic(newPublic);
    setPublicRole(newRole);
    onUpdateShareSettings(page.id, newPublic, newRole);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#2a2a2a] border-4 border-[#555555] rounded-none shadow-2xl overflow-hidden font-doc text-gray-200">
        {/* Header */}
        <div className="bg-[#3c3c3c] px-5 py-3 border-b-4 border-[#111111] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-none bg-[#4c7c3c] border-2 border-[#7eb063] flex items-center justify-center text-white">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-pixel text-xs text-[#FFD700] tracking-wide">
                SHARE REALM DOCUMENT
              </h2>
              <p className="text-xs text-gray-400 font-sans truncate max-w-xs">
                "{page.title || 'Untitled document'}"
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 hover:bg-[#555] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto font-sans">
          {/* Add People Section */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
              Share with players or emails
            </label>
            <form onSubmit={handleAddCollaborator} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inviteInput}
                  onChange={(e) => setInviteInput(e.target.value)}
                  placeholder="GamerTag, email, or @player..."
                  className="w-full bg-[#1a1a1a] border-2 border-[#444] px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-hidden focus:border-[#FFD700]"
                />
              </div>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as ShareRole)}
                className="bg-[#1a1a1a] border-2 border-[#444] px-2 py-2 text-xs text-gray-200 focus:outline-hidden focus:border-[#FFD700]"
              >
                <option value="viewer">Viewer (Adventure)</option>
                <option value="commenter">Commenter (Villager)</option>
                <option value="editor">Editor (Creative)</option>
              </select>
              <button
                type="submit"
                className="bg-[#4c7c3c] hover:bg-[#578c45] border-2 border-[#7eb063] px-4 py-2 text-xs font-pixel text-white flex items-center gap-1 shadow-sm active:translate-y-0.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                INVITE
              </button>
            </form>
          </div>

          {/* People with access list */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Players with Realm Access
            </label>
            <div className="bg-[#1e1e1e] border-2 border-[#3a3a3a] divide-y divide-[#333]">
              {collaborators.map((user, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-none border-2 flex items-center justify-center font-pixel text-xs ${
                        user.character === 'alex'
                          ? 'bg-[#e28a58] border-[#7d4825] text-amber-950'
                          : 'bg-[#5c8bbf] border-[#294c73] text-blue-950'
                      }`}
                    >
                      {user.character === 'alex' ? 'A' : 'S'}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                        {user.name}
                        {idx === 0 && (
                          <span className="text-[10px] bg-[#4c7c3c] text-white px-1 py-0.2 font-pixel">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-400">{user.emailOrTag}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-300 font-mono">{user.role}</span>
                    {idx !== 0 && (
                      <button
                        onClick={() => handleRemoveCollaborator(idx)}
                        className="text-gray-500 hover:text-red-400 p-1"
                        title="Remove player"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* General Access */}
          <div className="bg-[#1f1f1f] p-3.5 border-2 border-[#3a3a3a] space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#333] border border-[#555] flex items-center justify-center text-[#FFD700]">
                  {isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">General Access</div>
                  <div className="text-[11px] text-gray-400">
                    {isPublic
                      ? 'Anyone in the Overworld with the link can access'
                      : 'Restricted - Only invited players can open'}
                  </div>
                </div>
              </div>

              <select
                value={isPublic ? publicRole : 'restricted'}
                onChange={(e) => {
                  if (e.target.value === 'restricted') {
                    handleSavePublicAccess(false, 'viewer');
                  } else {
                    handleSavePublicAccess(true, e.target.value as ShareRole);
                  }
                }}
                className="bg-[#292929] border border-[#555] px-2 py-1.5 text-xs text-white focus:outline-hidden focus:border-[#FFD700]"
              >
                <option value="viewer">Viewer (Adventure)</option>
                <option value="commenter">Commenter (Villager)</option>
                <option value="editor">Editor (Creative)</option>
                <option value="restricted">Restricted (Locked)</option>
              </select>
            </div>

            {/* Link Box */}
            <div className="flex items-center gap-2 bg-[#121212] border border-[#444] p-2">
              <div className="flex-1 text-xs text-gray-300 font-mono truncate select-all">
                {shareUrl}
              </div>
              <button
                onClick={() => setShowQr(!showQr)}
                className="text-gray-400 hover:text-white p-1 hover:bg-[#2a2a2a]"
                title="Toggle QR Code"
              >
                <QrCode className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopyLink}
                className="bg-[#2d2d2d] hover:bg-[#3d3d3d] border border-[#666] hover:border-[#FFD700] px-3 py-1 text-xs font-pixel text-white flex items-center gap-1.5 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    COPIED!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    COPY LINK
                  </>
                )}
              </button>
            </div>

            {showQr && (
              <div className="p-3 bg-white text-black flex flex-col items-center justify-center space-y-2 border-2 border-black">
                <div className="font-pixel text-[10px] uppercase text-black">Scan to join Realm</div>
                {/* SVG Pixel QR simulation */}
                <div className="w-32 h-32 bg-gray-950 p-2 flex flex-wrap gap-0.5 justify-center items-center">
                  <div className="text-[9px] text-green-400 font-mono text-center leading-none">
                    [CRAFTDOCS REALM QR]
                    <br />
                    ■ ■ ■ ■ ■ ■ ■
                    <br />
                    ■ ▣ ▣ ▣ ▣ ▣ ■
                    <br />
                    ■ ▣ ■ ■ ■ ▣ ■
                    <br />
                    ■ ■ ■ ■ ■ ■ ■
                  </div>
                </div>
                <p className="text-[10px] text-gray-600 font-sans">
                  Direct live link to "{page.title}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#222222] px-5 py-3 border-t-2 border-[#3a3a3a] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-yellow-500 font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Realm link synced with Google Drive cloud</span>
          </div>
          <button
            onClick={onClose}
            className="mc-button px-5 py-1.5 font-pixel text-xs text-white"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};
