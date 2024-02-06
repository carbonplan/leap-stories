import {
  Chart,
  Circle,
  Grid,
  Label,
  Plot,
  TickLabels,
  useChart,
} from '@carbonplan/charts'
import { useState } from 'react'
import { Box } from 'theme-ui'
import { animated, useSpring, easings } from '@react-spring/web'

import { budgets } from '../data/carbon_budget_data'
import { Filter } from '@carbonplan/components'

const HEIGHT = 150
const MAX_MAGNITUDE = 500
const Y_SCALE = 10

const BudgetCircle = animated(({ x, y, magnitude, negative, ...props }) => {
  const { x: _x, y: _y } = useChart()
  const yFactor = negative ? -1 : 1
  const ratio = magnitude / MAX_MAGNITUDE

  return (
    <Circle
      x={x}
      y={(yFactor * ratio * Y_SCALE) / 2}
      size={ratio * HEIGHT}
      {...props}
    />
  )
})

const BudgetLabel = animated(({ x, magnitude, negative, ...props }) => {
  const yFactor = negative ? -1 : 1

  return (
    <Label
      x={x}
      y={((yFactor * magnitude) / MAX_MAGNITUDE) * Y_SCALE}
      align='center'
      verticalAlign={negative ? 'top' : 'bottom'}
      width={1.2}
      {...props}
    />
  )
})

const SinksExploration = ({ debug = false }) => {
  const [year, setYear] = useState(2022)
  const { fossil, landUseChange, landSink, oceanSink } = useSpring({
    fossil: budgets[0].values[year],
    landUseChange: budgets[1].values[year],
    landSink: budgets[2].values[year],
    oceanSink: budgets[3].values[year],
    config: {
      duration: 500,
      easing: easings.easeOut,
    },
  })

  return (
    <Box>
      <Filter
        values={{ start: year === 1851, end: year === 2022 }}
        setValues={(obj) => setYear(obj.start ? 1851 : 2022)}
        sx={{ mb: 3 }}
      />
      <Box sx={{ height: HEIGHT * 2 }}>
        <Chart
          x={[0, 10]}
          y={[-Y_SCALE, Y_SCALE]}
          padding={{ left: 0, bottom: 0 }}
        >
          <Grid horizontal values={[0]} sx={{ borderColor: 'primary' }} />
          {debug && (
            <>
              <Grid horizontal vertical />
              <TickLabels left />
            </>
          )}
          <Plot>
            <BudgetCircle x={2} y={0} magnitude={fossil} />
            <BudgetCircle x={4} y={0} color='green' magnitude={landUseChange} />
            <BudgetCircle
              x={6}
              y={0}
              color='green'
              magnitude={landSink}
              negative
            />
            <BudgetCircle
              x={8}
              y={0}
              color='blue'
              magnitude={oceanSink}
              negative
            />
          </Plot>
          <Label x={0} y={1.5}>
            Sources
          </Label>
          <Label x={0} y={-0.5}>
            Sinks
          </Label>
          <Label x={10} y={0} verticalAlign='middle' height={2} sx={{ pl: 2 }}>
            {year}
          </Label>
          <BudgetLabel x={2} magnitude={fossil} color='primary'>
            Fossil fuels
          </BudgetLabel>
          <BudgetLabel x={4} magnitude={landUseChange} color='green'>
            Land-use change
          </BudgetLabel>
          <BudgetLabel x={6} magnitude={landSink} negative color='green'>
            Land sink
          </BudgetLabel>
          <BudgetLabel x={8} magnitude={oceanSink} negative color='blue'>
            Ocean sink
          </BudgetLabel>
        </Chart>
      </Box>
    </Box>
  )
}

export default SinksExploration
