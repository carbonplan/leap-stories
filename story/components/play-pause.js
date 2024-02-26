import React, { useEffect, useState } from 'react'
import { Flex, Box } from 'theme-ui'
import useInViewPlayPause from '../../hooks/useInViewPlayPause'
import { IconButton, Play, Pause } from './icons'

const PlayPause = ({ playing, setPlaying, sx, controls = <></>, children }) => {
  const [shouldAnimate, ref] = useInViewPlayPause()
  const [isManuallyPaused, setIsManuallyPaused] = useState(false)

  const handlePlayClick = () => {
    setPlaying(true)
    setIsManuallyPaused(false)
  }

  const handlePauseClick = () => {
    setPlaying(false)
    setIsManuallyPaused(true)
  }

  useEffect(() => {
    if (!isManuallyPaused) {
      if (shouldAnimate) {
        setPlaying(true)
      } else {
        setPlaying(false)
      }
    }
  }, [shouldAnimate, isManuallyPaused, setPlaying])

  return (
    <Box ref={ref}>
      <Flex
        sx={{
          gap: 3,
          ...sx,
        }}
      >
        <IconButton
          aria-label={'Play'}
          onClick={handlePlayClick}
          disabled={playing}
          sx={{ width: 14, height: 16 }}
        >
          <Play />
        </IconButton>

        <IconButton
          aria-label={'Pause'}
          onClick={handlePauseClick}
          disabled={!playing}
          sx={{ width: 14, height: 16 }}
        >
          <Pause />
        </IconButton>
        {controls}
      </Flex>
      {children}
    </Box>
  )
}

export default PlayPause
