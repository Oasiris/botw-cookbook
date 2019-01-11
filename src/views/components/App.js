import React, { Component } from 'react'

import Material from './Material'
import MaterialList from './MaterialList'
import Pot from './Pot'

// import { materials } from '../../data'
import { Mat } from '../../scripts/CookingUtil'
import style from './styles/App.module.scss'
import { range } from 'ramda';
import loremIpsum from 'lorem-ipsum'
import { IconContext } from 'react-icons'
import { GoInfo, GoHeart } from 'react-icons/go'

import Modal from '../swaponents/Modal'



class Topbar extends Component {

  constructor() {
    super()
    this.state = { show: false }
  }

  showModal = () => this.setState((prev, _) => ({...prev, show: !prev.show}))

  render() {
    return (
      <div id={style.topbar}>
        <h1 id={style.title}>Breath of the Wild Cookbook</h1>

        {/* <button onClick={this.showModal}>Show Modal</button> */}

        <IconContext.Provider value={{ size: '26px' }}>
          <div className={`${style.topbarIconWrapper}`}>
            <GoInfo onClick={this.showModal} />
          </div>
        </IconContext.Provider>

        <Modal
          onClose={this.showModal}
          show={this.state.show}>
          Created with <GoHeart /> by David Hong. 
          <br />
          Powered by React.
        </Modal>

      </div>
    );
  }
}


// const Header = () => (
//   <div id={style.header}>
//     <h1>Breath of the Wild Cookbook</h1>
//   </div>
// )

const Footer = () => (
  <div id={style.footer}>
    Created by David Hong. Powered by React.
  </div>
)

class Content extends Component {
  render() {
    // const mat1 = materials[0];
    // const mat1 = Mat.ofId(24);
    // const mat2 = Mat.ofId(37);
    // const mat3 = Mat.ofId(40)

    // const idxes = range(1, 20)
    // const mats = idxes.map(idx => <Material data={Mat.ofId(idx)} key={idx} />)

    return (
      <>
        <Pot />
        {/* {mats} */}
        <MaterialList size={50} />
        {/* <Material data={mat1} />
        <Material data={mat2} />
        <Material data={mat3} /> */}
      </>
    )
  }
}


export default class App extends React.Component {
  render() {
    return (
      <div className="app">
        <Topbar />
        <div className="container" id={style.mainContent}>
          <Content />
        </div>
        {/* <Footer /> */}
      </div>
    )

  }
}