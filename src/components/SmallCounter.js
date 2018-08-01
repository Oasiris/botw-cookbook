import React, { Component } from 'react'
import PropTypes from 'prop-types'

import FancyCard from './FancyCard'

import '../styles/SmallCounter.css'
import '../styles/global.css'

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