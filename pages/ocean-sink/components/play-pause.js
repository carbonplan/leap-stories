import React from 'react'
import { Flex, Box } from 'theme-ui'
import { IconButton, Play, Pause } from './icons'
import BoxButton from './box-button'

const PlayPause = ({ playing, setPlaying, sx, controls = <></>, children }) => {
  const handlePlayClick = () => {
    setPlaying(true)
  }

  const handlePauseClick = () => {
    setPlaying(false)
  }

  return (
    <Box>
      <Flex
        sx={{
          gap: 1,
          alignItems: 'center',
          ...sx,
        }}
      >
        <BoxButton
          active={playing}
          aria-label={'Play'}
          onClick={handlePlayClick}
        >
          <Play />
        </BoxButton>

        <BoxButton
          active={!playing}
          aria-label={'Pause'}
          onClick={handlePauseClick}
        >
          <Pause />
        </BoxButton>

        {controls}
      </Flex>
      {children}
    </Box>
  )
}

export default PlayPause
