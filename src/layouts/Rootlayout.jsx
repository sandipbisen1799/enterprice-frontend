import React from 'react'
import { Outlet } from 'react-router'
import Navbar from '../components/Navbar.jsx'
function Rootlayout() {
  return (
     <div >
    <div  ><Outlet/></div>
   </div>
  )
}

export default Rootlayout