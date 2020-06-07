import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {Router as ReachRouter, LocationProvider, createHistory, createMemorySource} from "@reach/router"
import _A3c from './views/A3c'
import {make} from './makeDependencies'


const quit = () => {
  require('electron').remote.getCurrentWindow().close()
}

let history = createHistory(createMemorySource("/events/a929735c-e149-41c5-b2bf-929a57d289ad"))

const Router = ({children}) => <LocationProvider history={history}>
  <ReachRouter>
    {children}
  </ReachRouter>
</LocationProvider>

const A3c = _A3c({navigate: history.navigate, Router, quit, ...make()})

ReactDOM.render(
  <A3c/>,
  document.getElementById('root')
);

serviceWorker.unregister();
