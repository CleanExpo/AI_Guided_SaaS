const fs = require('fs');

const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    forceSwcTransforms: true,
    esmExternals: true,
  },
  webpack: (config, { isServer, dev }) => {
    if (!dev) {
      config.optimization.minimize = false;
      config.optimization.usedExports = false;
    }
    
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };
    
    return config;
  },
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: false,
};

module.exports = nextConfig;`;

fs.writeFileSync('next.config.js', nextConfig);
console.log('✅ Created next.config.js successfully');
