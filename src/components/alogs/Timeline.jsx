import React, { useEffect, useRef, useState } from 'react'
import { C } from '../../util/Constants';

function Timeline({ timeUnits, readyQ, setReadyQ }) {

    const [entries, setEntries] = useState([{ label: "Start", extras: { marker: true } }]);
    const [tick, setTick] = useState(0);

    const [processInExecution, setProcessInExecution] = useState();

    const [atLeastOneProcessExecuted, setAtLeastOneProcessExecuted] = useState(false);

    const [timelineWidth, setTimelineWidth] = useState(0);

    const [processorBusy, setProcessorBusy] = useState(false);

    const readyQRef = useRef(readyQ);
    readyQRef.current = readyQ;
    const tickRef = useRef(tick);
    tickRef.current = tick;
    const pbRef = useRef(processorBusy);
    pbRef.current = processorBusy;
    const pieRef = useRef(processInExecution);
    pieRef.current = processInExecution;
    const aopeRef = useRef(atLeastOneProcessExecuted);
    aopeRef.current = atLeastOneProcessExecuted;

    // const getUnitsValues = () => {
    //     if (timeUnits == "SECONDS") {
    //         return 1000
    //     }
    //     return 1000;
    // }

    // const setPBusy = (v) => setProcessorBusy(v);

    useEffect(() => {
        let intervalHandler = setInterval(() => {
            let newEntry = {
                time: tick,
                label: "",
                extras: { marker: false }
            };

            let rQ = readyQRef.current;

            if (rQ.length) {

                if (!pbRef.current) {
                    let processEntry = rQ[0];
                    newEntry.extras.marker = true;
                    newEntry.extras.bt = processEntry.bt;
                    newEntry.extras.rt = tickRef.current; //repond time
                    newEntry.label = processEntry.pid;
                    newEntry.time = tickRef.current;
                    setProcessInExecution(prevPie => newEntry);
                    setProcessorBusy(true)
                    setAtLeastOneProcessExecuted(true);
                    setEntries(prevEntries => [...prevEntries, newEntry])
                    setReadyQ(prevVal => prevVal.filter((item, index) => index != 0))
                } else {
                    if (pieRef.current.extras.rt - (-(pieRef.current.extras.bt)) === tickRef.current + 1) {
                        setProcessorBusy(false);
                    }
                    console.log({ cP: pieRef.current, ht: pieRef.current.extras.rt - (-(pieRef.current.extras.bt)) })
                    setEntries(prevEntries => [...prevEntries, newEntry])
                }

            }
            else {

                if (!pbRef.current && aopeRef.current) {
                    newEntry.extras.marker = true;
                    newEntry.extras.bt = 0;
                    newEntry.extras.rt = tickRef.current; //repond time
                    newEntry.label = "End";
                    newEntry.time = tickRef.current;

                    clearInterval(intervalHandler)
                }

                if (pieRef.current && pieRef.current.extras.rt - (-(pieRef.current.extras.bt)) === tickRef.current + 1) {
                    setProcessorBusy(false);
                }
                setEntries(prevEntries => [...prevEntries, newEntry])
            }


            // setReadyQ(prevVal => {
            //     let processEntry = prevVal[0];
            //     console.log("hi this: ", { processEntry }, pbRef)
            //     if (prevVal.length) {
            //         if (!pbRef.current) {
            //             newEntry.extras.marker = true;
            //             newEntry.label = processEntry.pid;
            //             newEntry.time = tick;
            //             // setPBusy(true);
            //             setProcessorBusy(true)
            //             setEntries(prevEntries => [...prevEntries, newEntry])
            //             return prevVal.filter((item, index) => index != 0)
            //         }
            //         else {
            //             console.log("processor busy")
            //             return prevVal
            //         }
            //     }
            //     else {
            //         return prevVal;
            //     }
            // })


            // let processEntry = dequeue();
            // setProcessorBusy(processorBusy => !processorBusy);
            console.log(tickRef)
            // setTime(prevTime => prevTime + 1);
            setTick(prevTick => prevTick + 1);
        }, C.UNIT_TIME)
        return () => {
            clearInterval(intervalHandler)
        }
    }, [])

    useEffect(() => {
        console.log(entries)
        setTimelineWidth(prevTimelineWidth => prevTimelineWidth + C.TIMELINE_INC)
    }, [entries])

    return (
        <div style={{
            padding: 10
        }}>
            {/* <span>{JSON.stringify(entries)}</span> */}
            <hr />
            <h5>System Tick: {tick}</h5>
            <h5>Processor State: {processorBusy ? 'Executing ' + processInExecution.label + "  (" + processInExecution.extras.bt + "/" + processInExecution.extras.rt + ")" : 'IDLE'}</h5>
            <hr />
            <h3>Timeline</h3>
            <div style={{ display: 'flex' }}>
                {/* {
                    entries.map((entry, index) => {
                        return 
                    })
                } */}
                <div style={{ position: 'relative' }}>
                    <div style={{
                        width: timelineWidth,
                        height: 40,
                        borderBottom: '5px solid black',
                    }}
                    >
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {entries.map((e, index) => {
                            if (e.extras.marker)
                                return <>
                                    <div key={index} style={{ position: 'relative' }}>
                                        <div style={{ borderLeft: '2px solid black', marginTop: -30, top: 15, height: 50, }}></div>
                                        <div style={{ position: 'absolute', left: -10, fontSize: 11, fontWeight: 'bold' }}>{e.label} {e.time && "(" + e.time + ")"}</div>
                                    </div>
                                </>
                            else
                                return <div key={index} style={{ width: C.TIMELINE_INC }}></div>
                        }
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Timeline