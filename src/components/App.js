import React, { Component } from 'react';
// import logo from './logo.svg';
import './../styles/App.css';
import './../styles/global.css';
import './../static/css/fontello.css';

import Material, { ThumbedMaterials, MaterialList } from './Material';
import Recipe, { RecipeList } from './Recipe'
import Button from './Button';

import data from '../data/all'


export default class App extends Component {
  render() {
    return (
      <div className="App">
      
        <header className="App-header">
          <h1 className="App-title unselectable">Breath of the Wild Cookbook</h1>
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          {/* <h1 className="App-title">Welcome to React</h1> */}
        </header>

        {/* <p className="App-intro"> */}
          {/* To get started, edit <code>src/App.js</code> and save to reload. */}
        {/* </p> */}

        <div className="container">

          {/* <Button onClick={() => alert('hey')}>asdfghjfdsfgh</Button> */}
        
          {/* <Material name="Goat Butter" imgSrc="img/thumb/tiny/thumb-17-10.png" />         */}
          {/* <ThumbedMaterials /> */}
          {/* <MaterialList materials={data.materials} /> */}
          <ThumbedMaterials />

          <RecipeList recipes={data.recipes} />
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
          David Hong. Created in 2018. Powered by React.
        </div>
        <div className="footer-icon">
          <a href="https://github.com/Oasiris/botw-cookbook" target="_blank" rel="noopener noreferrer" alt="View in GitHub">
            <i className="icon-github-circled"></i>            
          </a>
        </div>

      </div>
    )
  }
}
