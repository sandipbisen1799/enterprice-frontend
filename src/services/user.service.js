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
export const getAllUsers = async (page = 1, limit = 10) => {
  const res = await api.get(`/auth/users?page=${page}&limit=${limit}`);
  return res.data;
};
export const getAllUsersdata = async () => {
  const res = await api.get(`/auth/user`);
  console.log(res)
  return res;
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


export const blockUsers = async (userId)=>{
  const res = await api.put (`/auth/blockuser/${userId}`);
  return res ;
}
export const handleunblockUserAPI = async (userId)=>{
  const res = await api.put( `/auth/unblockuser/${userId}`)
  return res ;
}
export const getBlockUser = async (page = 1, limit = 5) => {
  const res = await api.get(
    `/auth/blockusers?page=${page}&limit=${limit}`,
    { withCredentials: true }
  );
  return res.data;
};
export const uploadImageAPI = async (formData) => {
  const res = await api.post('/auth/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
}
export const changePasswordAPI = async (formData) => {
  const res = await api.put('/auth/changepassword', formData);
  return res.data;
}
export const updateProfileAPI = async (formData) => {
  const res = await api.put('/auth/updateprofile', formData);
  return res.data;
}