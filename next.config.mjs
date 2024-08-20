/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    LIFF_ID: process.env.LIFF_ID,
  },
  transpilePackages: ['antd-mobile'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'antd-mobile': 'antd-mobile/2x',
    }

    return config
  },
}

export default nextConfig
