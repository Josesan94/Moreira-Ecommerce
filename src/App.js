import {Router} from 'react-router-dom'
import {createBrowserHistory} from 'history'
import {EstadoProveedor} from './context/EstadoGeneral'
import Routes from "./Routes"
import './App.css';

const browserHistory = createBrowserHistory()


function App() {
  return (
    <EstadoProveedor>
      <Router history={browserHistory}>
        <Routes />
      </Router>
    </EstadoProveedor>
  );
}

export default App;
