import React, {Component} from 'react';
import {render} from 'react-dom';
import tune from './tune.js';

class App extends Component {
  render() {
    return (
      <div>
      Hello world
      </div>
    );
  }

}


render(<App />, document.getElementById('root'));
