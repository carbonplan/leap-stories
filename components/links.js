import { Button, Column, Row } from '@carbonplan/components'
import { RotatingArrow } from '@carbonplan/icons'

const Links = ({ links }) => {
  const widths = links.length > 2 ? [3, 2, 2, 2] : [3, 3, 3, 3]

  return (
    <Row
      columns={6}
      sx={{
        mt: 6,
        rowGap: 4,
        borderWidth: 0,
        borderStyle: 'solid',
        borderColor: 'secondary',
        borderTopWidth: 1,
        pt: 6,
      }}
    >
      {links.map(({ label, href }, i) => (
        <Column
          key={label}
          start={widths.map((w) => ((i * w) % 6) + 1)}
          width={widths}
        >
          <Button
            href={href}
            suffix={<RotatingArrow />}
            sx={{
              background: 'rgba(182,216,238,0.7)',
              p: 5,
              width: '100%',
              height: '100%',
              '&:hover': {
                background: 'rgba(182,216,238,0.55)',
              },
            }}
          >
            {label}
          </Button>
        </Column>
      ))}
    </Row>
  )
}

export default Links
