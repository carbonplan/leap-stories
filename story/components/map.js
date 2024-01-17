import React from 'react'
import { Minimap, Path, Sphere, Raster } from '@carbonplan/minimaps'
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
      <Sphere stroke={'black'} fill={'#00000000'} strokeWidth={1} /> //
      Transparent black hex color
      {/* <Raster source={datasets['blue-marble.png']} /> */}
    </Minimap>
  )
}

export default Test
