import React from 'react'
import { Box, Link, Image } from 'theme-ui'
import { Row, Column } from '@carbonplan/components'

const Header = () => {
  return (
    <Row
      sx={{
        pt: ['12px'],
        pb: [3],
      }}
    >
      <Column start={[1]} width={[2]}>
        <Box
          sx={{ pointerEvents: 'all', display: 'block', width: 'fit-content' }}
        >
          <Link
            href='https://leap.columbia.edu/'
            aria-label='LEAP Homepage'
            sx={{ display: 'block' }}
          >
            <Image src='/leap.png' alt='LEAP' sx={{ width: '150px' }} />
          </Link>
        </Box>
      </Column>
    </Row>
  )
}

export default Header
