import React, { Component } from 'react'
import { connect } from 'react-redux'
import { exists, ifExists } from '../../scripts/utility'
// import PropTypes from 'prop-types'

import data from '../../data'
import { Mat } from '../../scripts/CookingUtil'

import style from './styles/Material.module.scss'

// export default class Material extends Component {
//     constructor(props) {
//         super(props);
//         // this.state = { numSelected: 0 }
//     }

//     render() {
//         const { name } = this.props.data;


//         return (
//             <div className={style.material}>
//                 <h5>{name}</h5>
//                 <button onClick={onIncrementClick}>+</button>
//                 <button onClick={onDecrementClick}>-</button>
//             </div>
//         );
//     }



// }
function Material(props) {
  return (
    <div className={style.material}>
      <h5>{props.data.name}</h5>
      <p>x{ifExists(props.count, 0)}</p>
      <button onClick={props.onIncrementClick}>+</button>
      <button onClick={props.onDecrementClick}>-</button>
      <button onClick={props.onRemoveClick}>Remove</button>
    </div>
  )
}


function mapStateToProps(state) {
  const  { ingreds, hasIngreds, dish, hasDish } = state;
  return { ingreds, hasIngreds, dish, hasDish }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onIncrementClick: () => {
      // console.log('evt', evt);
      // return { type: 'Add Item' }
      console.log('+', ownProps.data)
      dispatch({ type: 'Add Item', id: ownProps.data.idx })
    },
    onDecrementClick: () => {
      dispatch({ type: 'Rmv Item', id: ownProps.data.idx })
    },
    onRemoveClick: () => {
      dispatch({ type: 'Purge Item', id: ownProps.data.idx })
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Material)