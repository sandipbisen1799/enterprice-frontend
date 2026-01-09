import React from 'react'
import { Outlet } from 'react-router'
import Navbar from '../components/Navbar.jsx'
function Rootlayout() {
  return (
     <div className='flex flex-col gap-1 w-full h-full'>
    <div className='h-screen w-f '><Outlet/></div>
   </div>
  )
}

export default Rootlayout