import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";



const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="fixed w-full top-0 z-40 transition-all duration-300 border-b border-base-content/10 glass-effect"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              
              <h1 className="text-3xl font-bold font-slackey tracking-tight bg-gradient-to-br from-base-content to-base-content/70 bg-clip-text text-transparent">
                Pingr
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={"/settings"}
              className="btn btn-sm btn-ghost gap-2 hover:bg-base-content/10 transition-all duration-200 rounded-lg group"
            >
              <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              <span className="hidden sm:inline font-medium">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link
                  to={"/profile"}
                  className="btn btn-sm btn-ghost gap-2 hover:bg-base-content/10 transition-all duration-200 rounded-lg group"
                >
                  <User className="size-4 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline font-medium">Profile</span>
                </Link>

                <div className="w-px h-6 bg-base-content/10 mx-1 hidden sm:block" />

                <button
                  className="btn btn-sm btn-ghost gap-2 text-error hover:bg-error/10 hover:text-error transition-all duration-200 rounded-lg group"
                  onClick={logout}
                >
                  <LogOut className="size-4 group-hover:translate-x-0.5 transition-transform" />
                  <span className="hidden sm:inline font-medium">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
