import { DocumentTemplate } from '../types/editor';
import { generateId } from './converter';

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'tpl_blank',
    name: 'Blank Document',
    description: 'Start fresh with a clean A4 standard page.',
    icon: '📄',
    category: 'Standard',
    title: 'Untitled document',
    pageSettings: {
      pageSize: 'a4',
      orientation: 'portrait',
      pageColor: 'white',
      margins: 'normal',
    },
    blocks: [
      {
        id: generateId(),
        type: 'heading1',
        content: 'Untitled document',
      },
      {
        id: generateId(),
        type: 'text',
        content: '',
      },
    ],
  },
  {
    id: 'tpl_quest_log',
    name: 'Epic Quest Log',
    description: 'Track objectives, rewards, boss encounters, and milestones.',
    icon: '⚔️',
    category: 'Minecraft',
    title: 'Dragon Slayer Quest Journal',
    pageSettings: {
      pageSize: 'a4',
      orientation: 'portrait',
      pageColor: 'parchment',
      margins: 'normal',
    },
    blocks: [
      {
        id: generateId(),
        type: 'heading1',
        content: 'Ender Dragon Expedition Log 🐉',
      },
      {
        id: generateId(),
        type: 'text',
        content: '<b>Hero of the Realm:</b> Steve the Brave<br/><b>Location:</b> Stronghold Coordinates (X: 1042, Y: 32, Z: -850)',
      },
      {
        id: generateId(),
        type: 'heading2',
        content: 'Primary Objectives',
      },
      {
        id: generateId(),
        type: 'todoList',
        content: 'Collect 12 Eyes of Ender from Blazes & Endermen',
        checked: true,
      },
      {
        id: generateId(),
        type: 'todoList',
        content: 'Brew 5 Potions of Slow Falling and Regeneration',
        checked: true,
      },
      {
        id: generateId(),
        type: 'todoList',
        content: 'Destroy all Obsidian Crystal Pillars with Bow',
        checked: false,
      },
      {
        id: generateId(),
        type: 'todoList',
        content: 'Claim the Dragon Egg and collect Dragon Breath',
        checked: false,
      },
      {
        id: generateId(),
        type: 'quote',
        content: '"The End is not the destination, but the beginning of flight with Elytra."',
      },
    ],
  },
  {
    id: 'tpl_alchemy',
    name: 'Brewing & Potion Compendium',
    description: 'Master recipes for speed, invisibility, fire resistance, and healing.',
    icon: '🧪',
    category: 'Minecraft',
    title: 'Master Alchemist Handbook',
    pageSettings: {
      pageSize: 'a4',
      orientation: 'portrait',
      pageColor: 'obsidian',
      margins: 'narrow',
    },
    blocks: [
      {
        id: generateId(),
        type: 'heading1',
        content: 'Nether Brewing & Alchemy Codex 🧪✨',
      },
      {
        id: generateId(),
        type: 'text',
        content: 'All advanced concoctions begin with <b>Awkward Potion</b> (Water Bottle + Nether Wart) placed in the Brewing Stand with Blaze Powder.',
      },
      {
        id: generateId(),
        type: 'heading2',
        content: 'Essential Potion Formulas',
      },
      {
        id: generateId(),
        type: 'bulletList',
        content: '🔥 <b>Fire Resistance (8:00):</b> Awkward Potion + Magma Cream + Redstone Dust',
      },
      {
        id: generateId(),
        type: 'bulletList',
        content: '⚡ <b>Speed II (1:30):</b> Awkward Potion + Sugar + Glowstone Dust',
      },
      {
        id: generateId(),
        type: 'bulletList',
        content: '💖 <b>Instant Health II:</b> Awkward Potion + Glistering Melon + Glowstone Dust',
      },
      {
        id: generateId(),
        type: 'bulletList',
        content: '👁️ <b>Invisibility (8:00):</b> Awkward Potion + Golden Carrot + Fermented Spider Eye + Redstone',
      },
    ],
  },
  {
    id: 'tpl_redstone',
    name: 'Redstone Logic Blueprint',
    description: 'Logic gates, flying machines, item sorters, and clock circuits.',
    icon: '⚡',
    category: 'Engineering',
    title: 'Redstone Circuit Documentation',
    pageSettings: {
      pageSize: 'a4',
      orientation: 'portrait',
      pageColor: 'white',
      margins: 'normal',
    },
    blocks: [
      {
        id: generateId(),
        type: 'heading1',
        content: 'Automated 16-Item Sorter System ⚡',
      },
      {
        id: generateId(),
        type: 'text',
        content: '<b>Overview:</b> Silent hopper-comparator clock filter with overflow protection and chest buffer array.',
      },
      {
        id: generateId(),
        type: 'heading2',
        content: 'Component Specifications',
      },
      {
        id: generateId(),
        type: 'numberedList',
        content: 'Hopper pointing into comparator with 41 filter items + 4 blocker tokens.',
      },
      {
        id: generateId(),
        type: 'numberedList',
        content: 'Redstone dust line of length 2 running over solid stone blocks.',
      },
      {
        id: generateId(),
        type: 'numberedList',
        content: 'Redstone repeater powering the bottom locking torch.',
      },
      {
        id: generateId(),
        type: 'code',
        content: `// Signal Strength Math\n// 41 Items = Signal strength 1\n// 42 Items = Signal strength 2 (triggers repeater discharge)`,
      },
    ],
  },
  {
    id: 'tpl_meeting_notes',
    name: 'Village Council Minutes',
    description: 'Formal meeting notes, agenda, decisions, and action items.',
    icon: '🏛️',
    category: 'Work',
    title: 'Village Council Meeting Minutes',
    pageSettings: {
      pageSize: 'a4',
      orientation: 'portrait',
      pageColor: 'white',
      margins: 'normal',
    },
    blocks: [
      {
        id: generateId(),
        type: 'heading1',
        content: 'Overworld Town Council - Quarterly Review',
      },
      {
        id: generateId(),
        type: 'text',
        content: '<b>Date:</b> Minecraft Day 365<br/><b>Attendees:</b> Steve, Alex, Mayor Villager, Master Blacksmith',
      },
      {
        id: generateId(),
        type: 'heading2',
        content: 'Agenda & Discussion',
      },
      {
        id: generateId(),
        type: 'bulletList',
        content: '<b>Perimeter Defense:</b> Iron Golem patrol upgrades along Eastern Farmlands.',
      },
      {
        id: generateId(),
        type: 'bulletList',
        content: '<b>Emerald Economy:</b> Standardized enchanted book trade rates at 12 Emeralds.',
      },
      {
        id: generateId(),
        type: 'bulletList',
        content: '<b>Nether Highway:</b> Blue ice boat transport tunnel completion timeline.',
      },
    ],
  },
];
