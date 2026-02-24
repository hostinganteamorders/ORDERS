/**
 * Markdown parser with DOMPurify sanitization for safe rendering
 * Converts markdown syntax to HTML and sanitizes against XSS
 */
import DOMPurify from 'dompurify';

/**
 * Parse markdown text to HTML
 */
export function parseMarkdown(text: string): string {
  if (!text) return '';

  let html = text
    // Code blocks: ```code``` -> <pre><code>code</code></pre>
    .replace(/```(\w*)\n?([\s\S]*?)```/g, (_match, lang, code) => {
      const escapedCode = code.trim()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `<pre class="bg-gray-800 text-green-300 rounded-lg p-3 my-2 overflow-x-auto text-xs font-mono"><code>${escapedCode}</code></pre>`;
    })
    // Inline code: `code` -> <code>code</code>
    .replace(/`([^`]+)`/g, '<code class="bg-gray-200 text-orange-600 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
    // Bold: **text** -> <strong>text</strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    // Italic: *text* -> <em>text</em> (single asterisk, not double)
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
    // Links: [text](url) -> <a>text</a>
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-orange-500 underline hover:text-orange-600">$1</a>')
    // Bullet points: • text -> proper list styling
    .replace(/^[•●]\s*(.*)$/gm, '<div class="flex items-start gap-2 my-1"><span class="text-orange-500 mt-0.5 flex-shrink-0">•</span><span>$1</span></div>')
    // Markdown bullet points: - text -> proper list styling
    .replace(/^[-]\s+(.*)$/gm, '<div class="flex items-start gap-2 my-1"><span class="text-orange-500 mt-0.5 flex-shrink-0">•</span><span>$1</span></div>')
    // Numbered lists: 1. text -> proper styling
    .replace(/^(\d+)\.\s*(.*)$/gm, '<div class="flex items-start gap-2 my-1"><span class="text-orange-500 font-medium min-w-[1.5rem] flex-shrink-0">$1.</span><span>$2</span></div>')
    // Line breaks: \n\n -> paragraph break, \n -> line break
    .replace(/\n\n/g, '</p><p class="mt-2">')
    .replace(/\n/g, '<br/>');

  return html;
}

/**
 * Sanitize HTML using DOMPurify to prevent XSS attacks
 */
export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') {
    // Server-side: basic sanitization fallback
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/javascript:/gi, '');
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'strong', 'em', 'br', 'p', 'div', 'span', 'a',
      'pre', 'code', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4'
    ],
    ALLOWED_ATTR: [
      'class', 'href', 'target', 'rel', 'style'
    ],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Parse and sanitize markdown for safe rendering
 */
export function renderMarkdown(text: string): string {
  const parsed = parseMarkdown(text);
  return sanitizeHtml(parsed);
}
