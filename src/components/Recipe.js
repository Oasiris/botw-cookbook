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

import FancyCard from './FancyCard';


import data from '../data/all'

export default class Recipe extends Component {

  // constructor(props) {
  //   super(props);
  // }

  static propTypes = {
    // name: PropTypes.string.isRequired,
    // imgSrc: PropTypes.string.isRequired
    // imgSrc: PropTypes.string,
    showText: PropTypes.bool,
    data: PropTypes.object
  }

  static defaultProps = {
    showText: true
  }

  render() {



    return (
      <div className="mat-card-wrapper">
        <FancyCard>
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
                <div className="mat-name">
                  {this.props.data.name}
                </div>
              </div>
            }

          </div>
        </FancyCard>
      </div>

    );
  }
}


export class RecipeList extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   sortBy: 'default',
    //   showText: true
    // };
    // this.toggleShowText = this.toggleShowText.bind(this);
  }

  static propTypes = {
    recipes: PropTypes.arrayOf(PropTypes.object).isRequired
  }

  // toggleShowText() {
  //   this.setState((prevState, props) => {
  //     // console.log(prevState);
  //     return {
  //       showText: !prevState.showText
  //     };
  //   });
  // }

  // sortBy(criteria) {
  //   this.setState(prevState => ({
  //     sortBy: criteria
  //   }));
  // }

  render() {
    const { recipes } = this.props;
    // const { sortBy, showText } = this.state;

    // let sortedMaterials;
    // if (sortBy === 'default') {
    //   sortedMaterials = [...materials];
    // } else if (sortBy === 'name') {
    //   sortedMaterials = [...materials];
    //   sortedMaterials.sort((m1, m2) => {
    //     return (m1.name > m2.name ? 1 : (m1.name === m2.name ? 0 : -1));
    //   });

    // }


    const recipesDiv = <div>
      {
        // sortedMaterials.map(({ name, thumb, idx }) => (
        // sortedMaterials.map(rcp => (
        recipes.map(rcp => (
          <Recipe
            data={rcp}
            // name={name}
            // imgSrc={thumb ? `img/thumb/tiny/${thumb}` : undefined}
            key={rcp.idx}
            // showText={showText}
             />
        ))
      }
    </div>;

    return <div>
      {/* <button onClick={this.toggleShowText}>Toggle Show Text</button> */}
      {/* <button onClick={() => this.sortBy('name')}>Sort By: Name</button> */}
      {/* <button onClick={() => this.sortBy('default')}>Sort By: Default</button> */}
      {recipesDiv}
    </div>;
  }
}