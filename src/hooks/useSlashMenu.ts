import { useState, useCallback } from 'react';
import { BlockType, SlashMenuItem } from '../types/editor';

export const SLASH_MENU_ITEMS: SlashMenuItem[] = [
  {
    type: 'text',
    label: 'Paragraph Text',
    shortcut: 'text',
    icon: '📝',
    description: 'Plain text paragraph for standard notes.',
  },
  {
    type: 'todoList',
    label: 'To-Do Checkbox',
    shortcut: 'todo',
    icon: '☑️',
    description: 'Track Minecraft tasks and quests with checkmarks.',
  },
  {
    type: 'toggleList',
    label: 'Toggle Accordion',
    shortcut: 'toggle',
    icon: '🔽',
    description: 'Expandable and collapsible section list.',
  },
  {
    type: 'callout',
    label: 'Minecraft Callout',
    shortcut: 'callout',
    icon: '📦',
    description: 'Highlighted callout box with custom chest/mob icon.',
  },
  {
    type: 'table',
    label: 'Crafting Table',
    shortcut: 'table',
    icon: '🧱',
    description: 'Insert 3x3 crafting grid table with editable cells.',
  },
  {
    type: 'heading1',
    label: 'Heading 1',
    shortcut: 'h1',
    icon: '🪨',
    description: 'Large stone heading title.',
  },
  {
    type: 'heading2',
    label: 'Heading 2',
    shortcut: 'h2',
    icon: '🧱',
    description: 'Medium cobblestone section title.',
  },
  {
    type: 'heading3',
    label: 'Heading 3',
    shortcut: 'h3',
    icon: '📦',
    description: 'Small wood block sub-heading.',
  },
  {
    type: 'bulletList',
    label: 'Bullet List',
    shortcut: 'bullet',
    icon: '📋',
    description: 'Simple bulleted inventory list.',
  },
  {
    type: 'numberedList',
    label: 'Numbered List',
    shortcut: 'number',
    icon: '🔢',
    description: 'Sequenced recipe order list.',
  },
  {
    type: 'quote',
    label: 'Quote Box',
    shortcut: 'quote',
    icon: '💬',
    description: 'Wisdom quote block with parchment border.',
  },
  {
    type: 'code',
    label: 'Redstone Code',
    shortcut: 'code',
    icon: '💻',
    description: 'Monospaced code block with green glow.',
  },
  {
    type: 'divider',
    label: 'Divider Line',
    shortcut: 'hr',
    icon: '➖',
    description: 'Dashed brown parchment separator line.',
  },
  {
    type: 'image',
    label: 'Image / Map',
    shortcut: 'img',
    icon: '🗺️',
    description: 'Embed image URL or pixel map asset.',
  },
];

export function useSlashMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [targetBlockId, setTargetBlockId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openMenu = useCallback((blockId: string) => {
    setIsOpen(true);
    setTargetBlockId(blockId);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setTargetBlockId(null);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const filteredItems = SLASH_MENU_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.shortcut.toLowerCase().includes(query.toLowerCase()) ||
    item.type.toLowerCase().includes(query.toLowerCase())
  );

  return {
    isOpen,
    targetBlockId,
    query,
    setQuery,
    selectedIndex,
    setSelectedIndex,
    filteredItems,
    openMenu,
    closeMenu,
  };
}
