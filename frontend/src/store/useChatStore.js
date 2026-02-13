import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { playSound } from "../lib/sounds";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  groups: [],
  isMessagesLoading: false,
  isGroupsLoading: false,
  typingUsers: [],
  isTruthMode: false,
  xp: Number(localStorage.getItem("pingr-xp")) || 0,
  level: Number(localStorage.getItem("pingr-level")) || 1,

  addXP: (amount) => {
    const newXP = get().xp + amount;
    const newLevel = Math.floor(newXP / 100) + 1;
    localStorage.setItem("pingr-xp", newXP);
    localStorage.setItem("pingr-level", newLevel);
    set({ xp: newXP, level: newLevel });
  },

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (chatId, isGroup = false) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${chatId}?isGroup=${isGroup}`);
      set({ messages: res.data });
      get().markMessagesAsSeen(chatId, isGroup);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  getGroups: async () => {
    set({ isGroupsLoading: true });
    try {
      const res = await axiosInstance.get("/groups/all");
      set({ groups: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching groups");
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  createGroup: async (groupData) => {
    try {
      const res = await axiosInstance.post("/groups/create", groupData);
      set({ groups: [...get().groups, res.data] });
      toast.success("Group created successfully!");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating group");
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages, addXP } = get();
    const isGroup = !!selectedUser.members;
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, {
        ...messageData,
        isGroup,
      });
      set({ messages: [...messages, res.data] });
      // Update local sidebar preview
      if (isGroup) {
        set({
          groups: get().groups.map(g => g._id === selectedUser._id ? { ...g, lastMessage: res.data } : g)
        });
      } else {
        set({
          users: get().users.map(u => u._id === selectedUser._id ? { ...u, lastMessage: res.data } : u)
        });
      }
      playSound("sent");
      addXP(10);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending message");
    }
  },

  toggleReaction: async (messageId, emoji) => {
    try {
      const res = await axiosInstance.patch(`/messages/react/${messageId}`, { emoji });
      set({
        messages: get().messages.map((m) =>
          m._id === messageId ? { ...m, reactions: res.data } : m
        ),
      });
    } catch (error) {
      toast.error("Failed to react");
    }
  },

  deleteMessage: async (messageId, type) => {
    try {
      await axiosInstance.patch(`/messages/delete/${messageId}`, { type });
      if (type === "me") {
        set({ messages: get().messages.filter((m) => m._id !== messageId) });
      } else {
        set({
          messages: get().messages.map((m) =>
            m._id === messageId ? { ...m, isDeletedForEveryone: true, text: "This message was deleted", image: null } : m
          ),
        });
      }
      toast.success("Message deleted");
    } catch (error) {
      toast.error("Failed to delete message");
    }
  },

  markMessagesAsSeen: async (chatId, isGroup = false) => {
    try {
      await axiosInstance.patch(`/messages/read/${chatId}?isGroup=${isGroup}`);
      if (!isGroup) {
        set({
          users: get().users.map(u => u._id === chatId ? { ...u, unreadCount: 0 } : u)
        });
      }
    } catch (error) {
      console.log("Error marking as seen:", error);
    }
  },

  sendTyping: (receiverId) => {
    const { selectedUser } = get();
    const socket = useAuthStore.getState().socket;
    if (socket) socket.emit("typing", { receiverId, isGroup: !!selectedUser.members });
  },

  sendStopTyping: (receiverId) => {
    const { selectedUser } = get();
    const socket = useAuthStore.getState().socket;
    if (socket) socket.emit("stopTyping", { receiverId, isGroup: !!selectedUser.members });
  },

  toggleTruthMode: (receiverId) => {
    const { selectedUser, isTruthMode, addXP } = get();
    if (!selectedUser.members) {
      return toast.error("Truth Mode is only for groups! 🕵️");
    }
    const socket = useAuthStore.getState().socket;
    const nextState = !isTruthMode;
    set({ isTruthMode: nextState });
    if (socket) {
      socket.emit(nextState ? "truthModeStart" : "truthModeEnd", { receiverId, isGroup: true });
    }
    toast(nextState ? "🕵️ Truth Mode Active! (Anonymous)" : "🎭 Truth Mode Ended", {
      icon: nextState ? "🕵️" : "🎭",
      style: { borderRadius: '20px', background: '#333', color: '#fff' }
    });
    if (nextState) addXP(20);
  },

  subscribeToMessages: () => {
    const { selectedUser, addXP } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    const isGroup = !!selectedUser.members;

    if (isGroup) {
      socket.emit("joinGroup", selectedUser._id);
    }

    socket.on("newMessage", (newMessage) => {
      const isCorrectChat = isGroup
        ? newMessage.groupId === selectedUser._id
        : (newMessage.senderId._id || newMessage.senderId) === selectedUser._id || (newMessage.receiverId === selectedUser._id && (newMessage.senderId._id || newMessage.senderId) === authUser._id);

      if (isCorrectChat) {
        // Prevent duplicates
        const exists = get().messages.some(m => m._id === newMessage._id);
        if (!exists) {
          set({ messages: [...get().messages, newMessage] });
          if (newMessage.senderId._id !== authUser._id) {
            playSound("received");
            get().markMessagesAsSeen(selectedUser._id, isGroup);
          }
        }
      }

      // Update sidebar previews and unread counts
      if (newMessage.groupId) {
        set({
          groups: get().groups.map(g => g._id === newMessage.groupId ? { ...g, lastMessage: newMessage } : g)
            .sort((a, b) => new Date(b.lastMessage?.createdAt || 0) - new Date(a.lastMessage?.createdAt || 0))
        });
      } else {
        const otherUserId = newMessage.senderId._id === authUser._id ? newMessage.receiverId : newMessage.senderId._id;
        set({
          users: get().users.map(u => {
            if (u._id === otherUserId) {
              return {
                ...u,
                lastMessage: newMessage,
                unreadCount: (newMessage.senderId._id !== authUser._id && (!selectedUser || selectedUser._id !== otherUserId)) ? (u.unreadCount || 0) + 1 : u.unreadCount
              };
            }
            return u;
          }).sort((a, b) => new Date(b.lastMessage?.createdAt || 0) - new Date(a.lastMessage?.createdAt || 0))
        });
      }
    });

    socket.on("messageReaction", ({ messageId, reactions }) => {
      set({
        messages: get().messages.map((m) =>
          m._id === messageId ? { ...m, reactions } : m
        ),
      });
    });

    socket.on("messageDeleted", ({ messageId, isDeletedForEveryone }) => {
      if (isDeletedForEveryone) {
        set({
          messages: get().messages.map((m) =>
            m._id === messageId ? { ...m, isDeletedForEveryone: true, text: "This message was deleted", image: null } : m
          ),
        });
      }
    });

    socket.on("messagesSeen", ({ chatId, isGroup: eventIsGroup }) => {
      // If it's a 1-to-1 chat, chatId is the user who saw it.
      // If it's a group chat, chatId is the members who saw it.
      const isCorrectChat = eventIsGroup ? isGroup && selectedUser._id : selectedUser && selectedUser._id === chatId;

      if (isCorrectChat) {
        set({
          messages: get().messages.map(m => ({
            ...m,
            seenBy: [...new Set([...(m.seenBy || []), chatId])]
          }))
        });
      }
    });

    socket.on("truthModeStarted", () => {
      set({ isTruthMode: true });
      toast("🕵️ Someone activated Truth Mode!", { icon: "🕵️" });
    });

    socket.on("truthModeEnded", () => {
      set({ isTruthMode: false });
      toast("🎭 Truth Mode deactivated", { icon: "🎭" });
    });

    socket.on("userTyping", ({ senderId }) => {
      if (!get().typingUsers.includes(senderId)) {
        set({ typingUsers: [...get().typingUsers, senderId] });
      }
    });

    socket.on("userStoppedTyping", ({ senderId }) => {
      set({ typingUsers: get().typingUsers.filter((id) => id !== senderId) });
    });
  },

  unsubscribeFromMessages: () => {
    const { selectedUser } = get();
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    if (selectedUser?.members) {
      socket.emit("leaveGroup", selectedUser._id);
    }

    socket.off("newMessage");
    socket.off("userTyping");
    socket.off("userStoppedTyping");
    socket.off("truthModeStarted");
    socket.off("truthModeEnded");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
