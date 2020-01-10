import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';

const reactApp = function(){
     return {
          init(element,parameter) {
               console.log('Rendering React Component Into:' + element);
               return ReactDOM.render(<App parameter={parameter}/>, document.getElementById(element));
          }
}
}

define(reactApp);