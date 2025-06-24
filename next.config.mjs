/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  serverActions: {
    bodySizeLimit: '10mb', // Aumenta il limite del body per file upload
  },
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/andamento",
        permanent: false,
      },
    ];
  },
}

export default nextConfig
