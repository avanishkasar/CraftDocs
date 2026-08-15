import { Page, UserProfile } from '../types/editor';
import { generateId } from './converter';

const DRIVE_FILES_STORAGE_KEY = 'craftdocs_google_drive_files_v1';
const GOOGLE_AUTH_STORAGE_KEY = 'craftdocs_google_auth_v1';

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: string;
  iconUrl?: string;
  content?: string;
  isSyncedWithApp?: boolean;
}

export interface GoogleAuthState {
  isConnected: boolean;
  userEmail: string;
  userName: string;
  avatarUrl: string;
  accessToken?: string;
  linkedAt: number;
}

// Initial Google Drive Mock/Synced Files for authentic cloud experience
const DEFAULT_DRIVE_FILES: GoogleDriveFile[] = [
  {
    id: 'gdrive_file_1',
    name: 'Ancient Netherite Mining Records.gdoc',
    mimeType: 'application/vnd.google-apps.document',
    modifiedTime: new Date(Date.now() - 86400000).toISOString(),
    size: '14.2 KB',
    isSyncedWithApp: true,
  },
  {
    id: 'gdrive_file_2',
    name: 'Village Defense & Iron Golem Blueprint.gdoc',
    mimeType: 'application/vnd.google-apps.document',
    modifiedTime: new Date(Date.now() - 172800000).toISOString(),
    size: '22.8 KB',
    isSyncedWithApp: false,
  },
  {
    id: 'gdrive_file_3',
    name: 'Ender Dragon Strategy & Supply Check.gdoc',
    mimeType: 'application/vnd.google-apps.document',
    modifiedTime: new Date(Date.now() - 259200000).toISOString(),
    size: '18.5 KB',
    isSyncedWithApp: true,
  },
  {
    id: 'gdrive_file_4',
    name: 'Redstone Computer & ALU Specifications.gdoc',
    mimeType: 'application/vnd.google-apps.document',
    modifiedTime: new Date(Date.now() - 400000000).toISOString(),
    size: '35.1 KB',
    isSyncedWithApp: false,
  },
];

export function getGoogleAuthState(): GoogleAuthState {
  try {
    const data = localStorage.getItem(GOOGLE_AUTH_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to parse Google Auth state', e);
  }
  return {
    isConnected: false,
    userEmail: '',
    userName: '',
    avatarUrl: '',
    linkedAt: 0,
  };
}

export function saveGoogleAuthState(state: GoogleAuthState): void {
  try {
    localStorage.setItem(GOOGLE_AUTH_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save Google Auth state', e);
  }
}

export function getGoogleDriveFiles(): GoogleDriveFile[] {
  try {
    const data = localStorage.getItem(DRIVE_FILES_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load drive files', e);
  }
  return DEFAULT_DRIVE_FILES;
}

export function saveGoogleDriveFiles(files: GoogleDriveFile[]): void {
  try {
    localStorage.setItem(DRIVE_FILES_STORAGE_KEY, JSON.stringify(files));
  } catch (e) {
    console.error('Failed to save drive files', e);
  }
}

// Sync single document to Google Drive
export async function syncDocumentToDrive(page: Page, profile: UserProfile): Promise<{ driveFileId: string; syncedAt: number }> {
  // Simulate network delay for authentic cloud upload feedback
  await new Promise((resolve) => setTimeout(resolve, 800));

  const existingFiles = getGoogleDriveFiles();
  const fileId = page.driveFileId || `gdrive_${page.id}_${Date.now()}`;
  const now = new Date().toISOString();

  const driveFileName = `${page.title || 'Untitled document'}.gdoc`;
  const existingIndex = existingFiles.findIndex((f) => f.id === fileId);

  const updatedFile: GoogleDriveFile = {
    id: fileId,
    name: driveFileName,
    mimeType: 'application/vnd.google-apps.document',
    modifiedTime: now,
    size: `${(JSON.stringify(page.blocks).length / 1024).toFixed(1)} KB`,
    isSyncedWithApp: true,
  };

  if (existingIndex >= 0) {
    existingFiles[existingIndex] = updatedFile;
  } else {
    existingFiles.unshift(updatedFile);
  }

  saveGoogleDriveFiles(existingFiles);

  return {
    driveFileId: fileId,
    syncedAt: Date.now(),
  };
}

// Import a file from Google Drive into CraftDocs Page format
export function convertDriveFileToPage(file: GoogleDriveFile): Page {
  return {
    id: `page_drive_${generateId()}`,
    title: file.name.replace(/\.gdoc$|\.txt$|\.docx$/i, ''),
    icon: '☁️',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    driveFileId: file.id,
    driveSyncedAt: Date.now(),
    blocks: [
      {
        id: generateId(),
        type: 'heading1',
        content: file.name.replace(/\.gdoc$|\.txt$|\.docx$/i, ''),
      },
      {
        id: generateId(),
        type: 'text',
        content: `<i>Synced from Google Drive on ${new Date().toLocaleDateString()}</i>`,
      },
      {
        id: generateId(),
        type: 'divider',
        content: '',
      },
      {
        id: generateId(),
        type: 'text',
        content: 'This document was imported from your linked Google Drive account. Changes made here can be synced directly back to Google Drive.',
      },
    ],
  };
}
