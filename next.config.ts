import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: `next build` emits a fully static site into `out/`,
  // deployable to any host (Vercel, Netlify, S3, nginx).
  output: "export",

  // Images are served straight from the Unsplash CDN with hand-built
  // srcsets (see lib/images.ts), so Next's optimizer is not in the path.
  images: { unoptimized: true },
};

export default nextConfig;
