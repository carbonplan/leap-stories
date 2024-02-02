import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Minimap, Path, Sphere, Raster } from '@carbonplan/minimaps'
import { naturalEarth1 } from '@carbonplan/minimaps/projections'
import { useThemedColormap } from '@carbonplan/colormaps'
import { Slider } from '@carbonplan/components'
import zarr from 'zarr-js'
import { Box } from 'theme-ui'

import { datasets } from '../datasets'
import PlayPause from './play-pause'

class ChunkCache {
  constructor() {
    this.cache = {}
    this.loading = {}
  }

  addLoading(index) {
    this.loading[index] = true
  }

  getLoading(index) {
    return this.loading[index]
  }

  add(index, value) {
    this.cache[index] = value
    delete this.loading[index]
  }

  get(index) {
    return this.cache[index]
  }
}

const Map = ({ sourceUrl, variable, clim, colormapName }) => {
  const colormap = useThemedColormap(colormapName)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [data, setData] = useState([null])
  const [timeRange, setTimeRange] = useState([0, 0])
  const [timeChunkSize, setTimeChunkSize] = useState(12)
  const [nullValue, setNullValue] = useState(9.969209968386869e36)
  const chunkCache = useRef(new ChunkCache())
  const groupRef = useRef(null)
  const timeout = useRef(null)

  const updateData = () => {
    // Always grab the most up-to-date time index from state
    const chunkIndex = Math.floor(time / timeChunkSize)
    const timeIndexWithinChunk = time % timeChunkSize
    const chunk = chunkCache.current.get(chunkIndex)

    // Do not update if chunk is not present due to race condition
    if (!chunk) {
      return
    }

    const chunkData = chunk.pick(timeIndexWithinChunk, null, null)
    setData(chunkData)
  }

  const loadChunk = (getChunk, chunkIndex, shouldUpdateData) => {
    chunkCache.current.addLoading(chunkIndex)
    getChunk([chunkIndex, 0, 0], (err, chunk) => {
      if (err) {
        console.error('Error loading chunk:', err)
        return
      }
      chunkCache.current.add(chunkIndex, chunk)
      if (shouldUpdateData) {
        updateData()
      }
    })
  }

  const handleChunkLoading = (chunkIndex, shouldUpdateData = true) => {
    if (chunkCache.current.get(chunkIndex)) {
      if (shouldUpdateData) {
        updateData()
      }
    } else if (chunkCache.current.getLoading(chunkIndex)) {
      // Do nothing
    } else if (groupRef.current) {
      loadChunk(groupRef.current[variable], chunkIndex, shouldUpdateData)
    }
  }

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

      const nextChunkIndex = chunkIndex + 1
      if (nextChunkIndex * timeChunkSize < timeRange[1]) {
        handleChunkLoading(nextChunkIndex, false)
      }
    }
  }, [time, timeChunkSize, timeRange])

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
            setTime((prev) => {
              let nextValue = prev + 1
              if (nextValue > timeRange[1]) {
                nextValue = timeRange[0]
                shouldContinue = false
                setPlaying(false)
              }
              return nextValue
            })
            if (shouldContinue) {
              incrementTime()
            }
          }, 500)
        }
        incrementTime()
      }
    },
    [timeRange]
  )

  const handleSliderChange = (event) => {
    setTime(parseInt(event.target.value))
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
        <PlayPause playing={playing} setPlaying={handlePlay} />
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
