import { Column, Row, Slider } from '@carbonplan/components'
import { useState } from 'react'
import { Box, Flex, Label, useThemeUI } from 'theme-ui'
import { mix } from '@theme-ui/color'
import PlayPause from './play-pause'

const Bathtub = () => {
  const { theme } = useThemeUI()
  const [playing, setPlaying] = useState(false)
  const [flow, setFlow] = useState(6)

  return (
    <Box>
      <Row columns={[6]}>
        <Column start={1} width={[6, 2]}>
          <PlayPause playing={playing} setPlaying={setPlaying} />
        </Column>
        <Column start={[1, 4]} width={[6, 3]}>
          <Label
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <Box
              as='span'
              sx={{
                fontSize: [1, 1, 1, 2],
                textTransform: 'uppercase',
              }}
            >
              Flow rate
            </Box>
            <Slider
              min={1}
              max={6}
              value={flow}
              onChange={(e) => setFlow(e.target.value)}
            />
          </Label>
        </Column>
      </Row>

      <svg viewBox='0 0 167 98' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <mask
          id='mask0_0_1'
          style={{ maskType: 'alpha' }}
          maskUnits='userSpaceOnUse'
          x='1'
          y='30'
          width='165'
          height='67'
        >
          <path
            d='M11.7671 63.5489L1.40051 33.9929C0.716247 32.0421 2.16403 30 4.23142 30H162.769C164.836 30 166.284 32.0421 165.599 33.9929L155.233 63.5489C148.205 83.587 129.286 97 108.051 97H58.9491C37.7141 97 18.7954 83.587 11.7671 63.5489Z'
            fill='#D9D9D9'
          />
        </mask>
        <g mask='url(#mask0_0_1)'>
          <path
            d='M0.351659 36.9473L-0.928497 38.076C-5.64052 42.2304 -7.88787 48.5141 -6.87917 54.7145L0 97H169V36.3757C162.813 41.2819 154.062 41.2819 147.875 36.3757C141.688 31.4696 132.937 31.4696 126.75 36.3757C120.563 41.2819 111.812 41.2819 105.625 36.3757C99.4379 31.4696 90.6871 31.4696 84.5 36.3757C78.3129 41.2819 69.5621 41.2819 63.375 36.3757C57.1879 31.4696 48.4371 31.4696 42.25 36.3757C36.0629 41.2819 27.3121 41.2819 21.125 36.3757C14.9711 31.5246 6.22945 31.7652 0.351659 36.9473Z'
            fill={mix('blue', 'background', 0.5)(theme)}
          />
          {/* <path
              d='M10.0535 94L-0.184979 94.3914C-1.70713 94.4496 -1.94794 96.6077 -0.476056 97H169V94.3642L158.408 94.7283L147.815 94.3642L137.223 94L126.631 94.3642L116.039 94.7283L105.446 94.3642L94.8542 94L84.262 94.3642L73.6697 94.7283L63.0775 94.3642L52.4852 94L41.893 94.3642L31.3007 94.7283L20.7085 94.3642L10.0535 94Z'
              fill={mix('blue', 'background', 0.5)(theme)}
            /> */}
        </g>
        <rect
          x='-27'
          y={29 + (6 - flow) / 2}
          width='65'
          height={flow}
          transform='rotate(-90 24 29)'
          fill={mix('blue', 'background', 0.5)(theme)}
        />
        <path
          d='M7 30V13C7 6.37258 12.3726 1 19 1C25.6274 1 31 6.37259 31 13V14.86H23.6667V13.2533C23.6667 10.8601 21.7266 8.92 19.3333 8.92C16.9401 8.92 15 10.8601 15 13.2533V30H7Z'
          stroke='black'
          stroke-width='2'
        />
        <path
          d='M11.7671 63.5489L1.40051 33.9929C0.716247 32.0421 2.16403 30 4.23142 30H162.769C164.836 30 166.284 32.0421 165.599 33.9929L155.233 63.5489C148.205 83.587 129.286 97 108.051 97H58.9491C37.7141 97 18.7954 83.587 11.7671 63.5489Z'
          stroke='black'
          stroke-width='2'
        />
      </svg>
    </Box>
  )
}

export default Bathtub
