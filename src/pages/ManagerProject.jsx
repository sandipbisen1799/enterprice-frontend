import React, { useEffect, useState } from 'react'
import { getMyProjectsAPI } from '../services/projectManager.service'

function ManagerProject() {
    const [project ,setProject]=useState([])
  const fetchProject = async()=>{
    const data =  await  getMyProjectsAPI();
    console.log(data);
    setProject(data.projects)

  }
    useEffect(() => {
      fetchProject();
    }, []);

  return (
    <div className='flex flex-col min-h-screen bg-gray-200 gap-3' > 
    <div className='flex p-3 text-3xl text-gray-800 font-semibold w-full h-20 items-center   border-b  border-gray-500 flex-row capitalize '> 
        
        <h1>project list</h1> 
         
        </div>
    <div className='flex flex-col   gap-8  pt-7 items-center w-full '>
  {
    project.map((project)=>(
        <div className='w-1/2 bg-amber-50 p-4 flex rounded-2xl flex-col  gap-4 ' key={project._id}>

            <h1>name {project.name}</h1>
            <h1>description {project.description}</h1>
            <h1>{project.status}</h1>
        </div>
    ))
  }


    </div>
    </div>
  )
}

export default ManagerProject