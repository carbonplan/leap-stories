import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { Minimap, Path, Sphere, Raster } from '@carbonplan/minimaps'
import { naturalEarth1 } from '@carbonplan/minimaps/projections'
import { useThemedColormap } from '@carbonplan/colormaps'
import { Colorbar, Column, Row } from '@carbonplan/components'
import zarr from 'zarr-js'
import { Flex, useThemeUI } from 'theme-ui'

import PlayPause from './play-pause'
import DraggableValue from './draggable-value'

const SOURCE_URL =
  'https://carbonplan-data-viewer.s3.us-west-2.amazonaws.com/demo/leap-data-stories/GCB-2023_dataprod_LDEO-HPD_1959-2022-flipped-lon.zarr'
const VARIABLE = 'fgco2'
const CLIM = [
  /* Convert clim of [-3, 3] from seconds to year  */
  -9.5129376e-8, 9.5129376e-8,
]
const START_YEAR = 1959
const END_YEAR = 2022
const FILL_VALUE = 9.969209968386869e36

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
          loader([0, 0, 0], (err, chunk) => {
            if (err) {
              console.error('Error loading chunk:', err)
              return
            }

            setChunks((prev) => ({ ...prev, start: chunk }))
          })
          loader([63, 0, 0], (err, chunk) => {
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
        <DraggableValue
          value={month}
          range={[0, 11]}
          setValue={setMonth}
          formatter={formatMonth}
          sx={{ fontSize: 2 }}
        />
      }
    >
      <Row columns={[6]} sx={{ mt: 2 }}>
        <Column start={1} width={[6, 3]}>
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
          {START_YEAR}
        </Column>
        <Column start={[1, 4]} width={[6, 3]}>
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
          {END_YEAR}
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