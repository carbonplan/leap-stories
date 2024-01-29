import React, { useState, useEffect } from 'react'
import * as d3 from 'd3'
import { Scrollama, Step } from 'react-scrollama'
import { Box } from 'theme-ui'

const Sinks = () => {
  const [currentStep, setCurrentStep] = useState(0)

  const circleData = [
    { cx: 200, radius: 80, color: 'green', sink: false },
    { cx: 600, radius: 50, color: 'blue', sink: true },
  ]

  const lineHeight = 300

  const calculateCirclePositions = (circles, lineHeight) => {
    return circles.map((circle, index) => ({
      ...circle,
      cy: circle.sink ? lineHeight + circle.radius : lineHeight - circle.radius,
    }))
  }

  const calculateAreaDifference = (circles) => {
    const [area1, area2] = circles.map((circle) => Math.PI * circle.radius ** 2)
    return Math.sqrt((area1 - area2) / Math.PI)
  }

  const circles = calculateCirclePositions(circleData, lineHeight)
  const finalRadius = calculateAreaDifference(circles)

  const steps = [
    {
      text: 'Initial State',
      animate: (svg) => {
        circles.forEach((circle, index) => {
          svg
            .select(`.circle-${index}`)
            .attr('cx', circle.cx)
            .attr('cy', circle.cy)
            .attr('r', circle.radius)
            .attr('fill', circle.color)
        })
      },
    },
    {
      text: 'Animate to Center',
      animate: (svg) => {
        svg.selectAll('circle').transition().duration(2000).attr('cx', 400)
      },
    },
    {
      text: 'Combine Circles',
      animate: (svg) => {
        svg
          .select('.circle-1')
          .transition()
          .duration(1000)
          .attr('cy', lineHeight - circles[1].radius)
          .on('start', function () {
            svg
              .select('.circle-1')
              .transition()
              .duration(1000)
              .ease(d3.easeCubic)
              .attr('cy', lineHeight)
              .attr('r', 0)

            svg
              .select('.circle-0')
              .transition()
              .duration(1000)
              .ease(d3.easeCubic)
              .attr('r', finalRadius)
              .attr('cy', lineHeight - finalRadius)
          })
      },
    },
  ]

  useEffect(() => {
    const svg = d3.select('svg')

    svg
      .append('line')
      .attr('x1', 0)
      .attr('y1', lineHeight)
      .attr('x2', 800)
      .attr('y2', lineHeight)
      .attr('stroke', 'black')
      .attr('stroke-width', 1)

    circles.forEach((circle, index) => {
      svg
        .append('circle')
        .attr('class', `circle-${index}`)
        .attr('stroke', 'black')
    })

    setCurrentStep(0)
  }, [])

  useEffect(() => {
    const svg = d3.select('svg')
    if (steps[currentStep] && steps[currentStep].animate) {
      steps[currentStep].animate(svg)
    }
  }, [currentStep])

  const handleStepEnter = ({ data }) => {
    setCurrentStep(data)
  }

  return (
    <Box>
      <Box sx={{ position: 'sticky', top: 0, height: '100vh' }}>
        <svg style={{ marginTop: '25vh' }} width='800' height='600'></svg>
      </Box>
      <Scrollama onStepEnter={handleStepEnter} offset={0.5}>
        {steps.map((step, index) => (
          <Step data={index} key={index}>
            <Box sx={{ pb: '100vh' }}>{step.text}</Box>
          </Step>
        ))}
      </Scrollama>
    </Box>
  )
}

export default Sinks
