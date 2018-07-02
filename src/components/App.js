import React, { Component } from 'react';
// import logo from './logo.svg';
import './../styles/App.css';
import './../styles/global.css';
import './../static/css/fontello.css';

import Header from './Header'
import Material, { ThumbedMaterials, MaterialList } from './Material';
import Recipe, { RecipeList } from './Recipe'
import Button from './Button';
import Footer from './Footer'

import FancyCard from './FancyCard'

import data from '../data/all'


export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <div className="container">
          <FancyCard />
          {/* <Button onClick={() => alert('hey')}>asdfghjfdsfgh</Button> */}
        
          {/* <Material name="Goat Butter" imgSrc="img/thumb/tiny/thumb-17-10.png" />         */}
          {/* <ThumbedMaterials /> */}
          {/* <MaterialList materials={data.materials} /> */}
          
          <ThumbedMaterials />
          <hr />
          <RecipeList recipes={data.recipes} />
        </div>
        <Footer />
      </div>
    );
  }
}