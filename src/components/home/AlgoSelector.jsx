import React from 'react'

function AlgoSelector({ algo, setAlgo }) {
    return (
        <div style={{ textAlign: 'left' }}>

            <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <h5>Selected Algo: </h5>
                {algo == 0 && <h6>No algo selected.</h6>}
                {/* {algo == 1 && <h6>First Come First Served.</h6>}
                {algo == 2 && <h6>Shortest Job First.</h6>} */}
                {algo == 3 && <h6>Round Robin.</h6>}
            </div>

            <select onChange={(e) => {
                console.log(e.target.value)
                setAlgo(e.target.value)
            }}
                value={algo}
                className='form-control'
            >
                <option value={0}> -- Select --</option>
                {/* <option value={1}>FCFS - First Come First Served</option>
                <option value={2}>SJF - Short Job First</option> */}
                <option value={3}>RR - Round Robin</option>
                <option value={4}>MLFQ - Multi Level Feedback Queue</option>
            </select>

        </div>
    )
}

export default AlgoSelector