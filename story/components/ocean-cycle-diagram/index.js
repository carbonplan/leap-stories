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
import { Column, Row } from '@carbonplan/components'
import { Left } from '@carbonplan/icons'
import { useState } from 'react'
import { Box } from 'theme-ui'
import { animated, useSpring, easings } from '@react-spring/web'

import Radio from '../radio'
import Diagram from './diagram'
import { C_NAT, C_ANT, C_TOTAL } from './data'

const AnimatedChart = animated(Chart)

const OceanCycleDiagram = () => {
  const [mode, setMode] = useState('natural')
  const xMax = mode === 'natural' ? 2400 : 70
  const { domain } = useSpring({
    domain: [0, xMax],
    config: {
      duration: 500,
      easing: easings.easeOut,
    },
  })

  return (
    <Box>
      <Row columns={6}>
        <Column start={1} width={[6, 2, 2, 2]} sx={{ position: 'relative' }}>
          <Box
            sx={{
              fontSize: [1, 1, 1, 2],
              mt: 2,
              textTransform: 'uppercase',
              mb: 3,
            }}
          >
            Carbon source
          </Box>
          <Radio
            name='natural'
            label='Natural'
            checked={mode === 'natural'}
            value='natural'
            onChange={setMode}
          />
          <Radio
            name='anthropogenic'
            label='Anthropogenic'
            checked={mode === 'anthropogenic'}
            value='anthropogenic'
            onChange={setMode}
          />
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
              padding={{ bottom: 0 }}
            >
              <Axis left top />
              <AxisLabel bottom units='mmol/m³' sx={{ top: -50 }}>
                DIC
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
              <Ticks left top />
              <TickLabels top count={3} />
              <TickLabels left />
              <Grid horizontal />
              <Plot sx={{ overflow: 'hidden' }}>
                <Line
                  data={mode === 'natural' ? C_NAT : C_ANT}
                  color='#232d61'
                  width={2}
                />
              </Plot>
            </AnimatedChart>
          </Box>
        </Column>
        <Column start={[1, 3, 3, 3]} width={[6, 6, 4, 4]}>
          <Diagram mode={mode} />
        </Column>
      </Row>
    </Box>
  )
}

export default OceanCycleDiagram
