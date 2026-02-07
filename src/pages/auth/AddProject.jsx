import React, { useState } from "react";
import Button from '@mui/material/Button';
import { createProjectAPI } from "../../services/user.service.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function AddProject() {
  const Navigate = useNavigate();
  
  const [formData, setFormdata] = useState({
    name: "",
    status: "",
    description: "",
    startDate: "",
    endDate: "",
    visibility: "public",
    priority: "medium",
    budget: "",
  });

  function handlechange(event) {
    const { name, type, value, checked } = event.target;
    setFormdata((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  const handleCreateProject = async () => {
    try {
      const res = await createProjectAPI(formData);
      console.log(res);
      if (res) {
        Navigate("/admin/projects");
      }
      toast.success("Project created successfully!");
    } catch (error) {
      console.error(error.response?.data?.message);
      toast.error("Failed to create project!");
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="mb-6 border-b pb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Create New Project
          </h2>
          <p className="text-sm text-gray-500">
            Fill in the details to create a project
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5 bg-white">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handlechange}
              placeholder="Enter project name"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handlechange}
              placeholder="Describe your project"
              rows="3"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
            />
          </div>

          {/* Visibility & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visibility
              </label>
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handlechange}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handlechange}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handlechange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handlechange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget (₹)
            </label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handlechange}
              placeholder="Enter budget"
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
              onClick={() => Navigate("/admin/projects")}
            >
              Cancel
            </button>

            <button
              onClick={handleCreateProject}
              className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
            >
              Create Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProject;
