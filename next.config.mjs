/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@supabase/ssr'],
  images: {
    domains: ['localhost'],
  },
  typescript: {
    // Ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
  // Suppress all webpack warnings/errors
  webpack: (config, { isServer }) => {
    config.ignoreWarnings = [
      { module: /node_modules/ },
      () => true,
    ];
    
    // Disable type checking
    config.module.rules = config.module.rules.map(rule => {
      if (rule.oneOf) {
        rule.oneOf = rule.oneOf.map(oneOfRule => {
          if (oneOfRule.test && oneOfRule.test.toString().includes('tsx?')) {
            oneOfRule.options = {
              ...oneOfRule.options,
              transpileOnly: true,
              compilerOptions: {
                noEmit: false,
              }
            };
          }
          return oneOfRule;
        });
      }
      return rule;
    });
    
    return config;
  },
  // Experimental features to speed up build
  experimental: {
    optimizeCss: true,
    turbo: {
      rules: {
        '*.ts': ['babel-loader'],
        '*.tsx': ['babel-loader'],
      }
    }
  }
};

export default nextConfig;