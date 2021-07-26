import React, { useState } from 'react'
import './Landing.scss';
import { CgEnter } from 'react-icons/cg';

export default function Landing() {
    const [code, setCode] = useState('')
    function addNumber (n) {
        setCode(code + n)
    }
    function deleteNumber () {
        setCode(code.substr(0, code.length-1))
    }
    return (
        <div className="landing">
            <h1>Bem Vindo!</h1>
            <div className="code-holder">
                <input type="text" value={code} onChange={event => setCode(event.target.value)} />
            </div>
            <div className="container-keyboard">
                <div className="d-flex just-center">
                    <button onClick={()=>addNumber('7')} type="button" className="btn btn-key">7</button>
                    <button onClick={()=>addNumber('8')} type="button" className="btn btn-key">8</button>
                    <button onClick={()=>addNumber('9')} type="button" className="btn btn-key">9</button>
                </div>
                <div className="d-flex just-center">
                    <button onClick={()=>addNumber('4')} type="button" className="btn btn-key">4</button>
                    <button onClick={()=>addNumber('5')} type="button" className="btn btn-key">5</button>
                    <button onClick={()=>addNumber('6')} type="button" className="btn btn-key">6</button>
                </div>
                <div className="d-flex just-center">
                    <button onClick={()=>addNumber('1')} type="button" className="btn btn-key">1</button>
                    <button onClick={()=>addNumber('2')} type="button" className="btn btn-key">2</button>
                    <button onClick={()=>addNumber('3')} type="button" className="btn btn-key">3</button>
                </div>
                <div className="d-flex just-center">
                    <button onClick={()=>addNumber('0')} type="button" className="btn btn-key">0</button>
                    <button onClick={()=>deleteNumber()} type="button" className="btn btn-key danger">X</button>
                    <a href={'/bingo/'+code} type="button" className="btn btn-key primary deco-none"><CgEnter/></a>
                </div>
            </div>
            {/* <a href="/bingo"> Entrar</a> */}
        </div>
    )
}
