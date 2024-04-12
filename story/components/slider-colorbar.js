import React from 'react'
import { Box, Flex } from 'theme-ui'
import { Colorbar, Slider } from '@carbonplan/components'

const SliderColorbar = ({
  value,
  minMax,
  setter,
  colormap,
  clim,
  variableName,
  units,
  playPause,
}) => {
  return (
    <Flex
      sx={{
        flexDirection: ['column', 'row-reverse', 'row-reverse', 'row-reverse'],
        justifyContent: 'space-between',
        alignItems: 'center',
        ml: 1,
      }}
    >
      <Flex
        sx={{
          mx: 1,
          mt: [1, 0, 0, 0],
        }}
      >
        <Box
          as={'span'}
          sx={{
            color: 'primary',
            fontSize: [0, 0, 0, 1],
            flex: '1 0 auto',
          }}
        >
          {variableName}
        </Box>
        <Box
          as={'span'}
          sx={{
            color: 'secondary',
            fontSize: [0, 0, 0, 1],
            flex: '1 0 auto',
            mx: 1,
          }}
        >
          {units}
        </Box>
        <Colorbar
          colormap={colormap}
          clim={clim}
          horizontal
          height={[13, 13, 13, 15]}
          sxClim={{ fontSize: [0, 0, 0, 1] }}
        />
      </Flex>

      <Flex
        sx={{
          flexGrow: 1,
          mr: [0, 5, 5, 5],
          mt: [3, 0, 0, 0],
          width: ['80%', 'auto', 'auto', 'auto'],
        }}
      >
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
      </Flex>
    </Flex>
  )
}

export default SliderColorbar
