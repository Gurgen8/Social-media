import React from 'react'
import { useState } from 'react'

export default function Help() {
  const [open, setOpen] = useState(false)
  return (
    <div className="help">
      <div style={{ display: open ? "none" : "block" }} className="help-section">
        <div> a <progress max={100} value={49} >  </progress></div>
        <div> b<progress max={100} value={50} > </progress></div>
        <div> c <progress max={100} value={40} > </progress></div>
        <div> d <progress max={100} value={45} > </progress></div>
        <button onClick={() => setOpen(!open)}>x</button>
      </div>
    </div>
  )
}
