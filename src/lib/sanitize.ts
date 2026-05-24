import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(html: string): string {
  if (!html) return "";
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'br', 'span', 'div', 'blockquote', 'code', 'pre', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class', 'style', 'width', 'height'],
  });
}

export function sanitizeText(text: string): string {
  if (!text) return "";
  // Strip all HTML tags
  return text.replace(/<[^>]*>?/gm, '');
}
