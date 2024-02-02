import React from 'react'
import { useSidenote } from './references'
import InlineNote from './inline-note'

// copied from https://github.com/carbonplan/layouts/blob/main/src/sidenote.js
const Sidenote = ({ children, url, ...props }) => {
  const { number, color, side, mode } = useSidenote(children, url)

  return (
    <InlineNote
      number={number}
      color={color}
      url={url}
      side={side}
      mode={mode}
      sxReference={{
        '& a': { color: 'inherit', '&:hover': { color: 'inherit' } },
      }}
      {...props}
    >
      {children}
    </InlineNote>
  )
}

export default Sidenote
