import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        domains: [
            'prod-files-secure.s3.us-west-2.amazonaws.com',
            's3.us-west-2.amazonaws.com',
            'www.notion.so',
            'notion.so',
            'images.unsplash.com',
            'file.notion.so'
        ],
    },
    eslint: {
        ignoreDuringBuilds: true
    },
};

export default nextConfig;
