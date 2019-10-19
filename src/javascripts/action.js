import React from 'react';
import ReactDOM from 'react-dom';
import '../stylesheets/entry.sass';
import ActionApp from './components/ActionApp';

ReactDOM.render(
  React.createElement(ActionApp),
  document.querySelector('#app')
);
