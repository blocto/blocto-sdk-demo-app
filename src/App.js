import { BrowserRouter as Router, Route } from 'react-router-dom';
import Solana from './pages/Solana';
import Ethereum from './pages/Ethereum';
import SelectChain from './pages/SelectChain';

const App = () => (
  <Router>
    <Route exact path="/" component={SelectChain} />
    <Route exact path="/solana" component={Solana} />
    <Route exact path="/ethereum" render={() => <Ethereum blockchain='ethereum' />} />
    <Route exact path="/bsc" render={() => <Ethereum blockchain='bsc' />} />
  </Router>
)

export default App;
