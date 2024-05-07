import React from 'react'
import { Row, Column } from '@carbonplan/components'

import Layout from './layout'

const Story = ({ children }) => {
  return (
    <Layout
      title={'The ocean carbon sink'}
      description={
        'Oceans are helping us to fight climate change, but there’s still a lot to learn about how that works. Scientists use machine learning to study how oceans absorb carbon, even in parts of the world they haven’t sampled directly.'
      }
    >
      <Row>
        <Column start={[1, 2, 4, 4]} width={[6]} sx={{ pt: 6 }}>
          {children}
        </Column>
      </Row>
    </Layout>
  )
}

export default Story
