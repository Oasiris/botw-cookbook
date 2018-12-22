/**
 * Represents the cooking pot.
 * 
 * Starts by displaying state at all times.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { clone, append, until } from 'ramda'
import { ifExists } from '../../scripts/utility';

/* TODO: Figure out testing   */
function Pot(props) {
  let ingreds = props.st.ingreds

  const numIngreds = ingreds.reduce((count, ing) => count + ing.count, 0)

  let ingredItems = ingreds.map((ing) => (
    <li>
      {/* <div style="display: inline-block"> */}
      <div>
        <div>{ing.data.name}</div>
        <div>{ing.count}</div>
      </div>
    </li>
  ))
  const emptyListEle = <li></li>
  ingredItems = until((v) => v.length >= 5, append(emptyListEle), ingredItems)

  // ingreds = JSON.stringify(ingreds)

  // const superState = JSON.stringify(props.st);
  return (
    <div>
      <h3>Pot</h3>
      <h5>{numIngreds}</h5>
      <ul>
        {/* {ingreds.} */}
        {ingredItems}
      </ul>
    </div>
  )
}

function mapStateToProps(state) {
  // state.hasIngreds = 'lol'
  return { st: state };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    // ...
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Pot)