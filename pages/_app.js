import { ThemeProvider } from 'theme-ui'
import '@carbonplan/components/fonts.css'
import '@carbonplan/components/globals.css'
import theme from '@carbonplan/theme'

const leapTheme = {
  ...theme,
  colors: {
    background: '#fff',
    text: '#000',
    primary: '#000',
    secondary: '#000',
    accent: '#000',
    highlight: '#000',
    muted: '#000',
  },
}

const App = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={leapTheme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default App
