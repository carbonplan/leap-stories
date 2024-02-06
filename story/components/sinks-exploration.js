import {
  Chart,
  Circle,
  Grid,
  Label,
  Plot,
  TickLabels,
} from '@carbonplan/charts'
import { useState } from 'react'
import { Box } from 'theme-ui'
import { animated, useSpring, easings } from '@react-spring/web'

import { budgets } from '../data/carbon_budget_data'
import { Filter } from '@carbonplan/components'

const HEIGHT = 150
const MAX_VALUE = 500
const Y_SCALE = 10
const AnimatedLabel = animated(Label)

const BudgetCircle = animated(({ x, values, year, negative, ...props }) => {
  const value = values[year.toFixed()]
  const yFactor = negative ? -1 : 1
  const ratio = value / MAX_VALUE

  return (
    <Circle
      x={x}
      y={(yFactor * ratio * Y_SCALE) / 2}
      size={ratio * HEIGHT}
      {...props}
    />
  )
})

const BudgetLabel = animated(
  ({ x, values, year, negative, children, ...props }) => {
    const value = values[year.toFixed()]
    const yFactor = negative ? -1 : 1

    return (
      <Label
        x={x}
        y={((yFactor * value) / MAX_VALUE) * Y_SCALE}
        align='center'
        verticalAlign={negative ? 'top' : 'bottom'}
        width={1.2}
        {...props}
      >
        {children} {value}
      </Label>
    )
  }
)

const SinksExploration = ({ debug = false }) => {
  const [step, setStep] = useState(0)
  const { year } = useSpring({
    year: step === 0 ? 1851 : 2022,
    config: {
      duration: 500,
      easing: easings.easeOut,
    },
  })

  return (
    <Box>
      <Filter
        values={{ start: step === 0, end: step === 1 }}
        setValues={(obj) => setStep(obj.start ? 0 : 1)}
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
            {budgets.map(({ category, values, color, sink }, i) => (
              <BudgetCircle
                key={category}
                x={(i + 1) * 2}
                values={values}
                year={year}
                negative={sink}
                color={color}
              />
            ))}
          </Plot>
          <Label x={0} y={1.5}>
            Sources
          </Label>
          <Label x={0} y={-0.5}>
            Sinks
          </Label>
          <AnimatedLabel
            x={10}
            y={0}
            verticalAlign='middle'
            height={2}
            sx={{ pl: 2 }}
          >
            {year.to((x) => x.toFixed())}
          </AnimatedLabel>
          {budgets.map(({ category, values, color, sink }, i) => (
            <BudgetLabel
              key={category}
              x={(i + 1) * 2}
              values={values}
              year={year}
              negative={sink}
              color={color}
            >
              {category}
            </BudgetLabel>
          ))}
        </Chart>
      </Box>
    </Box>
  )
}

export default SinksExploration
