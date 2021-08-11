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
  const [kuadraWinnerModalOpen, setKuadraWinnerModalOpen] = useState(false)
  const [kinaWinnerModalOpen, setKinaWinnerModalOpen] = useState(false)
  const [bingoWinnerModalOpen, setBingoWinnerModalOpen] = useState(false)
  const [kuadra, setKuadra] = useState(null)
  const [kina, setKina] = useState(null)
  const [bingo, setBingo] = useState(null)
  const [kuadraData, setKuadraData] = useState(null)
  const [kinaData, setKinaData] = useState(null)
  const [bingoData, setBingoData] = useState(null)
  const [fullData, setFullData] = useState(null)
  const [time, setTime] = useState(5000)
  const [stop, setStop] = useState(false)
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  let { id } = useParams();

  useEffect(() => {
    for (let index = 0; index <= 90; index++) {
      stack.push(index)
    }
    setStack(stack)
    /* rollBall() */
    let kinaRaw = null
    let kuadraRaw = null
    let bingoRaw = null

    let kinaDataRaw = null
    let kuadraDataRaw = null
    let bingoDataRaw = null

    const interval = setInterval(() => {
      rollBall(kinaRaw, kuadraRaw, bingoRaw, kinaDataRaw, kuadraDataRaw, bingoDataRaw)
    }, time);
    return () => clearInterval(interval);
  }, []);

  function setTimeWin () {
    console.log("set being called okok")
    setTime(10000)
    forceUpdate();
    setTimeout( function() { setTime(5000); forceUpdate(); }, 10000);
  }

  async function rollBall (kinaRaw, kuadraRaw, bingoRaw, kinaDataRaw, kuadraDataRaw, bingoDataRaw) {
    let rolledRaw = rolled ? rolled : []
    let stackRaw = stack ? stack : []
    if (stop){
      return
    }

    if(stackRaw.length <= 0){
      return
    }
    /* setting all modals to false */
    setModal(false)
    /* setKuadraWinnerModal(false)
    setKinaWinnerModal(false)
    setBingoWinnerModal(false) */


    const rolledIndex = getRandomInt(0, stackRaw.length)
    const rolledBall = stackRaw[rolledIndex]
    let result = null
    /* calling endpoint */
    await api.post(`/api/bingos/${id}/run?ball=${rolledBall}&position=${rolledRaw.length + 1}&type=${type}`, {}).then((res)=>{
      console.log('response', res)
      result = res

      /* new bets cards being set */

      forceUpdate();
    }).catch((error) => {
      console.log('error', error)
      setModal(true)
    })
    console.log('before set ', result)
    console.log('before set ', kuadraRaw)
    console.log('before set ', kinaRaw)
    console.log('before set ', bingoRaw)

    setBests(result.data.data.bests)
    setFullData(result.data.data)


    if(result.data.data.kuadra_winner){
      if(!kuadraRaw){
        kuadraRaw = result.data.data.kuadra_winner
        kuadraDataRaw = result.data.data.kuadra
        console.log('inside set ', kuadraRaw)
        console.log('inside set ', result.data.data.kuadra_winner)
        if (kuadraWinnerModalOpen) {
          setKuadraWinnerModal(false)
        } else {
          setKuadraWinnerModal(true)
          setKuadraWinnerModalOpen(true)
          setTime(9000)
        }
        setKuadra(kuadraRaw)
        setKuadraData(kuadraDataRaw)
      }
      setType(2)
    }
    if(result.data.data.kina_winner){
      if(!kinaRaw){
        kinaRaw = result.data.data.kina_winner
        kinaDataRaw = result.data.data.kina
        if(kinaWinnerModalOpen){

          setKinaWinnerModal(false)
        }else {
          setKinaWinnerModal(true)
          setKinaWinnerModalOpen(true)
        }
        setKina(kinaRaw)
        setKinaData(kinaDataRaw)
      }
      setType(3)
    }
    if(result.data.data.bingo_winner){
      setStopF()
      if(!bingoRaw){
        bingoRaw = result.data.data.bingo_winner
        bingoDataRaw = result.data.data.bingo
        if(bingoWinnerModalOpen){
          setBingoWinnerModal(false)

        }else {
          setBingoWinnerModal(true)
          setBingoWinnerModalOpen(true)

        }
        setBingo(bingoRaw)
        setBingoData(bingoDataRaw)
      }
    }

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
    
  }

  function setStopF() {
    setStop(true);
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
      {kuadraData && <Modal setWin={()=>setTimeWin()} out={true} active={kuadraWinnerModal} close={()=>setKuadraWinnerModal(false)} redirect={false} winner={kuadraData} title={`Ganhador da kuadra!!! ${kuadraData.player}`} subtitle={`Parabéns ${kuadraData.player}, vc foi o ganhador`} />}
      {kinaData && <Modal setWin={()=>setTimeWin()} out={true} active={kinaWinnerModal} close={()=>setKinaWinnerModal(false)} redirect={false} winner={kinaData} title={`Ganhador da kina!!! ${kinaData.player}`} subtitle={`Parabéns ${kinaData.player}, vc foi o ganhador`} />}
      {bingoData && <Modal active={bingoWinnerModal} close={()=>setBingoWinnerModal(false)} redirect={false} winner={bingoData} title={`BINGO!!!! ${bingoData.player}`} subtitle={`Parabéns ${bingoData.player}, vc foi o ganhador`} />}
    </div>
  );
}

export default App;
