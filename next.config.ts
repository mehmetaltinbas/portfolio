import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";
import { NextConfig } from "next";

const nextConfig: NextConfig = {
    devIndicators: false,
    experimental: {
        authInterrupts: true,
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.plugins = [...config.plugins, new PrismaPlugin()];
        }
        return config;
    },
    turbopack: {},
    images: {
        remotePatterns: [new URL(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/**`)]
    }
};

export default nextConfig;