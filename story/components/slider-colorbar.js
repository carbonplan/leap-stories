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
        <BoxButton active sx={{ mr: 3 }}>
          {formatter(value)}
        </BoxButton>
        <Flex
          sx={{
            height: ['24px', '24px', '24px', '30px'],
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
