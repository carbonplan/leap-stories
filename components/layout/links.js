import { Button, Column, Row } from '@carbonplan/components'
import { RotatingArrow } from '@carbonplan/icons'
import { Box } from 'theme-ui'

// const COLORS = ['rgba(182,216,238,0.7)', 'rgba(0,119,102,0.6)'] // LEAP blue and teal

const Links = ({ links }) => {
  const widths = links.length > 2 ? [3, 2, 2, 2] : [3, 3, 3, 3]

  return (
    <Row columns={6} sx={{ mt: 6, rowGap: 4 }}>
      {links.map(({ label, href }, i) => (
        <Column
          key={label}
          start={widths.map((w) => ((i * w) % 6) + 1)}
          width={widths}
        >
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              height: '100%',
              minHeight: [100],
              alignItems: 'center',
              // background: widths.map((w) => {
              //   const entriesPerRow = 6 / w
              //   const isEvenRowColumnSum =
              //     (Math.floor(i / entriesPerRow) + (i % entriesPerRow)) % 2 ===
              //     0
              //   return isEvenRowColumnSum ? COLORS[0] : COLORS[1]
              // }),
              background: 'rgba(182,216,238,0.7)',
              p: 4,
            }}
          >
            <Button
              href={href}
              suffix={<RotatingArrow />}
              sx={{
                '&:hover': { color: 'background' },
                '&:hover > #suffix-span >#suffix': {
                  color: 'background',
                },
              }}
            >
              {label}
            </Button>
          </Box>
        </Column>
      ))}
    </Row>
  )
}

export default Links
