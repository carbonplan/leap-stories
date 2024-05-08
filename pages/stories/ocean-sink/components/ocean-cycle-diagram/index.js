import {
  AxisLabel,
  Chart,
  Grid,
  Line,
  Plot,
  TickLabels,
} from '@carbonplan/charts'
import { Column, Row } from '@carbonplan/components'
import { Left } from '@carbonplan/icons'
import { useState } from 'react'
import { Box, Flex, useThemeUI } from 'theme-ui'
import { animated, useSpring, easings } from '@react-spring/web'

import BoxButton from '../box-button'
import Diagram from './diagram'
import { C_NAT, C_ANT, C_TOTAL } from './data'

const AnimatedChart = animated(Chart)

const OceanCycleDiagram = () => {
  const { theme } = useThemeUI()
  const [mode, setMode] = useState('natural')
  const { domain } = useSpring({
    domain: mode !== 'anthropogenic' ? [0, 2400] : [0, 70],
    config: {
      duration: 500,
      easing: easings.easeOut,
    },
  })

  const options = (
    <>
      <Box
        sx={{
          fontSize: [0, 0, 0, 1],
          mt: 2,
          textTransform: 'uppercase',
          fontFamily: 'mono',
          letterSpacing: 'mono',
          mb: 2,
        }}
      >
        Carbon source
      </Box>
      <Flex sx={{ gap: 2, flexWrap: ['wrap', 'wrap', 'nowrap', 'nowrap'] }}>
        <BoxButton
          onClick={() => setMode('natural')}
          active={mode === 'natural'}
        >
          Natural
        </BoxButton>
        <BoxButton
          onClick={() => setMode('anthropogenic')}
          active={mode === 'anthropogenic'}
        >
          Human-dervied
        </BoxButton>
        <BoxButton onClick={() => setMode('all')} active={mode === 'all'}>
          All
        </BoxButton>
      </Flex>
    </>
  )

  return (
    <Box>
      <Box sx={{ display: ['inherit', 'none'], mb: 3 }}>{options}</Box>
      <Row columns={6}>
        <Column start={1} width={[3, 2, 3, 3]} sx={{ position: 'relative' }}>
          <Box sx={{ display: ['none', 'inherit'] }}>{options}</Box>
          <Box
            sx={{
              height: `${200 / 3}%`,
              width: '100%',
              position: 'absolute',
              top: `${100 / 3}%`,
            }}
          >
            <AnimatedChart
              clamp={false}
              x={domain}
              y={[2000, 0]}
              padding={{ bottom: 0, left: 56 }}
            >
              {/* <Axis left top /> */}
              <AxisLabel
                bottom
                units='mmol/m³'
                sx={{ textAlign: 'left', top: -40 }}
              >
                Carbon
              </AxisLabel>
              <AxisLabel left units='m' align='left' arrow={false}>
                <Left
                  sx={{
                    position: 'relative',
                    top: '-5px',
                    right: '2px',
                    width: 11,
                    height: 11,
                    transform: 'rotate(-45deg)',
                  }}
                />
                Ocean depth
              </AxisLabel>
              {/* <Ticks left top /> */}
              <TickLabels top count={3} sx={{ mb: -2 }} />
              <TickLabels left sx={{ mr: -2 }} />
              <Grid horizontal />
              <Grid vertical />
              <Plot sx={{ overflow: 'hidden' }}>
                <Line
                  data={C_NAT}
                  opacity={mode === 'natural' ? 1 : 0.2}
                  color={theme.colors.primary}
                  width={mode === 'natural' ? 2 : 1.5}
                />
                <Line
                  data={C_ANT}
                  opacity={mode === 'anthropogenic' ? 1 : 0.2}
                  color={theme.colors.primary}
                  width={mode === 'anthropogenic' ? 2 : 1.5}
                />
                <Line
                  data={C_TOTAL}
                  opacity={mode === 'all' ? 1 : 0.2}
                  color={theme.colors.primary}
                  width={mode === 'all' ? 2 : 1.5}
                />
              </Plot>
            </AnimatedChart>
          </Box>
        </Column>
        <Column start={[4, 3, 4, 4]} width={[3, 6, 3, 3]}>
          <Diagram mode={mode} />
        </Column>
      </Row>
    </Box>
  )
}

export default OceanCycleDiagram
