import React from 'react'

function ReadyQNode({ node }) {
  return (
    <div style={{ border: '1px solid black', padding: '0 20px' }}>
      {node.pid}, {node.at}/{node.bt}
    </div>
  )
}

export default ReadyQNode