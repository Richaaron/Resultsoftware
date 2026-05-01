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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 animate-fade-in-up">
      <button
        onClick={() => setLoginType("ADMIN")}
        className="glass-panel flex flex-col items-center justify-center gap-3 p-6 md:p-8 group h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:border-accent-gold/40 cursor-pointer"
      >
        <div className="w-12 md:w-16 h-12 md:h-16 bg-brand-800/50 backdrop-blur-sm border border-brand-700/50 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-brand-700 transition-all duration-300">
          <ShieldCheck size={32} className="text-accent-gold" />
        </div>
        <div className="text-center mt-2">
          <span className="text-lg md:text-xl font-bold block text-white group-hover:text-accent-gold transition-colors">Admin</span>
          <span className="text-xs font-semibold text-brand-300 uppercase tracking-wider mt-1 block">
            Full Access
          </span>
        </div>
      </button>

      <button
        onClick={() => setLoginType("TEACHER")}
        className="glass-panel flex flex-col items-center justify-center gap-3 p-6 md:p-8 group h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(59,130,246,0.25)] hover:border-brand-400/40 cursor-pointer"
      >
        <div className="w-12 md:w-16 h-12 md:h-16 bg-brand-800/50 backdrop-blur-sm border border-brand-700/50 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-brand-700 transition-all duration-300">
          <UserCircle size={32} className="text-brand-400" />
        </div>
        <div className="text-center mt-2">
          <span className="text-lg md:text-xl font-bold block text-white group-hover:text-brand-400 transition-colors">Teacher</span>
          <span className="text-xs font-semibold text-brand-300 uppercase tracking-wider mt-1 block">
            Records
          </span>
        </div>
      </button>

      <button
        onClick={() => setLoginType("PARENT")}
        className="glass-panel flex flex-col items-center justify-center gap-3 p-6 md:p-8 group h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:border-accent-green/40 cursor-pointer"
      >
        <div className="w-12 md:w-16 h-12 md:h-16 bg-brand-800/50 backdrop-blur-sm border border-brand-700/50 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-brand-700 transition-all duration-300">
          <Users size={32} className="text-accent-green" />
        </div>
        <div className="text-center mt-2">
          <span className="text-lg md:text-xl font-bold block text-white group-hover:text-accent-green transition-colors">Parent</span>
          <span className="text-xs font-semibold text-brand-300 uppercase tracking-wider mt-1 block">
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
        className="mb-4 text-brand-300 font-medium text-sm flex items-center gap-2 hover:text-white transition-colors hover:translate-x-[-4px]"
      >
        ← Go Back
      </button>

      <div className="glass-panel p-5 mb-6 flex items-center gap-4">
        {loginType === "ADMIN" ? (
          <ShieldCheck size={24} className="text-accent-gold flex-shrink-0" />
        ) : loginType === "TEACHER" ? (
          <UserCircle size={24} className="text-accent-gold flex-shrink-0" />
        ) : (
          <Users size={24} className="text-accent-gold flex-shrink-0" />
        )}
        <div>
          <h3 className="text-lg md:text-xl font-extrabold text-white tracking-tight">
            {loginType} Access
          </h3>
          <p className="text-xs font-medium text-brand-300 uppercase tracking-wider mt-0.5">
            Enter your credentials
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 md:mb-6 p-4 bg-red-500/20 border border-red-500/30 text-red-200 font-medium rounded-lg text-sm md:text-base">
          ⚠ {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div className="relative group">
          <label className="block text-sm font-bold text-brand-100 mb-2 uppercase tracking-wide">
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
          <label className="block text-sm font-bold text-brand-100 mb-2 uppercase tracking-wide">
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
              className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-400 hover:text-accent-gold transition-colors focus:outline-none"
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
          className="w-full btn-primary text-base py-3.5 mt-6 disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wider"
        >
          {loading ? "Authenticating..." : "Access Portal"}
        </button>
      </form>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-950 relative overflow-hidden p-4 sm:p-8">
      <AcademicBackground />

      <div className="glass-premium p-8 md:p-10 w-full max-w-xl relative z-10 animate-fade-in-up">
        <div className="mb-8 md:mb-10 text-center relative">
          <div className="w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-accent-gold to-yellow-500 rounded-2xl flex items-center justify-center text-brand-950 mx-auto mb-6 shadow-[0_0_30px_rgba(245,158,11,0.4)] animate-pulse-glow">
            <GraduationCap size={40} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
            Folusho Victory
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-yellow-300">
              Result Portal
            </span>
          </h2>
          <p className="text-brand-300 font-medium text-sm md:text-base tracking-wide uppercase">
            Select your role to continue
          </p>
        </div>

        {!loginType ? renderLoginButtons() : renderLoginForm()}

        <div className="mt-10 md:mt-12 text-center border-t border-brand-800/40 pt-6">
          <p className="text-brand-400/60 text-xs font-semibold tracking-wider uppercase">
            Folusho Victory School Result Portal v2.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
