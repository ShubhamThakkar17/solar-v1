"use client";

import { useEffect, useRef, useState } from "react";
import { type Img, srcFor, srcSetFor } from "@/lib/images";

type Props = {
  img: Img;
  /** The `sizes` attribute. Get this right or the browser over-fetches. */
  sizes?: string;
  className?: string;
  /** Set on the hero only — hints the LCP image to the preload scanner. */
  priority?: boolean;
};

/**
 * A 4K-capable image served from the Unsplash CDN.
 *
 * The tone colour fills the frame until the bitmap decodes, so there is no
 * white flash against the graphite page. `srcSetFor` caps the candidate
 * widths at the image's native size — see the note in lib/images.ts about
 * why that matters.
 */
export default function Photo({
  img,
  sizes = "100vw",
  className = "",
  priority = false,
}: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  // A cached image can finish decoding before React attaches `onLoad`, and
  // that event never fires again — leaving the picture stuck at opacity 0.
  // Checking `.complete` once on mount closes that race.
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);

  return (
    // next/image is deliberately not in the path: the export is static and
    // `images.unoptimized` is set, so it would add a wrapper and a loader
    // around the same CDN URL while discarding the native-width cap that
    // `srcSetFor` applies. The srcset below is the optimisation.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={srcFor(img, priority ? 1920 : 1280)}
      srcSet={srcSetFor(img)}
      sizes={sizes}
      alt={img.alt}
      width={img.native[0]}
      height={img.native[1]}
      onLoad={() => setLoaded(true)}
      // Never leave the frame permanently blank if the CDN fails.
      onError={() => setLoaded(true)}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding={priority ? "sync" : "async"}
      className={`h-full w-full object-cover transition-opacity duration-700 ${
        loaded ? "opacity-100" : "opacity-0"
      } ${className}`}
      style={{ backgroundColor: img.tone }}
    />
  );
}
