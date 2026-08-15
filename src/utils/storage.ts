import { Page, UserProfile } from '../types/editor';
import { generateId } from './converter';

const STORAGE_KEY = 'craftdocs_pages_v1';
const ACTIVE_PAGE_KEY = 'craftdocs_active_page_v1';
const MODE_KEY = 'craftdocs_editor_mode_v1';
const PROFILE_KEY = 'craftdocs_user_profile_v1';

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Minecraftian',
  character: 'steve',
  theme: 'day',
  isSignedUp: false,
};

export function loadUserProfile(): UserProfile {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    if (!data) return DEFAULT_PROFILE;
    return JSON.parse(data);
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save user profile:', err);
  }
}

export const INITIAL_PAGES: Page[] = [
  {
    id: 'page_getting_started',
    title: 'Welcome to CraftDocs',
    icon: '📜',
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now(),
    blocks: [
      {
        id: generateId(),
        type: 'heading1',
        content: 'Welcome to CraftDocs ⚔️🧱',
      },
      {
        id: generateId(),
        type: 'text',
        content:
          'CraftDocs is a <b>Minecraft-themed</b> document editor that blends <i>Survival Mode</i> (Google Docs style) and <i>Creative Mode</i> (Notion block style).',
      },
      {
        id: generateId(),
        type: 'heading2',
        content: 'How to Craft Your Documents',
      },
      {
        id: generateId(),
        type: 'bulletList',
        content: '⚔️ <b>Survival Mode:</b> Continuous linear editor with standard hotbar formatting.',
      },
      {
        id: generateId(),
        type: 'bulletList',
        content: '🧱 <b>Creative Mode:</b> Reorderable drag & drop blocks with slash (/) command menu.',
      },
      {
        id: generateId(),
        type: 'bulletList',
        content: '📚 <b>Inventory Sidebar:</b> Nest pages into folders and organize your world.',
      },
      {
        id: generateId(),
        type: 'divider',
        content: '',
      },
      {
        id: generateId(),
        type: 'quote',
        content: 'In a world made of blocks, your words are the ultimate Redstone engine.',
      },
      {
        id: generateId(),
        type: 'code',
        content: `// CraftDocs Redstone Logic\nconst craftDocument = (blocks) => {\n  return blocks.map(b => b.content).join('\\n');\n};`,
      },
      {
        id: generateId(),
        type: 'heading3',
        content: 'Try typing "/" in Creative Mode!',
      },
      {
        id: generateId(),
        type: 'image',
        content: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=800&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'page_mining_guide',
    title: 'Mining & Resource Log',
    icon: '⛏️',
    parentId: 'page_getting_started',
    createdAt: Date.now() - 1800000,
    updatedAt: Date.now(),
    blocks: [
      {
        id: generateId(),
        type: 'heading1',
        content: 'Diamond Mining Strategy 💎',
      },
      {
        id: generateId(),
        type: 'numberedList',
        content: 'Descend to Y-level -58 near bedrock.',
      },
      {
        id: generateId(),
        type: 'numberedList',
        content: 'Equip Fortune III Pickaxe for maximum yield.',
      },
      {
        id: generateId(),
        type: 'numberedList',
        content: 'Keep a water bucket ready for lava pools.',
      },
    ],
  },
  {
    id: 'page_redstone_specs',
    title: 'Redstone Machinery',
    icon: '⚡',
    createdAt: Date.now() - 900000,
    updatedAt: Date.now(),
    blocks: [
      {
        id: generateId(),
        type: 'heading1',
        content: 'Automated Crafting Station',
      },
      {
        id: generateId(),
        type: 'text',
        content: 'Blueprint for item sorters and automatic potion brewing stands.',
      },
    ],
  },
];

export function loadPagesFromStorage(): Page[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      savePagesToStorage(INITIAL_PAGES);
      return INITIAL_PAGES;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PAGES;
  } catch (err) {
    console.error('Failed to load CraftDocs pages from storage:', err);
    return INITIAL_PAGES;
  }
}

export function savePagesToStorage(pages: Page[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
  } catch (err) {
    console.error('Failed to save CraftDocs pages to storage:', err);
  }
}

export function loadActivePageId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_PAGE_KEY) || 'page_getting_started';
  } catch {
    return 'page_getting_started';
  }
}

export function saveActivePageId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_PAGE_KEY, id);
  } catch (err) {
    console.error('Failed to save active page ID:', err);
  }
}

export function loadEditorMode(): 'survival' | 'creative' {
  try {
    const saved = localStorage.getItem(MODE_KEY);
    return saved === 'creative' ? 'creative' : 'survival';
  } catch {
    return 'survival';
  }
}

export function saveEditorMode(mode: 'survival' | 'creative'): void {
  try {
    localStorage.setItem(MODE_KEY, mode);
  } catch (err) {
    console.error('Failed to save editor mode:', err);
  }
}
