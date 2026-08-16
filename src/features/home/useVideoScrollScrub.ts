import { useEffect, type RefObject } from 'react';

interface VideoScrollScrubRefs {
  /** Tall wrapper section that defines the scroll distance. */
  wrapperRef: RefObject<HTMLElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  /** Hero text overlay — fades out as the sequence progresses. */
  contentRef: RefObject<HTMLDivElement | null>;
  /** "Scroll to explore" hint — fades out as soon as scrolling starts. */
  hintRef: RefObject<HTMLDivElement | null>;
  enabled: boolean;
}

/**
 * Exponential smoothing factor per frame. High enough to feel responsive,
 * low enough that the video glides like a camera move instead of snapping.
 */
const SMOOTHING = 0.14;
/** Below this delta the interpolation snaps to target and the rAF loop parks. */
const EPSILON = 0.0004;
/** Minimum currentTime change (seconds) worth issuing a seek for. */
const MIN_SEEK_STEP = 1 / 60;

const clamp01 = (value: number): number => Math.min(Math.max(value, 0), 1);

/**
 * Maps page scroll progress through the wrapper onto video.currentTime.
 *
 * All per-frame work happens outside React: measurements are cached, scroll
 * events only update a target value, and a self-parking requestAnimationFrame
 * loop interpolates toward it and writes to the DOM directly.
 */
export function useVideoScrollScrub({
  wrapperRef,
  videoRef,
  contentRef,
  hintRef,
  enabled,
}: VideoScrollScrubRefs): void {
  useEffect(() => {
    if (!enabled) return;
    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    if (!wrapper || !video) return;

    let sectionTop = 0;
    let scrollRange = 1;
    let targetProgress = 0;
    let currentProgress = 0;
    let lastSeekTime = -1;
    let lastContentOpacity = -1;
    let lastHintOpacity = -1;
    let rafId = 0;
    let isLoopRunning = false;
    let isDisposed = false;

    const measure = () => {
      const rect = wrapper.getBoundingClientRect();
      sectionTop = rect.top + window.scrollY;
      scrollRange = Math.max(rect.height - window.innerHeight, 1);
    };

    const readScrollTarget = () => {
      targetProgress = clamp01((window.scrollY - sectionTop) / scrollRange);
    };

    const applyFrame = () => {
      currentProgress += (targetProgress - currentProgress) * SMOOTHING;
      if (Math.abs(targetProgress - currentProgress) < EPSILON) {
        currentProgress = targetProgress;
      }

      const { duration } = video;
      // Skip while a previous seek is still pending to keep the decoder queue short.
      if (Number.isFinite(duration) && duration > 0 && !video.seeking) {
        // Stay a hair before the end so the final frame keeps rendering.
        const time = currentProgress * Math.max(duration - 0.01, 0);
        if (Math.abs(time - lastSeekTime) > MIN_SEEK_STEP) {
          video.currentTime = time;
          lastSeekTime = time;
        }
      }

      // Text overlay: fully visible until ~8% progress, gone by ~40%.
      const content = contentRef.current;
      if (content) {
        const opacity = 1 - clamp01((currentProgress - 0.08) / 0.32);
        if (Math.abs(opacity - lastContentOpacity) > 0.001) {
          content.style.opacity = opacity.toFixed(3);
          content.style.transform = `translateY(${(-32 * (1 - opacity)).toFixed(2)}px)`;
          content.style.pointerEvents = opacity < 0.2 ? 'none' : '';
          lastContentOpacity = opacity;
        }
      }

      // Scroll hint disappears within the first ~5% of the sequence.
      const hint = hintRef.current;
      if (hint) {
        const opacity = 1 - clamp01(currentProgress / 0.05);
        if (Math.abs(opacity - lastHintOpacity) > 0.001) {
          hint.style.opacity = opacity.toFixed(3);
          lastHintOpacity = opacity;
        }
      }
    };

    const tick = () => {
      applyFrame();
      if (currentProgress !== targetProgress) {
        rafId = requestAnimationFrame(tick);
      } else {
        isLoopRunning = false;
      }
    };

    const startLoop = () => {
      if (isLoopRunning || isDisposed) return;
      isLoopRunning = true;
      rafId = requestAnimationFrame(tick);
    };

    const handleScroll = () => {
      readScrollTarget();
      startLoop();
    };

    const handleResize = () => {
      measure();
      readScrollTarget();
      startLoop();
    };

    // Once duration is known, force one frame so a mid-page reload syncs the video.
    const handleMetadata = () => {
      lastSeekTime = -1;
      startLoop();
    };

    measure();
    readScrollTarget();
    // Jump straight to the scrolled position — no catch-up replay on reload.
    currentProgress = targetProgress;
    startLoop();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    video.addEventListener('loadedmetadata', handleMetadata);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      video.removeEventListener('loadedmetadata', handleMetadata);
    };
  }, [wrapperRef, videoRef, contentRef, hintRef, enabled]);
}
