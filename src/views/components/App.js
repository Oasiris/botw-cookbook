import React from 'react'

import Material from './Material'

import { materials } from '../../data'
import style from './styles/App.module.scss'




const Header = () => (
    <div id={style.header}>
        <h1>Breath of the Wild Cookbook</h1>
    </div>
)

const Footer = () => (
    <div id={style.footer}>
        Created by David Hong | Powered by React
    </div>
)

class Content extends React.Component {
    render() {
        const mat1 = materials[0];


        return (
            <>
                <Material data={mat1} />
            </>
        )
    }
}


export default class App extends React.Component {
    render() {
        return (
            <div className="app">
                <Header />
                <div className="container">
                    <Content />
                </div>
                <Footer />
            </div>
        )
        
    }
}