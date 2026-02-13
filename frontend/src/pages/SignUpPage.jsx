import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";

import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) signup(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-base-100">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-hidden">
        {/* Background blur decorative element */}
        <div className="absolute top-1/4 -right-20 size-64 bg-primary/10 rounded-full blur-3xl -z-10" />

        <div className="w-full max-w-md space-y-8 bg-base-100/40 p-8 rounded-3xl border border-base-content/10 shadow-glass backdrop-blur-sm">
          {/* LOGO */}
          <div className="text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="size-14 rounded-2xl bg-primary/15 flex items-center justify-center shadow-glass ring-1 ring-primary/20 transition-all hover:scale-105">
                <MessageSquare className="size-8 text-primary" />
              </div>
              <h1 className="text-3xl font-extrabold mt-4 tracking-tight bg-gradient-to-br from-base-content to-base-content/70 bg-clip-text text-transparent">
                Create Account
              </h1>
              <p className="text-base-content/50 font-medium">Join us and start connecting today</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-base-content/70 px-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/30 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  className="w-full h-12 pl-12 pr-4 rounded-2xl bg-base-content/5 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:text-base-content/30"
                  placeholder="Your Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-base-content/70 px-1">Email address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/30 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="email"
                  className="w-full h-12 pl-12 pr-4 rounded-2xl bg-base-content/5 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:text-base-content/30"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-base-content/70 px-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/30 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full h-12 pl-12 pr-12 rounded-2xl bg-base-content/5 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:text-base-content/30"
                  placeholder="Create a password"
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
              className="w-full h-12 bg-primary text-primary-content rounded-2xl font-bold shadow-glass hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 mt-4"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="size-5 animate-spin" />
                  <span>Creating account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-sm font-medium text-base-content/50">
              Already a member?{" "}
              <Link to="/login" className="text-primary font-bold hover:underline transition-all">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};
export default SignUpPage;
