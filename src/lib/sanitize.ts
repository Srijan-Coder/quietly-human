export function sanitizeHtml(html: string): string {
  if (!html) return "";
  
  // Basic fallback sanitization since DOMPurify crashes Vercel Edge/Node due to jsdom limits.
  // We strip dangerous tags like script, iframe, object, embed.
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    // Also remove any inline event handlers (on...)
    .replace(/\s+on[a-z]+="[^"]*"/gi, '')
    .replace(/\s+on[a-z]+='[^']*'/gi, '');
}

export function sanitizeText(text: string): string {
  if (!text) return "";
  // Strip all HTML tags
  return text.replace(/<[^>]*>?/gm, '');
}
