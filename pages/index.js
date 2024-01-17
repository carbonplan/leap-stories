import React from 'react'
import fs from 'fs'
import path from 'path'
import { serialize } from 'next-mdx-remote/serialize'
import Main from '../components/main'

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'story', 'story.md')
  const mdxContent = fs.readFileSync(filePath, 'utf8')
  const mdxSource = await serialize(mdxContent)
  return { props: { mdxSource } }
}

const Index = ({ mdxSource }) => {
  return <Main mdxSource={mdxSource} />
}

export default Index
