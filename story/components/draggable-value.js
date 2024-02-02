import { useCallback, useEffect, useRef, useState } from 'react'
import { Box } from 'theme-ui'

// Adapted from https://github.com/carbonplan/components/blob/main/src/colorbar.js
const DraggableValue = ({
  value,
  setValue,
  range,
  step = 1,
  horizontal = true,
  formatter,
  sx,
  sync = false,
}) => {
  const [renderedValue, setRenderedValue] = useState(value)
  const renderedRef = useRef(renderedValue)
  const ref = useRef()
  const draggingFunction = useRef()
  const [x, y, init] = [useRef(), useRef(), useRef()]

  useEffect(() => {
    setRenderedValue(value)
  }, [value])

  useEffect(() => {
    renderedRef.current = renderedValue
  }, [renderedValue])

  const handleMouseUp = useCallback(() => {
    setValue(renderedRef.current)
    document.body.setAttribute('style', 'cursor: unset')
    document.removeEventListener('mousemove', draggingFunction.current)
  }, [setValue])

  const handleMouseDown = useCallback(
    (e) => {
      y.current = e.pageY
      x.current = e.pageX
      init.current = value

      document.body.setAttribute(
        'style',
        horizontal
          ? 'cursor: ew-resize !important'
          : 'cursor: ns-resize !important'
      )
      draggingFunction.current = (e) => {
        const dx = e.pageX - x.current
        const dy = e.pageY - y.current
        const v = horizontal
          ? init.current + dx * step
          : init.current + dy * step
        const normalizedValue = Math.max(Math.min(v, range[1]), range[0])
        sync ? setValue(normalizedValue) : setRenderedValue(normalizedValue)
      }
      document.addEventListener('mousemove', draggingFunction.current)
      window.addEventListener('mouseup', handleMouseUp, { once: true })
    },
    [horizontal, range, sync, setValue, step]
  )

  return (
    <Box
      as={'button'}
      ref={ref}
      tabIndex={0}
      sx={{
        bg: 'unset',
        border: 'none',
        color: 'primary',
        px: 0,
        letterSpacing: 'smallcaps',
        textTransform: 'uppercase',
        transition: 'border 0.15s',
        userSelect: 'none !important',
        width: 'fit-content',
        minWidth: 'fit-content',
        borderBottom: ({ colors }) => `solid 1px ${colors.primary}`,
        cursor: horizontal ? 'ew-resize' : 'ns-resize',
        ...sx,
      }}
      onMouseDown={handleMouseDown}
      onClick={() => ref.current.focus()}
    >
      {formatter ? formatter(renderedValue) : renderedValue}
    </Box>
  )
}

export default DraggableValue
