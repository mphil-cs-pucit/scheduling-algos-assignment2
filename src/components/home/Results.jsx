import React, { useState } from 'react'
import html2canvas from 'html2canvas'

function Results({ results, extras, closeHandler }) {

    const [toggleDropDown, setToggleDropDown] = useState(false);

    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                position: 'fixed',
                top: 0,
                left: 0,
                background: '#eee',
                zIndex: 9,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <div
                id="results-container"
                style={{
                    width: 'clamp(250px, 600px, 60%)'
                }}>
                <div
                    style={{
                        display: 'flex',
                        padding: '10px 20px',
                        justifyContent: 'space-between',
                        background: '#0d6efd',
                        color: 'white',
                        alignItems: 'center'
                    }}
                >
                    <h2>Results</h2>

                    <div style={{ display: 'flex', position: 'relative' }}>
                        <button id="download-btn" className='btn btn-success btn-sm' style={{ marginRight: 10, background: '#66BB6A', color: 'white', fontWeight: 'bolder' }} onClick={() => {
                            console.log({ toggleDropDown })
                            setToggleDropDown(prevVal => !prevVal);
                        }}>Download</button>
                        {
                            toggleDropDown &&
                            <div className='dropdown'>
                                <div
                                    className='dropdown-item'
                                    onClick={() => {
                                        setToggleDropDown(false);
                                        setTimeout(() => {
                                            html2canvas(document.getElementById("results-container")).then(function (canvas) {
                                                document.body.appendChild(canvas);
                                                var link = document.createElement('a');
                                                link.download = 'results.png';
                                                link.href = canvas.toDataURL()
                                                link.click();
                                                canvas.remove()
                                            });
                                        }, 100)
                                    }}
                                >Download Image</div>
                                <hr />
                                <div
                                    className='dropdown-item'
                                    onClick={() => {

                                        setToggleDropDown(false);

                                        const rows = [["PID", "AT", "BT", "ST", "FT", "WT"], ...results.map(r => [r.pid, r.at, r.bt, r.st, r.ft, r.st - r.at])];

                                        let csvContent = "data:text/csv;charset=utf-8,"
                                            + rows.map(e => e.join(",")).join("\n");

                                        var encodedUri = encodeURI(csvContent);
                                        var link = document.createElement("a");
                                        link.setAttribute("href", encodedUri);
                                        link.setAttribute("download", "results.csv");
                                        //document.body.appendChild(link); // Required for FF

                                        link.click();
                                    }}
                                >Download CSV</div>
                            </div>
                        }

                        <button className='btn btn-light btn-sm' onClick={() => {
                            closeHandler()
                        }}>Close</button>
                    </div>
                </div>

                <div style={{ background: 'white', color: 'black', padding: 25 }}>
                    <div style={{ fontSize: 12 }}>
                        <div>
                            <b>PID </b> - Process identifier or label
                        </div>

                        <div>
                            <b>AT </b> - Process arrival time
                        </div>

                        <div>
                            <b>BT </b> - Process burst time
                        </div>

                        <div>
                            <b>ST </b> - Process start time (when the execution of the process starts)
                        </div>

                        <div>
                            <b>FT </b> - Process finish time
                        </div>

                        <div>
                            <b>WT </b> - Process wait time
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '40px', alignItems: 'center', border: '1px solid' }}>
                            <b>PID</b>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '40px', alignItems: 'center', border: '1px solid' }}>
                            <b>AT</b>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', width: '40px', alignItems: 'center', border: '1px solid' }}>
                            <b>BT</b>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', width: '40px', alignItems: 'center', border: '1px solid' }}>
                            <b>ST</b>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', width: '40px', alignItems: 'center', border: '1px solid' }}>
                            <b>FT</b>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', width: '40px', alignItems: 'center', border: '1px solid' }}>
                            <b>WT</b>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '40px', alignItems: 'center', border: '1px solid' }}>
                            {
                                results.map(ri => {
                                    return (
                                        <div key={ri.pid} style={{}}>
                                            <div>{ri.pid}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '40px', alignItems: 'center', border: '1px solid' }}>
                            {
                                results.map(ri => {
                                    return (
                                        <div key={ri.pid} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div>{ri.at}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', width: '40px', alignItems: 'center', border: '1px solid' }}>
                            {
                                results.map(ri => {
                                    return (
                                        <div key={ri.pid} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div>{ri.bt}</div>
                                        </div>
                                    )
                                })
                            }

                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', width: '40px', alignItems: 'center', border: '1px solid' }}>
                            {
                                results.map(ri => {
                                    return (
                                        <div key={ri.pid} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div>{ri.st}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', width: '40px', alignItems: 'center', border: '1px solid' }}>
                            {
                                results.map(ri => {
                                    return (
                                        <div key={ri.pid} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div>{ri.ft}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', width: '40px', alignItems: 'center', border: '1px solid' }}>
                            {
                                results.map(ri => {
                                    return (
                                        <div key={ri.pid} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div>{ri.st - ri.at}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Results