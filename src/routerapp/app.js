import {Component, createElement, Route, Link} from '../framework';

import {Home, About, Topics} from './components';

class App extends Component {
  render() {
    return (
      <div>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/about'>About</Link></li>
          <li><Link to='/topics'>Topics</Link></li>
        </ul>

        <hr />

        <Route key={0} exact path='/' render={() => <Home name={'Hello'}/>} />
        <Route key={1} path='/about' render={() => <About />} />
        <Route key={2} path='/topics' render={({match}) => <Topics match={ match } />} />
      </div>
    );
  }
}

export default App;
