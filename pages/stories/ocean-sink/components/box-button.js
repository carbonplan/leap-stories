import { Button } from '@carbonplan/components'

const BoxButton = ({ children, onClick, active, sx, ...props }) => {
  return (
    <Button
      onClick={(e) => {
        e.stopPropagation()
        onClick && onClick(e)
      }}
      sx={{
        transition: 'all 0.2s ease-in-out',
        cursor: onClick ? 'pointer' : 'inherit',
        bg: active ? 'muted' : 'hinted',
        color: active ? 'primary' : 'secondary',
        fontSize: [0, 0, 0, 1],
        py: 1,
        px: '6px',
        minWidth: '20px',
        flexShrink: 0,
        height: ['20px', '20px', '20px', '24px'],
        textAlign: 'center',
        textTransform: 'uppercase',
        '&:hover': { bg: 'muted' },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  )
}

export default BoxButton
