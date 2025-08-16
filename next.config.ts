import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: '',
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
        source: '/((?!(?:en|fr|front-pages|favicon.ico)\\b)):path',
        destination: '/fr/:path',
        permanent: true,
        locale: false
      }
    ]
  }
}

export default nextConfig
