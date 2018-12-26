/**
 * Represents the cooking pot.
 * 
 * Starts by displaying state at all times.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { __, map, range, clone, append, until } from 'ramda'
import { mapIndexed } from 'ramda-adjunct'
import { ifExists, forEachIndexed, exists } from '../../scripts/utility';

import style from './styles/Pot.module.scss'


function PotDish(props) {
  if (!props.data) return <></>
  const { name, thumb, desc, hpRestore, rupeePrice, effectData } = props.data;

  let effectEle = <div></div>;
  if (exists(effectData)) {
    effectEle = <div>TODO: Effect</div>
  }

  return (
    <>
      <h2>{name}</h2>
      <p>{desc}</p>
      <ul>
        <li>
          <div>Restores HP:</div>
          <div>{hpRestore}</div>
        </li>
        <li>
          <div>Sells for (rupees):</div>
          <div>{rupeePrice}</div>
        </li>
      </ul>
      {effectEle}
    </>
  )
}

/* TODO: Figure out testing   */
function Pot(props) {
  let ingreds = props.st.ingreds

  const numIngreds = ingreds.reduce((count, ing) => count + ing.count, 0)

  let ingredItems = map(__, range(0, 5))((idx) => (
    <li key={idx}><div className={style.potIngred}><div /><div /></div></li>
  ))
  // forEachIndexed(console.log, ingredItems);

  /* Map first (ingreds.len) <li>'s to contain ingredient information  */
  ingredItems = mapIndexed(__, ingredItems)((val, idx) => {
    const ing = ingreds[idx];
    if (!ing) return val;

    return <li key={idx}>
      <div className={style.potIngred}>
        <div>{ing.count}</div>
        <div>{ing.data.name}</div>
      </div>
    </li>
  })
  

  // let ingredItems = mapIndexed(__, ingreds)((ing, idx) => (
    {/* <li key={idx}> */}
      {/* <div className={style.potIngred}> */}
        {/* <div>{ing.count}</div> */}
        {/* <div>{ing.data.name}</div> */}
      {/* </div> */}
    {/* </li> */}
  // ))

  // let ingredItems = ingreds.map((ing) => (
  //   <li>
  //     <div className={style.potIngred}>
  //       <div>{ing.count}</div>
  //       <div>{ing.data.name}</div>
  //     </div>
  //   </li>
  // ))
  // const emptyListEle = <li></li>
  // ingredItems = until((v) => v.length >= 5, append(emptyListEle), ingredItems)
  // ingredItems = mapIndexed(__, ingredItems)()

  

  // ingreds = JSON.stringify(ingreds)

  // const superState = JSON.stringify(props.st);
  return (
    <div className={style.pot}>
      <h1>Pot</h1>

      {/* Left */}
      <div>
        <div className={style.inlineList}>
          <h3>{numIngreds}</h3>
          { (props.st.ingredCount > 0) && (
            <>
              <button onClick={props.onEmptyPotClick}>Empty the Pot</button>
              <button onClick={props.onCookClick}>Cook!</button>
            </>
          )}
        </div>
        <ul>
          {ingredItems}
        </ul>
      </div>

      {/* Right */}
      <div>
        { props.st.hasDish && (
          <PotDish data={props.st.dish} />
          /* <p>{JSON.stringify(props.st.dish)}</p> */
        )}
      </div>
      
    </div>
  )
}

function mapStateToProps(state) {
  return { st: state };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onEmptyPotClick: () => dispatch({ type: 'Empty Pot' }),
    onCookClick: () => dispatch({ type: 'Cook', keepPot: true })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Pot)