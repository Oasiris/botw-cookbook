import React, { Component } from 'react'
// import PropTypes from 'prop-types'

import '../styles/FancyCard.css'
import '../styles/global.css'


export default class FancyCard extends Component {
  render() {
    return (
        <div className="fancy-card-outer grow-slight">
          <div className="fancy-card-inner">
            {this.props.content}
          </div>
        </div>
    );
  }
}

export class SelectedFancyCard extends Component {
  render() {
    return (
      <div className="fancy-card-outer grow-slight selected-fancy-card-outer">
        <div className="fancy-card-inner selected-fancy-card-inner">
          {this.props.content}
        </div>
      </div>
    );
  }
}

// Material.propTypes = {
//   name: PropTypes.string.isRequired,
//   imgSrc: PropTypes.string.isRequired
// }