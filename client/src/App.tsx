import React from 'react';
import { Provider } from 'react-redux';
import './App.css';

import store from './GameLogic/Store'
import P1 from './NoughtsAndCrosses/P1/P1';
import P2 from './NoughtsAndCrosses/P2/P2';
import MakeMove from './components/Game/MakeMove';
import { Roles } from './NoughtsAndCrosses/Constants';
import waitServer from './components/Game/WaitServer';
import waitOpponent from './components/Game/WaitOpponent';
import ResultView from './components/Game/ResultView';

type P = {}
type S = { role?: Roles }

const ENDPOINT = 'ws://localhost:8080'

class App extends React.Component<P, S> {

  constructor(props: P) {
    super(props)
    this.state = { role: undefined }
  }

  selectPlayer = (role: Roles) => (_: React.MouseEvent) => this.setState({ role })

  render() {
    return (
      <Provider store={store}>
        <div className='App'>
          <h1>Noughts and Crosses</h1>
          <hr />
          {this.state.role === undefined && 
          <div>
            <h3>Pick a marker</h3>
            <span className='Button' onClick={this.selectPlayer(Roles.P1)}>Noughts</span>  
            <span className='Button' onClick={this.selectPlayer(Roles.P2)}>Crosses</span>  
          </div>}

          {this.state.role === Roles.P1 && 
          <P1 
            endpoint={ENDPOINT}
            states={[MakeMove, ResultView, waitServer(Roles.P1), waitOpponent(Roles.P1)]}
            waiting={<p>Hello, Noughts: waiting for Crosses...</p>}
            />
          }

          {this.state.role === Roles.P2 && 
          <P2 
            endpoint={ENDPOINT}
            states={[MakeMove, ResultView, waitServer(Roles.P2), waitOpponent(Roles.P2)]}
            waiting={<p>Hello, Crosses: waiting for Noughts...</p>}
            />
          }
        </div>
      </Provider>
    )
  }
}

export default App;
