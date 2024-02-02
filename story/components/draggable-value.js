import { useRef } from 'react'
import { Box } from 'theme-ui'

// Adapted from https://github.com/carbonplan/components/blob/main/src/colorbar.js
const DraggableValue = ({
  value,
  setValue,
  range,
  step = 1,
  horizontal = true,
}) => {
  const ref = useRef()
  let x, y, dx, dy, init

  const draggingFunction = (e) => {
    dx = e.pageX - x
    dy = e.pageY - y
    const value = horizontal ? init + dx * step : init + dy * step
    setValue(Math.max(Math.min(value, range[1]), range[0]))
  }

  const handleMouseDown = (e) => {
    y = e.pageY
    x = e.pageX
    init = value

    document.body.setAttribute(
      'style',
      horizontal
        ? 'cursor: ew-resize !important'
        : 'cursor: ns-resize !important'
    )
    document.addEventListener('mousemove', draggingFunction)
    const updater = () => {
      document.body.setAttribute('style', 'cursor: unset')
      document.removeEventListener('mousemove', draggingFunction)
      window.removeEventListener('mouseup', updater)
    }
    window.addEventListener('mouseup', updater)
  }

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
        fontFamily: 'mono',
        fontSize: ['9px', 0, 0, 1],
        letterSpacing: 'smallcaps',
        textTransform: 'uppercase',
        transition: 'border 0.15s',
        userSelect: 'none !important',
        width: 'fit-content',
        minWidth: 'fit-content',
        borderBottom: ({ colors }) => `solid 1px ${colors.primary}`,
        cursor: horizontal ? 'ew-resize' : 'ns-resize',
      }}
      onMouseDown={handleMouseDown}
      onClick={() => ref.current.focus()}
    >
      {value}
    </Box>
  )
}

export default DraggableValue
