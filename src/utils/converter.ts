import { Block, BlockType } from '../types/editor';

/**
 * Generate a unique ID for new blocks
 */
export function generateId(): string {
  return 'block_' + Math.random().toString(36).substring(2, 9);
}

/**
 * Convert an array of Blocks (Creative Mode) to continuous HTML string (Survival Mode)
 */
export function blocksToHtml(blocks: Block[]): string {
  if (!blocks || blocks.length === 0) {
    return '<p><br></p>';
  }

  return blocks
    .map((block) => {
      const content = block.content || '';
      switch (block.type) {
        case 'heading1':
          return `<h1 style="font-size: 1.875rem; font-weight: bold; margin-top: 1rem; margin-bottom: 0.5rem;">${content}</h1>`;
        case 'heading2':
          return `<h2 style="font-size: 1.5rem; font-weight: bold; margin-top: 0.875rem; margin-bottom: 0.375rem;">${content}</h2>`;
        case 'heading3':
          return `<h3 style="font-size: 1.25rem; font-weight: bold; margin-top: 0.75rem; margin-bottom: 0.25rem;">${content}</h3>`;
        case 'bulletList':
          return `<ul><li>${content}</li></ul>`;
        case 'numberedList':
          return `<ol><li>${content}</li></ol>`;
        case 'quote':
          return `<blockquote style="border-left: 4px solid #8B6914; padding-left: 1rem; font-style: italic; margin: 0.75rem 0; color: #5a4511;">${content}</blockquote>`;
        case 'code':
          return `<pre style="background-color: #2b2b2b; color: #55FF55; padding: 0.75rem; border-radius: 4px; font-family: 'Press Start 2P', monospace; font-size: 0.75rem; overflow-x: auto; border: 2px solid #1a1a1a;"><code>${content}</code></pre>`;
        case 'divider':
          return `<hr style="border: none; border-top: 3px dashed #8B6914; margin: 1.25rem 0;" />`;
        case 'image':
          return `<p><img src="${content}" alt="CraftDocs Media" style="max-width: 100%; border: 3px solid #8B6914; border-radius: 2px; margin: 0.5rem 0;" /></p>`;
        case 'text':
        default:
          return `<p>${content || '<br>'}</p>`;
      }
    })
    .join('');
}

/**
 * Convert continuous HTML string (Survival Mode) to an array of Blocks (Creative Mode)
 */
export function htmlToBlocks(html: string): Block[] {
  if (!html || !html.trim()) {
    return [{ id: generateId(), type: 'text', content: '' }];
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const blocks: Block[] = [];

  const children = Array.from(doc.body.childNodes);

  if (children.length === 0) {
    return [{ id: generateId(), type: 'text', content: html }];
  }

  children.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        blocks.push({
          id: generateId(),
          type: 'text',
          content: text,
        });
      }
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tagName = el.tagName.toUpperCase();

      // Check if image is inside p/div
      const img = el.querySelector('img');
      if (img && tagName !== 'IMG') {
        const imgSrc = img.getAttribute('src');
        if (imgSrc) {
          blocks.push({
            id: generateId(),
            type: 'image',
            content: imgSrc,
          });
        }
        // Get text without image text if any
        const textContent = el.innerText?.trim();
        if (textContent) {
          blocks.push({
            id: generateId(),
            type: 'text',
            content: textContent,
          });
        }
        return;
      }

      switch (tagName) {
        case 'H1':
          blocks.push({ id: generateId(), type: 'heading1', content: el.innerHTML });
          break;
        case 'H2':
          blocks.push({ id: generateId(), type: 'heading2', content: el.innerHTML });
          break;
        case 'H3':
          blocks.push({ id: generateId(), type: 'heading3', content: el.innerHTML });
          break;
        case 'UL':
          Array.from(el.querySelectorAll('li')).forEach((li) => {
            blocks.push({ id: generateId(), type: 'bulletList', content: li.innerHTML });
          });
          break;
        case 'OL':
          Array.from(el.querySelectorAll('li')).forEach((li) => {
            blocks.push({ id: generateId(), type: 'numberedList', content: li.innerHTML });
          });
          break;
        case 'BLOCKQUOTE':
          blocks.push({ id: generateId(), type: 'quote', content: el.innerHTML });
          break;
        case 'PRE':
        case 'CODE':
          blocks.push({ id: generateId(), type: 'code', content: el.innerText || el.innerHTML });
          break;
        case 'HR':
          blocks.push({ id: generateId(), type: 'divider', content: '' });
          break;
        case 'IMG':
          blocks.push({ id: generateId(), type: 'image', content: (el as HTMLImageElement).src || '' });
          break;
        case 'P':
        case 'DIV':
        default:
          blocks.push({
            id: generateId(),
            type: 'text',
            content: el.innerHTML === '<br>' ? '' : el.innerHTML,
          });
          break;
      }
    }
  });

  return blocks.length > 0 ? blocks : [{ id: generateId(), type: 'text', content: '' }];
}

/**
 * Calculate total word count from blocks
 */
export function calculateWordCountFromBlocks(blocks: Block[]): number {
  if (!blocks) return 0;
  return blocks.reduce((acc, block) => {
    if (block.type === 'divider' || block.type === 'image') return acc;
    // Strip HTML tags if content contains HTML
    const plainText = block.content.replace(/<[^>]*>/g, ' ').trim();
    if (!plainText) return acc;
    const words = plainText.split(/\s+/).filter(Boolean);
    return acc + words.length;
  }, 0);
}

/**
 * Calculate total word count from HTML string
 */
export function calculateWordCountFromHtml(html: string): number {
  if (!html) return 0;
  const plainText = html.replace(/<[^>]*>/g, ' ').trim();
  if (!plainText) return 0;
  return plainText.split(/\s+/).filter(Boolean).length;
}
