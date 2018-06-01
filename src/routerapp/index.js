import {render, createElement} from '../framework';
import App from './App';
import './index.css';

render(
  createElement(App),
  document.getElementById('root')
);
