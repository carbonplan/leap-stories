import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { Minimap, Path, Sphere, Raster } from '@carbonplan/minimaps'
import { useThemedColormap } from '@carbonplan/colormaps'
import { Column, Row } from '@carbonplan/components'
import zarr from 'zarr-js'
import { Box, Flex, useThemeUI } from 'theme-ui'

import { getCustomProjection } from './projection'
import PlayPause from './play-pause'
import TimeSlider from './time-slider'
import DynamicColorbar from './dynamic-colorbar'

const SOURCE_URL =
  'https://carbonplan-data-viewer.s3.us-west-2.amazonaws.com/demo/leap-data-stories/GCB-2023_dataprod_LDEO-HPD_1959-2022-updated-flipped-lon.zarr'
const VARIABLE = 'fgco2'
const CLIM = [
  /* Convert clim of [-3, 3] from seconds to year  */
  -9.5129376e-8, 9.5129376e-8,
]

const FILL_VALUE = 9.969209968386869e36
const BASE_YEAR = 1959
const SHOW_YEAR = 2022

const formatMonth = (month) => {
  const date = new Date(2024, month, 1)

  return date.toLocaleString('default', {
    month: 'short',
  })
}

const delay = 250

const FluxMap = () => {
  const { theme } = useThemeUI()
  const colormap = useThemedColormap('redteal')
  const colormapReversed = [...colormap].reverse() // flipped colorbar colormap to correct sign of data
  const [month, setMonth] = useState(0)
  const [chunks, setChunks] = useState({ data: null })

  const [playing, setPlaying] = useState(false)
  const timeout = useRef(null)

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        zarr().openGroup(SOURCE_URL, (err, l) => {
          if (err) {
            console.error('Error opening group:', err)
            return
          }
          const loader = l[VARIABLE]
          loader([SHOW_YEAR - BASE_YEAR, 0, 0], (err, chunk) => {
            if (err) {
              console.error('Error loading chunk:', err)
              return
            }
            setChunks((prev) => ({ ...prev, data: chunk }))
          })
        })
      } catch (error) {
        console.error('Error fetching group:', error)
      }
    }
    fetchGroup()
  }, [])

  const data = useMemo(() => {
    if (chunks.data) {
      return {
        end: chunks.data.pick(month, null, null),
      }
    } else {
      return {}
    }
  }, [chunks, month])

  const handleSetMonth = useCallback(
    (month) => {
      setMonth(month)
      handlePlay(false)
    },
    [setMonth, setPlaying]
  )

  const handlePlay = useCallback(
    (willPlay) => {
      if (timeout.current) {
        clearTimeout(timeout.current)
        timeout.current = null
      }

      setPlaying(willPlay)
      if (willPlay) {
        const incrementTime = () => {
          timeout.current = setTimeout(() => {
            let shouldContinue = true
            setMonth((prev) => {
              let nextValue = prev + 1
              if (nextValue > 11) {
                nextValue = 0
                shouldContinue = false
                setPlaying(false)
              }
              return nextValue
            })
            if (shouldContinue) {
              incrementTime()
            }
          }, delay)
        }
        incrementTime()
      }
    },
    [delay]
  )

  const climFormatter = useCallback((d) => {
    return d > 0 ? (
      <>
        +{d}{' '}
        <Box as='span' sx={{ textTransform: 'none' }}>
          (out)
        </Box>
      </>
    ) : (
      <>
        {d}{' '}
        <Box as='span' sx={{ textTransform: 'none' }}>
          (in)
        </Box>
      </>
    )
  }, [])

  return (
    <Box>
      <Row columns={[6]} sx={{ position: 'relative' }}>
        <Column start={1} width={6}>
          <Flex
            sx={{
              justifyContent: 'center',
              color: 'secondary',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formatMonth(month)} {SHOW_YEAR}
          </Flex>
        </Column>
        <Column start={1} width={6} sx={{ height: 'fit-content' }}>
          <Box>
            <Minimap
              projection={getCustomProjection}
              scale={1.05}
              translate={[0, 0]}
            >
              <Path
                stroke={theme.colors.primary}
                source={
                  'https://cdn.jsdelivr.net/npm/world-atlas@2/land-50m.json'
                }
                feature={'land'}
                opacity={0.3}
                fill={theme.colors.muted}
              />
              <Sphere
                stroke={theme.colors.primary}
                fill={theme.colors.background}
                strokeWidth={1}
              />
              {data.end && (
                <Raster
                  source={data.end}
                  colormap={colormap}
                  clim={CLIM}
                  mode={'lut'}
                  nullValue={FILL_VALUE}
                />
              )}
            </Minimap>
          </Box>
        </Column>
        <Column start={1} width={[4, 3, 3, 3]} sx={{ mt: 3 }}>
          <TimeSlider
            value={month}
            minMax={[0, 11]}
            setter={handleSetMonth}
            playPause={<PlayPause playing={playing} setPlaying={handlePlay} />}
          />
        </Column>

        <DynamicColorbar
          colormap={colormapReversed}
          format={climFormatter}
          clim={[-3, 3]}
          label={'Carbon flux'}
          units={'mol / m² / year'}
          sx={{ right: -96 }}
        />
      </Row>
    </Box>
  )
}

export default FluxMap
