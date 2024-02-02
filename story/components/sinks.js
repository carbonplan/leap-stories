import React, { useEffect, useRef } from 'react'
import { select, easeCubic, interpolate } from 'd3'
import { Scrollama, Step } from 'react-scrollama'
import { Box } from 'theme-ui'
import { budgets } from '../data/carbon_budget_data'

const maxCircleRadius = 100
const lineHeight = 300
const width = 800
const fontSize = 20

const years = Object.keys(budgets[0].values)
const startYear = years[0]
const endYear = years[years.length - 1]
const maxBudgetValue = Math.max(
  ...budgets.map((budget) => Math.max(...Object.values(budget.values)))
)
const scalingConstant = (maxCircleRadius * maxCircleRadius) / maxBudgetValue

const getCircleData = (year) => {
  return budgets.map(({ color, sink, id, category, values }, index) => {
    const area = values[year] * scalingConstant
    const radius = Math.sqrt(area / Math.PI)
    return {
      cx: ((index + 1) * width) / (budgets.length + 1),
      cy: sink ? lineHeight + radius : lineHeight - radius,
      radius,
      color,
      sink,
      id,
      category,
      values,
    }
  })
}

const calculateCirclePositions = (circles, lineHeight) => {
  return circles.map((circle) => ({
    ...circle,
    cy: circle.sink ? lineHeight + circle.radius : lineHeight - circle.radius,
  }))
}

const circles = getCircleData(endYear)

const calculateAreaDifference = (radius1, radius2) => {
  const area1 = Math.PI * radius1 ** 2
  const area2 = Math.PI * radius2 ** 2
  return Math.abs(area1 - area2)
}

const getCarbonLabel = (value, sink) => {
  if (value === 0) return ''
  return value.toFixed(0) * (sink ? -1 : 1) + ' GtCO\u00B2'
}

const buildOpener = (svg) => {
  svg.selectAll('*').remove()
  const graph = svg.append('g').attr('class', 'graph')
  graph
    .append('line')
    .attr('class', 'line')
    .attr('x1', 0)
    .attr('y1', lineHeight)
    .attr('x2', 700)
    .attr('y2', lineHeight)
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .style('opacity', 0)

  graph
    .append('text')
    .attr('class', 'year')
    .attr('x', width - 90)
    .attr('y', lineHeight)
    .attr('font-size', fontSize)
    .attr('fill', '#808080')
    .text(startYear)
    .style('opacity', 0)

  graph
    .append('text')
    .text('Tracking Cumulative Carbon Budgets')
    .attr('class', 'title')
    .attr('x', width / 2)
    .attr('y', 0)
    .attr('font-size', fontSize + 5)
    .attr('fill', '#808080')
    .attr('text-anchor', 'middle')

  graph
    .append('text')
    .text('Sources')
    .attr('class', 'sources')
    .attr('x', width / 4)
    .attr('y', 40)
    .attr('font-size', fontSize)
    .attr('fill', '#808080')
    .attr('text-anchor', 'middle')

  graph
    .append('text')
    .text('Sinks')
    .attr('class', 'sinks')
    .attr('x', width * 0.75)
    .attr('y', 40)
    .attr('font-size', fontSize)
    .attr('fill', '#808080')
    .attr('text-anchor', 'middle')

  circles.forEach((circle, index) => {
    const x = circle.sink ? width * 0.75 : width / 4
    const y = index > 1 ? 50 + (index - 1) * 25 : 50 + (index + 1) * 25
    svg
      .append('text')
      .attr('class', `text-${circle.id}`)
      .attr('x', x)
      .attr('y', y)
      .attr('font-size', fontSize - 5)
      .attr('fill', circle.color)
      .attr('text-anchor', 'middle')
      .attr('text-align', 'center')
      .style('opacity', 0)
      // .attr('dominant-baseline', circle.sink && 'hanging')
      .data([circle])
      .text(circle.category)
      .transition()
      .duration(1000)
      .style('opacity', 1)
    svg.append('circle').attr('class', `circle-${circle.id}`).data([circle])
  })
}

