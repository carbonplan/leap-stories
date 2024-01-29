import React from 'react'
import Head from 'next/head'
import { useThemeUI } from 'theme-ui'

const Meta = ({ title, description, card, url }) => {
  const { theme, colorMode } = useThemeUI()
  if (!description) {
    console.warn(
      'a custom description should be used for search engine optimization'
    )
  }
  if (!title) {
    console.warn('a custom title should be used for search engine optimization')
  }
  const titleProp = title || 'LEAP Data Stories'
  const descriptionProp =
    description ||
    'Data-driven stories that showcase data produced and used at LEAP.'
  const cardProp = card || 'TK'
  const urlProp = url || 'TK'

  return (
    <Head>
      <title>{titleProp}</title>
      <meta name='description' content={descriptionProp} />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      {url && <link rel='canonical' href={url} />}
      <link
        rel='icon'
        type='image/png'
        href='https://leap.columbia.edu/wp-content/uploads/2021/11/cropped-favicon-1-1-32x32.png'
      />
      <link
        rel='preload'
        href='https://fonts.carbonplan.org/relative/relative-book-pro.woff2'
        as='font'
        type='font/woff2'
        crossOrigin='anonymous'
      />
      <link
        rel='preload'
        href='https://fonts.carbonplan.org/relative/relative-medium-pro.woff2'
        as='font'
        type='font/woff2'
        crossOrigin='anonymous'
      />
      <link
        rel='preload'
        href='https://fonts.carbonplan.org/relative/relative-mono-11-pitch-pro.woff2'
        as='font'
        type='font/woff2'
        crossOrigin='anonymous'
      />
      <link
        rel='preload'
        href='https://fonts.carbonplan.org/relative/relative-faux-book-pro.woff2'
        as='font'
        type='font/woff2'
        crossOrigin='anonymous'
      />
      <meta name='theme-color' content={theme.colors.background} />
      <meta
        name='color-scheme'
        content={colorMode === 'light' ? 'light' : 'dark'}
      />
      <meta name='msapplication-TileColor' content={theme.colors.background} />
      <meta property='og:title' content={titleProp} />
      <meta property='og:description' content={descriptionProp} />
      <meta property='og:image' content={cardProp} />
      <meta property='og:url' content={urlProp} />
      <meta name='twitter:title' content={titleProp} />
      <meta name='twitter:description' content={descriptionProp} />
      <meta name='twitter:image' content={cardProp} />
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='format-detection' content='telephone=no' />
    </Head>
  )
}

export default Meta
