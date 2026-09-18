const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&display=swap';

/**
 * Loads DM Sans / DM Mono from Google Fonts by appending a stylesheet link
 * to the page head (once, however many animation instances are on the page).
 * @font-face rules registered on the document apply inside shadow roots, so
 * this is all the components need even though they render in a shadow DOM.
 */
export function ensureFonts() {
  if (typeof document === 'undefined') return;
  if (document.querySelector(`link[href="${FONTS_HREF}"]`)) return;
  for (const origin of ['https://fonts.googleapis.com', 'https://fonts.gstatic.com']) {
    if (!document.querySelector(`link[rel="preconnect"][href="${origin}"]`)) {
      const pre = document.createElement('link');
      pre.rel = 'preconnect';
      pre.href = origin;
      if (origin.includes('gstatic')) pre.crossOrigin = '';
      document.head.appendChild(pre);
    }
  }
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = FONTS_HREF;
  document.head.appendChild(link);
}
