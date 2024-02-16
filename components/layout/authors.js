import { Box } from 'theme-ui'

const Authors = ({ authors }) => {
  return (
    <Box sx={{ fontStyle: 'italic', mt: 5, mb: 7 }}>
      by{' '}
      {authors
        .map((a, i) => (i < authors.length - 1 ? a : `and ${a}`))
        .join(', ')}
    </Box>
  )
}

export default Authors
