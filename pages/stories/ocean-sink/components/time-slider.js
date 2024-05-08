import React from 'react'
import { Flex } from 'theme-ui'
import { Slider } from '@carbonplan/components'

const TimeSlider = ({ value, minMax, setter, playPause }) => {
  return (
    <Flex
      sx={{
        alignItems: 'center',
        flexGrow: 1,
        gap: 3,
      }}
    >
      {playPause}
      <Slider
        value={value}
        onChange={(e) => {
          setter(parseFloat(e.target.value))
        }}
        min={minMax[0]}
        max={minMax[1]}
        sx={{
          bg: 'muted',
          color: 'secondary',
          ':focus': { color: 'primary' },
        }}
      />
    </Flex>
  )
}

export default TimeSlider
