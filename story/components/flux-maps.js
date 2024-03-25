import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { Minimap, Path, Sphere, Raster } from '@carbonplan/minimaps'
import { naturalEarth1 } from '@carbonplan/minimaps/projections'
import { useThemedColormap } from '@carbonplan/colormaps'
import { Colorbar, Column, Row, Slider } from '@carbonplan/components'
import zarr from 'zarr-js'
import { Box, Flex, useThemeUI } from 'theme-ui'

import PlayPause from './play-pause'
import DraggableValue from './draggable-value'

const SOURCE_URL =
  'https://carbonplan-data-viewer.s3.us-west-2.amazonaws.com/demo/leap-data-stories/GCB-2023_dataprod_LDEO-HPD_1959-2022-flipped-lon.zarr'
const VARIABLE = 'fgco2'
const CLIM = [
  /* Convert clim of [-3, 3] from seconds to year  */
  -9.5129376e-8, 9.5129376e-8,
]
const FILL_VALUE = 9.969209968386869e36
const BASE_YEAR = 1959

const formatMonth = (month) => {
  const date = new Date(2024, month, 1)

  return date.toLocaleString('default', {
    month: 'short',
  })
}

const FluxMaps = ({ delay = 500 }) => {
  const { theme } = useThemeUI()
  const colormap = useThemedColormap('redteal')
  const [playing, setPlaying] = useState(false)
  const [month, setMonth] = useState(0)
  const [chunks, setChunks] = useState({ start: null, end: null })
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
          loader([1990 - BASE_YEAR, 0, 0], (err, chunk) => {
            if (err) {
              console.error('Error loading chunk:', err)
              return
            }

            setChunks((prev) => ({ ...prev, start: chunk }))
          })
          loader([2020 - BASE_YEAR, 0, 0], (err, chunk) => {
            if (err) {
              console.error('Error loading chunk:', err)
              return
            }

            setChunks((prev) => ({ ...prev, end: chunk }))
          })
        })
      } catch (error) {
        console.error('Error fetching group:', error)
      }
    }
    fetchGroup()
  }, [])

  const data = useMemo(() => {
    if (chunks.start && chunks.end) {
      return {
        start: chunks.start.pick(month, null, null),
        end: chunks.end.pick(month, null, null),
      }
    } else {
      return {}
    }
  }, [chunks, month])

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

  return (
    <PlayPause
      playing={playing}
      setPlaying={handlePlay}
      controls={
        <Box>
          <Box
            sx={{
              width: 'fit-content',
            }}
          >
            <Flex
              sx={{
                mt: '-2px',
                mb: '12px',
                gap: 1,
              }}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <Box
                  key={i}
                  onClick={() => {
                    handlePlay(false)
                    setMonth(i)
                  }}
                  sx={{
                    cursor: 'pointer',
                    width: '30px',
                    fontSize: 0,
                    p: '2px',
                    bg: month === i ? 'muted' : 'hinted',
                    color: month === i ? 'primary' : 'secondary',
                    lineHeight: '20px',
                    textAlign: 'center',
                    transition: 'color 0.2s ease-in-out',
                    '&:hover': {
                      bg: 'muted',
                      transition: 'background-color 0.2s ease-in-out',
                    },
                  }}
                >
                  {formatMonth(i)}
                </Box>
              ))}
            </Flex>
            <Box sx={{ width: '100%', px: 2 }}>
              <Slider
                value={month}
                onChange={(e) => {
                  handlePlay(false)
                  setMonth(parseFloat(e.target.value))
                }}
                min={0}
                max={11}
                sx={{
                  bg: 'hinted',
                  color: 'secondary',
                }}
              />
            </Box>
          </Box>
        </Box>
      }
    >
      <Row columns={[6]} sx={{ mt: 3 }}>
        <Column start={1} width={[6, 3, 3, 3]}>
          <Box sx={{ color: 'secondary' }}>1990</Box>

          <Box sx={{ mx: [-3, -3, -3, -5] }}>
            <Minimap projection={naturalEarth1} scale={1} translate={[0, 0]}>
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
              {data.start && (
                <Raster
                  source={data.start}
                  colormap={colormap}
                  clim={CLIM}
                  mode={'lut'}
                  nullValue={FILL_VALUE}
                />
              )}
            </Minimap>
          </Box>
        </Column>
        <Column start={[1, 4, 4, 4]} width={[6, 3, 3, 3]}>
          <Box sx={{ color: 'secondary' }}>2020</Box>

          <Box sx={{ mx: [-3, -3, -3, -5] }}>
            <Minimap projection={naturalEarth1} scale={1} translate={[0, 0]}>
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
      </Row>
      <Flex sx={{ justifyContent: 'flex-end', mt: 3 }}>
        <Colorbar
          colormap={colormap}
          clim={[-3, 3]}
          horizontal
          label={'Carbon flux'}
          units={'mol / m² / yr'}
        />
      </Flex>
    </PlayPause>
  )
}

export default FluxMaps
