import React, { useEffect } from 'react'
import { Flex } from 'theme-ui'
import useInViewPlayPause from '../../hooks/useInViewPlayPause'

import { IconButton, Play, Pause } from './icons'

const PlayPause = ({ playing, setPlaying, sx }) => {
  const [shouldAnimate, ref] = useInViewPlayPause()

  useEffect(() => {
    if (shouldAnimate) {
      setPlaying(true)
    } else {
      setPlaying(false)
    }
  }, [shouldAnimate, setPlaying])

  return (
    <Flex ref={ref} sx={{ gap: 3, ...sx }}>
      <IconButton
        aria-label={'Play'}
        onClick={() => setPlaying(true)}
        disabled={playing}
        sx={{ width: 14, height: 16 }}
      >
        <Play />
      </IconButton>

      <IconButton
        aria-label={'Pause'}
        onClick={() => setPlaying(false)}
        disabled={!playing}
        sx={{ width: 14, height: 16 }}
      >
        <Pause />
      </IconButton>
    </Flex>
  )
}

export default PlayPause
