import Document, { Html, Main, NextScript, Head } from 'next/document'
import { Tracking } from '@carbonplan/components'
import { InitializeColorMode } from 'theme-ui'

class MyDocument extends Document {
  render() {
    return (
      <Html lang='en' className='no-focus-outline'>
        <Head>
          <Tracking id={process.env.GA_TRACKING_ID} />
          <link
            href='https://fonts.googleapis.com/css2?family=Inter:wght@100;400&display=swap'
            rel='stylesheet'
          />
        </Head>
        <body>
          <InitializeColorMode />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
