import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Book,
  GraduationCap,
  Pencil,
  Sparkles,
  Star,
  ShieldCheck,
  UserCircle,
  Users,
  Eye,
  EyeOff,
} from "lucide-react";
import api from "../api";
import AcademicBackground from "../components/AcademicBackground";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginType, setLoginType] = useState(null); // 'ADMIN', 'TEACHER', 'PARENT' or null
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const role = response.data.user.role;

      // Basic validation to ensure they are logging into the right portal
      if (loginType && role !== loginType) {
        setError(`This is the ${loginType.toLowerCase()} portal!`);
        setLoading(false);
        return;
      }

      if (role === "ADMIN") navigate("/admin");
      else if (role === "TEACHER") navigate("/teacher");
      else if (role === "PARENT") navigate("/parent");
    } catch (err) {
      setError("Invalid username or password");
      setLoading(false);
    }
  };

  const renderLoginButtons = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      <button
        onClick={() => setLoginType("ADMIN")}
        className="professional-card flex flex-col items-center justify-center gap-3 p-6 md:p-8 group h-full bg-slate-800/60 border-slate-600/60 hover:shadow-xl"
      >
        <div className="w-12 md:w-16 h-12 md:h-16 bg-slate-700 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <ShieldCheck size={32} className="text-accent-gold" />
        </div>
        <div className="text-center">
          <span className="text-lg md:text-xl font-bold block text-white">Admin</span>
          <span className="text-xs font-semibold text-slate-300">
            Full Access
          </span>
        </div>
      </button>

      <button
        onClick={() => setLoginType("TEACHER")}
        className="professional-card flex flex-col items-center justify-center gap-3 p-6 md:p-8 group h-full bg-slate-800/60 border-slate-600/60 hover:shadow-xl"
      >
        <div className="w-12 md:w-16 h-12 md:h-16 bg-slate-700 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <UserCircle size={32} className="text-accent-gold" />
        </div>
        <div className="text-center">
          <span className="text-lg md:text-xl font-bold block text-white">Teacher</span>
          <span className="text-xs font-semibold text-slate-300">
            Records
          </span>
        </div>
      </button>

      <button
        onClick={() => setLoginType("PARENT")}
        className="professional-card flex flex-col items-center justify-center gap-3 p-6 md:p-8 group h-full bg-slate-800/60 border-slate-600/60 hover:shadow-xl"
      >
        <div className="w-12 md:w-16 h-12 md:h-16 bg-slate-700 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <Users size={32} className="text-accent-gold" />
        </div>
        <div className="text-center">
          <span className="text-lg md:text-xl font-bold block text-white">Parent</span>
          <span className="text-xs font-semibold text-slate-300">
            Results
          </span>
        </div>
      </button>
    </div>
  );

  const renderLoginForm = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button
        onClick={() => {
          setLoginType(null);
          setError("");
          setUsername("");
          setPassword("");
          setShowPassword(false);
        }}
        className="mb-4 text-slate-300 font-medium text-sm flex items-center gap-2 hover:text-white transition-colors"
      >
        ← Go Back
      </button>

      <div className="professional-card p-4 mb-5 flex items-center gap-3 bg-slate-800/60 border-slate-600/60">
        {loginType === "ADMIN" ? (
          <ShieldCheck size={24} className="text-accent-gold flex-shrink-0" />
        ) : loginType === "TEACHER" ? (
          <UserCircle size={24} className="text-accent-gold flex-shrink-0" />
        ) : (
          <Users size={24} className="text-accent-gold flex-shrink-0" />
        )}
        <div>
          <h3 className="text-base md:text-xl font-bold text-white">
            {loginType} Login
          </h3>
          <p className="text-xs font-medium text-slate-300">
            Enter your credentials
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 md:mb-6 p-4 bg-red-500/20 border border-red-500/30 text-red-200 font-medium rounded-lg text-sm md:text-base">
          ⚠ {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="relative group">
          <label className="block text-sm font-bold text-white mb-1.5">
            Username
          </label>
          <input
            type="text"
            className="input-field"
            placeholder={
              loginType === "PARENT" ? "e.g. parent_12345" : "Your username..."
            }
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="relative group">
          <label className="block text-sm font-bold text-white mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="input-field pr-14"
              placeholder="Enter your password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-accent-gold transition-colors focus:outline-none"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary text-base py-2.5 mt-5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Accessing..." : "Access portal"}
        </button>
      </form>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 relative overflow-hidden p-4">
      <AcademicBackground />

      <div className="professional-card p-6 md:p-8 w-full max-w-xl relative z-10 bg-slate-900/85 border-slate-600/60 shadow-2xl">
        <div className="mb-6 md:mb-8 text-center relative">
          <div className="w-12 md:w-16 h-12 md:h-16 bg-accent-gold rounded-lg flex items-center justify-center text-slate-950 mx-auto mb-4 shadow-lg">
            <GraduationCap size={32} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Folusho{" "}
            <span className="text-accent-gold">
              Result Portal
            </span>
          </h2>
          <p className="text-slate-300 font-medium text-sm md:text-base">
            Select your role to continue
          </p>
        </div>

        {!loginType ? renderLoginButtons() : renderLoginForm()}

        <div className="mt-8 md:mt-12 text-center">
          <p className="text-slate-500 text-xs font-medium">
            Folusho Result Portal v2.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
