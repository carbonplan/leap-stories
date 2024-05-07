import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { Minimap, Path, Sphere, Raster } from '@carbonplan/minimaps'
import { naturalEarth1 } from '@carbonplan/minimaps/projections'
import { useThemedColormap } from '@carbonplan/colormaps'
import { Column, Row } from '@carbonplan/components'
import zarr from 'zarr-js'
import { Box, Flex, useThemeUI } from 'theme-ui'

import SliderColorbar from './slider-colorbar'
import PlayPause from './play-pause'

const SOURCE_URL =
  'https://carbonplan-data-viewer.s3.us-west-2.amazonaws.com/demo/leap-data-stories/annual-sfco2.zarr'
const VARIABLE = 'sfco2'

const CLIM = [280, 440]
const FILL_VALUE = 9.969209968386869e36
const START_YEAR = 1990
const END_YEAR = 2018

const delay = 250

const FCO2Maps = () => {
  const { theme } = useThemeUI()
  const colormap = useThemedColormap('warm')
  const [year, setYear] = useState(START_YEAR)
  const [chunks, setChunks] = useState(null)

  const [playing, setPlaying] = useState(false)
  const timeout = useRef(null)

  useEffect(() => {
    try {
      zarr().load(`${SOURCE_URL}/${VARIABLE}`, (err, arr) => {
        if (err) {
          console.error('Error loading array:', err)
          return
        }
        setChunks(arr)
      })
    } catch (error) {
      console.error('Error fetching group:', error)
    }
  }, [])

  const data = useMemo(() => {
    if (chunks) {
      return {
        measured: chunks.pick(0, year - START_YEAR, null, null),
        reconstructed: chunks.pick(1, year - START_YEAR, null, null),
      }
    } else {
      return {}
    }
  }, [chunks, year])

  const handleSetYear = useCallback(
    (newYear) => {
      setYear(newYear)
      handlePlay(false)
    },
    [setYear, setPlaying]
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
            setYear((prev) => {
              let nextValue = prev + 1
              if (nextValue > END_YEAR) {
                nextValue = START_YEAR
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
    <Box>
      <Flex sx={{ justifyContent: 'center' }}>
        <Box
          sx={{
            color: 'secondary',
            textAlign: 'center',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {year}
        </Box>
      </Flex>
      <Row columns={[6]}>
        <Column start={1} width={[6, 3, 3, 3]}>
          <Box
            sx={{
              color: 'secondary',
              textAlign: 'center',
            }}
          >
            Measured
          </Box>

          <Box>
            <Minimap projection={naturalEarth1} scale={1.05} translate={[0, 0]}>
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
              {data.measured && (
                <Raster
                  source={data.measured}
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
          <Box
            sx={{
              color: 'secondary',
              textAlign: 'center',
              mt: [3, 0, 0, 0],
            }}
          >
            Reconstructed
          </Box>
          <Box>
            <Minimap projection={naturalEarth1} scale={1.05} translate={[0, 0]}>
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
              {data.reconstructed && (
                <Raster
                  source={data.reconstructed}
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
      <SliderColorbar
        value={year}
        minMax={[START_YEAR, END_YEAR]}
        setter={handleSetYear}
        colormap={colormap}
        clim={CLIM}
        variableName={'fCO₂'}
        units={'μatm'}
        playPause={<PlayPause playing={playing} setPlaying={handlePlay} />}
      />
    </Box>
  )
}

export default FCO2Maps
