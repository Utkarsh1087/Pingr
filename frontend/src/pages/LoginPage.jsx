import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-base-100">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-hidden bg-gradient-to-br from-base-100 to-base-200">
        {/* Subtle Decorative Background Element */}
        <div className="absolute -top-24 -left-24 size-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 size-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md space-y-8 relative z-10">
          {/* Logo & Header */}
          <div className="text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-glass ring-1 ring-primary/20 animate-in fade-in zoom-in duration-700">
                <MessageSquare className="size-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tight text-base-content">
                  Welcome Back
                </h1>
                <p className="text-base-content/50 font-medium">Ready to jump back into the conversation?</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 bg-base-100/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-base-content/5 shadow-2xl">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/60 ml-1">Email Address</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/30 group-focus-within/input:text-primary transition-colors" />
                </div>
                <input
                  type="email"
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-base-200/50 border border-transparent focus:border-primary/30 focus:bg-base-100 outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium placeholder:text-base-content/20"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/60 ml-1">Password</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/30 group-focus-within/input:text-primary transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full h-14 pl-12 pr-12 rounded-2xl bg-base-200/50 border border-transparent focus:border-primary/30 focus:bg-base-100 outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium placeholder:text-base-content/20"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-base-content/30 hover:text-base-content transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-14 bg-primary text-primary-content rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:translate-y-0 mt-2"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="size-5 animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-sm font-semibold text-base-content/40">
              Not a member yet?{" "}
              <Link to="/signup" className="text-primary font-bold hover:underline decoration-2 underline-offset-4 transition-all">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={"Sign in to continue your conversations and catch up with your messages."}
      />
    </div>
  );
};
export default LoginPage;
