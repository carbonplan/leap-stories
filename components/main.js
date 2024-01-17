import React from 'react'
import Story from './story'
import { Image } from 'theme-ui'
import { Row, Column } from '@carbonplan/components'

const Main = ({ mdxSource }) => {
  return (
    <>
      <Row>
        <Column start={1} width={2}>
          <Image src='/leap.png' alt='LEAP' sx={{ width: '100%' }} />
        </Column>
      </Row>
      <Story mdxSource={mdxSource} />
    </>
  )
}

export default Main
