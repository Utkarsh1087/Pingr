import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-4 border-b border-base-content/10 glass-effect">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative group">
            <div className="size-11 rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-base-100 overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            {onlineUsers.includes(selectedUser._id) && (
              <span className="absolute bottom-0 right-0 size-3.5 bg-green-500 rounded-full ring-2 ring-base-100 shadow-md animate-pulse" />
            )}
          </div>

          {/* User info */}
          <div>
            <h3 className="font-bold text-base-content bg-gradient-to-r from-base-content to-base-content/70 bg-clip-text text-transparent">
              {selectedUser.fullName}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`size-1.5 rounded-full ${onlineUsers.includes(selectedUser._id) ? "bg-green-500" : "bg-base-content/30"}`} />
              <p className={`text-xs font-semibold uppercase tracking-wider ${onlineUsers.includes(selectedUser._id) ? "text-green-500/80" : "text-base-content/40"}`}>
                {onlineUsers.includes(selectedUser._id) ? "Online now" : "Offline"}
              </p>
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => setSelectedUser(null)}
          className="p-2 rounded-xl hover:bg-base-content/5 text-base-content/40 hover:text-base-content transition-all duration-200"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
