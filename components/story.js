import React from 'react'
import { Box } from 'theme-ui'
import { Row, Column } from '@carbonplan/components'

import Authors from './authors'
import Callout from './callout'
import Layout from './layout'
import Links from './links'

const Story = ({
  title = 'Placeholder title',
  description = 'Placeholder description',
  authors = [],
  links = [],
  children,
}) => {
  return (
    <Layout title={title} description={description}>
      <Row>
        <Column start={[1, 2, 4, 4]} width={[6]} sx={{ pt: 6 }}>
          <Box as='h1' variant='styles.h1'>
            {title}
          </Box>

          <Authors authors={authors} />

          <Callout>{description} </Callout>
          {children}

          <Links links={links} />
        </Column>
      </Row>
    </Layout>
  )
}

export default Story
