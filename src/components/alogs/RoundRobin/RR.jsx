import React, { useEffect, useState } from 'react'
import RRTimeline from './RRTimeline';
import ReadyQNode from '../ReadyQNode';

function RR({ processData, setFinalResult, finalResult, unitTime }) {

    const [readyQ, setReadyQ] = useState([]);

    useEffect(() => {
        processData?.data?.map(processEntry => {
            setTimeout(() => {
                enqueue(processEntry)
            }, processEntry.at * (unitTime + 10))
        })
    }, [])


    const enqueue = processEntry => {
        setReadyQ(prevReadyQ => [...prevReadyQ, processEntry])
    }

    return (
        <div>
            <div style={{ background: '#fff', padding: 20 }}>
                <h5>Ready Queue: </h5>
                <div style={{ display: 'flex', minHeight: '25.33px' }}>
                    {readyQ.map(readyQNode => <ReadyQNode key={readyQNode.pid} node={readyQNode} />)}
                    {readyQ.length === 0 && <div style={{
                        border: '1px solid black', fontWeight: 'bold', padding: '1px 5px', fontSize: 14, height: 25.33,
                        borderRight: 'none',
                        borderRadius: 0,
                        paddingRight: 17
                    }}>EMPTY</div>}
                </div>
            </div>
            <RRTimeline readyQ={readyQ} setReadyQ={setReadyQ} setFinalResult={setFinalResult} finalResult={finalResult} unitTime={unitTime} tq={processData?.tq} pcount={processData?.data?.length} />
        </div>
    )
}

export default RR