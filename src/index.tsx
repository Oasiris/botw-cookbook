import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import App from './components/App'

import './styles/index.scss'

/* 
React Router v6 – Helpful docs:
    https://reactrouter.com/docs/en/v6/getting-started/overview
*/

render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root'),
)
