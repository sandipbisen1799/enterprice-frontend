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
  const { user, theme } = useApi();
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-160px)] animate-in fade-in duration-300">
      
      {/* Directory & Requests List Pane */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 flex flex-col gap-5 h-full overflow-y-auto shadow-xs">
        
        {/* Navigation Tabs */}
        <div className="flex gap-1.5 p-1 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-805/60 rounded-2xl">
          <button
            onClick={() => setActiveTab("friends")}
            className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "friends" ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-xs" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-250"}`}
          >
            Friends
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "requests" ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-xs" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-250"}`}
          >
            Requests
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "search" ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-xs" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-250"}`}
          >
            Find Users
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 flex-1 items-center">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-3">
            
            {/* Friends Tab */}
            {activeTab === "friends" && (
              friends.map((f) => (
                <div 
                  key={f.id || f._id} 
                  className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-805/50 p-3 rounded-2xl flex items-center justify-between gap-3 hover:border-slate-350 dark:hover:border-slate-700 transition-colors cursor-pointer"
                  onClick={() => handleOpenChat(f)}
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="relative">
                      <img 
                        src={f.imageUrl || f.avatar || "https://via.placeholder.com/150"} 
                        alt={f.name} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-200/60 dark:border-slate-800" 
                      />
                      <Circle className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${f.isOnline ? "fill-emerald-500 text-emerald-500" : "fill-slate-400 text-slate-400"}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm line-clamp-1">{f.name}</h4>
                      <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-0.5 font-medium">Wins: {f.totalWins || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => handleOpenChat(f)}
                      className="p-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl transition-all border border-transparent cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleRemoveFriend(f.id || f._id)}
                      className="p-2 bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white rounded-xl transition-all border border-transparent cursor-pointer"
                    >
                      <UserX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Friend Requests Tab */}
            {activeTab === "requests" && (
              requests.map((req) => (
                <div key={req.id} className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-805/50 p-3 rounded-2xl flex items-center justify-between gap-3 text-left">
                  <div className="flex items-center gap-3">
                    <img 
                      src={req.requester.imageUrl || req.requester.avatar || "https://via.placeholder.com/150"} 
                      alt={req.requester.name} 
                      className="w-10 h-10 rounded-full object-cover border border-slate-200/60 dark:border-slate-800" 
                    />
                    <div>
                      <h4 className="font-bold text-slate-805 dark:text-slate-200 text-sm line-clamp-1">{req.requester.name}</h4>
                      <p className="text-[10px] text-slate-450 dark:text-slate-450 mt-0.5 line-clamp-1">{req.requester.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => handleAcceptRequest(req.id)}
                      className="p-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white rounded-xl transition-all border border-transparent cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeclineRequest(req.id)}
                      className="p-2 bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white rounded-xl transition-all border border-transparent cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Find Users Tab */}
            {activeTab === "search" && (
              onlineUsers.map((ou) => (
                <div key={ou.id} className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-805/50 p-3 rounded-2xl flex items-center justify-between gap-3 text-left">
                  <div className="flex items-center gap-3">
                    <img 
                      src={ou.imageUrl || ou.avatar || "https://via.placeholder.com/150"} 
                      alt={ou.name} 
                      className="w-10 h-10 rounded-full object-cover border border-slate-200/60 dark:border-slate-800" 
                    />
                    <div>
                      <h4 className="font-bold text-slate-805 dark:text-slate-200 text-sm line-clamp-1">{ou.name}</h4>
                      <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-0.5 font-medium">Wins: {ou.totalWins || 0}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleSendRequest(ou.id)}
                    className="p-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl transition-all flex items-center gap-1 text-[11px] font-bold px-3 py-2 border border-transparent cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              ))
            )}

            {/* Empty States */}
            {activeTab === "friends" && friends.length === 0 && (
              <div className="text-center py-16 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-wider">
                No friends added yet
              </div>
            )}
            {activeTab === "requests" && requests.length === 0 && (
              <div className="text-center py-16 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-wider">
                No pending requests
              </div>
            )}
            {activeTab === "search" && onlineUsers.length === 0 && (
              <div className="text-center py-16 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-wider">
                No other online users found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Messaging Pane */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 flex flex-col justify-between h-full overflow-hidden shadow-xs">
        {activeChatFriend ? (
          <>
            {/* Header Info */}
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 text-left">
              <img 
                src={activeChatFriend.imageUrl || activeChatFriend.avatar || "https://via.placeholder.com/150"} 
                alt={activeChatFriend.name} 
                className="w-10 h-10 rounded-full object-cover border border-slate-200/60 dark:border-slate-800" 
              />
              <div>
                <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">{activeChatFriend.name}</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-455 mt-0.5">Direct chat session</p>
              </div>
            </div>

            {/* Message Logs */}
            <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3.5 px-2">
              {chatLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : (
                chatMessages.map((msg) => {
                  const isMe = msg.senderId === user?.id || msg.senderId === user?._id || msg.sender === user?.id || msg.sender === user?._id;
                  return (
                    <div 
                      key={msg.id || msg._id} 
                      className={`flex flex-col max-w-[75%] rounded-2xl px-4 py-2.5 text-xs text-left ${isMe ? "ml-auto bg-primary text-white rounded-tr-none" : "mr-auto bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805/50 text-slate-800 dark:text-slate-200 rounded-tl-none"}`}
                    >
                      <p>{msg.text}</p>
                      <span className={`text-[8px] mt-1.5 text-right block ${isMe ? "text-white/70" : "text-slate-400"}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input message form */}
            <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-slate-100 dark:border-slate-800 pt-3.5">
              <input 
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary dark:focus:border-indigo-500 focus:ring-2 focus:ring-primary/10"
              />
              <button 
                type="submit"
                disabled={!messageText.trim()}
                className="p-3 bg-primary hover:bg-primary-hover disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center gap-4 flex-1">
            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-center text-slate-400">
              <MessageSquare className="w-6 h-6 text-slate-400" />
            </div>
            <h4 className="font-extrabold text-slate-500 dark:text-slate-400 text-sm">No Active Conversation</h4>
            <p className="text-xs text-slate-405 dark:text-slate-500 max-w-xs leading-relaxed">
              Select a friend from the directory list on the left to open a real-time message stream.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserSocialHub;
