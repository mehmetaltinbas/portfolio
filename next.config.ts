import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    experimental: {
        outputFileTracing: true,
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
        config.externals.push(/@?prisma\/client/);
        }
        return config;
    },
    outputFileTracingIncludes: {
        '/generated/prisma': ['generated/prisma/**/*'],
    },
};

export default nextConfig;
