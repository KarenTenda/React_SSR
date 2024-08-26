const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost', 
        port: '5001',
        pathname: '/**', 
      }
      // {
      //   protocol: 'http',
      //   hostname: 'localhost', 
      //   port: '5001',
      //   pathname: '/cameras/**', 
      // },
    ],
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
