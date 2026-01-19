import api from '../utils/api'

export const signAPI = (data) => {
  return api.post("/auth/signup", data);
}
export const loginAPI = (data) => {
  return api.post("/auth/login", data);
}

export const logoutAPI = (data) => {
  return api.post("/auth/logout", data);
}
export const verifyuserAPI = async(form)=>{
  return api.post('/auth/verifyotp',form)

}
export const resenduserAPI = async(email)=>{
  return api.post('/auth/verifyotp',email)

}
export const reverifyuserAPI = async(email)=>{
  return api.post('/auth/resendotp',email)

}


export const authAPI = (data) => {
  return api.get("/auth/me", data);
}
export const getAllUsers = async () => {
  const res = await api.get("/auth/users");
  return res.data;
};
export const getAllUser = async () => {
  const res = await api.get("/auth/teammember");
  return res.data;
};
export const getUserDataAPI = async ()=>{
  const res = await api.get('/auth/userdata')
  return  res ;
}
export const getUserById = async (_id) => {
  const res = await api.get(`/auth/${_id}`);
  return res;
};
export const updateUser = async (_id, updatedData) => {
  const res = await api.put(`/auth/${_id}`, updatedData);
  return res.data;
};
export const deleteUser = async (_id) => {
  const res = await api.delete(`auth/${_id}`);
  return res.data;
};
export const addUserAPI = async (formData) => {
  const res = await api.post(`auth/add`,formData);
  
  return res.data;
};
export const createProjectManagerAPI = (data) => {
  return api.post("/auth/admin/createProjectmanager", data);
}
export const getProjectManager = async (page = 1, limit = 5) => {
  const res = await api.get(
    `/auth/admin/projectmanager?page=${page}&limit=${limit}`,
    { withCredentials: true }
  );
  return res.data;
};
export const UpdateProjectManagerAPI = async (projectManagerId, formData) => {
  const res = await api.put(`/auth/admin/${projectManagerId}`, formData);
  return res.data;
};
export const deleteProjectManagerAPI = async (projectManagerId) => {
  const res = await api.delete(`/auth/admin/${projectManagerId}`);
  return res.data;
};
export const createProjectAPI = (data) => {
  return api.post("/projects/create", data);
}
export const assignProjectAPI = (projectId, projectManagerId) =>
  api.put(`/projects/${projectId}/assign`, {
    projectManagerId,
  });

export const getProjectApi = async (page=1, limit=5)=>{
  const res = await api.get(`/projects/get?page=${page}&limit=${limit}`,
  {withCredentials:true});
  return res.data;
}
export const getAllProjectAPI = async ()=>{
  const res = await api.get(`/projects/all`)
  
  return res;
}
export const deleteProjectAPI = async(projectId)=>{
  const res = await api.delete(`projects/${projectId}/delete`)
  return res ;
}
export const updateProjectAPI = async(projectId, formData)=>{
  const res = await api.put(`projects/${projectId}/update`,formData)
  return res ;
}
export const blockUser = async (userId)=>{
  const res = await api.put (`/auth/blockuser/${userId}`);
  return res ;
}
export const handleunblockUserAPI = async (userId)=>{
  const res = await api.put( `/auth/unblockuser/${userId}`)
  return res ;
}