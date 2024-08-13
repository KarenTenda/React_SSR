const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost', 
        port: '5001',
        pathname: '/cameras/**', 
      },
    ],
  },
};

module.exports = nextConfig;
