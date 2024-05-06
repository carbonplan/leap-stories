import React from 'react'
import { Container, Flex, Box } from 'theme-ui'
import { FadeIn, Guide, Scrollbar } from '@carbonplan/components'
import Meta from './meta'
import Header from './header'
import Footer from './footer'

const Layout = ({
  title,
  description,
  url,
  card,
  children,
  header = true,
  guide = true,
  scrollbar = false,
  fade = true,
  container = true,
  printable = false,
}) => {
  let content = children

  if (fade) {
    content = <FadeIn duration={250}>{content}</FadeIn>
  }
  if (container) {
    content = (
      <Box sx={{ mb: [8, 8, 9, 10] }}>
        <Container>{content}</Container>
      </Box>
    )
  }

  const hideOnPrint = printable
    ? {
        '@media print': {
          display: 'none',
        },
      }
    : {}

  return (
    <>
      {guide && <Guide color={'teal'} />}
      {scrollbar && <Scrollbar />}
      <Meta card={card} description={description} title={title} url={url} />
      <Flex
        sx={{
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        {header && (
          <Box
            as='header'
            sx={{
              width: '100%',
              height: '56px',
              zIndex: 2000,
              ...hideOnPrint,
            }}
          >
            <Container>
              <Header />
            </Container>
          </Box>
        )}
        <Box
          sx={{
            width: '100%',
            flex: '1 1 auto',
          }}
        >
          {content}
        </Box>
        <Footer />
      </Flex>
    </>
  )
}

export default Layout
