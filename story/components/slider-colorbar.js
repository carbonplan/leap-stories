import React from 'react'
import { Box, Flex } from 'theme-ui'
import { Colorbar, Slider } from '@carbonplan/components'
import BoxButton from './box-button'

const SliderColorbar = ({
  value,
  formatter = (x) => x,
  minMax,
  setter,
  colormap,
  clim,
  variableName,
  units,
}) => {
  return (
    <Flex
      sx={{
        flexDirection: ['column', 'row-reverse', 'row-reverse', 'row-reverse'],
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: 3,
      }}
    >
      <Flex
        sx={{
          mx: 1,
          mt: [1, 0, 0, 0],
        }}
      >
        {' '}
        <Box
          as={'span'}
          sx={{
            color: 'primary',
            fontSize: 0,
            flex: '1 0 auto',
          }}
        >
          {variableName}
        </Box>
        <Box
          as={'span'}
          sx={{
            color: 'secondary',
            fontSize: 0,
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
          height={13}
          sxClim={{ fontSize: 0 }}
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
        <BoxButton
          active
          sx={{
            whiteSpace: 'nowrap',
            textAlign: 'center',
            mr: 3,
          }}
        >
          {formatter(value)}
        </BoxButton>
        <Flex
          sx={{
            alignItems: 'center',
            flexGrow: 1,
          }}
        >
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
