import { Box, Flex } from 'theme-ui'

import { IconButton, Play, Pause } from './icons'

const PlayPause = ({ playing, setPlaying, sx }) => {
  return (
    <Flex sx={{ gap: 3, ...sx }}>
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
