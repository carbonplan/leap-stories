import { Colorbar, Column } from '@carbonplan/components'
import { Flex } from 'theme-ui'

const DynamicColorbar = ({ colormap, format, clim, label, units, sx }) => {
  return (
    <>
      <Flex
        sx={{
          display: ['none', 'flex', 'flex', 'flex'],
          position: 'absolute',
          bottom: 3,
          flexDirection: 'column',
          right: -70,
          ...sx,
        }}
      >
        <Colorbar
          colormap={colormap}
          format={format}
          clim={clim}
          label={label}
          units={units}
          sx={{ alignItems: 'flex-end' }}
        />
      </Flex>
      <Column start={1} width={6} sx={{ display: ['inherit', 'none'] }}>
        <Colorbar
          colormap={colormap}
          format={format}
          clim={clim}
          label={label}
          units={units}
          horizontal
          sx={{ mt: 3 }}
        />
      </Column>
    </>
  )
}

export default DynamicColorbar
