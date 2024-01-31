import React, { useState } from 'react'
import * as d3 from 'd3'
import { Scrollama, Step } from 'react-scrollama'
import { Box } from 'theme-ui'
import { budgets } from './carbon_budget_data'

const Sinks = () => {
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
      }
    })
  }

  const calculateCirclePositions = (circles, lineHeight) => {
    return circles.map((circle) => ({
      ...circle,
      cy: circle.sink ? lineHeight + circle.radius : lineHeight - circle.radius,
    }))
  }

  const calculateAreaDifference = (radius1, radius2) => {
    const area1 = Math.PI * radius1 ** 2
    const area2 = Math.PI * radius2 ** 2
    return Math.abs(area1 - area2)
  }

  const animateCircles = (svg, circle1Id, circle2Id) => {
    return new Promise((resolve) => {
      const circle1 = svg.select(`.circle-${circle1Id}`)
      const circle2 = svg.select(`.circle-${circle2Id}`)

      const circle1Data = circle1.datum()
      const circle2Data = circle2.datum()

      const circle1Radius = parseFloat(circle1.attr('r'))
      const circle2Radius = parseFloat(circle2.attr('r'))

      const largerCircle = circle1Radius >= circle2Radius ? circle1 : circle2
      const smallerCircle = circle1Radius < circle2Radius ? circle1 : circle2
      const largerCircleData =
        largerCircle === circle1 ? circle1Data : circle2Data
      const smallerCircleData =
        smallerCircle === circle1 ? circle1Data : circle2Data

      const finalArea = calculateAreaDifference(circle1Radius, circle2Radius)
      const finalRadius = Math.sqrt(finalArea / Math.PI)

      largerCircle
        .transition()
        .duration(1000)
        .attr('cx', parseFloat(smallerCircle.attr('cx')))
        .on('end', () => {
          smallerCircle
            .raise()
            .transition()
            .duration(1000)
            .ease(d3.easeCubic)
            .attr(
              'cy',
              largerCircleData.sink
                ? lineHeight + parseFloat(smallerCircle.attr('r'))
                : lineHeight - parseFloat(smallerCircle.attr('r'))
            )
            .on('end', () => {
              largerCircle
                .transition()
                .duration(1000)
                .ease(d3.easeCubic)
                .attr('r', finalRadius)
                .attr(
                  'cy',
                  largerCircleData.sink
                    ? lineHeight + finalRadius
                    : lineHeight - finalRadius
                )
              smallerCircle
                .transition()
                .duration(1000)
                .ease(d3.easeCubic)
                .attr('r', 0)
                .attr('cy', lineHeight)
                .on('end', () => {
                  resolve()
                })
            })
        })
    })
  }

  const circles = getCircleData(endYear)

  const steps = [
    {
      text: `Carbon sources and sinks have been estimated for the past 60+ years`,
      progress: false,
      animate: (svg) => {
        svg.selectAll('*').remove()
        svg
          .append('line')
          .attr('x1', 0)
          .attr('y1', lineHeight)
          .attr('x2', 700)
          .attr('y2', lineHeight)
          .attr('stroke', 'black')
          .attr('stroke-width', 1)

        svg
          .append('text')
          .attr('x', 0)
          .attr('text-align', 'center')
          .attr('text-anchor', 'center')
          .attr('y', lineHeight - 10)
          .attr('font-size', fontSize)
          .attr('fill', '#808080')
          .text('Sources')

        svg
          .append('text')
          .attr('x', 0)
          .attr('text-align', 'center')
          .attr('text-anchor', 'center')
          .attr('y', lineHeight + 25)
          .attr('font-size', fontSize)
          .attr('fill', '#808080')
          .text('Sinks')
        svg
          .append('text')
          .attr('class', 'year')
          .attr('x', width - 100)
          .attr('y', lineHeight + 6)
          .attr('font-size', fontSize)
          .attr('fill', '#808080')
          .text('')

        circles.forEach((circle) => {
          svg
            .append('circle')
            .attr('class', `circle-${circle.id}`)
            .data([circle])
        })
      },
    },
    {
      text: `Carbon sources and sinks from ${startYear} to ${endYear}`,
      progress: true,
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
        circles.forEach((circle, index) => {
          svg
            .select(`.circle-${circle.id}`)
            .attr('cx', circle.cx)
            .attr('cy', lineHeight)
            .attr('r', 0)
            .attr('fill', circle.color)
            .attr('r', circle.radius)
            .attr('cy', circle.cy)
            .attr('stroke', 'black')
        })
      },
    },
    {
      text: 'Land use emissions and land-related overall remove a relatively small amount of carbon',
      animate: async (svg) => {
        const landUseCircle = circles.filter(
          (circle) => circle.id === 'land-use'
        )[0]
        const landSinkCircle = circles.filter(
          (circle) => circle.id === 'land-sink'
        )[0]
        const finalArea = calculateAreaDifference(landSinkCircle, landUseCircle)
        const finalRadius = Math.sqrt(finalArea / Math.PI)
        await animateCircles(svg, 'land-use', 'land-sink')
      },
    },
    {
      text: 'Land related carbon emissions make a relatively small dent in the budget',
      animate: async (svg) => {
        const landUseCircle = circles.filter(
          (circle) => circle.id === 'land-use'
        )[0]
        const landSinkCircle = circles.filter(
          (circle) => circle.id === 'land-sink'
        )[0]
        const finalArea = calculateAreaDifference(landSinkCircle, landUseCircle)
        await animateCircles(svg, 'fossil-fuels', 'land-sink')
      },
    },
    {
      text: 'The ocean accounts for by far the largest carbon sink',
      animate: async (svg) => {
        const landUseCircle = circles.filter(
          (circle) => circle.id === 'land-use'
        )[0]
        const landSinkCircle = circles.filter(
          (circle) => circle.id === 'land-sink'
        )[0]
        const finalArea = calculateAreaDifference(landSinkCircle, landUseCircle)
        await animateCircles(svg, 'fossil-fuels', 'ocean-sink')
        svg
          .select('.circle-fossil-fuels')
          .transition()
          .duration(1000)
          .attr('fill', '#64B9C4')
          .attr('cx', width / 2)
        svg.selectAll('text').remove()
        svg.selectAll('line').remove()
      },
    },
  ]

  const handleStepEnter = ({ data }) => {
    if (data.progress) return
    data.animate(d3.select('svg'))
  }
  const handleStepProgress = ({ progress, data }) => {
    if (!data.progress) return
    data.animate(d3.select('svg'), progress)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ position: 'sticky', top: 0, height: '100vh', zIndex: -1 }}>
        <svg
          style={{ marginTop: '25vh', width: '100%' }}
          width='800'
          height='600'
          viewBox='0 0 800 600'
        ></svg>
      </Box>
      <Scrollama
        onStepEnter={handleStepEnter}
        offset={1}
        onStepProgress={handleStepProgress}
      >
        {steps.map((step, index) => (
          <Step data={step} key={index}>
            <Box
              sx={{
                pb: '100vh',
              }}
            >
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
            </Box>
          </Step>
        ))}
      </Scrollama>
    </Box>
  )
}

export default Sinks
