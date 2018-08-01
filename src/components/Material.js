/**
 * Has the following Components:
 * * Material
 * * MaterialList
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import '../styles/Material.css'
import '../styles/global.css'
import '../styles/Card.css'
import '../styles/SmallCounter.css'

import FancyCard from './FancyCard';
import SimpleCard from './SimpleCard';
import SmallCounter from './SmallCounter';

import data from '../data/all'

export default class Material extends Component {

  constructor(props) {
    super(props);
    this.state = { numInPot: 0 };
    this.addToPot = this.addToPot.bind(this);
    this.removeAllFromPot = this.removeAllFromPot.bind(this);
  }

  static propTypes = {
    // name: PropTypes.string.isRequired,
    // imgSrc: PropTypes.string.isRequired
    // imgSrc: PropTypes.string,
    showText: PropTypes.bool,
    data: PropTypes.object.isRequired
  }

  static defaultProps = {
    showText: true
  }

  addToPot() {
    console.log('adding');
    console.log('log numInPot as ' + this.state.numInPot);
    this.setState(state => ({ numInPot: state.numInPot + 1 }));
  }

  removeAllFromPot(e) {
    console.log(e);
    // e.preventDefault();
    e.stopPropagation();
    console.log('removing');
    console.log('log numInPot as ' + this.state.numInPot);
    this.setState(() => ({ numInPot: 0 }));
  }

  render() {

    const highlighted = (this.state.numInPot > 0);
    
    
    return (
      <div className="mat-card-wrapper">
        {/* <button onClick={this.addToPot}>+</button> */}
        {/* <button onClick={this.removeAllFromPot}>×</button> */}
        <FancyCard 
          clickable={true} 
          highlighted={highlighted} 
          onClick={this.addToPot}>

          <div className="mat-card">
            <div className="mat-icon-wrapper">
              {
                this.props.data.thumb &&
                <img 
                  src={"img/thumb/tiny/" + this.props.data.thumb}
                  className="mat-icon unselectable"
                  alt="" />
              }
            </div>

            {
              this.props.showText && 
              <div className="mat-name-wrapper">
                <div className="mat-name unselectable">
                  {this.props.data.name}
                </div>
              </div>
            }

            {
              highlighted &&
              <React.Fragment>
                <div className="small-counter-corner">
                  <SmallCounter count={this.state.numInPot} />
                </div>
                <div className="small-corner-x-outer">
                  <SimpleCard clickable={true} onClick={this.removeAllFromPot}>
                    <div className="small-corner-x">
                      × 
                    </div>
                  </SimpleCard>
                </div>
              </React.Fragment>
              
              
            }
          </div>
        </FancyCard>
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
      // console.log(prevState);
      return {
        showText: !prevState.showText
      };
    });
  }

  sortBy(criteria) {
    this.setState(prevState => ({
      sortBy: criteria
    }));
  }

  render() {
    const { materials } = this.props;
    const { sortBy, showText } = this.state;
    
    let sortedMaterials;
    if (sortBy === 'default') {
      sortedMaterials = [...materials];
    } else if (sortBy === 'name') {
      sortedMaterials = [...materials];
      sortedMaterials.sort((m1, m2) => {
        return (m1.name > m2.name ? 1 : (m1.name === m2.name ? 0 : -1));
      });
      
    }


    const materialsDiv = <div>
      {
        // sortedMaterials.map(({ name, thumb, idx }) => (
        sortedMaterials.map(mat => (
          <Material
          data={mat}
          key={mat.idx}
          showText={showText} />
        ))
      }
    </div>;

    return <div>
      <button onClick={this.toggleShowText}>Toggle Show Text</button>
      <button onClick={() => this.sortBy('name')}>Sort By: Name</button>
      <button onClick={() => this.sortBy('default')}>Sort By: Default</button>
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
      <div>
        <h2>Materials</h2>
        <MaterialList materials={data.materials.filter(mat => mat.thumb)} />        
      </div>
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

