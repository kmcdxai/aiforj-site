/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/final',
        destination: '/final.html',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.aiforj.com' }],
        destination: 'https://aiforj.com/:path*',
        permanent: true,
      },
    ];
  },
};
module.exports = nextConfig;
