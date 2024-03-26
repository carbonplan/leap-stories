import React from 'react'
import { Box, Flex } from 'theme-ui'

const Figure = ({ as = 'figure', title, children, sx }) => {
  return (
    <Box
      as={as}
      sx={{
        my: [6, 6, 6, 7],
        '@media print': {
          breakInside: 'avoid',
        },
        ...sx,
      }}
    >
      {title && (
        <Box
          sx={{
            fontSize: [3, 3, 3, 4],
            fontFamily: 'heading',
            fontWeight: 'heading',
            lineHeight: 'h3',
            mb: [3, 4],
            pb: 2,
            width: '100%',
            borderWidth: 0,
            borderColor: 'secondary',
            borderStyle: 'solid',
            borderBottomWidth: 1,
            color: 'secondary',
          }}
        >
          {title}
        </Box>
      )}
      <Flex sx={{ flexDirection: 'column', gap: [4, 4, 4, 5] }}>
        {children}
      </Flex>
    </Box>
  )
}

export default Figure
