import React, { Fragment, useEffect, useRef, useState } from 'react'
import { C } from '../../../util/Constants';
import RRResults from '../../home/RRResults';

let intervalHandler;

function RRTimeline({ timeUnits, readyQ, setReadyQ, setFinalResult, finalResult, unitTime, tq, pcount }) {


    const [showResultsButton, setShowResultsButton] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const [entries, setEntries] = useState([]);

    const [tick, setTick] = useState(0);

    const [tqTick, setTqTick] = useState(0);

    const [processInExecution, setProcessInExecution] = useState();

    const [atLeastOneProcessExecuted, setAtLeastOneProcessExecuted] = useState(false);

    const [timelineWidth, setTimelineWidth] = useState(0);

    const [processorBusy, setProcessorBusy] = useState(false);

    const [systemHalted, setSystemHalted] = useState(false);

    const [finishCounter, setFinishCounter] = useState(0);

    const readyQRef = useRef(readyQ);
    readyQRef.current = readyQ;
    const finalResultRef = useRef(finalResult);
    finalResultRef.current = finalResult;

    const tickRef = useRef(tick);
    tickRef.current = tick;

    const tqTickRef = useRef(tqTick);
    tqTickRef.current = tqTick;

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
        console.log({ finishCounter }, pcount)
        if (finishCounter == pcount) {
            clearInterval(intervalHandler)
            setShowResultsButton(true);
            setProcessorBusy(false);
            setShowResultsButton(true)
        }
    }, [finishCounter])

    useEffect(() => {
        intervalHandler = setInterval(() => {
            let newEntry = {
                time: tick,
                label: "",
                extras: { marker: false }
            };

            // let lastIteration = false;

            let rQ = readyQRef.current;
            let incQuantum = true;
            let incCounter = true;

            // if (rQ.length) {

            //     if (!pbRef.current) {
            //         let minIndex = 0;
            //         //for SJF
            //         // rQ.map((qE, idx) => {
            //         //     if (parseInt(qE.bt) < parseInt(rQ[minIndex].bt)) {
            //         //         minIndex = idx;
            //         //     }
            //         // })
            //         let processEntry = rQ[minIndex];
            //         console.log({ processEntry })
            //         newEntry.extras.marker = true;
            //         newEntry.extras.bt = processEntry.bt;
            //         newEntry.extras.rt = tickRef.current; //repond time
            //         newEntry.label = processEntry.pid;
            //         newEntry.time = tickRef.current;
            //         setFinalResult(prevFinalResult => {
            //             return {
            //                 ...prevFinalResult, data: prevFinalResult.data.map(item => {
            //                     if (item.pid === processEntry.pid) {
            //                         return { ...item, st: tickRef.current };
            //                     }
            //                     else {
            //                         return item;
            //                     }
            //                 })
            //             }
            //         })
            //         setProcessInExecution(prevPie => newEntry);
            //         setProcessorBusy(true)
            //         setAtLeastOneProcessExecuted(true);
            //         setEntries(prevEntries => [...prevEntries, newEntry])
            //         setReadyQ(prevVal => prevVal.filter((item, index) => index != minIndex))
            //     } else {
            //         if (pieRef.current.extras.rt - (-(pieRef.current.extras.bt)) === tickRef.current + 1) {
            //             setFinalResult(prevFinalResult => {

            //                 // console.log({ prevFinalResult });
            //                 // return prevFinalResult
            //                 return {
            //                     ...prevFinalResult, data: prevFinalResult.data.map(item => {
            //                         if (item.pid === pieRef.current.label) {
            //                             return { ...item, ft: tickRef.current + 1 };
            //                         }
            //                         else {
            //                             return item;
            //                         }
            //                     })
            //                 }
            //             })

            //             setProcessorBusy(false);
            //         }
            //         else {
            //             if (tqTickRef.current === tq) {
            //                 //quantum has expired
            //                 let minIndex = 0;
            //                 let processEntry = rQ[minIndex];
            //                 console.log({ processEntry })
            //                 newEntry.extras.marker = true;
            //                 newEntry.extras.bt = processEntry.bt;
            //                 newEntry.extras.rt = tickRef.current; //repond time
            //                 newEntry.label = processEntry.pid;
            //                 newEntry.time = tickRef.current;

            //             }
            //         }
            //         // console.log({ cP: pieRef.current, ht: pieRef.current.extras.rt - (-(pieRef.current.extras.bt)) })
            //         setEntries(prevEntries => [...prevEntries, newEntry])
            //     }

            // }
            // else {

            //     if (tickRef.current === 0) {
            //         newEntry.label = "Start",
            //             newEntry.extras.marker = true;
            //     }
            //     if (!pbRef.current && aopeRef.current) {
            //         newEntry.extras.marker = true;
            //         newEntry.extras.bt = 0;
            //         newEntry.extras.rt = tickRef.current; //repond time
            //         newEntry.extras.last = true;
            //         newEntry.label = "End";
            //         newEntry.time = tickRef.current;

            //         clearInterval(intervalHandler)
            //         lastIteration = true
            //         setSystemHalted(true);
            //         setFinalResult({ ...finalResultRef.current, done: true })
            //         // console.log({ finalResult: finalResultRef.current });
            //     }

            //     if (pieRef.current && pieRef.current.extras.rt - (-(pieRef.current.extras.bt)) === tickRef.current + 1) {
            //         setFinalResult(prevFinalResult => {
            //             return {
            //                 ...prevFinalResult, data: prevFinalResult.data.map(item => {
            //                     if (item.pid === pieRef.current.label) {
            //                         return { ...item, ft: tickRef.current + 1 };
            //                     }
            //                     else {
            //                         return item;
            //                     }
            //                 })
            //             }
            //         })
            //         setProcessorBusy(false);
            //     }

            //     setEntries(prevEntries => [...prevEntries, newEntry])
            // }


            if (tqTickRef.current === 0) {

                incQuantum = false;

                if (rQ.length) {
                    console.log({ rQ })
                    let processEntry = rQ[0];
                    setFinalResult(prevFinalResult => {
                        return {
                            ...prevFinalResult, data: prevFinalResult.data.map(item => {
                                console.log(item, pieRef.current)
                                if (!item.st && item.pid == processEntry.pid) {
                                    return { ...item, st: tickRef.current };
                                }
                                else {
                                    return item;
                                }
                            })
                        }
                    })

                    newEntry.extras.marker = true;
                    newEntry.extras.bt = processEntry.bt;
                    newEntry.extras.rt = tickRef.current; //repond time
                    newEntry.label = processEntry.pid;
                    newEntry.time = tickRef.current;
                    if (pieRef.current) {
                        // console.log("here: ", pieRef.current.label, "  ", { rt: pieRef.current.extras.rt, bt: pieRef.current.extras.bt, add: pieRef.current.extras.rt - (-(pieRef.current.extras.bt)), tick: tickRef.current })
                        if (pieRef.current.extras.rt - (-(pieRef.current.extras.bt)) === tickRef.current) {
                            // incQuantum = false
                            // incCounter = false;
                            let endProcessMarker = {
                                time: tick,
                                label: "",
                                extras: { marker: false }
                            };

                            endProcessMarker.extras.marker = true;
                            endProcessMarker.extras.bt = pieRef.current.extras.bt;
                            endProcessMarker.extras.rt = tickRef.current; //repond time
                            endProcessMarker.label = pieRef.current.label;
                            endProcessMarker.time = tickRef.current;

                            endProcessMarker.extras.markerType = "end-process";
                            setFinishCounter(prev => prev + 1);
                            setFinalResult(prevFinalResult => {
                                return {
                                    ...prevFinalResult, data: prevFinalResult.data.map(item => {
                                        console.log(item, pieRef.current)
                                        if (item.pid == pieRef.current.label) {
                                            return { ...item, ft: tickRef.current };
                                        }
                                        else {
                                            return item;
                                        }
                                    })
                                }
                            })

                            setEntries(prevEntries => [...prevEntries, endProcessMarker])
                            setReadyQ(prevVal => prevVal.filter((item, index) => index != 0));
                            // setProcessInExecution(undefined);
                        }
                        else {
                            // incQuantum = false
                            // incCounter = false;
                            setReadyQ(prevVal => [...prevVal.filter((item, index) => index != 0), { pid: pieRef.current.label, at: tickRef.current, bt: pieRef.current.extras.bt - tq }]);
                        }
                    }
                    else {
                        setReadyQ(prevVal => prevVal.filter((item, index) => index != 0));
                    }
                    incQuantum = true;
                    setEntries(prevEntries => [...prevEntries, newEntry])
                    setProcessInExecution(newEntry)
                    setProcessorBusy(true);
                }
                else {
                    if (pieRef.current) {
                        incQuantum = true
                        // incCounter = false;
                        if (pieRef.current.extras.bt - tq > 0) {
                            newEntry.extras.marker = true;
                            newEntry.extras.bt = pieRef.current.extras.bt - tq;
                            newEntry.extras.rt = tickRef.current; //repond time
                            newEntry.label = pieRef.current.label;
                            newEntry.time = tickRef.current;
                            // setReadyQ(prevVal => [...prevVal, { pid: pieRef.current.label, at: tickRef.current, bt: pieRef.current.extras.bt - tq }]);
                            setProcessInExecution(newEntry);
                            setEntries(prevEntries => [...prevEntries, newEntry])
                        }
                        else {
                            newEntry.extras.marker = true;
                            newEntry.extras.markerType = "end-process";
                            newEntry.extras.bt = pieRef.current.extras.bt - tq;
                            newEntry.extras.rt = tickRef.current; //repond time
                            newEntry.label = pieRef.current.label;
                            newEntry.time = tickRef.current;
                            setFinishCounter(prev => prev + 1);
                            setFinalResult(prevFinalResult => {
                                return {
                                    ...prevFinalResult, data: prevFinalResult.data.map(item => {
                                        console.log(item, pieRef.current)
                                        if (item.pid == pieRef.current.label) {
                                            return { ...item, ft: tickRef.current };
                                        }
                                        else {
                                            return item;
                                        }
                                    })
                                }
                            })

                            setEntries(prevEntries => [...prevEntries, newEntry])
                            setProcessInExecution(undefined)
                        }

                    }
                }

                // setTqTick(prevVal => prevVal + 1)

            }
            else {

                if (pieRef.current && pieRef.current.label === "P4")
                    console.log("here: ", pieRef.current.label, "  ", { rt: pieRef.current.extras.rt, bt: pieRef.current.extras.bt, add: pieRef.current.extras.rt - (-(pieRef.current.extras.bt)), tick: tickRef.current })
                if (pieRef.current && pieRef.current.extras.rt - (-(pieRef.current.extras.bt)) === tickRef.current) {
                    setTqTick(0);
                    incQuantum = false;
                    incCounter = false;
                    setProcessorBusy(false);
                    setProcessInExecution(undefined);
                    let endProcessMarker = {
                        time: tick,
                        label: "",
                        extras: { marker: false }
                    };

                    endProcessMarker.extras.marker = true;
                    endProcessMarker.extras.bt = pieRef.current.extras.bt;
                    endProcessMarker.extras.rt = tickRef.current; //repond time
                    endProcessMarker.label = pieRef.current.label;
                    endProcessMarker.time = tickRef.current;
                    setFinishCounter(prev => prev + 1);

                    endProcessMarker.extras.markerType = "end-process";
                    setFinalResult(prevFinalResult => {
                        return {
                            ...prevFinalResult, data: prevFinalResult.data.map(item => {
                                console.log(item, pieRef.current)
                                if (item.pid == pieRef.current.label) {
                                    return { ...item, ft: tickRef.current };
                                }
                                else {
                                    return item;
                                }
                            })
                        }
                    })
                    setEntries(prevEntries => [...prevEntries, endProcessMarker])
                    // newEntry.extras.markerType = "end-process";
                }
                else {
                    incQuantum = true;
                    setEntries(prevEntries => [...prevEntries, newEntry])
                }
            }


            if (incCounter)
                setTick(prevTick => prevTick + 1);
            if (incQuantum) {

                setTqTick(prevVal => {
                    if (prevVal + 1 == tq) {
                        return 0
                    }
                    else {
                        return prevVal + 1;
                    }
                })
            }
        }, unitTime)
        return () => {
            clearInterval(intervalHandler)
        }
    }, [])

    useEffect(() => {
        // console.log(entries)
        setTimelineWidth(prevTimelineWidth => prevTimelineWidth + C.TIMELINE_INC)
    }, [entries])

    const stopSimulation = () => {
        console.log("Stopping ... ", intervalHandler)
        clearInterval(intervalHandler);
        setShowResultsButton(true)
    }

    return (
        <div style={{
            padding: 10
        }}>
            {/* <span>{JSON.stringify(entries)}</span> */}
            {/* <button onClick={stopSimulation}>Stop</button> */}
            {showResultsButton &&
                <button onClick={() => {
                    setShowResults(true);
                }}>Results</button>
            }
            {
                showResults && <RRResults results={finalResult} closeHandler={() => { setShowResults(false) }} />
            }

            <hr />
            <h5>System Tick: {tick}</h5>
            <h5>Quantum: {tqTick}</h5>
            <h5>Processor State: {systemHalted ? "Halted" : processorBusy ? 'Executing ' + processInExecution?.label + "  (" + processInExecution?.extras?.bt + "/" + processInExecution?.extras?.rt + ")" : 'IDLE'}</h5>
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
                        height: 60,
                        borderBottom: '5px solid black',
                    }}
                    >
                    </div>
                    <div style={{ display: 'flex' }}>
                        {entries.map((e, index) => {
                            if (e.extras.marker) {
                                if (e.extras.markerType) {
                                    if (e.extras.markerType == "end-process") {
                                        return <Fragment key={index}>
                                            {/* {e.extras.last && <div key={index + "-side"} style={{ width: C.TIMELINE_INC }}></div>} */}
                                            <div key={index} style={{ position: 'relative' }}>
                                                <div
                                                    style={{
                                                        width: 30,
                                                        height: 3,
                                                        background: '#F44336',
                                                        position: 'absolute',
                                                        top: -60,
                                                        left: -13
                                                    }}
                                                ></div>
                                                <div style={{ borderLeft: '2px solid rgb(244, 67, 54)', marginTop: -122, top: 15, height: 150, }}></div>
                                                <div style={{ position: 'absolute', left: -23, top: -50, fontSize: 11, fontWeight: 'bold', color: 'rgb(244, 67, 54)' }}>{e.label} {e.time && "(" + e.time + ")"}</div>
                                            </div>
                                            {/* {!e.extras.last && <div key={index + "-side"} style={{ width: C.TIMELINE_INC }}></div>} */}
                                        </Fragment>
                                    }
                                }
                                else
                                    return <Fragment key={index}>
                                        {e.extras.last && <div key={index + "-side"} style={{ width: C.TIMELINE_INC }}></div>}
                                        <div key={index} style={{ position: 'relative' }}>
                                            <div style={{ borderLeft: '2px solid black', marginTop: -30, top: 15, height: 50, }}></div>
                                            <div style={{ position: 'absolute', left: -10, fontSize: 11, fontWeight: 'bold' }}>{e.label} {e.time && "(" + e.time + ")"}</div>
                                        </div>
                                        {!e.extras.last && <div key={index + "-side"} style={{ width: C.TIMELINE_INC }}></div>}
                                    </Fragment>
                            }
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

export default RRTimeline