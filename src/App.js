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
  const [modal, setModal] = useState(false)
  const [kuadraWinnerModal, setKuadraWinnerModal] = useState(false)
  const [kinaWinnerModal, setKinaWinnerModal] = useState(false)
  const [bingoWinnerModal, setBingoWinnerModal] = useState(false)
  const [kuadra, setKuadra] = useState(null)
  const [kina, setKina] = useState(null)
  const [bingo, setBingo] = useState(null)
  const [kuadraData, setKuadraData] = useState(null)
  const [kinaData, setKinaData] = useState(null)
  const [bingoData, setBingoData] = useState(null)
  const [fullData, setFullData] = useState(null)
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  let { id } = useParams();

  useEffect(() => {
    for (let index = 0; index <= 90; index++) {
      stack.push(index)
    }
    setStack(stack)
    /* rollBall() */
    const interval = setInterval(() => {
      rollBall()
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  async function rollBall () {
    let rolledRaw = rolled ? rolled : []
    let stackRaw = stack ? stack : []
    
    let kinaRaw = kina ? kina : null
    let kuadraRaw = kuadra ? kuadra : null
    let bingoRaw = bingo ? bingo : null


    let kinaDataRaw = kinaData ? kinaData : null
    let kuadraDataRaw = kuadraData ? kuadraData : null
    let bingoDataRaw = bingoData ? bingoData : null

    if(stackRaw.length <= 0){
      return
    }
    /* setting all modals to false */
    setModal(false)
    setKuadraWinnerModal(false)
    setKinaWinnerModal(false)
    setBingoWinnerModal(false)


    const rolledIndex = getRandomInt(0, stackRaw.length)
    const rolledBall = stackRaw[rolledIndex]
    let result = null
    /* calling endpoint */
    await api.post(`/api/bingos/${id}/run?ball=${rolledBall}&position=${rolledRaw.length + 1}&type=${type}`, {}).then((res)=>{
      console.log('response', res)
      result = res

      /* new bets cards being set */
      setBests(res.data.data.bests)
      setFullData(res.data.data)
  
      if(res.data.data.kuadra_winner){
        /* kuadraRaw = res.data.data.kuadra_winner
        kuadraDataRaw = res.data.data.kuadra */
        setKuadra(res.data.data.kuadra_winner)
        setKuadraData(res.data.data.kuadra)
        /* if(!kuadraRaw){
          setKuadraWinnerModal(true)
          kuadraRaw = res.data.data.kuadra_winner
          setKuadraData(res.data.data.kuadra)
        } */
        setType(2)
      }
      if(res.data.data.kina_winner){
        /* kinaRaw = res.data.data.kina_winner
        kinaDataRaw = res.data.data.kina */
        setKina(res.data.data.kina_winner)
        setKinaData(res.data.data.kina)
        /* if(!kinaRaw){
          setKinaWinnerModal(true)
          kinaRaw = res.data.data.kina_winner
          setKinaData(res.data.data.kina)
        } */
        setType(3)
      }
      if(res.data.data.bingo_winner){
        /* bingoRaw = res.data.data.bingo_winner
        bingoDataRaw = res.data.data.bingo */
        setBingo(res.data.data.bingo_winner)
        setBingoData(res.data.data.bingo)
        /* if(!bingoRaw){
          console.log('setting bingo', bingo)
          setBingoWinnerModal(true)
          bingoRaw = res.data.data.bingo_winner
          setBingoData(res.data.data.bingo)
        } */
      }
      forceUpdate();
    }).catch((error) => {
      console.log('error', error)
      setModal(true)
    }).finally(()=>{
      /* setting up ball */
      rolledRaw.push(rolledBall)
      setRolled(rolledRaw)
      
      setCurrent(rolledBall)
      latests.unshift(rolledBall)
      if(latests.length > 8){
        latests.pop()
      }
      setLatests(latests)
      stackRaw.splice(rolledIndex, 1);
      setStack(stackRaw)
      
      forceUpdate();
    })
    await forceUpdate();
    console.log('before set ', result)
    if(!kuadra){
      setKuadraWinnerModal(true)
    }
    if(!kina){
      setKinaWinnerModal(true)
    }
    if(!bingo){
      setBingoWinnerModal(true)
    }
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
              <h1>Sorteio: {id}</h1>
            </div>
            {fullData &&
              <div className="h-col">
                <h1>Acumulado: R$ {fullData.value}</h1>
              </div>
            }
            {fullData &&
              <div className="h-col">
                <h1>Posição: {rolled.length - 1}</h1>
              </div>
            }
            {fullData &&
              <div className="h-col">
                <h1>Premio: {`${type === 1 ? 'Kuadra' : ''}`} {`${type === 2 ? 'kina' : ''}`} {`${type === 3 ? 'bingo' : ''}`}</h1>
              </div>
            }
          </div>
        </div>
        <div className="row">
          <div className="col col-data">
            <div className="row">
              {/* numbers */}
              <div className="col col-numbers">
                <Numbers key={stack.length} stack={stack} rolled={rolled}/>
              </div>
              {/* current ball */}
              <div className="col col-main">
                {fullData && 
                <div className="row w-90">
                  <div className="col col-4">
                    <div className={`card-type kuadra ${type === 1 ? "pulse" : ""}`}>
                      <h3 className="text-card text-white">Kuadra</h3>
                      <div className="card-price">
                        <h3 className="text-card">{fullData.kuadra_desc}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="col col-4">
                    <div className={`card-type kina ${type === 2 ? "pulse" : ""}`}>
                      <h3 className="text-card text-white">Kina</h3>
                      <div className="card-price">
                        <h3 className="text-card">{fullData.kina_desc}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="col col-4">
                    <div className={`card-type keno ${type === 3 ? "pulse" : ""}`}>
                      <h3 className="text-card text-white">Bingo</h3>
                      <div className="card-price">
                        <h3 className="text-card">{fullData.bingo_desc}</h3>
                      </div>
                    </div>
                  </div>
                </div>
                }
                <div className="row">
                  <div className="col col-list">
                    <ul className="player-list">
                    {bests.map((best, index)=>(
                      <li>
                        <div className="d-flex">
                          <h3 className="placement">{index + 1}º</h3>
                          <h3 className="id">{best.id}</h3>
                          <h3 className="player">{best.player}</h3>
                          <h3 className="kua">{best.hits.kina}</h3>
                          <h3 className="ki">{best.hits.kuadra}</h3>
                          <h3 className="to">{best.hits.total}</h3>
                        </div>
                      </li>
                    ))}
                    </ul>
                  </div>
                  <div className="col col-ball">
                    <div className="current-ball">
                      <h1 className={`ball b-${current%6}`}>{current}</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="previous">
              {latests.map((val) => (<h2 className={`ball b-${val%6}`}>{val}</h2>))}
            </div>
          </div>
          <div className="col col-cartelas">
            {/* cartelas */}
            <h3>Cartelas</h3>
            <div className="cards">
              {bests.map(best=>(
                <div className="card">
                  <h2 className="title">card - {best.id}</h2>
                  <h4> {best.player} - {best.status}</h4>
                  {best.card.map(row => (
                    <div className="d-flex justify-between">
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
      {kuadraData && <Modal active={kuadraWinnerModal} close={()=>setKuadraWinnerModal(false)} redirect={false} winner={kuadraData} title={`Ganhador da kuadra!!! ${kuadraData.player}`} subtitle={`Parabéns ${kuadraData.player}, vc foi o ganhador`} />}
      {kinaData && <Modal active={kinaWinnerModal} close={()=>setKinaWinnerModal(false)} redirect={false} winner={kinaData} title={`Ganhador da kina!!! ${kinaData.player}`} subtitle={`Parabéns ${kinaData.player}, vc foi o ganhador`} />}
      {bingoData && <Modal active={bingoWinnerModal} close={()=>setBingoWinnerModal(false)} redirect={false} winner={bingoData} title={`BINGO!!!! ${bingoData.player}`} subtitle={`Parabéns ${bingoData.player}, vc foi o ganhador`} />}
    </div>
  );
}

export default App;
