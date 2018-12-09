import React, { Component } from 'react'
import FancyCard from './FancyCard'

import '../styles/global.scss'

export default class Button extends Component {

  constructor(props) {
    super(props);

    if (this.props.onClick) {
      this.onClick = this.onClick.bind(this);
    }
  }

  onClick() {
    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  static defaultProps = {
    content: ''
  };

  render() {
    return (
      <FancyCard content={(
        <button onClick={this.props.onClick}>{this.props.children}</button>
      )} />
    );
  }
}