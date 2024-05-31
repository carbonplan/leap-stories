import nextMDX from '@next/mdx'

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    providerImportSource: '@mdx-js/react',
  },
})

export default withMDX({
  pageExtensions: ['page.js', 'page.jsx', 'page.md', 'page.mdx'],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/ocean-sink',
        permanent: false,
      },
      {
        source: '/stories/:path',
        destination: '/:path',
        permanent: false,
      },
    ]
  },
})
