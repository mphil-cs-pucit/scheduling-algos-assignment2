import React, { Fragment, useEffect, useRef, useState } from 'react'
import { C } from '../../util/Constants';

function SJFTimeline({ timeUnits, readyQ, setReadyQ, setFinalResult, finalResult, unitTime }) {

    const [entries, setEntries] = useState([]);
    const [tick, setTick] = useState(0);

    const [processInExecution, setProcessInExecution] = useState();

    const [atLeastOneProcessExecuted, setAtLeastOneProcessExecuted] = useState(false);

    const [timelineWidth, setTimelineWidth] = useState(0);

    const [processorBusy, setProcessorBusy] = useState(false);

    const [systemHalted, setSystemHalted] = useState(false);

    const readyQRef = useRef(readyQ);
    readyQRef.current = readyQ;
    const finalResultRef = useRef(finalResult);
    finalResultRef.current = finalResult;
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

            let lastIteration = false;

            let rQ = readyQRef.current;

            if (rQ.length) {

                if (!pbRef.current) {
                    let minIndex = 0;
                    rQ.map((qE, idx) => {
                        if (parseInt(qE.bt) < parseInt(rQ[minIndex].bt)) {
                            minIndex = idx;
                        }
                    })
                    let processEntry = rQ[minIndex];
                    console.log({ processEntry })
                    newEntry.extras.marker = true;
                    newEntry.extras.bt = processEntry.bt;
                    newEntry.extras.rt = tickRef.current; //repond time
                    newEntry.label = processEntry.pid;
                    newEntry.time = tickRef.current;
                    setFinalResult(prevFinalResult => {
                        return {
                            ...prevFinalResult, data: prevFinalResult.data.map(item => {
                                if (item.pid === processEntry.pid) {
                                    return { ...item, st: tickRef.current };
                                }
                                else {
                                    return item;
                                }
                            })
                        }
                    })
                    setProcessInExecution(prevPie => newEntry);
                    setProcessorBusy(true)
                    setAtLeastOneProcessExecuted(true);
                    setEntries(prevEntries => [...prevEntries, newEntry])
                    setReadyQ(prevVal => prevVal.filter((item, index) => index != minIndex))
                } else {
                    if (pieRef.current.extras.rt - (-(pieRef.current.extras.bt)) === tickRef.current + 1) {
                        setFinalResult(prevFinalResult => {

                            // console.log({ prevFinalResult });
                            // return prevFinalResult
                            return {
                                ...prevFinalResult, data: prevFinalResult.data.map(item => {
                                    if (item.pid === pieRef.current.label) {
                                        return { ...item, ft: tickRef.current + 1 };
                                    }
                                    else {
                                        return item;
                                    }
                                })
                            }
                        })

                        setProcessorBusy(false);
                    }
                    // console.log({ cP: pieRef.current, ht: pieRef.current.extras.rt - (-(pieRef.current.extras.bt)) })
                    setEntries(prevEntries => [...prevEntries, newEntry])
                }

            }
            else {

                if (tickRef.current === 0) {
                    newEntry.label = "Start",
                        newEntry.extras.marker = true;
                }
                if (!pbRef.current && aopeRef.current) {
                    newEntry.extras.marker = true;
                    newEntry.extras.bt = 0;
                    newEntry.extras.rt = tickRef.current; //repond time
                    newEntry.extras.last = true;
                    newEntry.label = "End";
                    newEntry.time = tickRef.current;

                    clearInterval(intervalHandler)
                    lastIteration = true
                    setSystemHalted(true);
                    setFinalResult({ ...finalResultRef.current, done: true })
                    // console.log({ finalResult: finalResultRef.current });
                }

                if (pieRef.current && pieRef.current.extras.rt - (-(pieRef.current.extras.bt)) === tickRef.current + 1) {
                    setFinalResult(prevFinalResult => {
                        return {
                            ...prevFinalResult, data: prevFinalResult.data.map(item => {
                                if (item.pid === pieRef.current.label) {
                                    return { ...item, ft: tickRef.current + 1 };
                                }
                                else {
                                    return item;
                                }
                            })
                        }
                    })
                    setProcessorBusy(false);
                }

                setEntries(prevEntries => [...prevEntries, newEntry])
            }

            if (!lastIteration)
                setTick(prevTick => prevTick + 1);
        }, unitTime)
        return () => {
            clearInterval(intervalHandler)
        }
    }, [])

    useEffect(() => {
        // console.log(entries)
        setTimelineWidth(prevTimelineWidth => prevTimelineWidth + C.TIMELINE_INC)
    }, [entries])

    return (
        <div style={{
            padding: 10
        }}>
            {/* <span>{JSON.stringify(entries)}</span> */}
            <hr />
            <h5>System Tick: {tick}</h5>
            <h5>Processor State: {systemHalted ? "Halted" : processorBusy ? 'Executing ' + processInExecution.label + "  (" + processInExecution.extras.bt + "/" + processInExecution.extras.rt + ")" : 'IDLE'}</h5>
            <hr />
            <h3>Timeline</h3>
            <div style={{ display: 'flex' }}>
                {/* {
                    entries.map((entry, index) => {
                        return 
                    })
                } */}
                <div style={{ position: 'relative', minHeight: 150, overflowY: 'auto', padding: '0 20px' }}>
                    <div style={{
                        width: timelineWidth,
                        height: 40,
                        borderBottom: '5px solid black',
                    }}
                    >
                    </div>
                    <div style={{ display: 'flex' }}>
                        {entries.map((e, index) => {
                            if (e.extras.marker)
                                return <Fragment key={index}>
                                    {e.extras.last && <div key={index + "-side"} style={{ width: C.TIMELINE_INC }}></div>}
                                    <div key={index} style={{ position: 'relative' }}>
                                        <div style={{ borderLeft: '2px solid black', marginTop: -30, top: 15, height: 50, }}></div>
                                        <div style={{ position: 'absolute', left: -10, fontSize: 11, fontWeight: 'bold' }}>{e.label} {e.time && "(" + e.time + ")"}</div>
                                    </div>
                                    {!e.extras.last && <div key={index + "-side"} style={{ width: C.TIMELINE_INC }}></div>}
                                </Fragment>
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

export default SJFTimeline