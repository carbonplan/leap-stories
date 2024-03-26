import React from 'react'
import { Box, Flex } from 'theme-ui'
import { Colorbar, Slider } from '@carbonplan/components'

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
        mt: 3,
        alignItems: ['center', 'flex-end', 'flex-end', 'flex-end'],
      }}
    >
      <Colorbar
        colormap={colormap}
        clim={clim}
        horizontal
        label={
          <Box as='span' sx={{ textTransform: 'none', fontSize: 0 }}>
            {variableName}
          </Box>
        }
        units={<Box sx={{ fontSize: 0 }}> {units} </Box>}
        sxClim={{ fontSize: 0 }}
        height={13}
      />
      <Flex
        sx={{
          flexGrow: 1,
          mr: [0, 5, 5, 5],
          mt: [3, 0, 0, 0],
          width: ['80%', 'auto', 'auto', 'auto'],
        }}
      >
        <Box
          sx={{
            fontSize: 0,
            width: '40px',
            py: '2px',
            bg: 'muted',
            color: 'primary',
            lineHeight: '20px',
            textAlign: 'center',
            textTransform: 'uppercase',
            mr: 3,
            ml: 1,
          }}
        >
          {formatter(value)}
        </Box>
        <Flex sx={{ mt: 1, flexGrow: 1 }}>
          <Slider
            value={value}
            onChange={(e) => {
              setter(parseFloat(e.target.value))
            }}
            min={minMax[0]}
            max={minMax[1]}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default SliderColorbar
