import {
  Chart,
  Circle,
  Grid,
  Label,
  Plot,
  TickLabels,
} from '@carbonplan/charts'
import React, { useState } from 'react'
import { Box } from 'theme-ui'
import { animated, useSpring, to } from '@react-spring/web'

import { budgets } from '../data/carbon_budget_data'
import { Filter } from '@carbonplan/components'

const HEIGHT = 150
const MAX_VALUE = 500
const Y_SCALE = 10
const AnimatedLabel = animated(Label)
const MAX_AREA = Math.PI * Math.pow(HEIGHT / 2, 2)
const MAX_RADIUS = HEIGHT / 2

const calculateYPos = (yFactor, ratio) => {
  return yFactor * ratio * Y_SCALE
}

const calculateSpringValues = ({ year, budget, override, xProp }) => {
  const { values, color: defaultColor, sink } = budget
  const {
    value: overrideValue,
    negative: overrideNegative,
    x: overrideX,
    color: overrideColor,
  } = override

  const value = overrideValue ?? values[year.toFixed()]
  const negative = overrideNegative ?? sink
  const yFactor = negative ? -1 : 1

  const area = (value / MAX_VALUE) * MAX_AREA
  const radius = Math.sqrt(area / Math.PI)
  const ratio = radius / MAX_RADIUS
  const yPos = calculateYPos(yFactor, ratio)

  const colorValue = overrideColor ?? defaultColor

  const springValues = {
    x: overrideX ?? xProp,
    y: yPos / 2,
    labelY: yPos,
    value: value,
    size: radius * 2,
    color: colorValue,
    config: { duration: 750, tension: 120, friction: 60 },
  }

  return springValues
}

const BudgetCircle = animated(({ x, y, value, negative, size, ...props }) => {
  return <Circle x={x} y={y} size={size} {...props} />
})

const BudgetLabel = animated(({ x, y, value, category, ...props }) => {
  return (
    <Label
      x={x}
      y={y}
      align='center'
      verticalAlign={y < 0 ? 'top' : 'bottom'}
      width={1.2}
      {...props}
    >
      {category}
      <div>{value} GtCO₂</div>
    </Label>
  )
})

const STEPS = [
  { year: 1851, budgetOverrides: [] }, // begin scrub through time
  { year: 2022, budgetOverrides: [] }, // end scrub through time
  { year: 2022, budgetOverrides: [{}, { x: 5 }, { x: 5 }, {}] }, // move land budgets together
  {
    year: 2022,
    budgetOverrides: [{}, { x: 5, negative: true }, { x: 5 }, {}], // render land source on top of land sink
  },
  {
    year: 2022,
    budgetOverrides: [
      {},
      { x: 5, negative: true, value: 0 },
      { x: 5, value: 25 },
      {},
    ], // absorb land source into top of land sink
  },
  {
    year: 2022,
    budgetOverrides: [
      { x: 5 },
      { x: 5, negative: true, value: 0 },
      { x: 5, value: 25 },
      {},
    ], // center fossil fuels
  },
  {
    year: 2022,
    budgetOverrides: [
      { x: 5 },
      { x: 5, negative: true, value: 0 },
      { x: 5, negative: false, value: 25 },
      {},
    ], // flip land sink
  },
  {
    year: 2022,
    budgetOverrides: [
      { x: 5, value: 452 },
      { x: 5, negative: true, value: 0 },
      { x: 5, negative: false, value: 0 },
      {},
    ], // absorb land sink into fossil fuels
  },
  {
    year: 2022,
    budgetOverrides: [
      { x: 5, value: 452 },
      { x: 5, negative: true, value: 0 },
      { x: 5, negative: false, value: 0 },
      { x: 5 },
    ], // center ocean sink
  },
  {
    year: 2022,
    budgetOverrides: [
      { x: 5, value: 452 },
      { x: 5, negative: true, value: 0 },
      { x: 5, negative: false, value: 0 },
      { x: 5, negative: false },
    ], // flip ocean sink
  },
  {
    year: 2022,
    budgetOverrides: [
      { x: 5, value: 270 },
      { x: 5, negative: true, value: 0 },
      { x: 5, negative: false, value: 0 },
      { x: 5, negative: false, value: 0 },
    ], // absorb ocean sink into fossils
  },
  {
    year: 2022,
    budgetOverrides: [
      {
        x: 5,
        negative: true,
        value: 270,
        color: '#64b9c4',
        category: 'Atmosphere',
      },
      { x: 5, negative: true, value: 0 },
      { x: 5, negative: false, value: 0 },
      { x: 5, negative: false, value: 0 },
    ], // show net fossil source as atmospheric "sink" (solid)
  },
  { year: 2022, budgetOverrides: [] }, // add net fossil source (w/o ocean sink) as atmospheric "sink" (dashed)
]

const StepifiedCircle = ({ year, budget, override, x: xProp }) => {
  const springValues = calculateSpringValues({
    year,
    budget,
    override,
    xProp,
  })

  const { x, y, size, color } = useSpring(springValues)

  const animatedColor = to([color], (c) => c)

  return (
    <BudgetCircle
      key={`${budget.category}-circle`}
      x={x}
      y={y}
      size={size}
      color={animatedColor}
    />
  )
}

const StepifiedLabel = ({ year, budget, override, x: xProp }) => {
  // don't override negative for labels
  const labelOverride = { ...override, negative: undefined }

  const springValues = calculateSpringValues({
    year,
    budget,
    override: labelOverride,
    xProp,
  })
  const { x, labelY, color, value } = useSpring(springValues)
  const category = budget.category

  // fade labels at zero values
  const opacity = value.to((v) => {
    return v <= 1 ? 0 : v < 20 ? 0.5 : 1
  })

  const animatedColor = to([color], (c) => c)
  const animatedValue = to([value], (v) => v.toFixed())

  return (
    <BudgetLabel
      x={x}
      y={labelY}
      value={animatedValue}
      category={category}
      color={animatedColor}
      style={{ opacity }}
    />
  )
}

const SinksExploration = ({ debug = true }) => {
  const [step, setStep] = useState(0)

  return (
    <Box>
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
            {budgets.map((budget, i) => {
              const { year, budgetOverrides } = STEPS[step]
              const override = budgetOverrides[i] ?? {}

              return (
                <StepifiedCircle
                  key={budget.category}
                  x={(i + 1) * 2}
                  year={year}
                  budget={budget}
                  override={override}
                />
              )
            })}
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
            {STEPS[step].year}
          </AnimatedLabel>
          {budgets.map((budget, i) => {
            const { year, budgetOverrides } = STEPS[step]
            const override = budgetOverrides[i] ?? {}

            return (
              <StepifiedLabel
                key={`${budget.category}-label`}
                x={(i + 1) * 2}
                year={year}
                budget={budget}
                override={override}
              />
            )
          })}
        </Chart>
      </Box>
      <Filter
        values={STEPS.reduce((accum, s, i) => {
          accum[i] = step === i
          return accum
        }, {})}
        setValues={(obj) =>
          setStep(parseInt(Object.keys(obj).find((k) => obj[k]) ?? '0'))
        }
        sx={{ mb: 3 }}
      />
    </Box>
  )
}

export default SinksExploration
