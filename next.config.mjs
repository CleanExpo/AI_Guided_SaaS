/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@supabase/ssr'],
  images: {
    domains: ['localhost'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ensure environment variables are available
  env: {
    // These will be replaced at build time
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV || 'development',
  },
  // Public runtime config (deprecated but useful for some cases)
  publicRuntimeConfig: {
    APP_URL: process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
  },
  webpack: (config, { isServer }) => {
    // Ignore lightningcss native module errors
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'lightningcss': false,
    };
    
    // Ensure environment variables are available in webpack
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
  experimental: {
    // Use SWC instead of Babel for better compatibility
    forceSwcTransforms: true,
  },
};

export default nextConfig;
