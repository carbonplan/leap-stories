import React from 'react'
import { ThemeUIProvider } from 'theme-ui'
import '@carbonplan/components/fonts.css'
import '@carbonplan/components/globals.css'
import theme from '@carbonplan/theme'
import { useThemedStylesWithMdx } from '@theme-ui/mdx'
import { MDXProvider, useMDXComponents } from '@mdx-js/react'

const leapTheme = {
  ...theme,
  fonts: {
    body: 'Inter, sans-serif',
    faux: 'Inter, sans-serif',
    heading: 'Inter, sans-serif',
    mono: 'Inter, sans-serif',
  },
  colors: {
    text: '#000',
    background: '#FFFFFF',
    primary: '#000',
    secondary: '#808080',
    muted: '#b9b9bb',
    hinted: '#f2f2f1',
    red: '#f07071',
    orange: '#ea9755',
    yellow: '#d4c05e',
    green: '#7eb36a',
    teal: '#64b9c4',
    blue: '#85a2f7',
    purple: '#bc85d9',
    pink: '#e587b6',
    grey: '#a9b4c4',
  },
  config: {
    initialColorModeName: 'light',
    printColorModeName: 'light',
    useLocalStorage: false,
    useColorSchemeMediaQuery: false,
  },
  styles: {
    ...theme.styles,
    a: {
      ...theme.styles.a,
      color: 'primary',
      textDecoration: 'underline',
    },
  },
}

const App = ({ Component, pageProps }) => {
  const components = useThemedStylesWithMdx(useMDXComponents())
  return (
    <ThemeUIProvider theme={leapTheme}>
      <MDXProvider components={components}>
        <Component {...pageProps} />
      </MDXProvider>
    </ThemeUIProvider>
  )
}

export default App