const buildGraphBase = (svg) => {
  return new Promise((resolve) => {
    svg
      .select('.sources')
      .transition()
      .duration(1000)
      .attr('x', 0)
      .attr('y', lineHeight - 10)
      .attr('text-anchor', 'unset')

    svg
      .select('.sinks')
      .transition()
      .duration(1000)
      .attr('x', 0)
      .attr('y', lineHeight + 25)
      .attr('text-anchor', 'unset')

    circles.forEach((circle) => {
      svg
        .select(`.text-${circle.id}`)
        .transition()
        .duration(1000)
        .attr('x', circle.cx)
        .attr('y', circle.sink ? lineHeight + 10 : lineHeight - 10)
        .attr('font-size', fontSize - 5)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', circle.sink && 'hanging')
        .text(circle.category)
      svg
        .select(`.value-${circle.id}`)
        .transition()
        .duration(1000)
        .attr('x', circle.cx)
        .attr('y', circle.sink ? lineHeight + 30 : lineHeight - 30)
        .attr('font-size', fontSize - 5)
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', circle.sink && 'hanging')
        .text(getCarbonLabel(circle.values[startYear], circle.sink))
      svg
        .append('text')
        .attr('class', `value-${circle.id}`)
        .attr('x', circle.cx)
        .attr('y', circle.sink ? lineHeight + 30 : lineHeight - 30)
        .attr('font-size', fontSize - 5)
        .attr('font-weight', 'bold')
        .attr('fill', circle.color)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', circle.sink && 'hanging')
        .data([circle])
        .text(getCarbonLabel(circle.values[startYear], circle.sink))
    })

    svg
      .selectAll('.line, .year')
      .transition()
      .duration(1000)
      .style('opacity', 1)
      .on('end', () => {
        resolve()
      })
  })
}

const animateCircles = (svg, largerCircleID, smallerCircleID) => {
  return new Promise((resolve) => {
    const largerCircleSVG = svg.select(`.circle-${largerCircleID}`)
    const smallerCircleSVG = svg.select(`.circle-${smallerCircleID}`)

    const largerCircleData = largerCircleSVG.datum()
    const smallerCircleData = smallerCircleSVG.datum()

    const largerRadius = parseFloat(largerCircleSVG.attr('r'))
    const smallerRadius = parseFloat(smallerCircleSVG.attr('r'))
    const finalArea = calculateAreaDifference(largerRadius, smallerRadius)
    const finalRadius = Math.sqrt(finalArea / Math.PI)
    // const targetX = parseFloat(smallerCircleSVG.attr('cx'))
    const targetX = width / 2
    const targetY = largerCircleData.sink
      ? lineHeight + finalRadius
      : lineHeight - finalRadius

    svg
      .select(`.text-${largerCircleID}`)
      .transition()
      .duration(1000)
      .attr('x', targetX)
    svg
      .select(`.value-${largerCircleID}`)
      .transition()
      .duration(1000)
      .attr('x', targetX)
    svg
      .select(`.text-${smallerCircleID}`)
      .transition()
      .duration(1000)
      .attr('x', targetX)
    svg
      .select(`.value-${smallerCircleID}`)
      .transition()
      .duration(1000)
      .attr('x', targetX)

    smallerCircleSVG.transition().duration(1000).attr('cx', targetX)

    largerCircleSVG
      .transition()
      .duration(1000)
      .attr('cx', targetX)
      .on('end', () => {
        smallerCircleSVG
          .raise()
          .transition()
          .duration(1000)
          .ease(easeCubic)
          .attr(
            'cy',
            largerCircleData.sink
              ? lineHeight + parseFloat(smallerCircleSVG.attr('r'))
              : lineHeight - parseFloat(smallerCircleSVG.attr('r'))
          )
          .on('end', () => {
            svg
              .select(`.text-${smallerCircleID}`)
              .transition()
              .duration(1000)
              .style('opacity', 0)
            svg
              .select(`.value-${smallerCircleID}`)
              .transition()
              .duration(1000)
              .tween('text', function () {
                const currentValue = parseFloat(
                  this.textContent.match(/[\d\.]+/)[0]
                )
                const finalValue = 0
                const interpolator = interpolate(currentValue, finalValue)
                return function (t) {
                  this.textContent = getCarbonLabel(
                    interpolator(t),
                    smallerCircleData.sink
                  )
                }
              })
              .style('opacity', 0)

            svg
              .select(`.value-${largerCircleID}`)
              .transition()
              .duration(1000)
              .tween('text', function () {
                const currentValue = parseFloat(
                  this.textContent.match(/[\d\.]+/)[0]
                )
                const finalValue =
                  currentValue -
                  svg
                    .select(`.value-${smallerCircleID}`)
                    .text()
                    .match(/[\d\.]+/)[0]
                const interpolator = interpolate(currentValue, finalValue)
                return function (t) {
                  this.textContent = getCarbonLabel(
                    interpolator(t),
                    largerCircleData.sink
                  )
                }
              })

            largerCircleSVG
              .transition()
              .duration(1000)
              .ease(easeCubic)
              .attr('r', finalRadius)
              .attr('cy', targetY)
            smallerCircleSVG
              .transition()
              .duration(1000)
              .ease(easeCubic)
              .attr('r', 0)
              .attr('cy', lineHeight)
              .on('end', () => {
                resolve()
              })
          })
      })
  })
}

