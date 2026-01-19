import React, { useEffect, useState } from 'react'
import { getMyProjectsAPI } from '../../services/projectManager.service'
import Table from '../../components/ui/Table';
import { toast } from 'react-toastify';

function ManagerProject() {
    const [project ,setProject]=useState([])
  const fetchProject = async()=>{
    try {
      const data =  await  getMyProjectsAPI();
      console.log(data);
      setProject(data.projects)
      toast.success("Projects fetched successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch projects!");
    }
  }
    const columns = [
  {
    key: "index",
    label: "Index",
    render: (_, index) => index,
  },
  {
    key: "name",
    label: "Name",
  },
  {
    key: "description",
    label: "description",
  },
  {
    key: "status",
    label: "Status",
  },
];
    useEffect(() => {
      fetchProject();
    }, []);

  return (
    <div className="min-h-screen px-5 bg-[#F7F7F7] flex flex-col items-center gap-3 ">
      <div className="w-full h-20 justify-between flex flex-row items-center ">
        <h1 className="text-2xl font-bold capitalize text-gray-800">Project List</h1>
      </div>
      <div className='flex flex-col gap-8 pt-7 items-center w-full '>
        {project.length === 0 ? (
          <h2 className="text-center text-gray-600 text-xl font-semibold">There are no projects</h2>
        ) : (
          <Table columns={columns} data={project} />
        )}
      </div>
    </div>
  )
}

export default ManagerProject