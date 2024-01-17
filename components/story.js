import React from 'react'
import { Row, Column } from '@carbonplan/components'
import StoryContent from '../story/story.mdx'

const Story = () => {
  return (
    <>
      <Row>
        <Column start={4} width={5}>
          <StoryContent />
        </Column>
      </Row>
    </>
  )
}

export default Story
