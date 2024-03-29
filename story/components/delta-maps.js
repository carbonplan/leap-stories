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

const getCustomProjection = () => {
  return {
    ...naturalEarth1(),
    glsl: {
      func: `
      vec2 naturalEarth1Invert(float x, float y)
      {
        const float pi = 3.14159265358979323846264;
        const float halfPi = pi * 0.5;
        float phi = y;
        float delta;
        float phi2 = phi * phi;
        float phi4 = phi2 * phi2;
        for (int i = 0; i < 25; i++) {
          phi2 = phi * phi;
          phi4 = phi2 * phi2;
          delta = (phi * (1.007226 + phi2 * (0.015085 + phi4 * (-0.044475 + 0.028874 * phi2 - 0.005916 * phi4))) - y) / (1.007226 + phi2 * (0.015085 * 3.0 + phi4 * (-0.044475 * 7.0 + 0.028874 * 9.0 * phi2 - 0.005916 * 11.0 * phi4)));
          phi = phi - delta;
          if (abs(delta) < 1e-6) {
            break;
          }
        }
        phi2 = phi * phi;
        float lambda = x / (0.8707 + phi2 * (-0.131979 + phi2 * (-0.013791 + phi2 * phi2 * phi2 * (0.003971 - 0.001529 * phi2))));
        if (lambda <= -1.0 * pi + 1e-6 || lambda >= pi - 1e-6) {
          return vec2(-1000.0, -1000.0);
        } else {
          return vec2(degrees(lambda), degrees(phi));
        }
      }
    `,
      name: 'naturalEarth1Invert',
    },
  }
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
          <Box
            sx={{
              color: 'secondary',
              textAlign: 'center',
            }}
          >
            1990
          </Box>
          <Box sx={{ mx: [-3, -3, -3, -5] }}>
            <Minimap
              projection={getCustomProjection}
              scale={1}
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
          <Box
            sx={{
              color: 'secondary',
              textAlign: 'center',
              mt: [3, 0, 0, 0],
            }}
          >
            2020
          </Box>

          <Box sx={{ mx: [-3, -3, -3, -5] }}>
            <Minimap
              projection={getCustomProjection}
              scale={1}
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
