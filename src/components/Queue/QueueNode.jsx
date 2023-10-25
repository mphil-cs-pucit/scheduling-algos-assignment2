import React from 'react'

function QueueNode({ nodeData }) {
    return (
        <div style={{ background: '#fff', padding: '5px 15px', fontWeight: 'bold', border: '1px solid' }}>{nodeData.pid + ", " + nodeData.at + "/" + nodeData.rt} {nodeData.startAt && <div> {"TIME: " + parseInt((new Date() - nodeData.startAt) / 100)} </div>}</div>
    )
}

export default QueueNode