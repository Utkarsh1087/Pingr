import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Search, Users, X } from "lucide-react";

const Sidebar = () => {
  const users = useChatStore((state) => state.users);
  const selectedUser = useChatStore((state) => state.selectedUser);
  const setSelectedUser = useChatStore((state) => state.setSelectedUser);
  const isUsersLoading = useChatStore((state) => state.isUsersLoading);
  const typingUsers = useChatStore((state) => state.typingUsers);
  const level = useChatStore((state) => state.level);
  const xp = useChatStore((state) => state.xp);
  const groups = useChatStore((state) => state.groups);
  const isGroupsLoading = useChatStore((state) => state.isGroupsLoading);
  const getUsers = useChatStore((state) => state.getUsers);
  const getGroups = useChatStore((state) => state.getGroups);
  const createGroup = useChatStore((state) => state.createGroup);

  const onlineUsers = useAuthStore((state) => state.onlineUsers);
  const authUser = useAuthStore((state) => state.authUser);

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("users"); // "users" or "groups"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    getUsers();
    getGroups();
  }, [getUsers, getGroups]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim() || selectedMembers.length === 0) return;
    await createGroup({
      name: newGroupName,
      members: selectedMembers,
    });
    setIsModalOpen(false);
    setNewGroupName("");
    setSelectedMembers([]);
  };

  const toggleMember = (userId) => {
    setSelectedMembers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOnline = showOnlineOnly ? onlineUsers.includes(user._id) : true;
    return matchesSearch && matchesOnline;
  });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-content/10 flex flex-col transition-all duration-300 bg-base-100/30 backdrop-blur-xl">
      <div className="border-b border-base-content/10 w-full p-6 bg-base-100/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="size-5 text-primary" />
            </div>
            <span className="font-semibold text-lg hidden lg:block bg-gradient-to-r from-base-content to-base-content/70 bg-clip-text text-transparent">
              Contacts
            </span>
          </div>
          {/* Level Badge */}
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-tighter text-primary/60">Level {level}</span>
            <div className="w-12 h-1 bg-base-content/10 rounded-full overflow-hidden mt-0.5">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${xp % 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative group hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/30 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full bg-base-content/5 border border-transparent focus:border-primary/20 focus:bg-base-content/10 rounded-xl py-2 pl-9 pr-8 text-sm outline-none transition-all placeholder:text-base-content/30"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-base-content/10 rounded-md transition-all"
            >
              <X className="size-3 text-base-content/40" />
            </button>
          )}
        </div>

        <div className="mt-4 hidden lg:flex flex-col gap-3">
          <div className="flex bg-base-content/5 p-1 rounded-xl gap-1">
            <button
              onClick={() => setActiveTab("users")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === "users" ? "bg-primary text-primary-content shadow-glass-sm" : "hover:bg-base-content/5"}`}
            >
              DMs
            </button>
            <button
              onClick={() => setActiveTab("groups")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === "groups" ? "bg-primary text-primary-content shadow-glass-sm" : "hover:bg-base-content/5"}`}
            >
              Groups
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-2 bg-gradient-to-r from-primary to-primary/80 text-primary-content rounded-xl text-xs font-bold shadow-glass-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>+ New Group</span>
          </button>

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
        </div>
      </div>

      <div className="overflow-y-auto w-full py-4 space-y-1 px-2">
        {activeTab === "users" ? (
          users.filter(u => u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) && (showOnlineOnly ? onlineUsers.includes(u._id) : true))
            .map((user) => (
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
                  {onlineUsers.includes(user._id) ? (
                    <span
                      className="absolute bottom-0.5 right-0.5 size-3.5 bg-green-500 
                  rounded-full ring-2 ring-base-100 shadow-md animate-pulse"
                    />
                  ) : (
                    <span
                      className="absolute bottom-0.5 right-0.5 size-3.5 bg-red-300
                  rounded-full ring-2 ring-base-100"
                    />
                  )}
                </div>

                {/* User info - only visible on larger screens */}
                <div className="hidden lg:block text-left min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className={`font-bold truncate transition-colors ${selectedUser?._id === user._id ? "text-primary text-sm" : "text-base-content text-[13px]"
                      }`}>
                      {user.fullName}
                    </div>
                    {user.unreadCount > 0 && (
                      <div className="bg-primary text-primary-content size-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg shadow-primary/20 animate-pulse">
                        {user.unreadCount}
                      </div>
                    )}
                  </div>
                  <div className="text-xs font-medium flex items-center gap-1 overflow-hidden">
                    {typingUsers.includes(user._id) ? (
                      <span className="text-primary animate-pulse font-bold truncate">Typing...</span>
                    ) : (
                      <span className="text-base-content/40 truncate italic flex items-center gap-1">
                        {user.lastMessage ? (
                          <>
                            {user.lastMessage.senderId === authUser._id && <span className="font-bold opacity-70 text-[10px]">You:</span>}
                            <span className="truncate">{user.lastMessage.text || "📷 Image"}</span>
                          </>
                        ) : (user.about || "Available")}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
        ) : (
          groups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((group) => (
              <button
                key={group._id}
                onClick={() => setSelectedUser(group)}
                className={`
              w-full p-3 flex items-center gap-3 rounded-xl
              transition-all duration-200 group
              ${selectedUser?._id === group._id
                    ? "bg-primary/15 ring-1 ring-primary/20 shadow-glass-sm"
                    : "hover:bg-base-content/5"}
            `}
              >
                <div className="relative mx-auto lg:mx-0">
                  <div className={`p-0.5 rounded-full transition-all duration-300 ${selectedUser?._id === group._id ? "ring-2 ring-primary ring-offset-2 ring-offset-base-100" : "ring-1 ring-base-content/10"
                    }`}>
                    <div className="size-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {group.groupPic ? (
                        <img src={group.groupPic} className="size-full rounded-full object-cover" />
                      ) : (
                        group.name[0].toUpperCase()
                      )}
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block text-left min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div className={`font-semibold truncate transition-colors ${selectedUser?._id === group._id ? "text-primary" : "text-base-content"
                      }`}>
                      {group.name}
                    </div>
                    <div className="px-1.5 py-0.5 rounded bg-base-content/5 text-[9px] font-bold opacity-50">
                      {group.members.length} members
                    </div>
                  </div>
                  <div className="text-xs font-medium text-base-content/40 truncate italic flex items-center gap-1">
                    {group.lastMessage ? (
                      <>
                        <span className="font-bold opacity-70">
                          {group.lastMessage.senderId === authUser._id ? "You: " : `${group.lastMessage.senderId.fullName?.split(' ')[0] || "User"}: `}
                        </span>
                        <span className="truncate">{group.lastMessage.text || "📷 Image"}</span>
                      </>
                    ) : (
                      <span className="font-mono">#{group.name.toLowerCase().replace(/\s+/g, '-')}</span>
                    )}
                  </div>
                </div>
              </button>
            ))
        )}

        {(activeTab === "users" && users.length === 0) || (activeTab === "groups" && groups.length === 0) && (
          <div className="text-center py-10 px-4">
            <div className="size-12 rounded-full bg-base-content/5 flex items-center justify-center mx-auto mb-3">
              <Users className="size-6 text-base-content/20" />
            </div>
            <p className="text-sm font-medium text-base-content/40">
              No {activeTab} yet
            </p>
          </div>
        )}
      </div>

      {/* New Group Modal */}
      {
        isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-base-100 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-base-content/10 animate-in zoom-in-95 duration-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Create Group</h3>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-base-content/5 rounded-full"><X size={20} /></button>
                </div>

                <form onSubmit={handleCreateGroup} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2 block">Group Name</label>
                    <input
                      type="text"
                      className="input input-bordered w-full rounded-xl bg-base-content/5 border-none focus:ring-2 focus:ring-primary/20"
                      placeholder="E.g. The Chaos Club"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2 block">Add Friends</label>
                    <div className="h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                      {users.map(user => (
                        <div
                          key={user._id}
                          onClick={() => toggleMember(user._id)}
                          className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all ${selectedMembers.includes(user._id) ? "bg-primary/10 ring-1 ring-primary/20" : "hover:bg-base-content/5"}`}
                        >
                          <img src={user.profilePic || "/avatar.png"} className="size-8 rounded-full" />
                          <span className="text-sm font-medium flex-1">{user.fullName}</span>
                          <input
                            type="checkbox"
                            checked={selectedMembers.includes(user._id)}
                            readOnly
                            className="checkbox checkbox-primary checkbox-xs rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!newGroupName.trim() || selectedMembers.length === 0}
                    className="w-full py-3 bg-primary text-primary-content rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all"
                  >
                    Create Reality
                  </button>
                </form>
              </div>
            </div>
          </div>
        )
      }
    </aside >
  );
};
export default Sidebar;
