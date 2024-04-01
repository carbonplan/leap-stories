import { Button, Link } from '@carbonplan/components'
import { Box } from 'theme-ui'

const Authors = ({ authors }) => {
  return (
    <Box sx={{ mt: 5, mb: 6, fontSize: [3, 3, 3, 4] }}>
      by{' '}
      {authors
        .map((a, i) => (i < authors.length - 1 ? a : `and ${a}`))
        .join(', ')}
      <Box sx={{ fontStyle: 'italic', mt: [5, 5, 5, 6], color: 'secondary' }}>
        This story was produced in collaboration with{' '}
        <Button
          href='https://carbonplan.org/'
          inverted
          sx={{ display: 'inline-block' }}
        >
          <Box as='span' sx={{ textDecoration: 'underline' }}>
            CarbonPlan
          </Box>
          .
        </Button>
      </Box>
    </Box>
  )
}

export default Authors
