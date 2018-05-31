import React, { Component } from 'react';
// import logo from './logo.svg';
import './../styles/App.css';
import './../styles/global.css';
import './../static/css/fontello.css';

import Material, { ThumbedMaterials } from './Material.js';


export default class App extends Component {
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
          {/* <Material name="Goat Butter" imgSrc="img/thumb/tiny/thumb-17-10.png" />         */}
          <ThumbedMaterials />
        </div>
        
        <Footer />
      </div>
    );
  }
}

// ——————————————————————————————————————————————————————————————————————————

export class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <div className="footer-quote">
          As the great Link famously said... "HYAAAAH! HAT HYAT SSSSKKKYYYAAAAAAA!"
        </div>
        <div className="footer-text-block">
          Franchise owned by Nintendo. Thumbnails and screenshots not mine.
        </div>
        <div className="footer-text-block">
          Created in 2018. Powered by React.
        </div>
        <div className="footer-icon">
          <a href="http://github.com/Oasiris" target="_blank" rel="noopener noreferrer" alt="Click here to go to my GitHub">
            <i className="icon-github-circled"></i>            
          </a>
        </div>

      </div>
    )
  }
}
