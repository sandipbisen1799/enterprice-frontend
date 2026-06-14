import api from '../utils/api.js';

export const sendFriendRequestAPI = async (recipientId) => {
  const res = await api.post("/social/friend-request", { recipientId });
  return res.data;
};

export const acceptFriendRequestAPI = async (requestId) => {
  const res = await api.post(`/social/accept-friend/${requestId}`);
  return res.data;
};

export const declineFriendRequestAPI = async (requestId) => {
  const res = await api.post(`/social/decline-friend/${requestId}`);
  return res.data;
};

export const getFriendRequestsAPI = async () => {
  const res = await api.get("/social/friend-requests");
  return res.data;
};

export const getFriendsAPI = async () => {
  const res = await api.get("/social/friends");
  return res.data;
};

export const getOnlineUsersAPI = async (limit = 50) => {
  const res = await api.get(`/social/online-users?limit=${limit}`);
  return res.data;
};

export const removeFriendAPI = async (friendId) => {
  const res = await api.delete(`/social/friend/${friendId}`);
  return res.data;
};

// Game Invites
export const sendGameInviteAPI = async (inviteeId, gameType = 'hand_cricket', entryFee = 0) => {
  const res = await api.post("/games/invite", { inviteeId, gameType, entryFee });
  return res.data;
};

export const acceptGameInviteAPI = async (inviteId) => {
  const res = await api.post(`/games/invite/${inviteId}/accept`);
  return res.data;
};

export const declineGameInviteAPI = async (inviteId) => {
  const res = await api.post(`/games/invite/${inviteId}/decline`);
  return res.data;
};

export const getPendingInvitesAPI = async () => {
  const res = await api.get("/games/invites/pending");
  return res.data;
};

export const getAllInvitesAPI = async () => {
  const res = await api.get("/games/invites/all");
  return res.data;
};

// Chat Messaging
export const getChatHistoryAPI = async (friendId) => {
  const res = await api.get(`/social/chat/${friendId}`);
  return res.data;
};

export const sendMessageAPI = async (data) => {
  const res = await api.post("/social/chat/send", data);
  return res.data;
};

export const markSeenAPI = async (data) => {
  const res = await api.post("/social/chat/seen", data);
  return res.data;
};
