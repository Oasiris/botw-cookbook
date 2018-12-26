import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { range, min } from 'ramda'

import Material from './Material'
import { Mat } from '../../scripts/CookingUtil'

import { info } from '../../data'
// import { exists } from 'fs';
import { exists } from '../../scripts/utility';

const matNum = info.materials.length;

/**
 * Props:
 *  - `size` -- the number of materials to render.
 */
function MaterialList(props) {
  // No greater than matNum mats to render.
  let size = exists(props.size) ? min(props.size, matNum) : matNum;

  const idxes = range(1, size + 1)
  const mats  = idxes.map(idx => 
    <Material data={Mat.ofId(idx)} key={idx} />
  )

  return (
    <>{mats}</>
  )
}
MaterialList.propTypes = {
  size: PropTypes.number
}

function mapStateToProps(state) {
  return { st: state }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(MaterialList)