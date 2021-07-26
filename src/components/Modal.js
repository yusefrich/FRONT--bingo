import React, { useState } from 'react'
import { Redirect } from 'react-router-dom';
import '../Modal.scss';

export default function Modal(props) {
    const [redirect, setRedirect] = useState(false)

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
        <div className={`modal-back ${props.active ? '' : 'd-none'}`}>
            <div className="modal">
                <button onClick={()=>close()} className="close">X</button>
                <h2>{props.title}</h2>
                <h4>{props.description}</h4>
                <div className="d-flex just-center">
                    <button onClick={()=>close()} className="continue">Continuar</button>
                </div>
            </div>
        </div>
    )
}
