import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import PropTypes from 'prop-types'

import '../styles/Card.scss'
import '../styles/global.scss'

/**
 * Element representing a card. Children to this Element will appear inside of
 * the card.
 * 
 * @prop {Boolean} growOnHover -- Whether or not the card will grow slightly when moused over.
 */
export default class SimpleCard extends Component {
  constructor(props) {
    super(props);
    // this.state = { highlighted: false };
    // this.toggleHighlight = this.toggleHighlight.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  static propTypes = {
    growOnHover: PropTypes.bool,
    angelOnHover: PropTypes.bool,
    highlighted: PropTypes.bool,
    clickable: PropTypes.bool,
    handleClick: PropTypes.func
  }

  static defaultProps = {
    growOnHover: false,
    angelOnHover: false,
    highlighted: false,
    clickable: false
  }

  handleClick(...args) {
    if (this.props.onClick)
      this.props.onClick(...args);
  }

  // toggleHighlight() {
  //   this.setState(({ highlighted }) => ({ highlighted: !highlighted }));
  // }

  render() {
    const { highlighted, growOnHover, angelOnHover } = this.props;
    const hiliteOut = highlighted ? ' selected-fancy-card-outer' : '';
    const hiliteInr = highlighted ? ' selected-fancy-card-inner' : '';

    const clickable = this.props.clickable ? ' clickable-fancy-card' : '';
    const maybeGrow = growOnHover ? ' grow-slight' : '';
    const maybeAngel = angelOnHover ? ' angel-on-hover' : '';

    return (
      <div
        className={"card-outer" + maybeGrow + maybeAngel + hiliteOut + clickable}
        onClick={this.handleClick}>
        <div className={"simple-card-inner " + hiliteInr}>
          {this.props.children}
        </div>
        {/* <button onClick={this.toggleHighlight}>Weee</button> */}
      </div>
    );
  }
}
// export default class SimpleCard extends Component {
//   constructor(props) {
//     super(props);
//     // this.state = { highlighted: false };
//     // this.toggleHighlight = this.toggleHighlight.bind(this);
//     this.handleClick = this.handleClick.bind(this);
//   }

//   static propTypes = {
//     // highlighted: PropTypes.bool,
//     clickable: PropTypes.bool,
//     handleClick: PropTypes.func
//   }

//   static defaultProps = {
//     // highlighted: false,
//     clickable: false
//   }

//   handleClick() {
//     if (this.props.onClick)
//       this.props.onClick();
//   }

//   // toggleHighlight() {
//   //   this.setState(({ highlighted }) => ({ highlighted: !highlighted }));
//   // }

//   render() {
//     // const { highlighted } = this.props;
//     // const hiliteOut = highlighted ? ' selected-fancy-card-outer' : '';
//     // const hiliteInr = highlighted ? ' selected-fancy-card-inner' : '';

//     const clickable = this.props.clickable ? ' clickable-fancy-card' : '';

//     return (
//       <div className={"card-outer"} onClick={this.handleClick}>
//         {this.props.children}
//       </div>
//     );
//   }
// }