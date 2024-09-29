/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'img.classistatic.de',
          port: '',
          pathname: '/api/v1/**',
        },
      ],
    },
  }
  
  export default nextConfig;