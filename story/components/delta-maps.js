import React, { useEffect, useState, useMemo } from 'react'
import { Minimap, Path, Sphere, Raster } from '@carbonplan/minimaps'
import { naturalEarth1 } from '@carbonplan/minimaps/projections'
import { useThemedColormap } from '@carbonplan/colormaps'
import { Column, Row } from '@carbonplan/components'
import zarr from 'zarr-js'
import { Box, useThemeUI } from 'theme-ui'
import SliderColorbar from './slider-colorbar'

const SOURCE_URL =
  'https://carbonplan-data-viewer.s3.us-west-2.amazonaws.com/demo/leap-data-stories/GCB-2023_dataprod_LDEO-HPD_1959-2022-flipped-lon.zarr'
const VARIABLE = 'sfco2'
const CLIM = [280, 440]

const FILL_VALUE = 9.969209968386869e36
const BASE_YEAR = 1959

const formatMonth = (month) => {
  const date = new Date(2024, month, 1)

  return date.toLocaleString('default', {
    month: 'short',
  })
}

const DeltaMaps = () => {
  const { theme } = useThemeUI()
  const colormap = useThemedColormap('warm')
  const [month, setMonth] = useState(0)
  const [chunks, setChunks] = useState({ start: null, end: null })

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

  return (
    <Box>
      <Row columns={[6]}>
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
      <SliderColorbar
        value={month}
        formatter={formatMonth}
        minMax={[0, 11]}
        setter={setMonth}
        colormap={colormap}
        clim={CLIM}
        variableName={'fCO₂'}
        units={'μatm'}
      />
    </Box>
  )
}

export default DeltaMaps