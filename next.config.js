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
  // compiler: {
  //   // Enables the styled-components SWC transform
  //   styledComponents: true
  // }
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
