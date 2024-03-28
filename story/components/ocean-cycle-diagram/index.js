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
import { Button, Column, Row, Filter } from '@carbonplan/components'
import { Left } from '@carbonplan/icons'
import { useState } from 'react'
import { Box, Flex, useThemeUI } from 'theme-ui'
import { animated, useSpring, easings } from '@react-spring/web'

import Radio from '../radio'
import Diagram from './diagram'
import { C_NAT, C_ANT, C_TOTAL } from './data'

const AnimatedChart = animated(Chart)

const OceanCycleDiagram = () => {
  const { theme } = useThemeUI()
  const [mode, setMode] = useState('natural')
  const { domain } = useSpring({
    domain: mode === 'natural' ? [0, 2400] : [0, 70],
    config: {
      duration: 500,
      easing: easings.easeOut,
    },
  })

  return (
    <Box>
      <Row columns={6}>
        <Column start={1} width={[6, 2, 3, 3]} sx={{ position: 'relative' }}>
          {/* <Filter
            values={{
              natural: mode === 'natural',
              anthropogenic: mode === 'anthropogenic',
            }}
            setValues={(obj) => setMode(Object.keys(obj).find((k) => obj[k]))}
            label='Carbon source'
          /> */}
          <Box
            sx={{
              fontSize: [1, 1, 1, 2],
              mt: 2,
              textTransform: 'uppercase',
              mb: 2,
            }}
          >
            Carbon source
          </Box>
          <Flex sx={{ gap: 2 }}>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                setMode('natural')
              }}
              sx={{
                transition: 'all 0.2s ease-in-out',
                cursor: 'pointer',
                bg: mode === 'natural' ? 'muted' : 'hinted',
                color: mode === 'natural' ? 'primary' : 'secondary',
                fontSize: 0,
                py: 1,
                px: 2,
                height: '20px',
                textAlign: 'center',
                '&:hover': { bg: 'muted' },
                flexShrink: 0,
              }}
            >
              Natural
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                setMode('anthropogenic')
              }}
              sx={{
                transition: 'all 0.2s ease-in-out',
                cursor: 'pointer',
                bg: mode === 'anthropogenic' ? 'muted' : 'hinted',
                color: mode === 'anthropogenic' ? 'primary' : 'secondary',
                fontSize: 0,
                py: 1,
                px: 2,
                height: '20px',
                textAlign: 'center',
                '&:hover': { bg: 'muted' },
                flexShrink: 0,
              }}
            >
              Anthropogenic
            </Button>
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
                  color={
                    mode === 'natural'
                      ? theme.colors.primary
                      : theme.colors.secondary
                  }
                  width={mode === 'natural' ? 2 : 1.5}
                />
                <Line
                  data={C_ANT}
                  color={
                    mode === 'anthropogenic'
                      ? theme.colors.primary
                      : theme.colors.secondary
                  }
                  width={mode === 'anthropogenic' ? 2 : 1.5}
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
