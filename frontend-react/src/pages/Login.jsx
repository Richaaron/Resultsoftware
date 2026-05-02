import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  UserCircle,
  Users,
  Eye,
  EyeOff,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Book
} from "lucide-react";
import api from "../api";
import "../styles/animations.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginType, setLoginType] = useState(null);
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

      if (loginType && role !== loginType) {
        setError(`This is the ${loginType.toLowerCase()} portal!`);
        setLoading(false);
        return;
      }

      if (role === "ADMIN") navigate("/admin");
      else if (role === "TEACHER") navigate("/teacher");
      else if (role === "PARENT") navigate("/parent");
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Invalid username or password");
      setLoading(false);
    }
  };

  const renderRoleSelection = () => (
    <div className="w-full max-w-md mx-auto space-y-4 animate-fade-in-up">
      <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2 animate-slide-down">Welcome back</h2>
      <p className="text-brand-300 font-medium mb-10 animate-slide-down" style={{animationDelay: '0.1s'}}>Select your role to continue</p>

      {/* Admin Button */}
      <button
        onClick={() => setLoginType("ADMIN")}
        className="w-full p-6 flex items-center justify-between group hover:-translate-y-2 transition-all duration-300 text-left bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 hover:border-accent-gold/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.25)] cursor-pointer rounded-2xl animate-card-fade" style={{animationDelay: '0.1s'}}
      >
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-accent-gold/10 text-accent-gold flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner border border-accent-gold/20 animate-icon-bounce" style={{animationDelay: '0.2s'}}>
            <ShieldCheck size={24} className="group-hover:animate-rotate" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-accent-gold transition-colors">Admin Login</h3>
            <p className="text-xs text-slate-400 mt-1 font-medium animate-text-fade" style={{animationDelay: '0.3s'}}>Manage students, teachers and results</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-slate-500 group-hover:text-accent-gold transition-colors transform group-hover:translate-x-2 group-hover:animate-pulse" />
      </button>

      {/* Teacher Button */}
      <button
        onClick={() => setLoginType("TEACHER")}
        className="w-full p-6 flex items-center justify-between group hover:-translate-y-2 transition-all duration-300 text-left bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 hover:border-brand-400/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.25)] cursor-pointer rounded-2xl animate-card-fade" style={{animationDelay: '0.2s'}}
      >
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-brand-400/10 text-brand-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner border border-brand-400/20 animate-icon-bounce" style={{animationDelay: '0.3s'}}>
            <Book size={24} className="group-hover:animate-rotate" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors">Teacher Login</h3>
            <p className="text-xs text-slate-400 mt-1 font-medium animate-text-fade" style={{animationDelay: '0.4s'}}>Enter and manage subject results</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-slate-500 group-hover:text-brand-400 transition-colors transform group-hover:translate-x-2 group-hover:animate-pulse" />
      </button>

      {/* Parent Button */}
      <button
        onClick={() => setLoginType("PARENT")}
        className="w-full p-6 flex items-center justify-between group hover:-translate-y-2 transition-all duration-300 text-left bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 hover:border-accent-green/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] cursor-pointer rounded-2xl animate-card-fade" style={{animationDelay: '0.3s'}}
      >
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-accent-green/10 text-accent-green flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner border border-accent-green/20 animate-icon-bounce" style={{animationDelay: '0.4s'}}>
            <Users size={24} className="group-hover:animate-rotate" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-accent-green transition-colors">Parent Login</h3>
            <p className="text-xs text-slate-400 mt-1 font-medium animate-text-fade" style={{animationDelay: '0.5s'}}>View your child's progress</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-slate-500 group-hover:text-accent-green transition-colors transform group-hover:translate-x-2 group-hover:animate-pulse" />
      </button>
    </div>
  );

  const renderLoginForm = () => (
    <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button
        onClick={() => {
          setLoginType(null);
          setError("");
          setUsername("");
          setPassword("");
          setShowPassword(false);
        }}
        className="mb-8 text-slate-400 font-medium text-sm flex items-center gap-2 hover:text-white transition-colors hover:translate-x-[-4px]"
      >
        ← Back to roles
      </button>

      <div className="mb-8 flex items-center gap-5">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg border ${
          loginType === 'ADMIN' ? 'bg-accent-gold/10 text-accent-gold border-accent-gold/20' : 
          loginType === 'TEACHER' ? 'bg-brand-400/10 text-brand-400 border-brand-400/20' : 
          'bg-accent-green/10 text-accent-green border-accent-green/20'
        }`}>
          {loginType === "ADMIN" ? <ShieldCheck size={28} /> : 
           loginType === "TEACHER" ? <Book size={28} /> : 
           <Users size={28} />}
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            {loginType === "ADMIN" ? "Admin Login" : loginType === "TEACHER" ? "Teacher Login" : "Parent Login"}
          </h2>
          <p className="text-slate-400 font-medium text-sm mt-1">
            Enter your credentials
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-300 font-medium rounded-lg text-sm flex items-center gap-3 animate-fade-in-up">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></div>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="relative group">
          <label className="block text-sm font-bold text-slate-200 mb-2 uppercase tracking-wide">
            Username
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/50 focus:bg-slate-800 transition-all duration-300"
            placeholder={
              loginType === "PARENT" ? "e.g. parent_12345" : "Your username..."
            }
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="relative group">
          <label className="block text-sm font-bold text-slate-200 mb-2 uppercase tracking-wide flex justify-between items-center">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/50 focus:bg-slate-800 transition-all duration-300 pr-12"
              placeholder="Enter your password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full text-base py-4 mt-8 rounded-lg font-bold transition-all duration-300 uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 ${
            loginType === 'ADMIN' ? 'bg-gradient-to-r from-accent-gold to-yellow-500 text-slate-950 hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:from-accent-gold hover:to-yellow-400' : 
            loginType === 'TEACHER' ? 'bg-gradient-to-r from-brand-400 to-brand-600 text-white hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] hover:from-brand-400 hover:to-brand-500' : 
            'bg-gradient-to-r from-accent-green to-emerald-500 text-white hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:from-accent-green hover:to-emerald-400'
          } ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1'}`}
        >
          {loading ? "Authenticating..." : "Sign In"}
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-brand-950">
      {/* Left Column - Branding */}
      <div className="w-full lg:w-[45%] xl:w-[40%] bg-brand-800 relative overflow-hidden flex flex-col justify-between p-8 lg:p-16 border-b lg:border-b-0 lg:border-r border-brand-700/50 shadow-2xl">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
           <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-brand-500 rounded-full blur-3xl mix-blend-screen"></div>
           <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-accent-gold rounded-full blur-3xl mix-blend-screen"></div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center text-white mb-10 shadow-xl border border-brand-400/20 animate-bounce-slow">
            <GraduationCap size={40} strokeWidth={2.5} className="animate-rotate-slow" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight animate-slide-right">
            Folusho Victory
            <br />
            Schools
          </h1>
          <p className="text-brand-300 text-lg lg:text-xl font-medium mb-12 animate-slide-right" style={{animationDelay: '0.1s'}}>
            Result Management System
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4 text-brand-100 group animate-slide-right" style={{animationDelay: '0.2s'}}>
              <div className="w-6 h-6 rounded-full bg-accent-gold/20 flex items-center justify-center border border-accent-gold/30 group-hover:bg-accent-gold/40 transition-colors group-hover:animate-scale-pulse">
                <CheckCircle2 size={14} className="text-accent-gold" />
              </div>
              <span className="font-medium text-sm lg:text-base">Student result entry and management</span>
            </div>
            <div className="flex items-center gap-4 text-brand-100 group animate-slide-right" style={{animationDelay: '0.3s'}}>
              <div className="w-6 h-6 rounded-full bg-accent-gold/20 flex items-center justify-center border border-accent-gold/30 group-hover:bg-accent-gold/40 transition-colors group-hover:animate-scale-pulse">
                <CheckCircle2 size={14} className="text-accent-gold" />
              </div>
              <span className="font-medium text-sm lg:text-base">Automated report card generation</span>
            </div>
            <div className="flex items-center gap-4 text-brand-100 group animate-slide-right" style={{animationDelay: '0.4s'}}>
              <div className="w-6 h-6 rounded-full bg-accent-gold/20 flex items-center justify-center border border-accent-gold/30 group-hover:bg-accent-gold/40 transition-colors group-hover:animate-scale-pulse">
                <CheckCircle2 size={14} className="text-accent-gold" />
              </div>
              <span className="font-medium text-sm lg:text-base">Teacher and class management</span>
            </div>
            <div className="flex items-center gap-4 text-brand-100 group animate-slide-right" style={{animationDelay: '0.5s'}}>
              <div className="w-6 h-6 rounded-full bg-accent-gold/20 flex items-center justify-center border border-accent-gold/30 group-hover:bg-accent-gold/40 transition-colors group-hover:animate-scale-pulse">
                <CheckCircle2 size={14} className="text-accent-gold" />
              </div>
              <span className="font-medium text-sm lg:text-base">Real-time performance analytics</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 pt-8 border-t border-brand-700">
          <p className="text-brand-400 text-sm font-medium">
            © 2025 Folusho Victory Schools
          </p>
        </div>
      </div>

      {/* Right Column - Authentication */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 relative bg-gradient-to-br from-brand-950 via-slate-900 to-slate-950">
        {/* Subtle background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 w-full">
          {!loginType ? renderRoleSelection() : renderLoginForm()}
        </div>
      </div>
    </div>
  );
};

export default Login;
