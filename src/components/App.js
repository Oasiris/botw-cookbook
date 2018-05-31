import React, { Component } from 'react';
// import logo from './logo.svg';
import './../styles/App.css';

import Material from './Material.js';


class App extends Component {
  render() {
    return (
      <div className="App">
      
        <header className="App-header">
          <h1 className="App-title">Breath of the Wild Cookbook</h1>
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          {/* <h1 className="App-title">Welcome to React</h1> */}
        </header>
        {/* <p className="App-intro"> */}
          {/* To get started, edit <code>src/App.js</code> and save to reload. */}
        {/* </p> */}

        <div className="container">
          <Material />        
        </div>
        
      </div>
    );
  }
}

export default App;
