import React from 'react'
import { Minimap, Path, Sphere, Raster } from '@carbonplan/minimaps'
import { naturalEarth1 } from '@carbonplan/minimaps/projections'
import { datasets } from '../datasets'
import { useThemedColormap } from '@carbonplan/colormaps'

const Map = () => {
  const colormap = useThemedColormap('fire')

  return (
    <Minimap projection={naturalEarth1} scale={1} translate={[0, 0]}>
      <Path
        stroke={'black'}
        source={datasets['land-110m.json']}
        feature={'land'}
      />
      <Sphere stroke={'black'} fill={'#00000000'} strokeWidth={1} />
      {/* <Raster
        source={
          'https://carbonplan-data-viewer.s3.us-west-2.amazonaws.com/demo/leap-data-stories/GCB-2023_dataprod_LDEO-HPD_1959-2022.zarr'
        }
        variable={'sfco2'}
        colormap={colormap}
        clim={[0, 2]}
        mode={'lut'}
      /> */}
    </Minimap>
  )
}

export default Map

//ncview for zarr example
