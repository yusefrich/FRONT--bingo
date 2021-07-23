import logo from './logo.svg';
import './App.scss';
import './Background.scss';
import Numbers from './components/Numbers'
import { useEffect, useReducer, useState } from 'react';
import api from './services/api'

function App() {
  const [stack, setStack] = useState([])
  const [type, setType] = useState(1)
  const [bests, setBests] = useState([])
  const [rolled, setRolled] = useState([])
  const [current, setCurrent] = useState(-1)
  const [latests, setLatests] = useState([])
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  useEffect(() => {
    for (let index = 0; index <= 90; index++) {
      stack.push(index)
    }
    setStack(stack)

    const interval = setInterval(() => {
      rollBall()
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  async function rollBall () {
    let rolledRaw = rolled ? rolled : []
    let stackRaw = stack ? stack : []

    if(stackRaw.length <= 0){
      return
    }

    const rolledIndex = getRandomInt(0, stackRaw.length)
    /* setting up ball */
    rolledRaw.push(stackRaw[rolledIndex])
    setRolled(rolledRaw)
    
    setCurrent(stackRaw[rolledIndex])
    latests.unshift(stackRaw[rolledIndex])
    if(latests.length > 10){
      latests.pop()
    }
    setLatests(latests)
    stackRaw.splice(rolledIndex, 1);
    setStack(stackRaw)

    /* calling endpoint */
    api.post(`/api/bingos/1/run?ball=${stackRaw[rolledIndex]}&position=${rolledRaw.length + 1}&type=${type}`, {}).then((res)=>{
      console.log('response', res)
      setBests(res.data.data.bests)
    }).catch((error) => {
      console.log('error', error)
    }).finally(()=>{
      forceUpdate();
    })
    forceUpdate();
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  return (
    <div className="App">
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>

      <div className="container">
        <div className="header">
          <div className="h-row">
            <div className="h-col">
              <h1>Efetuando sorteio: 32</h1>
            </div>
            <div className="h-col">
              <h1>Acumulado</h1>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Numbers key={stack.length} stack={stack} rolled={rolled}/>
          </div>
          <div className="col">
            <div className="current-ball">
              <h1 className={`ball b-${current%6}`}>{current}</h1>
            </div>
            <div className="previous">
              {latests.map((val) => (<h2 className={`ball b-${val%6}`}>{val}</h2>))}
              {/* <h2 className="ball b-red">41</h2>
              <h2 className="ball b-cyan">61</h2>
              <h2 className="ball b-green">81</h2>
              <h2 className="ball b-greenyellow">54</h2>
              <h2 className="ball b-goldenrod">43</h2>
              <h2 className="ball b-coral">44</h2>
              <h2 className="ball b-orange">45</h2>
              <h2 className="ball b-red">46</h2>
              <h2 className="ball b-cyan">47</h2> */}
            </div>
          </div>
          <div className="col">
            <h3>Cartelas</h3>
            <div className="cards">
              {bests.map(best=>(
                <div className="card">
                  <h2 className="title">card - 61</h2>
                  <h4> {best.player} - {best.status}</h4>
                  {best.card.map(row => (
                    <div className="d-flex">
                      {row.map(col=>(
                        <h3 className={`number ${col.hit === 1 ? 'active' : ''}`}>{col.number}</h3>
                      ))}
                    </div>
                  ))}
                </div>
              ))}

              {/* <div className="card">
                <h2 className="title">card - 61</h2>
                <div className="d-flex">
                  <h3 className="number">43</h3>
                  <h3 className="number">65</h3>
                  <h3 className="number">76</h3>
                  <h3 className="number">12</h3>
                  <h3 className="number">15</h3>
                </div>
                <div className="d-flex">
                  <h3 className="number">43</h3>
                  <h3 className="number">65</h3>
                  <h3 className="number">76</h3>
                  <h3 className="number">12</h3>
                  <h3 className="number">15</h3>
                </div>
                <div className="d-flex">
                  <h3 className="number">43</h3>
                  <h3 className="number">65</h3>
                  <h3 className="number">76</h3>
                  <h3 className="number">12</h3>
                  <h3 className="number">15</h3>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
