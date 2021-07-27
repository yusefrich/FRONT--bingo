import logo from './logo.svg';
import './App.scss';
import './Background.scss';
import Numbers from './components/Numbers'
import { useEffect, useReducer, useState } from 'react';
import api from './services/api'
import {
  useParams
} from "react-router-dom";
import Modal from './components/Modal'

function App() {
  const [stack, setStack] = useState([])
  const [type, setType] = useState(1)/* 1 = kuadra, 2 = kine, 3 = bingo */
  const [bests, setBests] = useState([])
  const [rolled, setRolled] = useState([])
  const [current, setCurrent] = useState(-1)
  const [latests, setLatests] = useState([])
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
  const [modal, setModal] = useState(false)
  const [kuadraWinnerModal, setKuadraWinnerModal] = useState(false)
  const [kinaWinnerModal, setKinaWinnerModal] = useState(false)
  const [bingoWinnerModal, setBingoWinnerModal] = useState(false)
  const [kuadra, setKuadra] = useState(null)
  const [kina, setKina] = useState(null)
  const [bingo, setBingo] = useState(null)

  let { id } = useParams();

  useEffect(() => {
    for (let index = 0; index <= 90; index++) {
      stack.push(index)
    }
    setStack(stack)
    rollBall()
    const interval = setInterval(() => {
      /* rollBall() */
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
    const rolledBall = stackRaw[rolledIndex]

    /* calling endpoint */
    await api.post(`/api/bingos/${id}/run?ball=${rolledBall}&position=${rolledRaw.length + 1}&type=${type}`, {}).then((res)=>{
      console.log('response', res)
      setModal(false)
      setKuadraWinnerModal(false)
      setKinaWinnerModal(false)
      setBingoWinnerModal(false)
      setBests(res.data.data.bests)
      if(res.data.data.kuadra_winner){
        setKuadraWinnerModal(true)
        setKuadra(res.data.data.kuadra_winner)
        setType(2)
      }
      if(res.data.data.kina_winner){
        setKinaWinnerModal(true)
        setKina(res.data.data.kina_winner)
        setType(3)
      }
      if(res.data.data.bingo_winner){
        setBingoWinnerModal(true)
        setBingo(res.data.data.bingo_winner)
      }
    }).catch((error) => {
      console.log('error', error)
      setModal(true)
    })
    /* setting up ball */
    rolledRaw.push(rolledBall)
    setRolled(rolledRaw)
    
    setCurrent(rolledBall)
    latests.unshift(rolledBall)
    if(latests.length > 10){
      latests.pop()
    }
    setLatests(latests)
    stackRaw.splice(rolledIndex, 1);
    setStack(stackRaw)
    
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
              <h1>Efetuando sorteio: {id}</h1>
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
            </div>
          </div>
        </div>
      </div>
      <Modal active={modal} close={()=>setModal(false)} redirect={true} title="Código de bingo inválido" subtitle="O código desse bingo se encontra inválido no momento, por favor tente novamente" />
      <Modal active={kuadraWinnerModal} close={()=>setKuadraWinnerModal(false)} redirect={true} title={`Ganhador da kuadra!!! ${kuadra}`} subtitle={`Parabéns ${kuadra}, vc foi o ganhador`} />
      <Modal active={kinaWinnerModal} close={()=>setKinaWinnerModal(false)} redirect={true} title={`Ganhador da kina!!! ${kina}`} subtitle={`Parabéns ${kina}, vc foi o ganhador`} />
      <Modal active={bingoWinnerModal} close={()=>setBingoWinnerModal(false)} redirect={true} title={`BINGO!!!! ${bingo}`} subtitle={`Parabéns ${bingo}, vc foi o ganhador`} />
    </div>
  );
}

export default App;
