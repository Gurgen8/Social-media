import React from 'react'
import { useState } from 'react'

export default function Help() {
    const [open, setOpen] = useState(false)
    
    return (
        <div className="help">
            <div style={{ display: open ? "none" : "block" }} className="help-section">
                <h1>a  <span style={{ fontSize: 15 }}>or</span>  b </h1>
                <button onClick={() => setOpen(!open)}>x</button>
            </div>
        </div>
    )
}
