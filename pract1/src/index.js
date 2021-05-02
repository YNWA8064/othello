import React from 'react';
import ReactDOM from 'react-dom';
import Game from './Game.js';
import UseHook from './useHook.js';
import Othello from './Othello.js';

ReactDOM.render(
  <React.StrictMode>
	<Othello />
  </React.StrictMode>,
  document.getElementById('root')
);