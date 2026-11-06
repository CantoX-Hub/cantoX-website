/** @type {import('next').NextConfig} */
const nextConfig = {
  // Forward /api/v1/* to the backend, so login cookies are set on your own domain
  async rewrites() {
    const backend = process.env.BACKEND_URL;
    if (!backend) return [];
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backend}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;