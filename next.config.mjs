/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // RAWG game cover images
      { protocol: "https", hostname: "media.rawg.io" },
      // Vercel Blob public URLs (evidence screenshots, future avatar uploads)
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
