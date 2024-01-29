import React from 'react'
import Story from './story'
import Layout from './layout'

const Main = ({ mdxSource }) => {
  return (
    <Layout>
      <Story mdxSource={mdxSource} />
    </Layout>
  )
}

export default Main
