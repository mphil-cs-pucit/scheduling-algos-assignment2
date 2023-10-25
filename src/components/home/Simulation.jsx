import React, { useState } from 'react'
import SJF from '../alogs/SJF'
import FCFS from '../alogs/FCFS'
import Results from './Results';
import RR from '../alogs/RoundRobin/RR';
import MFLQ from '../alogs/MLFQ/MFLQ';

function Simulation({ processData, algo, setRunningSimulation, unitTime }) {
    const [finalResult, setFinalResult] = useState({
        done: false, data: (() => {
            if (algo == 3)
                return JSON.parse(JSON.stringify(processData?.data));
            if (algo == 4)
                return JSON.parse(JSON.stringify(processData))
            else
                return JSON.parse(JSON.stringify(processData))
            // items.splice(0, 0, { pid: 'PID', at: 'AT', bt: 'BT', ft: 'FT', st: 'ST' });
        })()
    });
    const [showResults, setShowResults] = useState(false);
    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                overflowY: 'auto',
                position: 'fixed',
                top: 0,
                left: 0,
                background: '#eee',
                zIndex: 9
            }}>
            <div
                style={{
                    display: 'flex',
                    padding: '10px 20px',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#0d6efd',
                    color: 'white'
                }}
            >
                <h2>Simulation</h2>
                <div>
                    {finalResult.done && <button className='btn btn-success btn-sm' style={{ marginRight: 10, background: '#66BB6A', color: 'white', fontWeight: 'bolder' }} onClick={() => {
                        console.log(finalResult)
                        setShowResults(true);
                    }}>Results</button>}
                    {
                        showResults && <Results results={finalResult.data} closeHandler={() => { setShowResults(false) }} />
                    }
                    <button className='btn btn-light btn-sm' onClick={() => {
                        setRunningSimulation(false)
                    }}>Close</button>
                </div>
            </div>

            {algo == 1 && <FCFS processData={processData} setFinalResult={setFinalResult} finalResult={finalResult} unitTime={unitTime} />}
            {algo == 2 && <SJF processData={processData} setFinalResult={setFinalResult} finalResult={finalResult} unitTime={unitTime} />}
            {algo == 3 && <RR processData={processData} setFinalResult={setFinalResult} finalResult={finalResult} unitTime={unitTime} />}
            {algo == 4 && <MFLQ processData={processData} setFinalResult={setFinalResult} finalResult={finalResult} unitTime={unitTime} />}

        </div>
    )
}

export default Simulation