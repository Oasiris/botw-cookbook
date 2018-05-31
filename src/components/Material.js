/**
 * Has the following Components:
 * * Material
 * * MaterialList
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import '../styles/Material.css'
import '../styles/global.css'

import FancyCard from './FancyCard';

import data from '../data/'

export default class Material extends Component {

  // constructor(props) {
  //   super(props);
  // }

  static propTypes = {
    name: PropTypes.string.isRequired,
    // imgSrc: PropTypes.string.isRequired
    imgSrc: PropTypes.string,
    showText: PropTypes.bool
  }

  static defaultProps = {
    showText: true
  }

  render() {


    
    return (
      <div className="mat-card-wrapper">
        <FancyCard content={(
          <div className="mat-card">
            <div className="mat-icon-wrapper">
              {
                this.props.imgSrc &&
                <img 
                  src={this.props.imgSrc} 
                  className="mat-icon unselectable"
                  alt="" />
              }
              
            </div>

            {
              this.props.showText && 
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

export class MaterialList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortBy: 'default',
      showText: true
    };
    this.toggleShowText = this.toggleShowText.bind(this);
  }

  static propTypes = {
    materials: PropTypes.arrayOf(PropTypes.object).isRequired
  }

  toggleShowText() {
    this.setState((prevState, props) => {
      console.log(prevState);
      return {
        showText: !prevState.showText
      };
    });
  }

  render() {
    const { materials } = this.props;
    const { sortBy, showText } = this.state;
    if (sortBy !== 'default') {
      console.log('TODO');
    }

    const materialsDiv = <div>
      {
        materials.map(({ name, thumb, idx }) => (
          <Material
          name={name}
          imgSrc={thumb ? `img/thumb/tiny/${thumb}` : undefined}
          key={idx}
          showText={showText} />
        ))
      }
    </div>;

    return <div>
      <button onClick={this.toggleShowText}>Toggle Show Text</button>
      {materialsDiv}
    </div>;
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
      <MaterialList materials={data.materials.filter(mat => mat.thumb)} />
      // <div>
      //   <div>
      //     <button onClick={this.onButtonClick}>Toggle Names</button>
      //   </div>

      //   {/* {data.materials.filter(mat => mat.thumb).map(mat => (
      //     <Material 
      //       name={mat.name} 
      //       imgSrc={`img/thumb/tiny/${mat.thumb}`} 
      //       key={mat.idx} />
      //   ))} */}
      // </div>
    );
  }
}

