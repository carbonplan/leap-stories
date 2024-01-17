import React from 'react'
import { Row, Column } from '@carbonplan/components'
import { MDXRemote } from 'next-mdx-remote'
import Map from '../story/components/map'

const Story = ({ mdxSource }) => {
  const mdxComponents = {
    Map,
  }

  return (
    <>
      <Row>
        <Column start={4} width={5}>
          <MDXRemote {...mdxSource} components={mdxComponents} />
        </Column>
      </Row>
    </>
  )
}

export default Story
