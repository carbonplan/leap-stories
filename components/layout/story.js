import React from 'react'
import { Row, Column } from '@carbonplan/components'

import Layout from './layout'

const Story = ({ children }) => {
  return (
    <Layout>
      <Row>
        <Column start={[1, 2, 3, 3]} width={[6]} sx={{ pt: 6 }}>
          {children}
        </Column>
      </Row>
    </Layout>
  )
}

export default Story
