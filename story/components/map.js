import React, { useEffect, useState, useRef } from 'react'
import { Minimap, Path, Sphere, Raster } from '@carbonplan/minimaps'
import { naturalEarth1 } from '@carbonplan/minimaps/projections'
import { datasets } from '../datasets'
import { useThemedColormap } from '@carbonplan/colormaps'
import { Slider } from '@carbonplan/components'
import zarr from 'zarr-js'
import { Box } from 'theme-ui'

const Map = ({ sourceUrl, variable, clim, colormapName }) => {
  const colormap = useThemedColormap(colormapName)
  const [time, setTime] = useState(0)
  const [data, setData] = useState([null])
  const [timeRange, setTimeRange] = useState([0, 0])
  const [timeChunkSize, setTimeChunkSize] = useState(12)
  const [nullValue, setNullValue] = useState(9.969209968386869e36)
  const chunkCache = useRef({})
  const groupRef = useRef(null)

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const metadataUrl = sourceUrl + '/.zmetadata'
        const metadata = await fetch(metadataUrl)
        const metadataJson = await metadata.json()
        const { shape, chunks, fill_value } =
          metadataJson.metadata[variable + '/.zarray']
        setTimeRange([0, shape[0] - 1])
        setTimeChunkSize(chunks[0])
        setNullValue(fill_value)

        zarr().openGroup(
          sourceUrl,
          (err, group) => {
            if (err) {
              console.error('Error opening group:', err)
              return
            }
            groupRef.current = group
            handleChunkLoading(Math.floor(time / timeChunkSize))
          },
          [],
          metadataJson
        )
      } catch (error) {
        console.error('Error fetching group:', error)
      }
    }
    fetchGroup()
  }, [])

  useEffect(() => {
    if (groupRef.current) {
      const chunkIndex = Math.floor(time / timeChunkSize)
      handleChunkLoading(chunkIndex)
    }
  }, [time, timeChunkSize])

  const loadChunk = (getChunk, chunkIndex) => {
    getChunk([chunkIndex, 0, 0], (err, chunk) => {
      if (err) {
        console.error('Error loading chunk:', err)
        return
      }
      chunkCache.current[chunkIndex] = chunk
      updateData(chunkIndex)
    })
  }

  const updateData = (chunkIndex) => {
    const timeIndexWithinChunk = time % timeChunkSize
    const chunk = chunkCache.current[chunkIndex]
    const chunkData = chunk.pick(timeIndexWithinChunk, null, null)
    setData(chunkData)
  }

  const handleChunkLoading = (chunkIndex) => {
    if (chunkCache.current[chunkIndex]) {
      updateData(chunkIndex)
    } else if (groupRef.current) {
      loadChunk(groupRef.current[variable], chunkIndex)
    }
  }

  const handleSliderChange = (event) => {
    setTime(event.target.value)
  }

  return (
    <>
      <Minimap projection={naturalEarth1} scale={1} translate={[0, 0]}>
        <Path
          stroke={'black'}
          source={datasets['land-110m.json']}
          feature={'land'}
          fill={'#fff'}
        />
        <Sphere stroke={'black'} fill={'#fff'} strokeWidth={1} />
        {data && (
          <Raster
            source={data}
            colormap={colormap}
            clim={clim}
            mode={'lut'}
            nullValue={nullValue}
          />
        )}
      </Minimap>
      <Box sx={{ mt: 3 }}>
        <Slider
          min={timeRange[0]}
          max={timeRange[1]}
          value={time}
          onChange={handleSliderChange}
        />
      </Box>
    </>
  )
}

export default Map
