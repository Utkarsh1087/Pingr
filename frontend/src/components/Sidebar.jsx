import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-content/10 flex flex-col transition-all duration-300 bg-base-100/30 backdrop-blur-xl">
      <div className="border-b border-base-content/10 w-full p-6 bg-base-100/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="size-5 text-primary" />
          </div>
          <span className="font-semibold text-lg hidden lg:block bg-gradient-to-r from-base-content to-base-content/70 bg-clip-text text-transparent">
            Contacts
          </span>
        </div>

        <div className="mt-4 hidden lg:flex flex-col gap-3">
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm font-medium text-base-content/70 group-hover:text-base-content transition-colors">
              Online only
            </span>
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-primary checkbox-sm rounded-md"
            />
          </label>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-base-content/50">
              {onlineUsers.length - 1} users active
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-4 space-y-1 px-2">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3 rounded-xl
              transition-all duration-200 group
              ${selectedUser?._id === user._id
                ? "bg-primary/15 ring-1 ring-primary/20 shadow-glass-sm"
                : "hover:bg-base-content/5"}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <div className={`p-0.5 rounded-full transition-all duration-300 ${selectedUser?._id === user._id ? "ring-2 ring-primary ring-offset-2 ring-offset-base-100" : "ring-1 ring-base-content/10"
                }`}>
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="size-11 object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0.5 right-0.5 size-3 bg-green-500 
                  rounded-full ring-2 ring-base-100 shadow-md"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className={`font-semibold truncate transition-colors ${selectedUser?._id === user._id ? "text-primary" : "text-base-content"
                }`}>
                {user.fullName}
              </div>
              <div className="text-xs font-medium text-base-content/40 flex items-center gap-1">
                {onlineUsers.includes(user._id) ? (
                  <>
                    <span className="size-1.5 rounded-full bg-green-500" />
                    <span className="text-green-500/80">Active now</span>
                  </>
                ) : (
                  <span className="italic">Offline</span>
                )}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center py-10 px-4">
            <div className="size-12 rounded-full bg-base-content/5 flex items-center justify-center mx-auto mb-3">
              <Users className="size-6 text-base-content/20" />
            </div>
            <p className="text-sm font-medium text-base-content/40">No one's online</p>
          </div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
