import { Box } from 'theme-ui'

const Callout = () => {
  return (
    <Box
      variant='styles.blockquote'
      sx={{
        mx: [-4, -5, -5, -6],
        p: [4, 5, 5, 6],
        background: 'hinted',
      }}
    >
      Oceans are helping us to fight climate change, but there’s still a lot to
      learn about how that works. Scientists use machine learning to study how
      oceans absorb carbon, even in parts of the world they haven’t sampled
      directly.
    </Box>
  )
}

export default Callout
