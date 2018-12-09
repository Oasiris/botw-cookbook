import React, { Component } from 'react'

import data     from '../../data'
import { Mat }  from '../../scripts/CookingUtil'

import style from './styles/Material.module.scss'

export default class Material extends Component {
    constructor(props) {
        super(props);
        // this.state = { numSelected: 0 }
    }

    render() {
        const { name } = this.props.data;


        return (
            <div className={style.material}>
                {name}
            </div>
        );
    }



}