const updateLabels = (svg, circleId, radius, sink, carbon) => {
  return new Promise((resolve) => {
    const valueBaseOffset = sink ? 30 : -30
    const textBaseOffset = sink ? 10 : -10
    const circle = svg.select(`.circle-${circleId}`).datum()
    const text = svg.select(`.text-${circleId}`)
    const value = svg.select(`.value-${circleId}`)
    const textTargetY = lineHeight + (sink ? radius * 2 : radius * -2)

    text.attr('x', circle.cx).attr('y', textTargetY + textBaseOffset)
    value
      .attr('x', circle.cx)
      .attr('y', textTargetY + valueBaseOffset)
      .text(getCarbonLabel(carbon, sink))
    resolve()
  })
}

const Sinks = () => {
  const steps = [
    {
      text: `Carbon is added to the atmosphere from various sources and removed by various sinks. We'll explore the largest.`,
      progress: false,
      animate: (svg) => {
        buildGraphBase(svg)
      },
      revert: (svg) => {
        buildOpener(svg)
      },
    },
    {
      text: `Carbon sources and sinks from ${startYear} to ${endYear}`,
      progress: true,
      init: (svg) => {
        return new Promise((resolve) => {
          svg
            .selectAll("[class^='value-']")
            .transition()
            .duration(1000)
            .style('opacity', 1)
            .on('end', () => {
              resolve()
            })
        })
      },
      animate: (svg, percent) => {
        const year = Math.round(
          parseInt(startYear) +
            (parseInt(endYear) - parseInt(startYear)) * percent
        )
        const circles = calculateCirclePositions(
          getCircleData(year),
          lineHeight
        )
        svg.select('.year').text(year)
        circles.forEach(
          ({ id, cx, cy, color, radius, sink, values }, index) => {
            svg
              .select(`.circle-${id}`)
              .attr('cx', cx)
              .attr('cy', lineHeight)
              .attr('r', 0)
              .attr('fill', color)
              .attr('r', radius)
              .attr('cy', cy)
              .attr('stroke', 'black')

            updateLabels(svg, id, radius, sink, values[year])
          }
        )
      },
    },
    {
      text: 'Land use emissions and land-related sinks cancel a significant portion of each other out',
      animate: async (svg) => {
        await animateCircles(svg, 'land-sink', 'land-use')
      },
    },
    {
      text: 'Fossil fuel emissions dominate land related sources and sinks',
      animate: async (svg) => {
        await animateCircles(svg, 'fossil-fuels', 'land-sink')
      },
    },
    {
      text: 'The ocean, however, absorbs a very significant portion of these emissions',
      animate: async (svg) => {
        const clonedFossilFuelsCircle = svg
          .select('.circle-fossil-fuels')
          .clone(true)
        clonedFossilFuelsCircle
          .attr('class', 'cloned-fossil-fuels')
          .style('opacity', 0)
          .attr('cx', width / 2)
          .attr(
            'cy',
            lineHeight + parseFloat(clonedFossilFuelsCircle.attr('r'))
          )
          .attr('fill', '#00000000')
          .attr('stroke-dasharray', '5,5')
          .attr('stroke', '#64B9C4')

        svg.node().appendChild(clonedFossilFuelsCircle.node())

        await animateCircles(svg, 'fossil-fuels', 'ocean-sink')
      },
      // revert: (svg) => {
      //   svg.selectAll('*').remove()
      //   buildGraphBase(svg)
      // },
    },
    {
      text: 'The remainder is what we see in todays atmosphere. While extremely harmful, this amount is vastly smaller than what would otherwise exist without the ocean',
      animate: async (svg) => {
        return new Promise((resolve) => {
          const ffCircle = svg.select('.circle-fossil-fuels')
          const ffText = svg.select('.text-fossil-fuels')
          const ffValue = svg.select('.value-fossil-fuels')
          const clonedFossilFuelsCircle = svg.select('.cloned-fossil-fuels')

          ffText
            .transition()
            .duration(1000)
            .attr('x', width / 2)
          ffValue
            .transition()
            .duration(1000)
            .attr('x', width / 2)
          ffCircle
            .transition()
            .duration(1000)
            .attr('cx', width / 2)
            .on('end', () => {
              ffText.transition().duration(1000).style('opacity', 0)
              ffValue.transition().duration(1000).style('opacity', 0)
              clonedFossilFuelsCircle
                .transition()
                .duration(1000)
                .style('opacity', 1)

              ffText
                .transition()
                .duration(1000)
                .attr('y', lineHeight - 20)
                .text('Atmosphere')
                .attr('fill', '#64B9C4')
                .style('opacity', 1)
              ffValue
                .transition()
                .duration(1000)
                .attr('y', lineHeight - 40)
                .attr('fill', '#64B9C4')
                .style('opacity', 1)
              ffCircle
                .transition()
                .duration(1000)
                .attr('cy', lineHeight + parseFloat(ffCircle.attr('r')))
                .attr('fill', '#64B9C4')
                .on('end', () => {
                  svg
                    .select('.graph')
                    .transition()
                    .duration(1000)
                    .style('opacity', 0)
                    .on('end', () => {
                      resolve()
                    })
                })
            })
        })
      },
    },
    {
      text: null,
      animate: async (svg) => {
        return new Promise((resolve) => {
          const clonedFossilFuelsCircle = svg.select('.cloned-fossil-fuels')
          const currentRadius = parseFloat(
            svg.select('.circle-fossil-fuels').attr('r')
          )
          const newRadius = currentRadius * 4

          clonedFossilFuelsCircle
            .transition()
            .duration(2000)
            .style('opacity', 0)
          svg
            .select('.circle-fossil-fuels')
            .transition()
            .duration(2000)
            .attr('r', newRadius)
            .style('opacity', 0)
          svg
            .select('.text-fossil-fuels')
            .transition()
            .duration(2000)
            .style('opacity', 0)
          svg
            .select('.value-fossil-fuels')
            .transition()
            .duration(2000)
            .style('opacity', 0)
            .on('end', () => {
              resolve()
            })
        })
      },
    },
  ]

  const animationQueueRef = useRef([])

  const processQueue = async () => {
    if (animationQueueRef.current.length > 0) {
      const { animation, svg, resolve } = animationQueueRef.current[0]
      await animation(svg)
      resolve()
      animationQueueRef.current.shift()
      processQueue()
    }
  }

  const addToQ = (animation, svg) => {
    return new Promise((resolve) => {
      animationQueueRef.current.push({ animation, svg, resolve })
      if (animationQueueRef.current.length === 1) {
        processQueue()
      }
    })
  }

  const handleStepEnter = ({ data, direction }) => {
    if (data.progress && !data.init) return
    const svg = select('svg')
    if (direction === 'up') {
      if (data.revert) addToQ(() => data.revert(svg), svg)
    } else {
      if (data.init) addToQ(() => data.init(svg), svg)
      else addToQ(() => data.animate(svg), svg)
    }
  }

  const handleStepProgress = ({ progress, data }) => {
    if (!data.progress) return
    const svg = select('svg')
    data.animate(svg, progress)
  }
  useEffect(() => {
    const svg = select('svg')
    // buildGraphBase(svg)
    buildOpener(svg)
  }, [])

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ position: 'sticky', top: 0, height: '100vh', zIndex: -1 }}>
        <Box
          as={'svg'}
          sx={{
            height: '100vh',
            width: '100%',
          }}
          width='800'
          height='600'
          viewBox='0 0 800 600'
        ></Box>
      </Box>
      <Scrollama
        onStepEnter={handleStepEnter}
        offset={0.3}
        onStepProgress={handleStepProgress}
      >
        {steps.map((step, index) => (
          <Step data={step} key={index}>
            <Box
              sx={{
                py: '50vh',
              }}
            >
              {step.text && (
                <Box
                  sx={{
                    mr: 'calc(-1 * (3 * (100vw - 32px * 13) / 12 + 32px * 3))',
                    margin: [
                      'auto',
                      'auto',
                      '0 calc(-1 * (3 * (100vw - 32px * 13) / 12 + 32px * 3)) 0 0',
                      '0 calc(-1 * (3 * (100vw - 48px * 13) / 12 + 48px * 3)) 0 0',
                    ],
                    width: [
                      '50%',
                      '50%',
                      'calc(2 * (100vw - 32px * 13) / 12 + 32px)',
                      'calc(2 * (100vw - 48px * 13) / 12 + 48px)',
                    ],
                    float: ['unset', 'unset', 'right', 'right'],
                    bg: 'hinted',
                    fontSize: 1,
                    padding: 2,
                    borderRadius: 4,
                  }}
                >
                  {step.text}
                </Box>
              )}
            </Box>
          </Step>
        ))}
      </Scrollama>
    </Box>
  )
}

export default Sinks
