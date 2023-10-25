import React, { useState } from 'react'

function UnitTime({ unitTime, setUnitTime }) {

    return (
        <div style={{ textAlign: 'left' }}>

            <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <h5>Unit Time: (in milli-seconds)</h5>
            </div>

            <input type='number' className='form-control' value={unitTime} onChange={(e) => {
                setUnitTime(e.target.value);
            }}
                disabled={true}
            />

        </div>
    )
}

export default UnitTime