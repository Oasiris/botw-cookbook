import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Home from '../routes/home'

const App: React.FC = () => {
    return (
        <div id="root">
            <header>
                <h1>Hylian Cookbook</h1>
            </header>

            <Routes>
                <Route index element={<Home />} />
            </Routes>
        </div>
    )
}

export default App
