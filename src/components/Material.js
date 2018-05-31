import React, { Component } from 'react'
import PropTypes from 'prop-types'

import '../styles/Material.css'



export default class Material extends Component {
  render() {
    return (
      <div className="mat-card-wrapper">
        <div className="mat-card">
          <div className="mat-icon-wrapper">
            <img src={this.props.imgSrc} className="mat-icon" alt="" />
          </div>
          <div className="mat-name-wrapper">
            <div className="mat-name">
              {this.props.name}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Material.propTypes = {
  name: PropTypes.string.isRequired,
  imgSrc: PropTypes.string.isRequired
}