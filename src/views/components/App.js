/**
 * The highest-level component of the application and (probably) the master
 * of state for the entire app.
 * 
 * TODO: Add said state.
 */

import React, { Component } from 'react';

// import Header from './Header'
// import Footer from './Footer'
import Material, { ThumbedMaterials, MaterialList } from './Material'
import Recipe, { RecipeList } from './Recipe'
import Button from './Button'
import FancyCard, { SelectedFancyCard } from './FancyCard'
import SmallCounter from './SmallCounter'

import { recipes } from '../../data'

import '../styles/global.scss'
import '../styles/App.scss'
import '../static/css/fontello.css'

// —————————————————————————————————————
// Static Components
// —————————————————————————————————————


const Header = () => (
  <header className="App-header">
    <h1 className="App-title unselectable">Breath of the Wild Cookbook</h1>
  </header>
);


const Footer = () => (
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
      <a href="https://github.com/Oasiris/botw-cookbook" target="_blank"
        rel="noopener noreferrer" alt="View in GitHub">
        <i className="icon-github-circled"></i>
      </a>
    </div>

  </div>
)


const Sandbox = () => (
  <>
    {/* <SmallCounter count={3} /> */}
    {/* <SelectedFancyCard content={(
      <h2>Hello</h2>
    )} /> */}
    {/* <Button onClick={() => alert('hey')}>asdfghjfdsfgh</Button> */}
  
    {/* <Material name="Goat Butter" imgSrc="img/thumb/tiny/thumb-17-10.png" />         */}
    {/* <ThumbedMaterials /> */}
    {/* <MaterialList materials={data.materials} /> */}
  </>
)


// —————————————————————————————————————
// Main/Export Component
// —————————————————————————————————————

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <div className="container">
          <Sandbox />
          
          <ThumbedMaterials />
          <hr />
          {/* <RecipeList recipes={data.recipes} /> */}
          {/* <RecipeList recipes={recipes} /> */}
        </div>
        <Footer />
      </div>
    );
  }
}