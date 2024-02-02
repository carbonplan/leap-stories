import React from 'react'
import { Row, Column } from '@carbonplan/components'

import Layout from './layout'
import { ReferencesProvider } from './references'

const Story = ({ children }) => {
  return (
    <Layout>
      <Row>
        <Column start={[1, 2, 3, 3]} width={[6]} sx={{ pt: 6 }}>
          <ReferencesProvider color='primary'>{children}</ReferencesProvider>
        </Column>
      </Row>
    </Layout>
  )
}

export default Story
