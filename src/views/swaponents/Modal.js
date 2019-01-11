/**
 * Foreword:
 * 
 * https://css-tricks.com/considerations-styling-modal/:
 * "For anyone who has ever tried to make a modal accessible you know that even though they seem pretty innocuous, modals are actually the boss battle at the end of web accessibility. They will chew you up and spit you out. For instance, a proper modal will need to have the following features:

Keyboard focus should be moved inside of the modal and restored to the previous activeElement when the modal is closed
Keyboard focus should be trapped inside of the modal, so the user does not accidentally tab outside of the modal (a.k.a. "escaping the modal")
Screen readers should also be trapped inside of the modal to prevent accidentally escaping"
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import style from '../styles/Modal.module.scss'

export default class Modal extends Component {
  static defaultProps = { show: false }
  static propTypes = { show: PropTypes.bool }

  /**
   * 
   */
  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  }

  render() {
    if (!this.props.show) return null;

    return (
      <div class={style.modal}>
        {this.props.children}

        <div>
          <button onClick={e => this.onClose(e)}>Close</button>
        </div>
      </div>
    )
  }
}
