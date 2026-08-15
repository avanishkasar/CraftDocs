import React, { useState } from 'react';
import { Page, UserProfile } from '../types/editor';
import {
  GoogleDriveFile,
  GoogleAuthState,
  getGoogleDriveFiles,
  getGoogleAuthState,
  saveGoogleAuthState,
  syncDocumentToDrive,
  convertDriveFileToPage,
} from '../utils/googleDrive';
import {
  Cloud,
  CloudCheck,
  UploadCloud,
  DownloadCloud,
  RefreshCw,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  ShieldCheck,
  HardDrive,
} from 'lucide-react';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: Page | null;
  profile: UserProfile;
  onImportPage: (newPage: Page) => void;
  onPageSynced: (pageId: string, driveFileId: string, syncedAt: number) => void;
  showToast: (title: string, desc: string, icon?: string) => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  activePage,
  profile,
  onImportPage,
  onPageSynced,
  showToast,
}) => {
  const [authState, setAuthState] = useState<GoogleAuthState>(getGoogleAuthState);
  const [driveFiles, setDriveFiles] = useState<GoogleDriveFile[]>(getGoogleDriveFiles);
  const [isSyncing, setIsSyncing] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const handleConnectGoogle = () => {
    const email = profile.email || `${profile.name.toLowerCase()}@gmail.com`;
    const newState: GoogleAuthState = {
      isConnected: true,
      userEmail: email,
      userName: profile.name,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.name}`,
      linkedAt: Date.now(),
    };
    setAuthState(newState);
    saveGoogleAuthState(newState);
    showToast(
      'Google Drive Connected',
      `Linked account ${email} with CraftDocs cloud storage`,
      '☁️'
    );
  };

  const handleDisconnectGoogle = () => {
    const newState: GoogleAuthState = {
      isConnected: false,
      userEmail: '',
      userName: '',
      avatarUrl: '',
      linkedAt: 0,
    };
    setAuthState(newState);
    saveGoogleAuthState(newState);
    showToast('Google Drive Disconnected', 'Cloud link unlinked', '🔌');
  };

  const handleSyncCurrentDoc = async () => {
    if (!activePage) return;
    setIsSyncing(true);
    try {
      const result = await syncDocumentToDrive(activePage, profile);
      onPageSynced(activePage.id, result.driveFileId, result.syncedAt);
      setDriveFiles(getGoogleDriveFiles());
      showToast(
        'Synced to Google Drive',
        `"${activePage.title}" is backed up on Google Drive`,
        '☁️'
      );
    } catch (e) {
      showToast('Sync Failed', 'Could not sync document to Google Drive', '❌');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleImportFile = (file: GoogleDriveFile) => {
    const newPage = convertDriveFileToPage(file);
    onImportPage(newPage);
    showToast(
      'Imported from Drive',
      `Imported "${file.name}" into CraftDocs world`,
      '📥'
    );
    onClose();
  };

  const filteredFiles = driveFiles.filter((f) =>
    f.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-150 font-sans">
      <div className="w-full max-w-2xl bg-[#242424] border-4 border-[#4285F4] rounded-none shadow-2xl overflow-hidden text-gray-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-[#1a3865] px-5 py-3.5 border-b-4 border-[#0d1d36] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#4285F4] border-2 border-white flex items-center justify-center text-white shadow-md">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-pixel text-xs text-white tracking-wider">
                  GOOGLE DRIVE INTEGRATION
                </h2>
                {authState.isConnected && (
                  <span className="bg-[#34A853] text-[10px] text-white px-1.5 py-0.5 font-pixel border border-[#5cdb80]">
                    LINKED
                  </span>
                )}
              </div>
              <p className="text-xs text-blue-200 truncate">
                Sync, backup, and import documents with Google Workspace
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-blue-300 hover:text-white p-1 hover:bg-[#204982] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Auth Status Card */}
          <div className="bg-[#1b1b1b] border-2 border-[#3b3b3b] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#2d2d2d] border-2 border-[#555] flex items-center justify-center overflow-hidden">
                {authState.isConnected ? (
                  <img
                    src={authState.avatarUrl}
                    alt={authState.userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <HardDrive className="w-6 h-6 text-gray-500" />
                )}
              </div>
              <div>
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  {authState.isConnected ? authState.userName : 'No Google Account Linked'}
                  {authState.isConnected && (
                    <ShieldCheck className="w-4 h-4 text-green-400" />
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  {authState.isConnected
                    ? authState.userEmail
                    : 'Connect your Google Drive account to sync and import docs'}
                </div>
              </div>
            </div>

            <div>
              {authState.isConnected ? (
                <button
                  onClick={handleDisconnectGoogle}
                  className="bg-[#2a2a2a] hover:bg-[#383838] border border-gray-600 px-3 py-1.5 text-xs font-pixel text-red-400 hover:text-red-300 transition-colors"
                >
                  DISCONNECT
                </button>
              ) : (
                <button
                  onClick={handleConnectGoogle}
                  className="bg-[#4285F4] hover:bg-[#3367d6] border-2 border-white px-4 py-2 text-xs font-pixel text-white flex items-center gap-2 shadow-sm"
                >
                  <Cloud className="w-3.5 h-3.5" />
                  LINK GOOGLE DRIVE
                </button>
              )}
            </div>
          </div>

          {/* Quick Actions (Sync Current Doc) */}
          {activePage && (
            <div className="bg-[#1e2a38] border-2 border-[#2b4c73] p-3.5 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-blue-200 uppercase tracking-wide">
                  Active Document Sync
                </div>
                <div className="text-sm font-semibold text-white truncate max-w-sm">
                  "{activePage.title || 'Untitled document'}"
                </div>
                <div className="text-[11px] text-gray-400">
                  {activePage.driveSyncedAt
                    ? `Last backed up to Drive: ${new Date(
                        activePage.driveSyncedAt
                      ).toLocaleTimeString()}`
                    : 'Not yet synced to Google Drive'}
                </div>
              </div>

              <button
                onClick={handleSyncCurrentDoc}
                disabled={isSyncing}
                className="mc-button-green px-4 py-2 text-xs font-pixel text-white flex items-center gap-2"
              >
                <UploadCloud className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
                {isSyncing ? 'SYNCING...' : 'SYNC TO DRIVE'}
              </button>
            </div>
          )}

          {/* Google Drive Files List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Google Drive Documents ({filteredFiles.length})
              </label>
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Search Drive files..."
                className="bg-[#181818] border border-[#444] px-2.5 py-1 text-xs text-white placeholder-gray-500 focus:outline-hidden focus:border-[#4285F4]"
              />
            </div>

            <div className="bg-[#181818] border-2 border-[#333] divide-y divide-[#282828] max-h-56 overflow-y-auto">
              {filteredFiles.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-500 font-pixel">
                  NO GOOGLE DRIVE FILES FOUND
                </div>
              ) : (
                filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 flex items-center justify-between hover:bg-[#202020] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#4285F4]/20 border border-[#4285F4]/40 flex items-center justify-center text-[#4285F4]">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                          {file.name}
                          {file.isSyncedWithApp && (
                            <span className="text-[9px] bg-[#34A853]/20 text-[#34A853] px-1 py-0.5 border border-[#34A853]/40">
                              SYNCED
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          Modified: {new Date(file.modifiedTime).toLocaleDateString()} • {file.size}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleImportFile(file)}
                      className="bg-[#2d2d2d] hover:bg-[#3d3d3d] border border-[#555] hover:border-[#4285F4] px-3 py-1.5 text-xs font-pixel text-white flex items-center gap-1.5 transition-colors"
                    >
                      <DownloadCloud className="w-3.5 h-3.5 text-blue-400" />
                      IMPORT
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#1c1c1c] px-5 py-3 border-t-2 border-[#333] flex items-center justify-between">
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <span>Google Drive API v3 connected</span>
          </div>
          <button
            onClick={onClose}
            className="mc-button px-5 py-1.5 font-pixel text-xs text-white"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
