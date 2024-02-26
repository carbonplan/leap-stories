import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Minimap, Path, Sphere, Raster } from '@carbonplan/minimaps'
import { naturalEarth1 } from '@carbonplan/minimaps/projections'
import { useThemedColormap } from '@carbonplan/colormaps'
import { Colorbar } from '@carbonplan/components'
import zarr from 'zarr-js'
import { Flex, useThemeUI } from 'theme-ui'

import PlayPause from './play-pause'
import DraggableValue from './draggable-value'

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

const formatMonth = (index, startYear) => {
  const base = new Date(`${startYear}-01-15 00:00:00`)
  let month = base.getMonth()
  let year = base.getFullYear()

  const date = new Date(
    year + Math.floor(index / 12),
    month + (index % 12),
    base.getDate()
  )
  return `${date.toLocaleString('default', {
    month: 'short',
  })} ${date.getFullYear()}`
}

const Map = ({
  sourceUrl,
  variable,
  clim,
  climDisplay,
  colormapName,
  label,
  units,
  startYear,
  delay = 500,
}) => {
  const { theme } = useThemeUI()
  const colormap = useThemedColormap(colormapName)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [data, setData] = useState([null])
  const [timeRange, setTimeRange] = useState([0, 0])
  const [timeChunkSize, setTimeChunkSize] = useState(12)
  const [nullValue, setNullValue] = useState(9.969209968386869e36)
  const chunkCache = useRef(new ChunkCache())
  const loaders = useRef(null)
  const timeout = useRef(null)
  const formatter = useCallback(
    (index) => formatMonth(index, startYear),
    [startYear]
  )

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
    } else if (loaders.current) {
      loadChunk(loaders.current[variable], chunkIndex, shouldUpdateData)
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
          (err, l) => {
            if (err) {
              console.error('Error opening group:', err)
              return
            }
            loaders.current = l

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
    if (loaders.current) {
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
          }, delay)
        }
        incrementTime()
      }
    },
    [timeRange, delay]
  )

  return (
    <PlayPause
      playing={playing}
      setPlaying={handlePlay}
      controls={
        <DraggableValue
          value={time}
          range={timeRange}
          setValue={setTime}
          formatter={formatter}
          sx={{ fontSize: 2 }}
        />
      }
    >
      <Minimap projection={naturalEarth1} scale={1} translate={[0, 0]}>
        <Path
          stroke={theme.colors.primary}
          source={'https://cdn.jsdelivr.net/npm/world-atlas@2/land-50m.json'}
          feature={'land'}
          opacity={0.3}
          fill={theme.colors.muted}
        />
        <Sphere
          stroke={theme.colors.primary}
          fill={theme.colors.background}
          strokeWidth={1}
        />
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
      <Flex sx={{ justifyContent: 'flex-end', mt: 1 }}>
        <Colorbar
          colormap={colormap}
          clim={climDisplay ?? clim}
          horizontal
          label={label}
          units={units}
        />
      </Flex>
    </PlayPause>
  )
}

export default Map
