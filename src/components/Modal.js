import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom';
import '../Modal.scss';

export default function Modal(props) {
    const [redirect, setRedirect] = useState(false)
    const [openInside, setOpenInside] = useState(true)

    useEffect(() => {
        if(props.out){
            props.setWin()
            setTimeout( function() { setOpenInside(false); }, 5000);
        }
    }, [])

    function close() {
        if(props.redirect){
            setRedirect(true)
        }
        props.close()
    }

    if (redirect) {
        return <Redirect to='/'/>;
    }     
    return (
        <>
            {openInside && 
            <div className={`modal-back ${props.active ? '' : 'd-none'}`}>
                <div className="modal">
                    <button onClick={()=>close()} className="close">X</button>
                    <h2>{props.title}</h2>
                    <h4>{props.description}</h4>
                    {props.winner && 
                    <div className="card">
                        <h4> {props.winner.player}</h4>
                        {props.winner.card.map(row => (
                            <div className="d-flex justify-between">
                            {row.map(col=>(
                                <h3 className={`number ${col.hit === 1 ? 'active' : ''}`}>{col.number}</h3>
                            ))}
                            </div>
                        ))}
                    </div>}
                    <div className="d-flex just-center">
                        <button onClick={()=>close()} className="continue">Continuar</button>
                    </div>
                </div>
            </div>}
        </>
    )
}
