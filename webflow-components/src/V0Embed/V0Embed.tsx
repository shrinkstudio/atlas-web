import { useEffect, useRef, useState } from 'react';

export interface V0EmbedProps {
  sourceUrl?: string;
  title?: string;
  aspectRatio?: string;
  maxWidth?: string;
  mountMargin?: string;
  posterUrl?: string;
  entrance?: boolean;
  entranceDelay?: number;
}

const ENTRANCE_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

/**
 * Lazy-mounting iframe shell for the client's V0/Vercel UI animations.
 *
 * `loading="lazy"` alone only defers the FIRST load — once booted, an embedded
 * React app animates forever. This shell goes further: the iframe src is only
 * set while the embed is near the viewport (mountMargin), and removed again
 * once it scrolls far away, so five embeds on a page cost nothing off-screen.
 *
 * Reduced motion never mounts the iframe at all and shows the poster instead —
 * which is also the pre-mount placeholder, so give it the old static
 * screenshot and the page reads correctly in every state.
 *
 * Entrance (for the above-the-fold hero): the whole embed stays hidden until
 * the iframe has loaded AND entranceDelay has passed, then rises in
 * (Linear-style fade + blur + lift) and posts "ruxlo:play" into the iframe so
 * the animation's own entrance runs on-screen, in cadence after nav and hero
 * copy. Leave it off for below-the-fold embeds; they mount on approach.
 */
export const V0Embed = ({
  sourceUrl = '',
  title = 'UI animation',
  aspectRatio = '16/10',
  maxWidth = '620px',
  mountMargin = '600px',
  posterUrl = '',
  entrance = false,
  entranceDelay = 450,
}: V0EmbedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [delayDone, setDelayDone] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const list = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(list.matches);
    update();
    list.addEventListener('change', update);
    return () => list.removeEventListener('change', update);
  }, []);

  // Get the connection warm before the iframe src is even set.
  useEffect(() => {
    if (!sourceUrl || typeof document === 'undefined') return;
    try {
      const origin = new URL(sourceUrl, window.location.href).origin;
      if (document.querySelector(`link[rel="preconnect"][href="${origin}"]`)) return;
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = origin;
      link.crossOrigin = '';
      document.head.appendChild(link);
    } catch {
      /* invalid URL: nothing to warm */
    }
  }, [sourceUrl]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || reducedMotion || !sourceUrl) return;
    // The hero is above the fold by definition — mount instantly instead of
    // waiting an observer tick, so the iframe starts loading at hydration.
    if (entrance) {
      setMounted(true);
      return;
    }
    if (typeof IntersectionObserver === 'undefined') {
      setMounted(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => setMounted(entries[0].isIntersecting),
      { rootMargin: mountMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion, sourceUrl, mountMargin, entrance]);

  useEffect(() => {
    if (!entrance) return;
    const t = window.setTimeout(() => setDelayDone(true), entranceDelay);
    return () => window.clearTimeout(t);
  }, [entrance, entranceDelay]);

  // Reduced motion shows the poster in place, with no reveal to wait for.
  const revealed = !entrance || reducedMotion || (loaded && delayDone);

  // The load event can beat the app's message listener, so post a few times;
  // the app treats "ruxlo:play" as idempotent and also has its own fallback.
  useEffect(() => {
    if (!entrance || !revealed || reducedMotion) return;
    const post = () =>
      iframeRef.current?.contentWindow?.postMessage({ type: 'ruxlo:play' }, '*');
    post();
    const t1 = window.setTimeout(post, 200);
    const t2 = window.setTimeout(post, 600);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [entrance, revealed, reducedMotion]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        maxWidth,
        aspectRatio,
        margin: '0 auto',
        overflow: 'hidden',
        position: 'relative',
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'none' : 'translateY(16px)',
        filter: revealed ? 'none' : 'blur(8px)',
        transition: entrance
          ? `opacity 0.7s ${ENTRANCE_EASE}, transform 0.7s ${ENTRANCE_EASE}, filter 0.7s ${ENTRANCE_EASE}`
          : 'none',
      }}
    >
      {posterUrl ? (
        <img
          src={posterUrl}
          alt={title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : null}
      {mounted && !reducedMotion && sourceUrl ? (
        <iframe
          ref={iframeRef}
          src={sourceUrl}
          title={title}
          loading={entrance ? 'eager' : 'lazy'}
          onLoad={() => setLoaded(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            overflow: 'hidden',
          }}
        />
      ) : null}
    </div>
  );
};
