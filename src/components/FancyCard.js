import React, { Component } from 'react'
// import PropTypes from 'prop-types'

import '../styles/FancyCard.css'
import '../styles/global.css'


export default class FancyCard extends Component {
  constructor(props) {
    super(props);
    this.state = { highlighted: false };
    this.toggleHighlight = this.toggleHighlight.bind(this);
  }

  toggleHighlight() {
    this.setState(({ highlighted }) => ({ highlighted: !highlighted }));
  }

  render() {
    const { highlighted } = this.state;
    const adtnOuterClass = highlighted ? 'selected-fancy-card-outer' : '';
    const adtnInnerClass = highlighted ? 'selected-fancy-card-inner' : '';

    return (
        <div className={"fancy-card-outer grow-slight " + adtnOuterClass}>
          <div className={"fancy-card-inner " + adtnInnerClass}>
            {this.props.content}
          </div>
          {/* <button onClick={this.toggleHighlight}>Weee</button> */}
        </div>
    );
  }
}

// export class SelectedFancyCard extends Component {
//   render() {
//     return (
//       <div className="fancy-card-outer grow-slight selected-fancy-card-outer">
//         <div className="fancy-card-inner selected-fancy-card-inner">
//           {this.props.content}
//         </div>
//       </div>
//     );
//   }
// }

// Material.propTypes = {
//   name: PropTypes.string.isRequired,
//   imgSrc: PropTypes.string.isRequired
// }