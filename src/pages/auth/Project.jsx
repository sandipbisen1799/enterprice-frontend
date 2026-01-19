import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import TablePagination from '../../components/ui/TablePagination.jsx'
import {
  deleteProjectAPI,
  getProjectApi,
  updateProjectAPI,
} from "../../services/user.service.js";
import { Eye, EyeOff, Trash, UserRoundPen, EllipsisVertical } from "lucide-react";

import { toast } from 'react-toastify';
function Project() {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [projects, setProjects] = useState([]);
  const [modify, setModify] = useState(false);
  const [userId, setUserId] = useState(null);
  const [menu, setMenu] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormdata] = useState({
    name: "",
    status: "",
    description: "",
  });
  // const [showPassword, setShowPassword] = useState(false);
const navigate = useNavigate();
  // Handle input change
  function handlechange(event) {
    const { name, type, value, checked } = event.target;
    setFormdata((prevFormdata) => ({
      ...prevFormdata,
      [name]: type === "checkbox" ? checked : value,
    }));
  }
  const fetchProjects = async () => {
    try {
      const data = await getProjectApi(page, 5);
      console.log(data.projects);
      setProjects(data?.projects);

      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const handleDelete = async (user) => {
    try {
      console.log(user._id);
      const projectId = user._id;
      if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
        const res = await deleteProjectAPI(projectId);
        console.log(res);
        fetchProjects();
        toast.success("Project deleted successfully!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete project!");
    }
  };
  const onHandleModify = async () => {
    try {
      console.log(formData);
      console.log(userId);
      const projectId = userId;
      const res = await updateProjectAPI(projectId, formData);
      console.log(res);
      fetchProjects();
      setModify(false);
      toast.success("Project updated successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update project!");
    }
  };

  const handleModifyButton = (user) => {
    setFormdata({
      name: user.name || "",
      status: user.status || "",
      description: user.description || "",
    });
    setUserId(user._id);
    setModify(true);
  }
     const columns = [
  {
    key: "index",
    label: "Index",
    render: (_, index) => index +1,
  },
  {
    key: "name",
    label: "Name",
  },
  {
    key: "description",
    label: "discription",
  },
   {
    key: "status",
    label: "status",
  },

];

  useEffect(() => {
    fetchProjects();
  }, [page]);

  return (
    <div className="min-h-screen px-5 bg-[#F7F7F7] flex flex-col items-center gap-3 ">
      <div className="w-full h-20 justify-between flex flex-row items-center ">
        <h1 className="text-2xl font-bold capitalize text-gray-800">
          Projects
        </h1>
        <button
          className="px-6 py-2 hover:scale-101 capitalize hover:text-white rounded-lg text-gray-800 font-semibold text-center bg-[#7143f047] transition-all cursor-pointer"
          onClick={() => navigate('/admin/addproject')
          }
        >
          create the project
        </button>
      </div>
        {/* <div className=" w-full mt-2.5  md:w-3/4  flex flex-col  items-center  bg-[#E5E7EB] rounded-lg   h-full shadow-2xs "> */}
          {/* <div className=" p-1 md:p-4 flex flex-col gap-4 overflow-y-auto"> */}
            {projects.length === 0 && (
              <h2 className="text-center text-gray-600 text-xl font-semibold">There are no projects</h2>
            )}
            <TablePagination
              columns={columns}
              data={projects}
              page={page}
              totalPages ={totalPages}
              total={projects.length}
              onPageChange={setPage}
            renderActions={(user) => (
  <div className="flex gap-2 text-[#705CC7] relative">
    <EllipsisVertical
      className="cursor-pointer"
      onClick={() =>
        setMenu(menu === user._id ? null : user._id)
      }
    />

    {menu === user._id && (
      <div className="absolute right-12  top-10 bg-white shadow-md rounded w-36 z-50">
        <div
          className="text-black px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            handleModifyButton(user);
            setMenu(null);
          }}
        >
          Edit
        </div>

        <div
          className="text-black px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            handleDelete(user);
            setMenu(null);
          }}
        >
          Delete
        </div>
      </div>
    )}
  </div>
 )}/>

            {/* {projects.map((user) => (
              <div
                key={user._id}
                className="w-full p-1.5  min-h-32 rounded-lg text-gray-800 font-normal    h-full flex flex-col md:flex-row justify-between gap-y-2 bg-[#FFFFFF] "
              >
                <div className="flex flex-col w-full justify-beetween gap-y-1 ">
                  <h1>project name </h1>
                  <h1 className="font-bold ">{user.name}</h1>
                  <div>
                    <h1>discreption</h1>
                    <h1 className="font-bold"> {user.description}</h1>
                  </div>
                  <h1>
                    status: <span className="font-bold ">{user.status}</span>{" "}
                  </h1>
                </div>
                <div className="flex flex-col place-content-center   gap-2">
                  <button
                    className="px-6 py-2 hover:scale-101 rounded-lg text-gray-800 font-semibold text-center bg-[#7143f047] transition-all cursor-pointer capitalize "
                    onClick={() => {
                      setModify(true);
                      setUserId(user._id);
                    }}
                  >
                    {" "}
                    modify
                  </button>
                  <button
                    className="px-6 py-2 hover:scale-101 rounded-lg text-gray-800 font-semibold text-center bg-[#c0161647] hover:bg-red-400 transition-all cursor-pointer capitalize"
                    onClick={() => handleDelete(user)}
                  >
                    {" "}
                    delete
                  </button>
                </div>
                <div></div>
                {modify && (
                  <>
                    {" "}
                    <div
                      className="fixed inset-0 bg-black/50 z-40"
                      onClick={() => setModify(false)}
                    />
                    <div
                      className="fixed z-50 top-1/2 left-1/2 
        -translate-x-1/2 -translate-y-1/2
        bg-white p-6 rounded shadow w-96"
                    >
                      <h2 className="text-xl font-bold mb-4">
                        update the project{" "}
                      </h2>

                      <label className="flex flex-col w-full  " htmlFor="name">
                        <h1>name</h1>
                        <input
                          placeholder="update the name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handlechange}
                          className="border p-2 w-full mb-4"
                        />
                      </label>
                      <label
                        className="flex flex-col w-full"
                        htmlFor="discription"
                      >
                        <h1>discription</h1>
                        <textarea
                          placeholder="update the discription"
                          type="description"
                          name="description"
                          value={formData.description}
                          onChange={handlechange}
                          className="border p-2 w-full mb-4 "
                        />
                      </label>
                      <label className="flex flex-col w-full" htmlFor="status">
                        <h1>status</h1>
                        <select
                          placeholder="update the discription"
                          type="description"
                          name="status"
                          value={formData.status}
                          onChange={handlechange}
                          className="border p-2 w-full mb-4 "
                        >
                          <option value="assign">assign</option>
                          <option value="pending">pending</option>
                          <option value="completed">completed</option>
                        </select>
                      </label>

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setModify(false)}
                          className="px-4 py-2 border rounded"
                        >
                          Cancel
                        </button>

                        <button
                          onClick={onHandleModify}
                          className="px-4 py-2 bg-green-500 text-white rounded"
                        >
                          Update the ProjectManager
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))} */}
               {modify && (
                  <>
                    {" "}
                    <div
                      className="fixed inset-0 bg-black/50 z-40"
                      onClick={() => setModify(false)}
                    />
                    <div
                      className="fixed z-50 top-1/2 left-1/2 
        -translate-x-1/2 -translate-y-1/2
        bg-white p-6 rounded shadow w-96"
                    >
                      <h2 className="text-xl font-bold mb-4">
                        update the project{" "}
                      </h2>

                      <label className="flex flex-col w-full  " htmlFor="name">
                        <h1>name</h1>
                        <input
                          placeholder="update the name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handlechange}
                          className="border p-2 w-full mb-4"
                        />
                      </label>
                      <label
                        className="flex flex-col w-full"
                        htmlFor="discription"
                      >
                        <h1>discription</h1>
                        <textarea
                          placeholder="update the discription"
                          type="description"
                          name="description"
                          value={formData.description}
                          onChange={handlechange}
                          className="border p-2 w-full mb-4 "
                        />
                      </label>
                      <label className="flex flex-col w-full" htmlFor="status">
                        <h1>status</h1>
                        <select
                          placeholder="update the discription"
                          type="description"
                          name="status"
                          value={formData.status}
                          onChange={handlechange}
                          className="border p-2 w-full mb-4 "
                        >
                          <option value="assign">assign</option>
                          <option value="pending">pending</option>
                          <option value="completed">completed</option>
                        </select>
                      </label>

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setModify(false)}
                          className="px-4 py-2 border rounded"
                        >
                          Cancel
                        </button>

                        <button
                          onClick={onHandleModify}
                          className="px-4 py-2 bg-green-500 text-white rounded"
                        >
                          Update the ProjectManager
                        </button>
                      </div>
                    </div>
                  </>)}

        
        
     
      {/* <div className="flex items-center gap-4 mt-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className={`px-4 py-1.5 rounded-lg font-medium transition
            ${
              page === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-300 hover:bg-green-400 text-gray-900 hover:cursor-pointer"
            }`}
        >
          Prev
        </button>

        <span className="text-gray-700 font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className={`px-4 py-1.5 rounded-lg font-medium transition
            ${
              page === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-300 hover:bg-green-400 text-gray-900 hover:cursor-pointer"
            }`}
        >
          Next
        </button>
      </div> */}
     
    </div>
  );
}

export default Project;
