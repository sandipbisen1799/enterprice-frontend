import React, { useState, useEffect, useRef } from "react";
import { useApi } from "../context/contextApi";
import { toast } from "react-toastify";
import { 
  Users, 
  UserPlus, 
  MessageSquare, 
  Send, 
  UserX, 
  Check, 
  X,
  Loader2,
  Circle
} from "lucide-react";
import { 
  getFriendsAPI, 
  getFriendRequestsAPI, 
  getOnlineUsersAPI, 
  acceptFriendRequestAPI, 
  declineFriendRequestAPI, 
  removeFriendAPI, 
  sendFriendRequestAPI,
  getChatHistoryAPI,
  sendMessageAPI
} from "../services/social.service";
import socketManager from "../utils/socket";

function UserSocialHub() {
  const { user } = useApi();
  const [activeTab, setActiveTab] = useState("friends"); // friends, requests, search
  
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  
  const [loading, setLoading] = useState(false);

  // Chat window state
  const [activeChatFriend, setActiveChatFriend] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const socketRef = useRef(null);
  const chatBottomRef = useRef(null);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const res = await getFriendsAPI();
      if (res?.friends) setFriends(res.friends);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await getFriendRequestsAPI();
      if (res?.friendRequests) setRequests(res.friendRequests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOnlineUsers = async () => {
    setLoading(true);
    try {
      const res = await getOnlineUsersAPI();
      if (res?.onlineUsers) setOnlineUsers(res.onlineUsers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "friends") fetchFriends();
    if (activeTab === "requests") fetchRequests();
    if (activeTab === "search") fetchOnlineUsers();
  }, [activeTab]);

  // Connect socket on mount to receive real-time direct messages
  useEffect(() => {
    socketRef.current = socketManager.connect();
    
    // Listen for incoming messages
    socketRef.current.on("receive_message", (message) => {
      // If we are currently chatting with this sender, push to message logs
      if (activeChatFriend && (message.senderId === activeChatFriend.id || message.senderId === activeChatFriend._id)) {
        setChatMessages(prev => [...prev, message]);
      } else {
        toast.info(`New message from ${message.senderName || "Friend"}: "${message.text}"`);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off("receive_message");
      }
    };
  }, [activeChatFriend]);

  // Auto-scroll chat window to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleOpenChat = async (friend) => {
    setActiveChatFriend(friend);
    setChatLoading(true);
    try {
      const history = await getChatHistoryAPI(friend.id || friend._id);
      setChatMessages(history || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load chat history");
    } finally {
      setChatLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeChatFriend) return;

    const friendId = activeChatFriend.id || activeChatFriend._id;
    try {
      const msg = await sendMessageAPI({
        receiverId: friendId,
        text: messageText
      });
      
      // Update local messages array
      setChatMessages(prev => [...prev, {
        ...msg,
        senderId: user?.id || user?._id
      }]);
      setMessageText("");
    } catch (err) {
      console.error(err);
      toast.error("Message delivery failed!");
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const res = await acceptFriendRequestAPI(requestId);
      if (res?.success) {
        toast.success("Friend request accepted!");
        fetchRequests();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      const res = await declineFriendRequestAPI(requestId);
      if (res?.success) {
        toast.info("Friend request declined");
        fetchRequests();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendRequest = async (recipientId) => {
    try {
      const res = await sendFriendRequestAPI(recipientId);
      if (res?.success) {
        toast.success("Friend request sent successfully!");
        fetchOnlineUsers();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send request.");
    }
  };

  const handleRemoveFriend = async (friendId) => {
    if (!window.confirm("Are you sure you want to remove this friend?")) return;
    try {
      const res = await removeFriendAPI(friendId);
      if (res?.success) {
        toast.success("Friend removed successfully");
        fetchFriends();
        if (activeChatFriend && (activeChatFriend.id === friendId || activeChatFriend._id === friendId)) {
          setActiveChatFriend(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      
      {/* Directory & Requests List pane */}
      <div className="bg-slate-800/80 border border-slate-700/50 rounded-3xl p-5 flex flex-col gap-6 h-full overflow-y-auto">
        <div className="flex gap-2 p-1 bg-slate-900 border border-slate-850 rounded-2xl">
          <button
            onClick={() => setActiveTab("friends")}
            className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "friends" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"}`}
          >
            Friends
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "requests" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"}`}
          >
            Requests
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "search" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"}`}
          >
            Find Users
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 flex-1 items-center">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-3">
            {activeTab === "friends" && (
              friends.map((f) => (
                <div 
                  key={f.id || f._id} 
                  className="bg-slate-750/30 border border-slate-700/35 p-3 rounded-2xl flex items-center justify-between gap-3 hover:border-slate-600 transition-colors cursor-pointer"
                  onClick={() => handleOpenChat(f)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={f.imageUrl || f.avatar || "https://via.placeholder.com/150"} 
                        alt={f.name} 
                        className="w-10 h-10 rounded-full object-cover" 
                      />
                      <Circle className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${f.isOnline ? "fill-emerald-500 text-emerald-500" : "fill-slate-500 text-slate-500"}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-200 text-sm line-clamp-1">{f.name}</h4>
                      <p className="text-[10px] text-slate-450 mt-0.5">Wins: {f.totalWins || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => handleOpenChat(f)}
                      className="p-2 bg-indigo-500/10 hover:bg-indigo-500/25 border border-indigo-500/20 text-indigo-400 rounded-xl transition-all"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleRemoveFriend(f.id || f._id)}
                      className="p-2 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-450 rounded-xl transition-all"
                    >
                      <UserX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}

            {activeTab === "requests" && (
              requests.map((req) => (
                <div key={req.id} className="bg-slate-750/30 border border-slate-700/35 p-3 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={req.requester.imageUrl || req.requester.avatar || "https://via.placeholder.com/150"} 
                      alt={req.requester.name} 
                      className="w-10 h-10 rounded-full object-cover" 
                    />
                    <div>
                      <h4 className="font-bold text-slate-200 text-sm line-clamp-1">{req.requester.name}</h4>
                      <p className="text-[10px] text-slate-450 mt-0.5">{req.requester.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => handleAcceptRequest(req.id)}
                      className="p-2 bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-400 rounded-xl transition-all"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeclineRequest(req.id)}
                      className="p-2 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-450 rounded-xl transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}

            {activeTab === "search" && (
              onlineUsers.map((ou) => (
                <div key={ou.id} className="bg-slate-750/30 border border-slate-700/35 p-3 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={ou.imageUrl || ou.avatar || "https://via.placeholder.com/150"} 
                      alt={ou.name} 
                      className="w-10 h-10 rounded-full object-cover" 
                    />
                    <div>
                      <h4 className="font-bold text-slate-200 text-sm line-clamp-1">{ou.name}</h4>
                      <p className="text-[10px] text-slate-450 mt-0.5">Wins: {ou.totalWins || 0}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleSendRequest(ou.id)}
                    className="p-2 bg-indigo-500/10 hover:bg-indigo-500/25 border border-indigo-500/20 text-indigo-400 rounded-xl transition-all flex items-center gap-1 text-xs font-bold px-3 py-2"
                  >
                    <UserPlus className="w-4 h-4" /> Add
                  </button>
                </div>
              ))
            )}

            {activeTab === "friends" && friends.length === 0 && (
              <div className="text-center py-12 text-slate-500 font-bold text-xs uppercase tracking-wide">
                No friends added yet
              </div>
            )}
            {activeTab === "requests" && requests.length === 0 && (
              <div className="text-center py-12 text-slate-500 font-bold text-xs uppercase tracking-wide">
                No pending requests
              </div>
            )}
            {activeTab === "search" && onlineUsers.length === 0 && (
              <div className="text-center py-12 text-slate-500 font-bold text-xs uppercase tracking-wide">
                No other online users found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Messaging Pane */}
      <div className="lg:col-span-2 bg-slate-800/80 border border-slate-700/50 rounded-3xl p-5 flex flex-col justify-between h-full overflow-hidden">
        {activeChatFriend ? (
          <>
            {/* Header info */}
            <div className="flex items-center gap-3 border-b border-slate-700/50 pb-3">
              <img 
                src={activeChatFriend.imageUrl || activeChatFriend.avatar || "https://via.placeholder.com/150"} 
                alt={activeChatFriend.name} 
                className="w-10 h-10 rounded-full object-cover" 
              />
              <div>
                <h4 className="font-extrabold text-slate-100 text-sm">{activeChatFriend.name}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Direct chat session</p>
              </div>
            </div>

            {/* Message window */}
            <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3 px-2">
              {chatLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                </div>
              ) : (
                chatMessages.map((msg) => {
                  const isMe = msg.senderId === user?.id || msg.senderId === user?._id || msg.sender === user?.id || msg.sender === user?._id;
                  return (
                    <div 
                      key={msg.id || msg._id} 
                      className={`flex flex-col max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${isMe ? "ml-auto bg-indigo-600 text-white rounded-tr-none" : "mr-auto bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none"}`}
                    >
                      <p>{msg.text}</p>
                      <span className="text-[9px] text-slate-400 mt-1 text-right block">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input message form */}
            <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-slate-700/50 pt-3">
              <input 
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
              />
              <button 
                type="submit"
                disabled={!messageText.trim()}
                className="p-3 bg-indigo-650 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-600/10"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center gap-3 flex-1">
            <MessageSquare className="w-12 h-12 text-slate-700" />
            <h4 className="font-extrabold text-slate-400 text-sm">No Active Conversation</h4>
            <p className="text-xs text-slate-500 max-w-xs">
              Select a friend from the directory pane to open a real-time direct message window.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserSocialHub;
