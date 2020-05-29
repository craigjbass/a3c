import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {Router, navigate} from "@reach/router"
import _A3c from './views/A3c'
import { make } from './main'

const A3c = _A3c({navigate, Router, make})

ReactDOM.render(
  <A3c/>,
  document.getElementById('root')
);

serviceWorker.unregister();
