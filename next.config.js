const dotenv = require('dotenv');
dotenv.config();

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withImages = require('next-images');

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
        pathname: '/**',
      },
    ],
  },
  env: {
    NEXT_LOCAL_API_HOST: process.env.NEXT_LOCAL_API_HOST,
    NEXT_LOCAL_PORT: process.env.NEXT_LOCAL_PORT,
    NEXT_FASTAPI_LOCAL_HOST: process.env.NEXT_FASTAPI_LOCAL_HOST,
    NEXT_FASTAPI_PORT: process.env.NEXT_FASTAPI_PORT,
    NEXT_JSON_SERVER_HOST: process.env.NEXT_JSON_SERVER_HOST,
    NEXT_JSON_SERVER_PORT: process.env.NEXT_JSON_SERVER_PORT,
    NEXT_BACKEND_SERVER_HOST: process.env.NEXT_BACKEND_SERVER_HOST,
    NEXT_BACKEND_SERVER_PORT: process.env.NEXT_BACKEND_SERVER_PORT,
  },
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: 'canvas' }]; // required to make Konva & react-konva work
    return config;
  },
};

module.exports = withBundleAnalyzer(withImages(nextConfig));