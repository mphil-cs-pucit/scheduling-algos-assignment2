import React, { useRef } from 'react'

function MFLQDataReader({ processData, setProcessData, dataChangeCounter }) {

    const fileElement = useRef();

    const initImport = () => {
        fileElement.current.click();
    }

    const handleUpload = (event) => {
        let file = event.target.files[0];
        let reader = new FileReader();

        reader.onload = (function (theFile) {
            return function (e) {
                console.log(e.target.result);
                let rawData = e.target.result;
                let dataHolder = [];
                let _tq;
                rawData.split("\n").map((e, i) => {

                    if (i !== 0) {
                        let arr = e.trim().split(",")
                        if (i === 1) {
                            _tq = arr[3];
                        }
                        dataHolder.push({
                            pid: arr[0],
                            at: arr[1],
                            bt: arr[2],
                            priority: parseInt(arr[3])
                        });

                    }
                })
                setProcessData(dataHolder)
            };
        })(file);

        reader.readAsText(file);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h5 >Data:  </h5>
                <button style={{ margin: '0 10px' }} onClick={initImport} className='btn btn-primary btn-sm'>Import CSV</button>
                {!(dataChangeCounter > 1) &&
                    <span
                        style={{
                            fontSize: 11,
                            fontWeight: 'normal',
                            border: '0.3px solid',
                            padding: '1px 5px',
                            borderRadius: 11,
                            background: '#E53935',
                            color: 'white'
                        }}>Possibly Sample Data</span>}
                <input type='file' onChange={handleUpload} accept='.csv' ref={fileElement} style={{ display: 'none' }} />
            </div>
            <div style={{ minWidth: 100, padding: 20 }}>
                {
                    processData.length === 0 && <h5>No data given.</h5>
                }
                {
                    processData.map(d => {
                        return (
                            <div key={d.pid} style={{ display: 'flex', justifyContent: 'space-between', lineHeight: 0.5 }}>
                                <p>{d.pid}</p>
                                <p>{d.at}</p>
                                <p>{d.bt}</p>
                                <p>{d.priority}</p>
                            </div>)
                    })
                }
            </div>

        </div>
    )
}

export default MFLQDataReader