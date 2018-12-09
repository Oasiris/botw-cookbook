import React, { Component } from 'react'
import PropTypes from 'prop-types'

import FancyCard from './FancyCard'

import '../styles/SmallCounter.scss'
import '../styles/global.scss'

const SmallCounter = props => {

  const { count } = props;


  return (
    <div className="small-counter-outer">
      <FancyCard growOnHover={false} angelOnHover={false}>
        <div className="small-counter">
          ×{count}
        </div>
      </FancyCard>
    </div>
    
  )
}


export default SmallCounter;