<div align="center">

# ⚔️ CraftDocs 📜

### A Minecraft-Themed Dual-Paradigm Document Editor

**Google Docs × Notion — Built in a Minecraft Universe**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-GitHub_Pages-2ea44f?style=for-the-badge)](https://avanishkasar.github.io/CraftDocs/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

</div>

---

## 🌟 What is CraftDocs?

**CraftDocs** is a fully featured, pixel-art document editor that fuses the best of **Google Docs** and **Notion** — wrapped in an authentic Minecraft aesthetic. Write on parchment scrolls, organize your quest logs, and craft the perfect document with an enchanted toolbar — all while Steve and Alex watch over your shoulder.

> _"Stop writing in boring apps. Your documents deserve a crafting table."_

---

## ✨ Feature Highlights

### ⚔️ Dual Editing Paradigms (Switch Anytime, Zero Data Loss)
| Mode | Style | Best For |
|------|-------|----------|
| **⚔️ Survival** | Google Docs WYSIWYG | Long-form writing, reports, letters |
| **🧱 Creative** | Notion drag-and-drop blocks | Notes, wikis, structured content |

### 📚 Document Hub & Inventory
- **Minecraft Home Page** — Animated panoramic voxel landscape with day/night cycle
- **Template Gallery** — Blank Parchment, Quest Log, Alchemy Codex, Redstone Schematic, Meeting Minutes
- **Hierarchical Page Tree** — Parent/child pages, nested sub-notes, drag-to-reorder
- **Search & Filter** — Instant search with tabs: All, Recent, Starred, Shared, Google Drive

### 🎨 UI Density Modes
| Mode | Description |
|------|-------------|
| `⚡ Compact` | Single-row slim toolbar, maximizes document canvas area |
| `📐 Standard` | Classic multi-tier Google Docs menu bar |
| `👁️ Zen Focus` | Completely hides chrome — pure distraction-free parchment |

### 📑 Toolbar & Formatting
- Undo / Redo / Print
- Zoom (75% – 150%), Paragraph Styles, Font Family, Font Size
- **Bold**, _Italic_, Underline, ~~Strikethrough~~
- Text Color (8 Minecraft palette colors) & Highlight (5 colors)
- Align: Left, Center, Right, Justify
- Ordered & Unordered lists, Indent / Outdent
- Insert Link, Insert Image, Insert Special Minecraft Glyphs
- Clear formatting

### 🔮 AI & Productivity Tools
- **✨ Gemini AI Enchantment Table** — AI-powered spellcheck, grammar, summarize, expand, tone rewrite, and multi-language translation
- **☁️ Google Drive Sync** — Back up and import documents via Google Drive API
- **🔗 Share Realm** — Shareable links with Viewer / Commenter / Editor access controls
- **🔍 Find & Replace** — Match-case search with replace-all support
- **📊 Word Count Modal** — Words, characters, characters without spaces

### 🧱 Export Formats
| Format | Extension |
|--------|-----------|
| PDF Document | `.pdf` |
| Markdown | `.md` |
| Plain Text | `.txt` |
| HTML Web Page | `.html` |
| JSON Backup | `.json` |

### 🎮 Minecraft Authenticity
- **Steve & Alex Character Skins** — Choose your avatar on first sign-in
- **Day / Night Theme** — Overworld parchment (☀️) vs. Nether obsidian (🌙)
- **Achievement Toasts** — In-game pop-up notifications for every action
- **🧨 Creeper Explosion Easter Egg** — Troll mode that detonates your document with a full-screen animation
- **Slash Commands** — `/h1`, `/quote`, `/code`, `/todo`, `/image`, etc. in Creative Mode
- **Pixel-art UI** — `Press Start 2P` font, oak-wood sidebar panels, stone toolbar

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9

### 1. Clone
```bash
git clone https://github.com/avanishkasar/CraftDocs.git
cd CraftDocs
```

### 2. Install
```bash
npm install
```

### 3. Configure (Optional — for AI features)
```bash
cp .env.example .env
# Edit .env and add your Gemini API key:
# GEMINI_API_KEY=your_key_here
```

### 4. Run Dev Server
```bash
npm run dev
# Open http://localhost:3000
```

### 5. Build for Production
```bash
npm run build
# Output → ./dist/
```

---

## 🌐 Live Demo

> **🔗 [https://avanishkasar.github.io/CraftDocs/](https://avanishkasar.github.io/CraftDocs/)**

The live site is automatically deployed via **GitHub Actions** on every push to `main`.

---

## 🏗️ Architecture & Tech Stack

```
CraftDocs/
├── src/
│   ├── components/         # 25 UI Components
│   │   ├── Block.tsx               # Creative Mode block renderer
│   │   ├── CreativeEditor.tsx      # Notion-style drag-drop editor
│   │   ├── SurvivalEditor.tsx      # Google Docs WYSIWYG canvas
│   │   ├── GoogleDocsMenuBar.tsx   # File/Edit/View/Format menus
│   │   ├── Toolbar.tsx             # Formatting toolbar strip
│   │   ├── Sidebar.tsx             # Page inventory tree
│   │   ├── HomePage.tsx            # Animated Minecraft hub
│   │   ├── GeminiEnchantmentModal.tsx  # AI assistant
│   │   ├── ShareModal.tsx          # Collaboration & sharing
│   │   ├── GoogleDriveModal.tsx    # Cloud sync
│   │   └── ...                     # Modals, toasts, companions
│   ├── hooks/
│   │   ├── useEditor.ts            # Core document state engine
│   │   └── useAutoSave.ts          # 30s localStorage auto-save
│   ├── types/editor.ts             # TypeScript interfaces
│   └── utils/
│       ├── converter.ts            # HTML ↔ Block lossless conversion
│       └── storage.ts              # LocalStorage persistence
├── .github/workflows/deploy.yml   # GitHub Actions CI/CD
└── vite.config.ts
```

### Core Technologies
| Tool | Purpose |
|------|---------|
| **React 18** | Component framework |
| **TypeScript** | Type safety |
| **Vite 5** | Bundler & dev server |
| **Tailwind CSS** | Utility-first styling |
| **Lucide React** | Icon library |
| **Google GenAI SDK** | Gemini AI integration |

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Optional | Enables Gemini AI spellcheck & writing assistant |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feat/my-feature`
5. Open a Pull Request

---

## 📜 License

MIT License — © 2025 [Avanish Kasar](https://github.com/avanishkasar)

Made with ❤️, Redstone, and too many `document.execCommand` calls.
