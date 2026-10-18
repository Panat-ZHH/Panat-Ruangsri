/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      { source: '/software-developer', destination: '/panat/software-developer', permanent: true },
      { source: '/founder', destination: '/panat/founder', permanent: true },
      { source: '/side-jobs', destination: '/panat/side-jobs', permanent: true },
      { source: '/hobbys', destination: '/panat/hobbys', permanent: true },
      { source: '/legal/:document', destination: '/panat/legal/:document', permanent: true },
    ];
  },
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    }];
  },
};

export default nextConfig;
