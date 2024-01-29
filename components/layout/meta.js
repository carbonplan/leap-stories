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
      <link rel='preconnect' href='https://fonts.googleapis.com' />
      <link rel='preconnect' href='https://fonts.gstatic.com' crossorigin />
      <link
        href='https://fonts.googleapis.com/css2?family=Inter:wght@100;400&display=swap'
        rel='stylesheet'
      />
      <meta name='theme-color' content={theme.colors.background} />
      <meta
        name='color-scheme'
        content={colorMode === 'dark' ? 'dark' : 'light'}
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
