import {
  Chart,
  Circle,
  Grid,
  Label,
  Plot,
  TickLabels,
} from '@carbonplan/charts'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Box, Flex } from 'theme-ui'
import { keyframes } from '@emotion/react'
import { animated, useSpring, to } from '@react-spring/web'
import { Filter } from '@carbonplan/components'
import { budgets } from '../data/carbon_budget_data'
import PlayPause from './play-pause'

const STEPS = [
  {
    description: 'Our situation would be much worse without the ocean.',
    secondDescription: `It has absorbed a significant amount of carbon from the atmosphere.`,
    subSteps: [
      {
        year: 1851,
        hideAxis: true,
        duration: 0,
        budgetOverrides: [
          {
            x: 3,
            y: 0,
            value: 270,
            color: '#F07071',
            category: 'Current Atmosphere',
          },
          {
            x: 7,
            y: 0,
            value: 452,
            color: '#EA9755',
            category: 'Atmosphere without Ocean',
          },
          { value: 0 },
          { value: 0 },
          { value: 0 },
        ],
      },
    ],
  },
  {
    description: `Carbon is added to the atmosphere from various sources and removed by various sinks. We'll explore the largest.`,
    secondDescription: `In 1979, fossil fuel emissions surpassed land use emissions.`,
    subSteps: [
      {
        year: 1851,
        budgetOverrides: [
          { x: 4, value: 0 },
          { x: 6, value: 0 },
          { value: 0 },
          { value: 0 },
        ],
      },
      {
        year: 1851,
        duration: 0,
        budgetOverrides: [
          { duration: 0 },
          { duration: 0 },
          { duration: 0 },
          { duration: 0 },
        ],
      }, // begin scrub through time
      {
        year: 1979,
        budgetOverrides: [
          { duration: 0 },
          { duration: 0 },
          { duration: 0 },
          { duration: 0 },
        ],
      }, // end scrub through time
    ],
  },
  {
    description: `Today, two sinks have removed the most carbon from the atmosphere.`,
    secondDescription: `The land and the ocean.`,
    subSteps: [
      // begin scrub through time
      {
        year: 2022,
        budgetOverrides: [
          { duration: 0 },
          { duration: 0 },
          { duration: 0 },
          { duration: 0 },
        ],
      }, // end scrub through time
    ],
  },
  {
    description: `Land use emissions and land-related sinks cancel a significant portion of each other out.`,
    subSteps: [
      {
        year: 2022,
        budgetOverrides: [],
      },
      {
        year: 2022,
        budgetOverrides: [{}, { x: 5 }, { x: 5 }, {}],
      }, // move land budgets together
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
        ], // render land source on top of land sink
      },
    ],
  },
  {
    description: `Fossil fuel emissions dominate these land related sources and sinks.`,
    subSteps: [
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
    ],
  },
  {
    description: `The ocean, however, absorbs a very significant portion of these emissions.`,
    subSteps: [
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
          { x: 5 },
        ], // flip ocean sink
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
    ],
  },
  {
    description: `What remains is the carbon that has accumulated in the atmosphere`,
    secondDescription: `and causes global heating.`,
    subSteps: [
      {
        year: 2022,
        hideAxis: true,
        budgetOverrides: [
          {
            x: 5,
            y: 0,
            value: 270,
            color: '#F07071',
            category: 'Current Atmosphere',
          },
          { x: 5, negative: true, value: 0 },
          { x: 5, negative: false, value: 0 },
          { x: 5, negative: false, value: 0 },
        ], // absorb ocean sink into fossils
      },
    ],
  },
]

const HEIGHT = 150
const MAX_VALUE = 500
const Y_SCALE = 10
const AnimatedLabel = animated(Label)
const MAX_AREA = Math.PI * Math.pow(HEIGHT / 2, 2)
const MAX_RADIUS = HEIGHT / 2

const fadeIn = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } })

const calculateYPos = (yFactor, ratio) => {
  return yFactor * ratio * Y_SCALE
}

const calculateSpringValues = ({ year, budget, override, xProp }) => {
  const { values, color: defaultColor, sink } = budget
  const {
    value: overrideValue,
    negative: overrideNegative,
    duration: durationOverride,
    x: overrideX,
    y: overrideY,
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

  let labelY
  if (overrideY !== undefined) {
    labelY = overrideY + yPos / 2
  } else if (overrideNegative !== undefined) {
    labelY = 0
  } else {
    labelY = yPos
  }

  const springValues = {
    x: overrideX ?? xProp,
    y: overrideY ?? yPos / 2,
    labelY: labelY,
    value: value,
    size: radius * 2,
    color: colorValue,
    config: {
      duration: durationOverride ?? animationDuration,
      easing: (t) => t,
    },
  }
  return springValues
}

const BudgetCircle = animated(({ x, y, value, negative, size, ...props }) => {
  return <Circle x={x} y={y} size={size} opacity={0.8} {...props} />
})

const BudgetLabel = animated(
  ({ x, y, negative, value, sink, category, ...props }) => {
    return (
      <Label
        x={x}
        y={y}
        align='center'
        verticalAlign={sink ? 'top' : 'bottom'}
        width={2}
        {...props}
      >
        {category}
        <Box sx={{ color: 'secondary', textTransform: 'none' }}>
          <Box as={'span'} sx={{ color: 'primary' }}>
            {value}{' '}
          </Box>
          GtCO₂
        </Box>
      </Label>
    )
  }
)

const StepifiedCircle = animated(({ year, budget, override, x: xProp }) => {
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
})

const StepifiedLabel = animated(({ year, budget, override, x: xProp }) => {
  const springValues = calculateSpringValues({
    year,
    budget,
    override,
    xProp,
  })
  const { x, labelY, color, value } = useSpring(springValues)
  const category = override.category ?? budget.category

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
      sink={budget.sink}
      negative={override.negative}
      value={animatedValue}
      category={category}
      color={animatedColor}
      style={{ opacity }}
    />
  )
})

