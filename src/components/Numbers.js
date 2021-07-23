import { useEffect, useReducer, useState } from 'react';

export default function Numbers(props) {
    let n = []
    const numbers = [...props.stack, ...props.rolled];
    for (let index = 0; index < numbers.length; index++) {
        n.push(
            <h3 className={`number ${props.rolled.includes(index) ? 'active' : ''}`}>{index}</h3>
        )
    }

    return (
        <div>
            <h3>Números sorteados</h3>
            <div className="numbers">
                {n}
            </div>
        </div>
    )
}
