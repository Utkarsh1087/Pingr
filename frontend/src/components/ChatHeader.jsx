import { X, Ghost } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const selectedUser = useChatStore((state) => state.selectedUser);
  const setSelectedUser = useChatStore((state) => state.setSelectedUser);
  const isTruthMode = useChatStore((state) => state.isTruthMode);
  const toggleTruthMode = useChatStore((state) => state.toggleTruthMode);

  const onlineUsers = useAuthStore((state) => state.onlineUsers);
  const authUser = useAuthStore((state) => state.authUser);
  const isGroup = !!selectedUser?.members;

  const formatLastSeen = (date) => {
    if (!date) return "Long ago";
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-4 border-b border-base-content/10 glass-effect">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative group">
            <div className={`size-11 rounded-full ring-2 ${isTruthMode ? "ring-neutral" : "ring-primary/20"} ring-offset-2 ring-offset-base-100 overflow-hidden shadow-lg transition-all duration-500 ${isTruthMode ? "grayscale" : "group-hover:scale-105"}`}>
              {isGroup && !isTruthMode ? (
                <div className="size-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {selectedUser.groupPic ? (
                    <img src={selectedUser.groupPic} className="size-full object-cover" />
                  ) : (
                    selectedUser.name[0].toUpperCase()
                  )}
                </div>
              ) : (
                <img
                  src={isTruthMode ? "/avatar.png" : selectedUser.profilePic || "/avatar.png"}
                  alt={isTruthMode ? "Anonymous" : (isGroup ? selectedUser.name : selectedUser.fullName)}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {!isTruthMode && !isGroup && onlineUsers.includes(selectedUser?._id) && (
              <span className="absolute bottom-0 right-0 size-3.5 bg-green-500 rounded-full ring-2 ring-base-100 shadow-md animate-pulse" />
            )}
            {isGroup && !isTruthMode && (
              <span className="absolute -bottom-1 -right-1 size-5 bg-primary text-primary-content rounded-full ring-2 ring-base-100 flex items-center justify-center text-[10px] font-bold shadow-md">
                {selectedUser.members.length}
              </span>
            )}
          </div>

          {/* User info */}
          <div
            className="group/info"
          >
            <h3 className={`font-bold text-base-content ${isTruthMode ? "italic opacity-50" : "bg-gradient-to-r cursor-pointer from-base-content to-base-content/70 bg-clip-text text-transparent group-hover/info:text-primary transition-colors"}`}>
              {isTruthMode ? "Anonymous Shadow" : (isGroup ? selectedUser.name : selectedUser.fullName)}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              {!isGroup && <span className={`size-1.5 rounded-full ${isTruthMode ? "bg-neutral" : (onlineUsers.includes(selectedUser._id) ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-base-content/30")}`} />}
              <p className={`text-[10px] font-bold uppercase tracking-widest ${isTruthMode ? "text-neutral-content/40" : (isGroup ? "text-primary/60" : (onlineUsers.includes(selectedUser._id) ? "text-green-500/80" : "text-base-content/40"))}`}>
                {isTruthMode ? "Truth Mode Active" : (isGroup ? `${selectedUser.members.length} Members Online` : (onlineUsers.includes(selectedUser._id) ? "Online now" : `Last seen ${formatLastSeen(selectedUser.lastSeen)}`))}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Truth Mode Toggle */}
          {isGroup && (
            <button
              onClick={() => toggleTruthMode(selectedUser._id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 ${isTruthMode
                ? "bg-neutral text-neutral-content border-transparent shadow-lg scale-105"
                : "border-base-content/10 text-base-content/50 hover:bg-base-content/5 hover:text-base-content"}`}
            >
              <Ghost className={`size-4 ${isTruthMode ? "animate-bounce" : ""}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:block">Truth Mode</span>
            </button>
          )}

          {/* Close button */}
          <button
            onClick={() => setSelectedUser(null)}
            className="p-2 rounded-xl hover:bg-base-content/5 text-base-content/40 hover:text-base-content transition-all duration-200"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

    </div>
  );
};
export default ChatHeader;
