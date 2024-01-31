import React from 'react'
import { Row, Column } from '@carbonplan/components'

import Layout from './layout'
import StoryContent from '../story/story.mdx'

const Story = () => {
  return (
    <Layout>
      <Row>
        <Column start={[1, 2, 3, 3]} width={[6]}>
          <StoryContent />
        </Column>
      </Row>
    </Layout>
  )
}

export default Story
