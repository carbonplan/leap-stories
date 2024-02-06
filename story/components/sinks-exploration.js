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

import { budgets } from '../data/carbon_budget_data'

const HEIGHT = 150
const MAX_MAGNITUDE = 500
const Y_SCALE = 10

const BudgetCircle = ({ x, y, magnitude, negative, ...props }) => {
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
}

const BudgetLabel = ({ x, magnitude, negative, ...props }) => {
  const yFactor = negative ? -1 : 1

  return (
    <Label
      x={x}
      y={((yFactor * magnitude) / MAX_MAGNITUDE) * Y_SCALE}
      align='center'
      verticalAlign={negative ? 'top' : 'bottom'}
      width={2.5}
      {...props}
    />
  )
}

const SinksExploration = ({ debug = false }) => {
  const [year, setYear] = useState(1851)

  return (
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
          <BudgetCircle x={2} y={0} magnitude={budgets[0].values[year]} />
          <BudgetCircle
            x={4}
            y={0}
            color='green'
            magnitude={budgets[1].values[year]}
          />
          <BudgetCircle
            x={6}
            y={0}
            color='green'
            magnitude={budgets[2].values[year]}
            negative
          />
          <BudgetCircle
            x={8}
            y={0}
            color='blue'
            magnitude={budgets[3].values[year]}
            negative
          />
        </Plot>
        <Label x={0} y={1.5}>
          Sources
        </Label>
        <Label x={0} y={-0.5}>
          Sinks
        </Label>
        <BudgetLabel x={2} magnitude={budgets[0].values[year]} color='primary'>
          Fossil fuels
        </BudgetLabel>
        <BudgetLabel x={4} magnitude={budgets[1].values[year]} color='green'>
          Land-use change
        </BudgetLabel>
        <BudgetLabel
          x={6}
          magnitude={budgets[2].values[year]}
          negative
          color='green'
        >
          Land sink
        </BudgetLabel>
        <BudgetLabel
          x={8}
          magnitude={budgets[3].values[year]}
          negative
          color='blue'
        >
          Ocean sink
        </BudgetLabel>
      </Chart>
    </Box>
  )
}

export default SinksExploration
