import React from 'react'
import { Minimap, Graticule, Path, Sphere, Raster } from '@carbonplan/minimaps'
import { naturalEarth1 } from '@carbonplan/minimaps/projections'
import { datasets } from '../datasets'

const Test = () => {
  return (
    <Minimap projection={naturalEarth1} scale={1} translate={[0, 0]}>
      <Path
        stroke={'black'}
        source={datasets['land-110m.json']}
        feature={'land'}
      />
    </Minimap>
  )
}

export default Test
