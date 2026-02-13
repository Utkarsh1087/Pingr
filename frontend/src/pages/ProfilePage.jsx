import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [about, setAbout] = useState(authUser?.about || "Hey there! I'm using Pingr.");
  const [isEditingAbout, setIsEditingAbout] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleAboutUpdate = async () => {
    await updateProfile({ about });
    setIsEditingAbout(false);
  };

  return (
    <div className="min-h-screen pt-20 bg-base-100/50">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-100/60 backdrop-blur-xl rounded-3xl p-8 space-y-8 border border-base-content/5 shadow-glass relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

          <div className="text-center relative z-10">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-base-content to-base-content/70 bg-clip-text text-transparent">
              Profile
            </h1>
            <p className="mt-2 text-base-content/50 font-medium">Manage your personal information</p>
          </div>

          {/* avatar upload section */}
          <div className="flex flex-col items-center gap-4 relative z-10">
            <div className="relative group">
              <div className="size-36 rounded-full ring-4 ring-primary/10 ring-offset-4 ring-offset-base-100 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                <img
                  src={selectedImg || authUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-1 right-1 
                  bg-primary hover:bg-primary-focus
                  p-3 rounded-2xl cursor-pointer 
                  transition-all duration-300 shadow-lg
                  hover:scale-110 active:scale-95
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none opacity-50" : ""}
                `}
              >
                <Camera className="size-6 text-primary-content" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-base-content/40">
              {isUpdatingProfile ? "Uploading Profile..." : "Tap the icon to change photo"}
            </p>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-widest text-base-content/40 flex items-center gap-2 px-1">
                <User className="size-4" />
                Full Name
              </div>
              <div className="px-5 py-3.5 bg-base-content/5 rounded-2xl border border-base-content/5 font-semibold text-base-content shadow-inner">
                {authUser?.fullName}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-widest text-base-content/40 flex items-center gap-2 px-1">
                <Mail className="size-4" />
                Email Address
              </div>
              <div className="px-5 py-3.5 bg-base-content/5 rounded-2xl border border-base-content/5 font-semibold text-base-content shadow-inner">
                {authUser?.email}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-widest text-base-content/40 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  
                  About Me
                </div>
                {!isEditingAbout ? (
                  <button
                    onClick={() => setIsEditingAbout(true)}
                    className="text-primary hover:underline transition-all text-[10px] font-bold"
                  >
                    Edit Bio
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleAboutUpdate}
                      disabled={isUpdatingProfile}
                      className="text-primary hover:underline transition-all text-[10px] font-bold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingAbout(false);
                        setAbout(authUser?.about);
                      }}
                      className="text-base-content/40 hover:text-base-content transition-all text-[10px] font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              {isEditingAbout ? (
                <textarea
                  className="w-full px-5 py-3.5 bg-base-content/5 rounded-2xl border border-primary/20 font-medium text-base-content resize-none focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows={2}
                  maxLength={100}
                />
              ) : (
                <div className="px-5 py-3.5 bg-base-content/5 rounded-2xl border border-base-content/5 font-medium text-base-content/80 shadow-inner">
                  {authUser?.about || "Hey there! I'm using Pingr."}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 bg-primary/5 rounded-3xl p-8 relative z-10 border border-primary/10">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary" />
              Account Insights
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-primary/10">
                <span className="text-sm font-semibold text-base-content/60">Membership Profile</span>
                <span className="text-sm font-bold text-base-content">Pingr Standard</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-primary/10">
                <span className="text-sm font-semibold text-base-content/60">Member Since</span>
                <span className="text-sm font-bold text-base-content">{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-base-content/60">Account Status</span>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-bold text-emerald-500 uppercase tracking-wider">Verified Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
