import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {Router, LocationProvider, createHistory, createMemorySource} from "@reach/router"
import _A3c from './views/A3c'
import {make} from './makeDependencies'

let history = createHistory(createMemorySource("/"))

const _LocationProvider = ({children}) => <LocationProvider history={history}>{children}</LocationProvider>
const A3c = _A3c({navigate: history.navigate, Router, make, LocationProvider: _LocationProvider})

ReactDOM.render(
    <A3c/>,
    document.getElementById('root')
);

serviceWorker.unregister();
