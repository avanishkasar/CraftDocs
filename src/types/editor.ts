export type BlockType =
  | 'text'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'bulletList'
  | 'numberedList'
  | 'todoList'
  | 'toggleList'
  | 'callout'
  | 'table'
  | 'quote'
  | 'code'
  | 'divider'
  | 'image';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  checked?: boolean;
  icon?: string;
  expanded?: boolean;
  tableRows?: string[][];
  color?: string;
  bgColor?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
}

export type CharacterType = 'steve' | 'alex';
export type ThemeMode = 'day' | 'night';
export type UiDensity = 'compact' | 'standard' | 'zen';
export type SidebarMode = 'expanded' | 'rail' | 'hidden';

export type PageSize = 'a4' | 'letter' | 'legal' | 'book' | 'pageless' | 'tabloid';
export type PageOrientation = 'portrait' | 'landscape';
export type PageColor = 'white' | 'parchment' | 'ivory' | 'obsidian' | 'void';
export type MarginOption = 'normal' | 'narrow' | 'wide' | 'compact';

export interface PageSettings {
  pageSize: PageSize;
  orientation: PageOrientation;
  pageColor: PageColor;
  margins: MarginOption;
  fontFamily?: string;
  fontSize?: number;
  lineSpacing?: string;
  showRuler?: boolean;
  zoomLevel?: number;
}

export const DEFAULT_PAGE_SETTINGS: PageSettings = {
  pageSize: 'a4',
  orientation: 'portrait',
  pageColor: 'white',
  margins: 'normal',
  fontFamily: 'Arial, sans-serif',
  fontSize: 11,
  lineSpacing: '1.15',
  showRuler: true,
  zoomLevel: 100,
};

export interface UserProfile {
  name: string;
  character: CharacterType;
  theme: ThemeMode;
  isSignedUp: boolean;
  email?: string;
  gamerTag?: string;
  isGoogleLinked?: boolean;
  googleEmail?: string;
  googleAvatarUrl?: string;
  driveSyncEnabled?: boolean;
  lastDriveSync?: number;
  defaultPageSettings?: PageSettings;
}

export type ShareRole = 'viewer' | 'commenter' | 'editor';

export interface SharedUser {
  id: string;
  emailOrName: string;
  role: ShareRole;
  character: CharacterType;
  addedAt: number;
}

export interface ShareSettings {
  isPublic: boolean;
  publicRole: ShareRole;
  shareCode?: string;
  sharedWith: SharedUser[];
  allowCopy: boolean;
  passwordProtected?: boolean;
}

export interface Page {
  id: string;
  title: string;
  icon?: string;
  parentId?: string | null;
  blocks: Block[];
  createdAt: number;
  updatedAt: number;
  children?: Page[];
  isStarred?: boolean;
  pageSettings?: PageSettings;
  // Google Drive & Cloud syncing
  driveFileId?: string;
  driveSyncedAt?: number;
  isShared?: boolean;
  shareSettings?: ShareSettings;
  authorCharacter?: CharacterType;
  authorName?: string;
  category?: 'lore' | 'blueprints' | 'alchemy' | 'notes' | 'general';
  isTrash?: boolean;
}

export type AppView = 'home' | 'editor';

export type HomeTab = 'all' | 'recent' | 'shared' | 'drive' | 'starred' | 'trash';

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  blocks: Block[];
  title: string;
  pageSettings?: Partial<PageSettings>;
}

export type EditorMode = 'survival' | 'creative';

export interface EditorState {
  pages: Page[];
  activePageId: string | null;
  mode: EditorMode;
}

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface SlashMenuItem {
  type: BlockType;
  label: string;
  shortcut: string;
  icon: string;
  description: string;
}

