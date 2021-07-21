import logo from './logo.svg';
import './App.scss';
import './Background.scss';

function App() {
  let numbers = []
  for (let index = 0; index < 99; index++) {
    if (index%3===0){
      numbers.push(
        <h3 className="number active">{index}</h3>
      )
    }else {
      numbers.push(
        <h3 className="number">{index}</h3>
      )
    }
    
  }
  return (
    <div className="App">
      <div class="bg"></div>
      <div class="bg bg2"></div>
      <div class="bg bg3"></div>

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
            <h3>Números sorteados</h3>
            <div className="numbers">
              {numbers}
            </div>
          </div>
          <div className="col">
            <div className="current-ball">
              <h1 className="ball">99</h1>
            </div>
            <div className="previous">
              <h2 className="ball b-orange">15</h2>
              <h2 className="ball b-red">41</h2>
              <h2 className="ball b-cyan">61</h2>
              <h2 className="ball b-green">81</h2>
              <h2 className="ball b-greenyellow">54</h2>
              <h2 className="ball b-goldenrod">43</h2>
              <h2 className="ball b-coral">44</h2>
              <h2 className="ball b-orange">45</h2>
              <h2 className="ball b-red">46</h2>
              <h2 className="ball b-cyan">47</h2>
            </div>
          </div>
          <div className="col">
            <h3>Cartelas</h3>
            <div className="cards">
              <div className="card">
                <h2 className="title">card - 61</h2>
                <h3 className="number">43</h3>
                <h3 className="number">65</h3>
                <h3 className="number">76</h3>
                <h3 className="number">12</h3>
                <h3 className="number">15</h3>
                <h3 className="number">43</h3>
                <h3 className="number">65</h3>
                <h3 className="number">76</h3>
                <h3 className="number">12</h3>
                <h3 className="number">15</h3>
                <h3 className="number">43</h3>
                <h3 className="number">65</h3>
                <h3 className="number">76</h3>
                <h3 className="number">12</h3>
                <h3 className="number">15</h3>
              </div>
              <div className="card">
                <h2 className="title">card - 61</h2>
                <h3 className="number">43</h3>
                <h3 className="number">65</h3>
                <h3 className="number">76</h3>
                <h3 className="number">12</h3>
                <h3 className="number">15</h3>
                <h3 className="number">43</h3>
                <h3 className="number">65</h3>
                <h3 className="number">76</h3>
                <h3 className="number">12</h3>
                <h3 className="number">15</h3>
                <h3 className="number">43</h3>
                <h3 className="number">65</h3>
                <h3 className="number">76</h3>
                <h3 className="number">12</h3>
                <h3 className="number">15</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
