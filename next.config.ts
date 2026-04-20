import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: process.env.BASEPATH,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/fr/dashboard',
        permanent: true,
        locale: false
      },
      {
        source: '/:lang(en|fr)',
        destination: '/:lang/dashboard',
        permanent: true,
        locale: false
      },
      {
        source: '/:path((?!en|fr|front-pages|images|api|favicon.ico).*)*',
        destination: '/fr/:path*',
        permanent: true,
        locale: false
      }
    ]
  }
}

export default nextConfig
