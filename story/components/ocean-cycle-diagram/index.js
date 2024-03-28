import {
  Axis,
  AxisLabel,
  Chart,
  Grid,
  Line,
  Plot,
  TickLabels,
  Ticks,
} from '@carbonplan/charts'
import { Button, Column, Row } from '@carbonplan/components'
import { Left } from '@carbonplan/icons'
import { useState } from 'react'
import { Box, Flex, useThemeUI } from 'theme-ui'
import { animated, useSpring, easings } from '@react-spring/web'

import Diagram from './diagram'
import { C_NAT, C_ANT, C_TOTAL } from './data'

const AnimatedChart = animated(Chart)

const Option = ({ label, onClick, active }) => {
  return (
    <Button
      onClick={(e) => {
        e.stopPropagation()
        onClick(e)
      }}
      sx={{
        transition: 'all 0.2s ease-in-out',
        bg: active ? 'muted' : 'hinted',
        color: active ? 'primary' : 'secondary',
        fontSize: 0,
        py: 1,
        px: 2,
        height: '20px',
        '&:hover': { bg: 'muted' },
        textTransform: 'uppercase',
      }}
    >
      {label}
    </Button>
  )
}

const OceanCycleDiagram = () => {
  const { theme } = useThemeUI()
  const [mode, setMode] = useState('all')
  const { domain } = useSpring({
    domain: mode !== 'anthropogenic' ? [0, 2400] : [0, 70],
    config: {
      duration: 500,
      easing: easings.easeOut,
    },
  })

  return (
    <Box>
      <Row columns={6}>
        <Column start={1} width={[6, 2, 3, 3]} sx={{ position: 'relative' }}>
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
          <Flex sx={{ gap: 2 }}>
            <Option
              onClick={() => setMode('all')}
              label='All'
              active={mode === 'all'}
            />
            <Option
              onClick={() => setMode('natural')}
              label='Natural'
              active={mode === 'natural'}
            />
            <Option
              onClick={() => setMode('anthropogenic')}
              label='Anthropogenic'
              active={mode === 'anthropogenic'}
            />
          </Flex>

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
        <Column start={[1, 3, 4, 4]} width={[6, 6, 3, 3]}>
          <Diagram mode={mode} />
        </Column>
      </Row>
    </Box>
  )
}

export default OceanCycleDiagram
