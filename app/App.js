import React, {Component} from 'react';
import {render} from 'react-dom';
import tune from './tune.js';

class App extends Component {
  render() {
    return (
      <small>
        <a href="https://github.com/skilldrick/shasounds">github</a>
      </small>
    );
  }
}

render(<App />, document.getElementById('root'));
