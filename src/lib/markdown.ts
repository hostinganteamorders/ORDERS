/**
 * Simple markdown parser for chat messages
 * Converts basic markdown syntax to HTML
 */

export function parseMarkdown(text: string): string {
  if (!text) return '';
  
  return text
    // Bold: **text** -> <strong>text</strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    // Italic: *text* -> <em>text</em> (single asterisk, not double)
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
    // Bullet points: • text -> proper list styling
    .replace(/^[•●]\s*(.*)$/gm, '<div class="flex items-start gap-2 my-1"><span class="text-orange-500 mt-0.5">•</span><span>$1</span></div>')
    // Numbered lists: 1. text -> proper styling
    .replace(/^(\d+)\.\s*(.*)$/gm, '<div class="flex items-start gap-2 my-1"><span class="text-orange-500 font-medium min-w-[1.5rem]">$1.</span><span>$2</span></div>')
    // Line breaks: \n\n -> paragraph break, \n -> line break
    .replace(/\n\n/g, '</p><p class="mt-2">')
    .replace(/\n/g, '<br/>');
}

/**
 * Sanitize HTML to prevent XSS attacks
 * Only allows safe tags used by parseMarkdown
 */
export function sanitizeHtml(html: string): string {
  // Allow only specific safe tags and classes
  const allowedTags = ['strong', 'em', 'br', 'p', 'div', 'span'];
  const allowedClasses = ['font-semibold', 'flex', 'items-start', 'gap-2', 'my-1', 'text-orange-500', 'mt-0.5', 'font-medium', 'min-w-[1.5rem]', 'mt-2'];
  
  // Basic sanitization - remove script tags and event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

/**
 * Parse and sanitize markdown for safe rendering
 */
export function renderMarkdown(text: string): string {
  const parsed = parseMarkdown(text);
  return sanitizeHtml(parsed);
}
