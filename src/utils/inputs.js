import React from 'react'

export const generateInput = (label, value, setOnChange, inline = false) => {
    return(
        <div 
            style={{display: inline ? 'inline' : 'block'}}
        >
            <div
                style={{display: inline ? 'inline' : 'block'}}
            >
                <label htmlFor={label}>{label}</label>
            </div>
            
            <input id={label}
                value={value}
                onChange={(event) => setOnChange(event.target.value)} 
            />
        </div>
    )
}