import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MolCalc from "./components/MolCalc";
import './index.css';
import registerServiceWorker from './registerServiceWorker';


ReactDOM.render(
  <MolCalc />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
