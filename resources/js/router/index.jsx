import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Device from '../components/DevicePage'
import App from '../components/App'

const index = () => {
  return (
    <div>
        <Routes>
            <Route path='/' element={<App/>}/>
            <Route path='/Device' element={<Device/>}/>
        </Routes>
    </div>
  )
}

export default index