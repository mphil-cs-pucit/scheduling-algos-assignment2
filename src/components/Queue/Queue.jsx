import React, { useEffect, useRef, useState } from 'react'
import QueueNode from './QueueNode';
import { C } from '../../util/Constants';

function Queue({ queue, processDB, algo, tq, ppt, promoteParams }) {

    const [queueState, setQueueState] = useState([]);
    const lastQState = useRef(queueState);
    const promoteParamsRef = useRef(promoteParams);
    promoteParamsRef.current = promoteParams;
    // lastQState.current = queueState

    useEffect(() => {

        // console.log(lastQState, queueState)
        let newEntries = queue.filter(item => {
            if (queueState.some(innerItem => innerItem.id === item)) {
                return false;
            }
            else {
                return true;
            }
        });
        // setQueueState();
        // console.log({ newEntries })
        if (newEntries.length) {
            let newList = newEntries.map(item => {
                let [newItem] = processDB.filter(i => i.id === item);
                // console.log({ item, processDB, newItem })
                let [alreadyInState] = queueState.filter(item => item.id === item);
                if (alreadyInState) {
                    return alreadyInState;
                }
                if (newItem) {
                    if (promoteParams) {
                        newItem.delay = ppt;
                        // newItem.startAt = new Date();
                        newItem.promotionInterval = setTimeout(() => {
                            //promote the process

                            // console.log("Promoting: ", newItem)
                            let { from, to } = promoteParamsRef.current
                            let fromNewList = from.get.filter(e => {
                                // console.log({ e, newItem }, e.id, newItem.id)
                                return e !== newItem.id;
                            });
                            from.set(fromNewList);
                            to.set([...to.get, newItem.id]);

                        }, ppt * C.UNIT_TIME)
                        // console.log({ promoteParams, newItem })
                    }
                    return newItem;
                    // queueState.
                    // if (ppt) {
                    //     setTimeout(() => {
                    //         if(qu)
                    //      }, ppt * C.UNIT_TIME)
                    // }
                }
            })

            setQueueState(prev => [...prev, ...newList])
        }
        else {
            let remainingEntries = queue.filter(item => {
                if (queueState.some(innerItem => innerItem.id === item)) {
                    return true;
                }
                else {
                    return false;
                }
            });
            // console.log({ remainingEntries })
            setQueueState(prev => prev.filter(item => remainingEntries.includes(item.id)))
        }

    }, [queue])

    useEffect(() => {
        // console.log({ queueState });
    }, [queueState])

    return (
        <div style={{
            display: 'flex',
            gap: 20,
            margin: 10,
            padding: '10px 25px',
            boxShadow: '1px 2px 13px -4px #777',
            alignItems: 'center',
            position: 'relative'
        }}>
            <div>
                <h4>Queue: </h4>
                <div style={{
                    fontSize: 10,
                    fontWeight: 'bold',
                    position: 'absolute',
                    top: -5,
                    left: 8,
                    border: '1px solid #eee',
                    background: 'white',
                    padding: '1px 12px',
                    display: 'flex'
                }}>(
                    {
                        algo
                    }
                    )
                    {
                        algo === "RR" && <div>TQ: {tq}</div>
                    }
                </div>
            </div>
            <div style={{ display: 'flex', gap: 1 }}>
                {
                    queueState.map(queueItem => {
                        return <QueueNode key={queueItem.id} nodeData={queueItem} />
                    })
                }
                {queueState.length === 0 && <div style={{
                    border: '1px solid black',
                    fontWeight: 'bold',
                    padding: '1px 5px',
                    fontSize: 14,
                    height: 32.33,
                    borderRight: 'none',
                    borderRadius: 0,
                    paddingRight: 17,
                    background: '#fff'
                }}>EMPTY</div>}
            </div>
        </div>
    )
}

export default Queue