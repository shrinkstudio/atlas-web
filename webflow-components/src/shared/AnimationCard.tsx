import { type ReactNode, useEffect, useRef, useState } from 'react';
import { ensureFonts } from './fonts';
import { TAILWIND_CSS } from './generated/tailwind-css';

/**
 * Shared shell every animation renders inside. It replaces the old
 * iframe embed (V0 Embed + Vercel app) with the same behavior, natively:
 *
 * - Ships the compiled Tailwind stylesheet in a <style> tag. Code Components
 *   render in a shadow root, so the styles ride along with each component
 *   and cannot leak into the rest of the page.
 * - Loads the DM Sans / DM Mono fonts (document-level, shared, once).
 * - Only mounts the animation while it is near the viewport (600px margin),
 *   so many animations on one page cost nothing off-screen — exactly what
 *   the old lazy iframe did.
 * - Fixed-size cards (width/height given) scale down to fit the box the
 *   Designer gives the component, capped at 1:1 so text stays crisp.
 * - Heroes (selfSized) manage their own layout; with `entrance` on, the
 *   shell hides them briefly, then reveals with the page-load cadence and
 *   posts "ruxlo:play" so their internal entrance runs on-screen.
 */

const PAD = 16;
const MOUNT_MARGIN = '600px';
const ENTRANCE_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

export interface AnimationCardProps {
  /** Natural stage size of the card, from the source design. */
  width?: number;
  height?: number;
  /** Hero animations size themselves; the shell skips the fit-scaling. */
  selfSized?: boolean;
  /** Reveal in the page-load cadence and post "ruxlo:play" (heroes only). */
  entrance?: boolean;
  entranceDelay?: number;
  children: ReactNode;
}

export const AnimationCard = ({
  width = 320,
  height = 320,
  selfSized = false,
  entrance = false,
  entranceDelay = 450,
  children,
}: AnimationCardProps) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [scale, setScale] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [delayDone, setDelayDone] = useState(!entrance);

  useEffect(() => {
    ensureFonts();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const list = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(list.matches);
    update();
    list.addEventListener('change', update);
    return () => list.removeEventListener('change', update);
  }, []);

  // Mount the animation only while near the viewport; unmount again when it
  // scrolls far away so its loop stops running.
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setMounted(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => setMounted(entries[0].isIntersecting),
      { rootMargin: MOUNT_MARGIN }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Fit-scaling for fixed-size cards: fill the component's box, never upscale
  // (DOM text rasterizes at layout size, so upscaling blurs it).
  useEffect(() => {
    if (selfSized) return;
    const el = outerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const update = () =>
      setScale(
        Math.min(
          1,
          el.clientWidth / (width + PAD * 2),
          el.clientHeight / (height + PAD * 2)
        )
      );
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [selfSized, width, height]);

  useEffect(() => {
    if (!entrance) return;
    const t = window.setTimeout(() => setDelayDone(true), entranceDelay);
    return () => window.clearTimeout(t);
  }, [entrance, entranceDelay]);

  // Heroes listen for "ruxlo:play" on the window (kept from the iframe days);
  // post it a few times once revealed — they treat it as idempotent.
  const revealed = !entrance || reducedMotion || delayDone;
  useEffect(() => {
    if (!entrance || !revealed || reducedMotion || !mounted) return;
    const post = () => window.postMessage({ type: 'ruxlo:play' }, '*');
    post();
    const t1 = window.setTimeout(post, 200);
    const t2 = window.setTimeout(post, 600);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [entrance, revealed, reducedMotion, mounted]);

  return (
    <div
      ref={outerRef}
      style={{
        width: '100%',
        aspectRatio: selfSized ? undefined : `${width + PAD * 2} / ${height + PAD * 2}`,
        position: 'relative',
        overflow: selfSized ? undefined : 'hidden',
        WebkitFontSmoothing: 'antialiased',
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'none' : 'translateY(16px)',
        filter: revealed ? 'none' : 'blur(8px)',
        transition:
          entrance && !reducedMotion
            ? `opacity 0.7s ${ENTRANCE_EASE}, transform 0.7s ${ENTRANCE_EASE}, filter 0.7s ${ENTRANCE_EASE}`
            : 'none',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: TAILWIND_CSS }} />
      {mounted &&
        (selfSized ? (
          children
        ) : (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width,
              height,
              display: 'grid',
              placeItems: 'center',
              transform: `translate(-50%, -50%) scale(${scale})`,
            }}
          >
            {children}
          </div>
        ))}
    </div>
  );
};
