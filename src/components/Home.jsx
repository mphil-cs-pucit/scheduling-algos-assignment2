import React, { useEffect, useState } from 'react'
import DataReader from './home/DataReader';
import AlgoSelector from './home/AlgoSelector';
import Simulation from './home/Simulation';
import Properties from './home/Properties';
import { C } from '../util/Constants';

function Home() {
    const [processData, setProcessData] = useState([

        {
            "pid": "P1",
            "at": "2",
            "bt": "8"
        },
        {
            "pid": "P2",
            "at": "6",
            "bt": "3"
        },
        {
            "pid": "P3",
            "at": "7",
            "bt": "9"
        },
        {
            "pid": "P4",
            "at": "9",
            "bt": "4"
        },
        {
            "pid": "P5",
            "at": "13",
            "bt": "5"
        }

    ]);

    const [dataChangeCounter, setDataChangeCounter] = useState(0);

    const [algo, setAlgo] = useState(1);

    const [settingsOpened, setSettingsOpened] = useState(true);

    const [runningSimulation, setRunningSimulation] = useState(false);

    const [unitTime, setUnitTime] = useState(C.UNIT_TIME);

    useEffect(() => {
        if (dataChangeCounter > 0) {
            console.log("changed")
        }
        setDataChangeCounter(prevVal => prevVal + 1);
    }, [processData])

    useEffect(() => {
        console.log(processData)
    }, [processData])

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            width: '100vw',
            alignItems: 'center',
            justifyContent: 'center',
        }}>

            <button style={{
                margin: '0 10px'
            }} className='btn btn-secondary btn-sm' onClick={() => { setSettingsOpened(true) }}>Open Settings</button>
            {settingsOpened &&
                <div style={{
                    height: '100vh',
                    width: '100vw',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    background: '#eee',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 99
                }}>
                    <Properties
                        processData={processData}
                        setProcessData={setProcessData}
                        dataChangeCounter={dataChangeCounter}
                        algo={algo}
                        setAlgo={setAlgo}
                        setSettingsOpened={setSettingsOpened}
                        setCloseAndRun={() => {
                            setSettingsOpened(false);
                            setRunningSimulation(true);
                        }}
                        unitTime={unitTime}
                        setUnitTime={setUnitTime}
                    />
                </div>
            }

            <div style={{ margin: '10px 0', paddingRight: 30 }}>
                <button
                    onClick={() => {
                        setRunningSimulation(true);
                    }}
                    disabled={
                        !processData?.data?.length || algo == 0
                    }
                    className='btn btn-primary btn-sm'
                >Start</button>
            </div>

            {runningSimulation &&
                <Simulation setRunningSimulation={setRunningSimulation} processData={processData} algo={algo} unitTime={unitTime} />
            }
        </div>
    )
}

export default Home