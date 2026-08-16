import { useEffect, useRef, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { usePrefersReducedMotion } from '../../shared/hooks/usePrefersReducedMotion';
import { useVideoScrollScrub } from './useVideoScrollScrub';

// Version query busts stale browser caches when the video file is replaced.
const VIDEO_SRC = '/videos/electronics-hero.mp4?v=3';

interface CinematicHeroProps {
  /** DOM ids of the on-page sections the CTAs scroll to. */
  productsSectionId: string;
  categoriesSectionId: string;
}

/**
 * Full-viewport cinematic hero: the wrapper section provides scroll distance
 * while the inner viewport stays pinned and the scroll position scrubs
 * through the video like a camera move. Falls back to a static poster frame
 * for reduced motion or if the video fails to load.
 */
export const CinematicHero: FC<CinematicHeroProps> = ({
  productsSectionId,
  categoriesSectionId,
}) => {
  const { t } = useTranslation('common');
  const prefersReducedMotion = usePrefersReducedMotion();

  const wrapperRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasVideoFailed, setHasVideoFailed] = useState(false);

  const isCinematic = !prefersReducedMotion && !hasVideoFailed;

  useVideoScrollScrub({ wrapperRef, videoRef, contentRef, hintRef, enabled: isCinematic });

  // The loadeddata/error events can fire before React attaches its handlers
  // (cached video, HMR remounts), so also read the element state directly.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.error) {
      setHasVideoFailed(true);
    } else if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      setIsVideoReady(true);
    }
  }, []);

  const scrollToSection = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <section
      ref={wrapperRef}
      aria-label={t('home.cinematicTitle')}
      className={isCinematic ? 'relative h-[220svh] md:h-[300svh] bg-slate-950' : 'relative h-svh bg-slate-950'}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Graphite backdrop shown while the video loads or if it fails */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(120%_90%_at_70%_20%,#1e293b_0%,#0f172a_45%,#020617_100%)]"
        />

        {!hasVideoFailed && (
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            preload="auto"
            muted
            playsInline
            disablePictureInPicture
            aria-hidden="true"
            tabIndex={-1}
            onLoadedData={() => setIsVideoReady(true)}
            onCanPlay={() => setIsVideoReady(true)}
            onError={() => setHasVideoFailed(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              isVideoReady ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Legibility scrims — kept subtle so the video stays the hero */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/30 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-950/80 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/70 to-transparent"
        />

        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-12">
            <div ref={contentRef} className="max-w-2xl space-y-6 pt-16 will-change-transform">
              <p className="hero-fade-up flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-blue-400">
                <span aria-hidden="true" className="h-px w-8 bg-blue-400/70" />
                {t('home.cinematicEyebrow')}
              </p>

              <h1
                className="hero-fade-up text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
                style={{ animationDelay: '120ms' }}
              >
                {t('home.cinematicTitle')}
              </h1>

              <p
                className="hero-fade-up max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base"
                style={{ animationDelay: '240ms' }}
              >
                {t('home.cinematicSubtitle')}
              </p>

              <div className="hero-fade-up flex flex-wrap gap-3 pt-2" style={{ animationDelay: '360ms' }}>
                <button
                  type="button"
                  onClick={() => scrollToSection(productsSectionId)}
                  className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold tracking-wide text-slate-950 transition-all duration-300 hover:bg-blue-50 hover:shadow-[0_8px_30px_rgba(255,255,255,0.15)]"
                >
                  <span>{t('home.cinematicCtaProducts')}</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection(categoriesSectionId)}
                  className="inline-flex cursor-pointer items-center rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:border-white/60 hover:bg-white/5"
                >
                  {t('home.cinematicCtaCategories')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {isCinematic && (
          <div
            ref={hintRef}
            aria-hidden="true"
            className="hero-fade-up absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2 text-slate-400"
            style={{ animationDelay: '700ms' }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em]">
              {t('home.cinematicScrollHint')}
            </span>
            <ChevronDown size={16} className="hero-scroll-hint" />
          </div>
        )}
      </div>
    </section>
  );
};
