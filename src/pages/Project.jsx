import React, { useState, useEffect } from "react";

import {
  deleteProjectAPI,
  getProjectApi,
  updateProjectAPI,
} from "../services/user.service";
import { Eye, EyeOff } from "lucide-react";
import { createProjectAPI } from "../services/user.service";
function Project() {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [projects, setProjects] = useState([]);
  const [modify, setModify] = useState(false);
  const [userId, setUserId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormdata] = useState({
    name: "",
    status: "",
    description: "",
  });
  // const [showPassword, setShowPassword] = useState(false);

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
      const data = await getProjectApi(page, 2);
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
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onHandleModify = async () => {
    try {
      console.log(formData);
      console.log(userId);
      const projectId = userId;
      const res = updateProjectAPI(projectId, formData);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCreateProject = async () => {
    try {
      const res = await createProjectAPI(formData);
      console.log(res);
    } catch (error) {
      console.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page]);

  return (
    <div className="min-h-screen w-full  h-full items-center flex flex-col bg-[#F3F4F6]  ">
      <div className="w-full h-20 justify-between px-3 flex flex-row  items-center border-b border-gray-200  ">
        <h1 className="text-2xl font-bold capitalize text-gray-800">
          project section
        </h1>
        <button
          className="px-6 py-2 hover:scale-101 hover:text-white rounded-lg text-gray-800 font-semibold text-center bg-[#7143f047] transition-all cursor-pointer"
          onClick={() => setIsEditOpen(true)}
        >
          create the project
        </button>
      </div>

      <div className="flex flex-col justify-between items-center gap-y-2.5  w-full  bg-[#F3F4F6]  ">
        <h1 className="text-2xl md:text-3xl text-center  font-bold text-gray-900">
          {" "}
          Projects List
        </h1>
        <div className=" w-full mt-2.5  md:w-3/4  flex flex-col  items-center  bg-[#E5E7EB] rounded-lg   h-full shadow-2xs ">
          <div className="w-full max-w-3xl p-1 md:p-4 flex flex-col gap-4 overflow-y-auto">
            {projects.length === 0 && (
              <p className="text-center text-gray-600">
                No project managers found.
              </p>
            )}

            {projects.map((user) => (
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
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-2">
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
      </div>
      {isEditOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsEditOpen(false)}
          />

          {/* Modal */}
          <div
            className="fixed z-50 top-1/2 left-1/2 
        -translate-x-1/2 -translate-y-1/2
        bg-white p-6 rounded shadow w-96"
          >
            <h2 className="text-xl font-bold mb-4">create the project</h2>

            <label className="flex flex-col w-full  " htmlFor="name">
              <h1>name</h1>
              <input
                placeholder="write the name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handlechange}
                className="border p-2 w-full mb-4"
              />
            </label>
            <label className="flex flex-col w-full" htmlFor="discreption">
              <h1>description</h1>
              <input
                placeholder="write the discription"
                type="text"
                name="description"
                value={formData.description}
                onChange={handlechange}
                className="border p-2 w-full mb-4 "
              />
            </label>

            <div className="flex justify-end gap-2">
              <button
                onClick={setIsEditOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateProject}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                create the project
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Project;
