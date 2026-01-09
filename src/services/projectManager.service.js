import api from "../utils/api.js";
export const getMyTeamMembers = async (page = 1, limit = 2) => {
  const res = await api.get(
    `/projectManager/teamMember/?page=${page}&limit=${limit}`,
    { withCredentials: true }
  );
  return res.data;
};
export const getMyProjectsAPI = async () => {
  const res = await api.get(
    `/projectManager/myprojects`);
  return res.data;
};
export const createMyTeamMember = async (projecManagerId,formData)=>{
  const res = await api.post(`/projectManager/createTeammember/${projecManagerId}`,formData)
  return res ;
};
export const deleteTeamMembersAPI = async (teamMemberId,projectManagerId) => {
  const res = await api.delete(`/projectManager/delete/${teamMemberId}/${projectManagerId}`);
  return res ;
}