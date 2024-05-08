import nextMDX from '@next/mdx'

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    providerImportSource: '@mdx-js/react',
  },
})

export default withMDX({
  pageExtensions: ['page.js', 'page.jsx', 'page.md', 'page.mdx'],
})
