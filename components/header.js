import React from 'react'
import { Box, Link, Image } from 'theme-ui'

const Header = () => {
  return (
    <Box pb={8}>
      <Box
        as='header'
        sx={{
          width: '100%',
          px: [4, 5, 5, 6],
          borderBottom: '1px solid #eee',
          borderColor: 'muted',
          py: 3,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: 'background',
        }}
      >
        <Link href='/'>
          <Image src={'/leap.png'} width={120} height={30} alt={'LEAP Logo'} />
        </Link>
      </Box>
    </Box>
  )
}

export default Header
