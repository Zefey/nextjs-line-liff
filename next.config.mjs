/** @type {import('next').NextConfig} */
const nextConfig = {
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
