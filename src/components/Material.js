import React, { Component } from 'react'
import PropTypes from 'prop-types'
import '../styles/Material.css'
import '../styles/global.css'

import FancyCard from './FancyCard';

import data from '../data/'

export default class Material extends Component {

  constructor(props) {
    super(props);
    this.state = { showText: true };
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    imgSrc: PropTypes.string.isRequired
  }

  static defaultProps = {
  }

  render() {
    return (
      <div className="mat-card-wrapper">
        <FancyCard content={(
          <div className="mat-card">
            <div className="mat-icon-wrapper">
              <img src={this.props.imgSrc} className="mat-icon unselectable" alt="" />
            </div>

            {
              this.state.showText && 
              <div className="mat-name-wrapper">
                <div className="mat-name">
                  {this.props.name}
                </div>
              </div>
            }
            
          </div>
        )} />
      </div>
     
    );
  }
}

// ——————————————————————————————————————————————————————————————————————————

export class ThumbedMaterials extends Component {

  constructor(props) {
    super(props);
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  onButtonClick() {
    console.log('hey', this);
    // this.setState((prevState, props) => {
      
    // });
  }


  render() {
    return (
      <div>
        <div>
          <button onClick={this.onButtonClick}>Toggle Names</button>
        </div>

        {data.materials.filter(mat => mat.thumb).map(mat => (
          <Material 
            name={mat.name} 
            imgSrc={`img/thumb/tiny/${mat.thumb}`} 
            key={mat.idx} />
        ))}
      </div>
    );
  }
}

