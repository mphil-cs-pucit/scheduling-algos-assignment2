import React, { Fragment, useEffect, useRef, useState } from 'react'
import { C } from '../../../util/Constants';
import Results from '../../home/Results';
import MLFQResults from '../../home/MLFQResults';

let intervalHandler;

function MFLQTimeline({ queueList, processDB, processor }) {

    const [showResultsButton, setShowResultsButton] = useState(false);
    const [toggleResultShow, setToggleResultShow] = useState(false);
    const [finishCount, setFinishCount] = useState(0);

    const [entries, setEntries] = useState([]);

    const queueListRef = useRef(queueList);
    queueListRef.current = queueList;

    const processDBRef = useRef(processDB);
    processDBRef.current = processDB;

    const processorRef = useRef(processor);
    processorRef.current = processor;

    useEffect(() => {
        console.log({ finishCount }, processDB.get.length)
        if (finishCount !== 0 && finishCount === processDB.get.length) {
            clearInterval(intervalHandler)
            setShowResultsButton(true);
        }
    }, [finishCount])

    useEffect(() => {

        intervalHandler = setInterval(() => {

            let p = processorRef.current;
            let pdb = processDBRef.current;
            let qList = queueListRef.current;

            // console.log(p.get.status)

            // console.log({ p: p.get, qList })

            // console.log(p.get)

            let newEntry = { type: 'blank' };

            if (p.get.status === 0) { //Processor IDLE
                let processToStart;
                let tq;
                let qIndex;
                for (let i = 0; i < qList.length; i++) {
                    console.log(i, " => ", qList[i].queue.get.length)
                    if (qList[i].queue.get.length) {
                        qIndex = i;
                        if (qList[i].type === "rr") tq = qList[i].tq;
                        processToStart = qList[i].dequeue(qList[i].queue.get.map(e => pdb.get.filter(item => item.id === e)[0]))
                        // console.warn("here: ", processToStart.pid, processToStart.id);
                        let filteredList = qList[i].queue.get.filter(item => item != processToStart.id);
                        qList[i].queue.set(prev => prev.filter(item => item != processToStart.id));
                        // console.warn(qList[i].queue.get)

                        break;
                    }
                }

                if (processToStart) {
                    // console.log("Deququed: ", processToStart, qIndex)
                    //set process stats
                    let processLabel = "";
                    let processorGetTime;
                    let started = false;

                    pdb.set(pdb.get.map(e => {
                        if (e.id === processToStart.id) {
                            processLabel = e.pid;
                            processorGetTime = p.get.clk;
                            started = e.stats.length ? true : false;
                            console.log("stats: ", e.stats);
                            return { ...e, stats: [...e.stats, { processorGetTime: p.get.clk }] }
                        }
                        else {
                            return e
                        }
                    }));

                    if (started)
                        newEntry.type = "presume";
                    else
                        newEntry.type = "pstart";

                    newEntry.meta = {
                        processLabel,
                        timestamp: processorGetTime
                    }

                    //set
                    p.set(prev => ({
                        ...prev,
                        status: 1,
                        currentPid: processToStart.id,
                        tq: typeof tq !== "undefined" && tq,
                        tqCurrent: 0,
                        tqMode: typeof tq !== "undefined",
                        clk: p.get.clk + 1,
                        qIndex
                    }))

                }
                else {
                    p.set({
                        ...p.get,
                        // tqCurrent: p.get.tqCurrent + 1,
                        clk: p.get.clk + 1
                    })
                }
            }
            else {
                //first check if the processor life has naturally ended
                let processExecuting = getProcessById(p.get.currentPid);
                // console.log(p.get, processExecuting)
                if (!processExecuting.stats) console.log("mss: ", { here: processExecuting.stats })
                let lastProcessorGetTime = processExecuting?.stats[processExecuting?.stats?.length - 1]?.processorGetTime;
                if (processExecuting.pid === "P3") {
                    console.log(lastProcessorGetTime, processExecuting.rt, " ", lastProcessorGetTime + parseInt(processExecuting.rt), " ", p.get.clk);
                }
                if (processExecuting && lastProcessorGetTime + parseInt(processExecuting.rt) === p.get.clk) {

                    let lastStartTime;
                    let lastEndTime;

                    let newStats = processExecuting.stats.map((item, index) => {
                        if (index === processExecuting.stats.length - 1) {
                            lastStartTime = item.processorGetTime;
                            lastEndTime = p.get.clk;
                            return { ...item, processorLeaveTime: p.get.clk };
                        }
                        else
                            return item
                    });

                    console.log({ processExecuting }, lastStartTime, lastEndTime, processExecuting.rt - (lastEndTime - lastStartTime))

                    setPocessById(p.get.currentPid, {
                        ...processExecuting, rt: processExecuting.rt - (lastEndTime - lastStartTime), stats: newStats
                    })
                    console.warn("Process finished ... ", processExecuting.pid, " at ", p.get.clk)
                    newEntry.type = "pend";
                    newEntry.meta = {
                        processLabel: processExecuting.pid,
                        timestamp: p.get.clk
                    }
                    setFinishCount(prev => prev + 1)
                    // setPocessById(p.get.currentPid, {
                    //     ...processExecuting, stats: processExecuting.stats.map((item, index) => {
                    //         if (index === processExecuting.stats.length - 1) {
                    //             return { ...item, processorLeaveTime: p.get.clk };
                    //         }
                    //         else
                    //             return item
                    //     })
                    // })

                    //set the processor free
                    p.set({
                        ...p.get,
                        status: 0,
                        currentPid: -1,
                        tq: 0,
                        tqCurrent: 0,
                        tqMode: false,
                        qIndex: -1
                    })
                }
                //check if it processor has quantum mode on
                else if (qList[p.get.qIndex].type === "rr") {
                    //can we preempt?
                    if (tqExpired()) {

                        let lastStartTime;
                        let lastEndTime;

                        let newStats = processExecuting.stats.map((item, index) => {
                            if (index === processExecuting.stats.length - 1) {
                                lastStartTime = item.processorGetTime;
                                lastEndTime = p.get.clk;
                                return { ...item, processorLeaveTime: p.get.clk };
                            }
                            else
                                return item
                        });

                        console.log({ processExecuting }, lastStartTime, lastEndTime, processExecuting.rt - (lastEndTime - lastStartTime))

                        setPocessById(p.get.currentPid, {
                            ...processExecuting, rt: processExecuting.rt - (lastEndTime - lastStartTime), stats: newStats
                        })

                        //put it at the end of current queue
                        qList[p.get.qIndex].queue.set([...qList[p.get.qIndex].queue.get, p.get.currentPid]);

                        //set the processor free
                        p.set({
                            ...p.get,
                            status: 0,
                            currentPid: -1,
                            tq: 0,
                            tqCurrent: 0,
                            tqMode: false,
                            qIndex: -1
                        })
                    }
                    else {
                        p.set({
                            ...p.get,
                            tqCurrent: p.get.tqCurrent + 1,
                            clk: p.get.clk + 1
                        })

                    }

                }
                else if (qList[p.get.qIndex].type === "srtf") {
                    let result = qList[p.get.qIndex].preempt(qList.map(item => item.queue.get), qList[p.get.qIndex].queue.get, myIndex);
                    if (result.status) {
                        setPocessById(p.get.currentPid, {
                            ...processExecuting, stats: processExecuting?.stats?.map((item, index) => {
                                if (index === processExecuting?.stats?.length - 1) {
                                    return { ...item, processorLeaveTime: p.get.clk };
                                }
                                else
                                    return item
                            })
                        })

                        //put it at the end of current queue
                        qList[p.get.qIndex].queue.set([...qList[p.get.qIndex].queue.get, p.get.currentPid]);

                        //set the processor free
                        p.set({
                            ...p.get,
                            status: 0,
                            currentPid: -1,
                            tq: 0,
                            tqCurrent: 0,
                            tqMode: false,
                            qIndex: -1
                        })
                    }
                    else {
                        p.set({
                            ...p.get,
                            // tqCurrent: p.get.tqCurrent + 1,
                            clk: p.get.clk + 1
                        })

                    }
                }
                else {
                    //set the processor free
                    p.set({
                        ...p.get,
                        clk: p.get.clk + 1
                    })
                }
            }

            setEntries(prev => [...prev, newEntry])

        }, 1 * C.UNIT_TIME);

        return () => {
            clearInterval(intervalHandler);
        }
    }, [])

    const stopSimulation = () => {
        clearInterval(intervalHandler);
        setShowResultsButton(true);
    }

    const showResult = () => {
        setToggleResultShow(true);
    }

    const myIndex = () => {
        let p = processorRef.current;
        let qList = queueListRef.current;
        for (let i = 0; i < qList[p.qIndex].queue.get.length; i++) {
            if (qList[p.qIndex].queue.get[i] === p.currentPid)
                return i;
        }
        return 0
    }

    const tqExpired = () => {
        let p = processorRef.current;
        // console.log({ p })
        if (p.get.tqCurrent === p.get.tq - 1) {
            return true
        }
        else {
            return false;
        }
    }

    const setPocessById = (id, processRec) => {
        let pdb = processDBRef.current;
        pdb.set(pdb.get.map(item => item.id === id ? processRec : item));
    }

    const getProcessById = (id) => {
        let pdb = processDBRef.current;
        return pdb.get.filter(item => item.id === id)[0]
    }

    const getCurrentProcess = () => {
        let processItem = processDB.get.filter(item => processor.get.currentPid === item.id);
        // console.log({ processItem })
        if (processItem.length) {
            return {
                label: processItem[0].pid
            }
        }
        else {
            return {
                label: "None"
            }
        }
    }

    const getCurrentProcessFull = () => {
        let processItem = processDB.get.filter(item => processor.get.currentPid === item.id);
        // console.log({ processItem })
        return processItem
    }

    return (
        <div style={{
            padding: 10
        }}>

            <div style={{ display: 'flex', margin: '45px 20px', marginBottom: 80 }}>
                {
                    entries.map(entry => {

                        if (entry.type === "blank") {
                            return <div style={{ width: 5, background: 'black', height: 2 }}></div>
                        }
                        else if (entry.type === "pstart") {
                            return <div style={{ position: 'relative', width: 2 }}>
                                <div style={{
                                    height: 39,
                                    width: 3,
                                    background: '#4CAF50',
                                    position: 'absolute',
                                    top: -27
                                }}></div>
                                <div
                                    style={{
                                        fontSize: 9,
                                        position: 'absolute',
                                        top: -40,
                                        left: -4,
                                    }}>{entry.meta.processLabel}</div>
                                <div
                                    style={{
                                        fontSize: 9,
                                        position: 'absolute',
                                        top: -50,
                                        left: -4,
                                    }}>({entry.meta.timestamp})</div>
                            </div>
                        }
                        else if (entry.type === "presume") {
                            return <div style={{ position: 'relative', width: 2 }}>
                                <div style={{
                                    height: 13,
                                    width: 3,
                                    background: 'black',
                                    position: 'absolute',
                                    top: -6
                                }}></div>
                                <div
                                    style={{
                                        fontSize: 9,
                                        position: 'absolute',
                                        top: -20,
                                        left: -4,
                                    }}>{entry.meta.processLabel}</div>
                                <div
                                    style={{
                                        fontSize: 9,
                                        position: 'absolute',
                                        top: -32,
                                        left: -4,
                                    }}>({entry.meta.timestamp})</div>

                            </div>
                        }
                        else if (entry.type === "pend") {
                            return <div style={{ position: 'relative', width: 2 }}>
                                <div style={{
                                    height: 60,
                                    width: 3,
                                    background: '#F44336',
                                    position: 'absolute',
                                    top: -8
                                }}></div>
                                <div
                                    style={{
                                        fontSize: 9,
                                        position: 'absolute',
                                        top: 51,
                                        left: -4,
                                    }}
                                >{entry.meta.processLabel}</div>
                                <div
                                    style={{
                                        fontSize: 9,
                                        position: 'absolute',
                                        top: 65,
                                        left: -4,
                                    }}>({entry.meta.timestamp})</div>

                            </div>
                        }
                    })
                }
            </div>

            {/* <span>{JSON.stringify(entries)}</span> */}
            <button onClick={() => {
                stopSimulation();
                console.log(processDB)
            }}>Stop</button>
            {
                showResultsButton && <button onClick={showResult}>Results</button>
            }

            <hr />
            <h5>System Tick: {processor.get.clk}</h5>
            <h5>TQ: {processor.get.tq}</h5>
            <h5>TQCurrent: {processor.get.tqCurrent}</h5>
            <h5>Current Process: {getCurrentProcess().label}</h5>
            {/* <span>{JSON.stringify(processDB.get.filter(p => p.pid === "P1"))}</span>
            <span>{JSON.stringify(getCurrentProcessFull())}</span> */}
            {
                toggleResultShow && <MLFQResults results={processDB.get} closeHandler={() => { setToggleResultShow(false) }} />
            }
            <hr />

        </div >
    )
}

export default MFLQTimeline