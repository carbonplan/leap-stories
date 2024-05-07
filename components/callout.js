import { Box } from 'theme-ui'

const Callout = ({ children }) => {
  return (
    <Box
      variant='styles.blockquote'
      sx={{
        mx: [-4, -5, -5, -6],
        p: [4, 5, 5, 6],
        background: 'hinted',
      }}
    >
      {children}
    </Box>
  )
}

export default Callout
