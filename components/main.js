import React from 'react'
import Story from './story'
import { Image, Container } from 'theme-ui'
import { Row, Column, Guide } from '@carbonplan/components'

const Main = ({ mdxSource }) => {
  return (
    <Container>
      <Guide />
      <Row>
        <Column start={1} width={3}>
          <Image src='/leap.png' alt='LEAP' sx={{ width: '100%' }} />
        </Column>
      </Row>
      <Story mdxSource={mdxSource} />
    </Container>
  )
}

export default Main
