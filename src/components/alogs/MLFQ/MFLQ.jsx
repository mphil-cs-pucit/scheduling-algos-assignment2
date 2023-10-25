import React, { useEffect, useState } from 'react'
import RRTimeline from './MFLQTimeline';
import ReadyQNode from '../ReadyQNode';
import MFLQTimeline from './MFLQTimeline';
import Queue from '../../Queue/Queue';
import { C } from '../../../util/Constants';

function MFLQ({ processData, setFinalResult, finalResult, unitTime }) {

    const [processDB, setProcessDB] = useState([]);
    const [readyQ1, setReadyQ1] = useState([]);
    const [readyQ2, setReadyQ2] = useState([]);
    const [readyQ3, setReadyQ3] = useState([]);

    const [count, setCount] = useState(0);

    const [processor, setProcessor] = useState({
        status: 0, //0-IDLE, 1-BUSY, -1-Context Switching
        currentPid: -1,
        qIndex: -1,
        tqCurrent: 0,
        tq: 0,
        tqMode: false,
        clk: 0,
    });

    useEffect(() => {
        let _processDB = processData.map((processEntry, index) => {
            let id = "id" + Math.random().toString(16).slice(2)
            let processWithId = { id, st: 0, ft: 0, rt: 0, wt: 0, tat: 0, stats: [], rt: processEntry.bt, ...processEntry };
            return processWithId;
        });
        setProcessDB(_processDB)
    }, [])

    useEffect(() => {
        console.log(count)
        if (count === 1)
            processDB.map(processEntry => {
                setTimeout(() => {
                    // console.log("Inserting: ", processEntry.pid)
                    enqueue(processEntry)
                }, processEntry.at * (C.UNIT_TIME + 10))
            })
        setCount(count => count + 1)
    }, [processDB])
    // const enqueueProcesses = () => {
    // }

    const enqueue = processEntry => {
        console.log("adding ", processEntry.pid)
        if (processEntry.priority >= 1 && processEntry.priority <= 7)
            setReadyQ1(prevReadyQ => [...prevReadyQ, processEntry.id])
        if (processEntry.priority >= 8 && processEntry.priority <= 15)
            setReadyQ2(prevReadyQ => [...prevReadyQ, processEntry.id])
        if (processEntry.priority >= 16 && processEntry.priority <= 30)
            setReadyQ3(prevReadyQ => [...prevReadyQ, processEntry.id])
    }


    return (
        <div>
            <div style={{ background: '#fff', padding: 20, display: 'none' }}>
                <h5>Ready Queue: </h5>
                {/* <div style={{ display: 'flex', minHeight: '25.33px' }}>
                    {readyQ.map(readyQNode => <ReadyQNode key={readyQNode.pid} node={readyQNode} />)}
                    {readyQ.length === 0 && <div style={{
                        border: '1px solid black', fontWeight: 'bold', padding: '1px 5px', fontSize: 14, height: 25.33,
                        borderRight: 'none',
                        borderRadius: 0,
                        paddingRight: 17
                    }}>EMPTY</div>}
                </div> */}
            </div>
            <div>
                <Queue queue={readyQ1} processDB={processDB} algo="RR" tq={5} />
                <Queue queue={readyQ2} processDB={processDB} algo="RR" tq={8} ppt={40} promoteParams={{ str: '2=>1', from: { set: setReadyQ2, get: readyQ2 }, to: { set: setReadyQ1, get: readyQ1 } }} />
                <Queue queue={readyQ3} processDB={processDB} algo="SRTF" ppt={30} promoteParams={{ str: '3=>2', from: { set: setReadyQ3, get: readyQ3 }, to: { set: setReadyQ2, get: readyQ2 } }} />
            </div>
            <MFLQTimeline
                processDB={{ get: processDB, set: setProcessDB }}
                processor={{ get: processor, set: setProcessor }}
                queueList={[
                    {
                        queue: { get: readyQ1, set: setReadyQ1 },
                        type: 'rr',
                        tq: 5,
                        dequeue: (list) => { return list[0]; },
                        preempt: (tqExpired) => { if (tqExpired(5)) return { status: true }; else return { status: false }; }
                    },
                    {
                        queue: { get: readyQ2, set: setReadyQ2 },
                        type: 'rr',
                        tq: 8,
                        dequeue: (list) => { return list[0]; },
                        preempt: (tqExpired) => { if (tqExpired(8)) return { status: true }; else return { status: false }; }
                    },
                    {
                        queue: { get: readyQ3, set: setReadyQ3 },
                        type: 'srtf',
                        dequeue: (list) => {
                            let min = 0;
                            list.map((e, i) => {
                                // console.trace(list, min, list[min])
                                // if (!list[min]) {
                                // }
                                if (list[min].rt < e.rt) {
                                    min = i;
                                }
                            });
                            return list[min];
                        },
                        preempt: (qList, pList, myIndex, myListIndex = 2) => {
                            for (let i = 0; i < myListIndex; i++) {
                                if (qList[i].length !== 0) {
                                    return { status: true, from: 'queue', index: i };
                                }
                            }

                            let shorestOne = 0;
                            for (let i = 0; i < pList.length; i++) {
                                if (pList[i].rt < pList[shorestOne].rt) {
                                    shorestOne = i;
                                }
                            }

                            if (shorestOne !== myIndex()) {
                                return { status: true, from: 'list', index: shorestOne }
                            }

                            return { status: false };
                        }
                    }
                ]}

            />
        </div>
    )
}

export default MFLQ