const animationDuration = 1000

const SinksExploration = ({ debug = false }) => {
  const [playing, setPlaying] = useState(false)
  const timeout = useRef()
  const [stepIndex, setStepIndex] = useState({ main: 0, sub: 0 })

  const currentStep = STEPS[stepIndex.main]
  const currentSubStep = currentStep.subSteps[stepIndex.sub]
  const axisOpacity = currentSubStep.hideAxis ? 0 : 1
  const hideYear = currentStep.subSteps.every(
    (step, _, arr) => step.year === arr[0].year
  )

  const { year } = useSpring({
    year: currentSubStep.year,
    config: {
      duration: currentSubStep.duration ?? animationDuration,
      easing: (t) => t,
    },
  })

  const handlePlay = useCallback(
    (willPlay, playCurrentStepOnly = false) => {
      if (timeout.current) {
        clearTimeout(timeout.current)
        timeout.current = null
      }

      setPlaying(willPlay)

      if (willPlay) {
        const increment = () => {
          setStepIndex((prev) => {
            let nextSub = prev.sub + 1
            let nextMain = prev.main
            if (nextSub >= STEPS[prev.main].subSteps.length) {
              if (playCurrentStepOnly) {
                setPlaying(false)
                return prev
              } else {
                nextSub = 0
                nextMain += 1
                if (nextMain >= STEPS.length) {
                  setPlaying(false)
                  return { main: 0, sub: 0 }
                }
              }
            }
            timeout.current = setTimeout(increment, animationDuration)
            return { main: nextMain, sub: nextSub }
          })
        }

        increment()
      }
    },
    [animationDuration]
  )

  const handleStepClick = (i) => {
    setStepIndex({ main: i, sub: 0 })
    handlePlay(true, true)
  }

  return (
    <PlayPause
      sx={{ pb: 2 }}
      playing={playing}
      setPlaying={handlePlay}
      controls={
        <Flex sx={{ justifyContent: 'flex-start' }}>
          {STEPS.map((_, i) => (
            <Box
              key={`step-${i}`}
              onClick={() => handleStepClick(i)}
              sx={{
                transition: 'all 0.2s ease-in-out',
                cursor: 'pointer',
                bg: stepIndex.main === i ? 'muted' : 'hinted',
                color: stepIndex.main === i ? 'primary' : 'secondary',
                ml: 1,
                fontSize: 0,
                width: '20px',
                height: '20px',
                lineHeight: '20px',
                textAlign: 'center',
                '&:hover': { bg: 'muted' },
              }}
            >
              {i + 1}
            </Box>
          ))}
        </Flex>
      }
    >
      {debug && (
        <Filter
          values={STEPS.reduce((accum, s, i) => {
            accum[i] = step === i
            return accum
          }, {})}
          setValues={(obj) =>
            setStep(parseInt(Object.keys(obj).find((k) => obj[k]) ?? '0'))
          }
        />
      )}
      <Box
        key={currentStep.description}
        sx={{
          fontSize: 2,
          height: '8em',
          color: 'secondary',
          animation: `${fadeIn} 1s ease-in-out`,
        }}
      >
        {currentStep.description}{' '}
        <Box
          key={currentStep.secondDescription}
          as={'span'}
          sx={{
            opacity: 0,
            animation: `${fadeIn} 1s ease-in-out 1s forwards`,
          }}
        >
          {currentStep.secondDescription ?? ''}
        </Box>
      </Box>
      <Box sx={{ height: HEIGHT * 2 }}>
        <Chart
          x={[0, 10]}
          y={[-Y_SCALE, Y_SCALE]}
          padding={{ left: 0, bottom: 0 }}
        >
          <Grid
            horizontal
            values={[0]}
            sx={{
              borderColor: 'primary',
              transition: 'opacity 1s ease-in-out',
              opacity: axisOpacity,
            }}
          />
          {debug && (
            <>
              <Grid horizontal vertical />
              <TickLabels left />
            </>
          )}
          <Plot>
            {budgets.map((budget, i) => {
              const { budgetOverrides } = currentSubStep
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
          <Label
            x={0}
            y={1.5}
            sx={{
              opacity: axisOpacity,
              transition: 'opacity 0.5s ease-in-out',
            }}
          >
            Sources
          </Label>
          <Label
            x={0}
            y={-0.5}
            sx={{
              opacity: axisOpacity,
              transition: 'opacity 0.5s ease-in-out',
            }}
          >
            Sinks
          </Label>
          <AnimatedLabel
            x={10}
            y={0}
            verticalAlign='middle'
            height={2}
            sx={{
              pl: 2,
              opacity: !hideYear ? axisOpacity : 0,
              transition: 'opacity 0.5s ease-in-out',
            }}
          >
            {year.to((y) => y.toFixed())}
          </AnimatedLabel>
          {budgets.map((budget, i) => {
            const { budgetOverrides } = currentSubStep
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
    </PlayPause>
  )
}

export default SinksExploration
