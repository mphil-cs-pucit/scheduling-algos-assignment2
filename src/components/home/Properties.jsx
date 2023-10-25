import React, { useEffect } from 'react'
import DataReader from './DataReader'
import AlgoSelector from './AlgoSelector'
import UnitTime from './UnitTime'
import RRDataReader from './RRDataReader'
import MFLQDataReader from './MFLQDataReader'

function Properties({
    processData,
    setProcessData,
    dataChangeCounter,
    algo,
    setAlgo,
    setSettingsOpened,
    unitTime,
    setUnitTime,
    setCloseAndRun
}) {

    useEffect(() => {
        if (algo == 3) {
            setProcessData({
                tq: 3, data:
                    [
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

                    ]
            })
        }

        if (algo == 4) {
            setProcessData(
                [
                    {
                        "pid": "P1",
                        "at": "2",
                        "bt": "15",
                        'priority': 4
                    },
                    {
                        "pid": "P2",
                        "at": "6",
                        "bt": "9",
                        'priority': 3
                    },
                    {
                        "pid": "P3",
                        "at": "7",
                        "bt": "11",
                        'priority': 12
                    },
                    {
                        "pid": "P4",
                        "at": "14",
                        "bt": "28",
                        'priority': 8
                    },
                    {
                        "pid": "P5",
                        "at": "13",
                        "bt": "19",
                        'priority': 4
                    },

                    {
                        "pid": "P6",
                        "at": "21",
                        "bt": "16",
                        'priority': 21
                    },

                    {
                        "pid": "P7",
                        "at": "40",
                        "bt": "22",
                        'priority': 25
                    }

                ]
            )
        }
    }, [algo])

    return (
        <div style={{ display: 'flex', maxWidth: 400, flexDirection: 'column', background: '#fff', justifyContent: 'space-between', width: '100vw', padding: "20px 25px" }}>
            <div style={{ padding: '20px 0px' }}>
                <div className='settings-block'>
                    <AlgoSelector
                        algo={algo}
                        setAlgo={setAlgo}
                    />
                </div>
                <div style={{ pointerEvents: algo == 0 && "none", borderColor: algo == 0 && "red" }} className='settings-block'>
                    {
                        algo == 3 && <RRDataReader
                            processData={processData}
                            setProcessData={setProcessData}
                            dataChangeCounter={dataChangeCounter}
                        />
                    }

                    {
                        algo == 4 && <MFLQDataReader
                            processData={processData}
                            setProcessData={setProcessData}
                            dataChangeCounter={dataChangeCounter}
                        />
                    }
                    {
                        algo == 0 && <DataReader
                            processData={processData}
                            setProcessData={setProcessData}
                            dataChangeCounter={dataChangeCounter}
                        />

                    }
                </div>
                <div className='settings-block'>
                    <UnitTime unitTime={unitTime} setUnitTime={setUnitTime} />
                </div>
            </div>

            <button
                className='btn btn-primary'
                style={{ marginBottom: 10 }}
                disabled={
                    algo == 0 ||
                    algo == 3 && !processData?.data?.length ||
                    algo == 4 && !processData.length ||
                    unitTime.toString().trim() == ""
                }
                onClick={() => {
                    setCloseAndRun()
                }}
            >Close & Run</button>

            <button
                className='btn btn-light'
                onClick={() => {
                    setSettingsOpened(false)
                }}
            >Close</button>

        </div>
    )
}

export default Properties