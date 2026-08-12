import React, { useEffect, useState } from 'react';

/** Soft gray placeholder when a remote image fails to load */
const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <rect fill="#f1f5f9" width="800" height="600"/>
      <g fill="#94a3b8" transform="translate(400 300)">
        <rect x="-48" y="-36" width="96" height="72" rx="8" fill="none" stroke="#94a3b8" stroke-width="4"/>
        <circle cx="-18" cy="-8" r="10"/>
        <path d="M-40 28 L-10 0 L10 16 L28 -8 L48 28 Z"/>
      </g>
    </svg>`,
  );

/**
 * Unsplash `auto=format` negotiates AVIF/WebP from Accept headers.
 * Force JPEG so product photos always render in the browser.
 */
function normalizeSrc(src?: string | null): string | undefined {
  if (!src) return undefined;
  try {
    if (!src.includes('images.unsplash.com')) return src;
    const url = new URL(src);
    url.searchParams.delete('auto');
    url.searchParams.set('fm', 'jpg');
    return url.toString();
  } catch {
    return src;
  }
}

type SafeImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

export const SafeImage: React.FC<SafeImageProps> = ({ src, alt, onError, ...rest }) => {
  const normalized = normalizeSrc(typeof src === 'string' ? src : undefined);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [normalized]);

  const resolved = failed || !normalized ? PLACEHOLDER : normalized;

  return (
    <img
      {...rest}
      src={resolved}
      alt={alt ?? ''}
      decoding="async"
      onError={(e) => {
        if (!failed) setFailed(true);
        onError?.(e);
      }}
    />
  );
};
