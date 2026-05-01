import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Link, NavLink, useNavigate } from "react-router-dom";
import api from "../api";
import {
  Users,
  BookOpen,
  LogOut,
  LayoutDashboard,
  Sparkles,
  GraduationCap,
  ClipboardCheck,
  UserCircle,
  UserPlus,
  CheckCircle,
  Eye,
  EyeOff,
  ChevronUp,
  Trash2,
  Edit3,
  Plus,
  X,
  FileSpreadsheet,
  Search,
  Settings,
  ShieldAlert,
  Palette,
  Upload,
  Save,
  Lock,
  Menu,
  MessageCircle,
  Activity,
} from "lucide-react";
import AcademicBackground from "../components/AcademicBackground";
import AdminTeacherChat from "../components/AdminTeacherChat";
import ActivityTracker from "../components/ActivityTracker";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [activeTab, setActiveTab] = useState("overview");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showActivityTracker, setShowActivityTracker] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      setShowScrollTop(el.scrollTop > 300);
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-transparent relative overflow-hidden transition-colors duration-300">
      <AcademicBackground />

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-brand-900 border-b-4 border-brand-900 p-4 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <LayoutDashboard size={24} className="text-accent-gold" />
          <h1 className="text-lg font-bold text-white uppercase">Admin Dashboard</h1>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-brand-800 rounded-lg"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-brand-950/50 md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative md:flex w-64 md:w-72 h-[calc(100vh-64px)] md:h-screen bg-brand-900 border-r-4 border-brand-900 p-4 md:p-8 flex flex-col shadow-xl z-40 overflow-y-auto transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="hidden md:flex items-center gap-3 mb-8 md:mb-12">
          <div className="w-12 h-12 bg-accent-gold border border-brand-700/50 rounded-lg flex items-center justify-center shadow-md transform">
            <LayoutDashboard size={24} className="text-black" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight uppercase  text-white text-gradient">
            Admin <span className="text-accent-red">Hub</span>
          </h2>
        </div>

        <nav className="space-y-3 md:space-y-4">
          <NavLink
            to="/admin"
            end
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center p-3 md:p-4 rounded-lg border-4 transition-all group font-bold uppercase tracking-tight text-white text-sm md:text-base ${isActive ? "border-brand-900 bg-accent-gold/30" : "border-transparent hover:border-brand-900 hover:bg-accent-gold/20"}`
            }
          >
            <LayoutDashboard className="mr-2 md:mr-3" size={18} />
            <span>Overview</span>
          </NavLink>
          <NavLink
            to="/admin/students"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center p-3 md:p-4 rounded-lg border-4 transition-all group font-bold uppercase tracking-tight text-white text-sm md:text-base ${isActive ? "border-brand-900 bg-accent-red/30" : "border-transparent hover:border-brand-900 hover:bg-accent-red/10"}`
            }
          >
            <Users className="mr-2 md:mr-3" size={18} />
            <span>Students</span>
          </NavLink>
          <NavLink
            to="/admin/subjects"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center p-3 md:p-4 rounded-lg border-4 transition-all group font-bold uppercase tracking-tight text-white text-sm md:text-base ${isActive ? "border-brand-900 bg-accent-gold/30" : "border-transparent hover:border-brand-900 hover:bg-accent-gold/20"}`
            }
          >
            <BookOpen className="mr-2 md:mr-3" size={18} />
            <span>Knowledge</span>
          </NavLink>
          <NavLink
            to="/admin/teachers"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center p-3 md:p-4 rounded-lg border-4 transition-all group font-bold uppercase tracking-tight text-white text-sm md:text-base ${isActive ? "border-brand-900 bg-accent-red/30" : "border-transparent hover:border-brand-900 hover:bg-accent-red/10"}`
            }
          >
            <UserCircle className="mr-2 md:mr-3" size={18} />
            <span>Educators</span>
          </NavLink>
          <NavLink
            to="/broadsheet"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center p-3 md:p-4 rounded-lg border-4 transition-all group font-bold uppercase tracking-tight text-white text-sm md:text-base ${isActive ? "border-brand-900 bg-accent-gold/30" : "border-transparent hover:border-brand-900 hover:bg-accent-gold/20"}`
            }
          >
            <FileSpreadsheet className="mr-2 md:mr-3" size={18} />
            <span>Broadsheet</span>
          </NavLink>
          <NavLink
            to="/admin/settings"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center p-3 md:p-4 rounded-lg border-4 transition-all group font-bold uppercase tracking-tight text-white text-sm md:text-base ${isActive ? "border-brand-900 bg-accent-red/30" : "border-transparent hover:border-brand-900 hover:bg-accent-red/10"}`
            }
          >
            <Settings className="mr-2 md:mr-3" size={18} />
            <span>Settings</span>
          </NavLink>

          {/* Divider */}
          <div className="my-4 border-t-2 border-brand-700"></div>

          {/* Chat & Activity Buttons */}
          <button
            onClick={() => {
              setShowChat(true);
              setSidebarOpen(false);
            }}
            className="w-full flex items-center p-3 md:p-4 rounded-lg border border-transparent hover:border-brand-900 hover:bg-accent-gold/20 transition-all group font-bold uppercase tracking-tight text-white text-sm md:text-base"
          >
            <MessageCircle className="mr-2 md:mr-3" size={18} />
            <span>Chat</span>
          </button>

          <button
            onClick={() => {
              setShowActivityTracker(true);
              setSidebarOpen(false);
            }}
            className="w-full flex items-center p-3 md:p-4 rounded-lg border border-transparent hover:border-brand-900 hover:bg-accent-red/10 transition-all group font-bold uppercase tracking-tight text-white text-sm md:text-base"
          >
            <Activity className="mr-2 md:mr-3" size={18} />
            <span>Activity Logs</span>
          </button>
        </nav>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="flex items-center p-3 md:p-4 rounded-lg border border-brand-700/50 bg-accent-gold shadow-md hover:-translate-y-1 transition-all group mt-auto mb-3 text-sm md:text-base"
          >
            <ChevronUp
              size={18}
              className="mr-2 md:mr-3 text-black group-hover:scale-125 transition-transform"
            />
            <span className="font-bold text-black uppercase tracking-tight">
              Top
            </span>
          </button>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center p-3 md:p-4 rounded-lg border border-brand-700/50 bg-accent-red shadow-md hover:-translate-y-1 transition-all group mt-4 text-sm md:text-base"
        >
          <LogOut
            size={18}
            className="mr-2 md:mr-3 text-white group-hover:rotate-12 transition-transform"
          />
          <span className="font-bold text-white uppercase tracking-tight">
            Sign Out
          </span>
        </button>
      </div>

      {/* Modals */}
      {showChat && <AdminTeacherChat onClose={() => setShowChat(false)} />}
      {showActivityTracker && (
        <ActivityTracker onClose={() => setShowActivityTracker(false)} />
      )}

      {/* Main Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight uppercase  text-gradient">
              Welcome, {user?.fullName?.split(" ")[0]}
            </h1>
            <p className="text-sm md:text-lg text-brand-400 mt-2 font-bold underline decoration-4 decoration-accent-gold">
              Welcome to the administration dashboard.
            </p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="text-right flex-1 md:flex-none">
              <p className="text-base md:text-xl font-bold text-white uppercase tracking-tight text-gradient truncate">
                {user?.fullName}
              </p>
              <p className="text-xs md:text-sm font-bold text-accent-red uppercase tracking-widest">
                {user?.role} Mode
              </p>
            </div>
            <div className="w-12 md:w-16 h-12 md:h-16 bg-brand-800 border border-brand-700/50 rounded-xl flex items-center justify-center font-bold text-lg md:text-2xl shadow-xl transform text-white flex-shrink-0">
              {user?.fullName?.charAt(0)}
            </div>
          </div>
        </header>

        <main className="max-w-6xl">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/subjects" element={<SubjectList />} />
            <Route path="/teachers" element={<TeacherManagement />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    schoolName: "",
    logo: "",
    primaryColor: "#fbbf24",
    secondaryColor: "#ef4444",
    principalName: "",
    headTeacherName: "",
    proprietressName: "",
    schoolAddress: "",
    schoolPhoneNumber: "",
    currentTerm: "First",
    currentAcademicYear: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get("/settings");
      setSettings({
        schoolName: "",
        logo: "",
        primaryColor: "#fbbf24",
        secondaryColor: "#ef4444",
        principalName: "",
        headTeacherName: "",
        proprietressName: "",
        schoolAddress: "",
        schoolPhoneNumber: "",
        currentTerm: "First",
        currentAcademicYear: "",
        ...res.data,
      });
    } catch (err) {
      console.error("Error fetching settings:", err);
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    try {
      await api.put("/settings", {
        schoolName: settings.schoolName,
        logo: settings.logo,
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor,
        principalName: settings.principalName,
        headTeacherName: settings.headTeacherName,
        proprietressName: settings.proprietressName,
        schoolAddress: settings.schoolAddress,
        schoolPhoneNumber: settings.schoolPhoneNumber,
        currentTerm: settings.currentTerm,
        currentAcademicYear: settings.currentAcademicYear,
      });

      // Apply colors immediately
      document.documentElement.style.setProperty(
        "--color-accent-gold",
        settings.primaryColor,
      );
      document.documentElement.style.setProperty(
        "--color-accent-red",
        settings.secondaryColor,
      );
      document.documentElement.style.setProperty(
        "--color-brand-400",
        settings.primaryColor,
      );

      setMessage("Settings updated successfully! 🚀");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError("Failed to update settings");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    try {
      const response = await api.put("/settings/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      // Verify password change was successful on backend
      if (response.data.verified) {
        setMessage("✓ Password changed successfully! 🔐\nLogging you out... Please log in with your new password.");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        
        // Immediate logout and cache clear
        setTimeout(() => {
          // Clear all session data
          localStorage.clear();
          sessionStorage.clear();
          
          // Disable API interceptor
          delete api.defaults.headers.common['Authorization'];
          
          // Force hard redirect to login with cache bust
          window.location.href = `/login?nocache=${Date.now()}`;
        }, 1500);
      } else {
        setError("Password change verification failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Error changing password");
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings({ ...settings, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex justify-between items-end mb-10 border-b-4 border-brand-900 pb-8">
        <div>
          <h2 className="text-4xl font-bold text-white uppercase  tracking-tight text-gradient mb-2">
            System Settings
          </h2>
          <p className="text-xl font-bold text-accent-red uppercase tracking-tight">
            Manage global application settings.
          </p>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-accent-gold border border-brand-700/50 text-black font-bold rounded-lg shadow-md flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle size={24} />
          {message}
        </div>
      )}

      {error && (
        <div className="p-4 bg-accent-red border border-brand-700/50 text-white font-bold rounded-lg shadow-md flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <ShieldAlert size={24} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* School Identity */}
        <div className="professional-card p-6 bg-brand-900">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-accent-gold border border-brand-700/50 rounded-lg flex items-center justify-center shadow-md">
              <Sparkles size={24} className="text-black" />
            </div>
            <h3 className="text-2xl font-bold text-white uppercase  tracking-tight text-gradient">
              School Identity
            </h3>
          </div>

          <form onSubmit={handleUpdateSettings} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-400 uppercase tracking-widest">
                School Name
              </label>
              <input
                type="text"
                className="input-field"
                value={settings.schoolName}
                onChange={(e) =>
                  setSettings({ ...settings, schoolName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-400 uppercase tracking-widest">
                Principal Name
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Mr. John Smith"
                value={settings.principalName}
                onChange={(e) =>
                  setSettings({ ...settings, principalName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-400 uppercase tracking-widest">
                Class Teacher/Form Teacher Name
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Mrs. Jane Doe"
                value={settings.headTeacherName}
                onChange={(e) =>
                  setSettings({ ...settings, headTeacherName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-400 uppercase tracking-widest">
                Proprietress Name
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Ms. Mary Johnson"
                value={settings.proprietressName}
                onChange={(e) =>
                  setSettings({ ...settings, proprietressName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-400 uppercase tracking-widest">
                School Address
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. 123 Academy Road, Lagos"
                value={settings.schoolAddress}
                onChange={(e) =>
                  setSettings({ ...settings, schoolAddress: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-400 uppercase tracking-widest">
                School Phone Number
              </label>
              <input
                type="tel"
                className="input-field"
                placeholder="e.g. +234 800 000 0000"
                value={settings.schoolPhoneNumber}
                onChange={(e) =>
                  setSettings({ ...settings, schoolPhoneNumber: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-400 uppercase tracking-widest">
                  Current Term
                </label>
                <select
                  className="input-field"
                  value={settings.currentTerm}
                  onChange={(e) =>
                    setSettings({ ...settings, currentTerm: e.target.value })
                  }
                >
                  <option value="First">First Term</option>
                  <option value="Second">Second Term</option>
                  <option value="Third">Third Term</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-400 uppercase tracking-widest">
                  Academic Year
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. 2024/2025"
                  value={settings.currentAcademicYear}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      currentAcademicYear: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-400 uppercase tracking-widest">
                School Logo
              </label>
              <div className="flex items-center gap-6 p-6 bg-brand-800 border border-brand-700/50 border-dashed rounded-lg">
                {settings.logo ? (
                  <img
                    src={settings.logo}
                    alt="Logo"
                    className="w-20 h-20 object-contain bg-brand-50 p-2 rounded-xl border border-brand-700/50"
                  />
                ) : (
                  <div className="w-20 h-20 bg-brand-700 border border-brand-700/50 rounded-xl flex items-center justify-center text-brand-500">
                    <Upload size={32} />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    id="logo-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                  <label
                    htmlFor="logo-upload"
                    className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Upload size={14} /> Upload New
                  </label>
                  <p className="text-[10px] text-brand-500 mt-2 font-bold uppercase">
                    PNG, JPG recommended
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-400 uppercase tracking-widest">
                  Primary Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    className="w-12 h-12 bg-transparent border border-brand-700/50 rounded-xl cursor-pointer"
                    value={settings.primaryColor}
                    onChange={(e) =>
                      setSettings({ ...settings, primaryColor: e.target.value })
                    }
                  />
                  <span className="font-mono text-white text-xs uppercase">
                    {settings.primaryColor}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-400 uppercase tracking-widest">
                  Secondary Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    className="w-12 h-12 bg-transparent border border-brand-700/50 rounded-xl cursor-pointer"
                    value={settings.secondaryColor}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        secondaryColor: e.target.value,
                      })
                    }
                  />
                  <span className="font-mono text-white text-xs uppercase">
                    {settings.secondaryColor}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-4 flex items-center justify-center gap-3 text-lg mt-4"
            >
              <Save size={24} />
              Save Identity
            </button>
          </form>
        </div>

        {/* Security Settings */}
        <div className="professional-card p-6 bg-brand-900">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-accent-red border border-brand-700/50 rounded-lg flex items-center justify-center shadow-md">
              <Lock size={24} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white uppercase  tracking-tight text-gradient">
              Security
            </h3>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-400 uppercase tracking-widest">
                Current Password
              </label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-400 uppercase tracking-widest">
                New Password
              </label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-400 uppercase tracking-widest">
                Confirm New Password
              </label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />
            </div>

            <button
              type="submit"
              className="w-full btn-accent text-white py-4 flex items-center justify-center gap-3 text-lg mt-4"
            >
              <ShieldAlert size={24} />
              Change Password
            </button>
          </form>

          <div className="mt-10 p-6 bg-accent-red/10 border border-brand-700/50 border-dotted rounded-lg">
            <h4 className="text-accent-red font-bold uppercase  tracking-tight mb-2">
              Security Tip
            </h4>
            <p className="text-xs text-brand-400 font-bold leading-relaxed">
              Use a strong password with symbols and numbers to keep the hackers
              away from your academy's secrets!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminOverview = () => {
  const [stats, setStats] = useState({
    studentCount: 0,
    teacherCount: 0,
    subjectCount: 0,
  });

  useEffect(() => {
    api
      .get("/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="professional-card p-6 hover:-translate-y-1 group bg-accent-gold/20 dark:bg-accent-gold/10">
          <div className="w-12 h-12 bg-brand-50 dark:bg-brand-800 border border-brand-700/50 rounded-lg flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
            <Users size={24} className="text-black dark:text-white" />
          </div>
          <h3 className="text-black dark:text-brand-300 uppercase text-sm font-bold tracking-widest mb-2 ">
            Total Students
          </h3>
          <p className="text-4xl font-bold text-black dark:text-white tracking-tight text-gradient">
            {stats.studentCount}
          </p>
          <div className="mt-4 inline-flex items-center px-3 py-1 bg-brand-50 dark:bg-brand-800 border border-brand-700/50 rounded-full text-xs font-bold uppercase tracking-tight dark:text-brand-300">
            Students
          </div>
        </div>

        <div className="professional-card p-6 hover:-translate-y-1 group bg-accent-red/20 dark:bg-accent-red/10">
          <div className="w-12 h-12 bg-brand-50 dark:bg-brand-800 border border-brand-700/50 rounded-lg flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
            <BookOpen size={24} className="text-black dark:text-white" />
          </div>
          <h3 className="text-black dark:text-brand-300 uppercase text-sm font-bold tracking-widest mb-2 ">
            Subjects
          </h3>
          <p className="text-4xl font-bold text-black dark:text-white tracking-tight text-gradient">
            {stats.subjectCount}
          </p>
          <div className="mt-4 inline-flex items-center px-3 py-1 bg-brand-50 dark:bg-brand-800 border border-brand-700/50 rounded-full text-xs font-bold uppercase tracking-tight dark:text-brand-300">
            Subjects
          </div>
        </div>

        <div className="professional-card p-6 hover:-translate-y-1 group bg-accent-gold/20 dark:bg-accent-gold/10">
          <div className="w-12 h-12 bg-brand-50 dark:bg-brand-800 border border-brand-700/50 rounded-lg flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
            <UserCircle size={24} className="text-black dark:text-white" />
          </div>
          <h3 className="text-black dark:text-brand-300 uppercase text-sm font-bold tracking-widest mb-2 ">
            Educators
          </h3>
          <p className="text-4xl font-bold text-black dark:text-white tracking-tight text-gradient">
            {stats.teacherCount}
          </p>
          <div className="mt-4 inline-flex items-center px-3 py-1 bg-brand-50 dark:bg-brand-800 border border-brand-700/50 rounded-full text-xs font-bold uppercase tracking-tight dark:text-brand-300">
            Teachers
          </div>
        </div>

        <div className="professional-card p-6 hover:-translate-y-1 group bg-accent-gold/10 dark:bg-accent-gold/5">
          <div className="w-12 h-12 bg-brand-50 dark:bg-brand-800 border border-brand-700/50 rounded-lg flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
            <Sparkles size={24} className="text-black dark:text-white" />
          </div>
          <h3 className="text-black dark:text-brand-300 uppercase text-sm font-bold tracking-widest mb-2 ">
            System Health
          </h3>
          <p className="text-4xl font-bold text-black dark:text-white tracking-tight text-gradient">
            100%
          </p>
          <div className="mt-4 inline-flex items-center px-3 py-1 bg-brand-50 dark:bg-brand-800 border border-brand-700/50 rounded-full text-xs font-bold uppercase tracking-tight dark:text-brand-300">
            Operational
          </div>
        </div>
      </div>

      <div className="professional-card p-6 bg-brand-50 dark:bg-brand-900 border border-brand-700/50 shadow-xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-accent-gold border border-brand-700/50 rounded-lg flex items-center justify-center shadow-md">
            <ClipboardCheck size={24} className="text-black" />
          </div>
          <h3 className="text-3xl font-bold text-black dark:text-white uppercase  tracking-tight text-gradient">
            Quick Actions
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/admin/students"
            className="btn-primary text-xl py-6 flex items-center justify-center gap-3"
          >
            <Users size={24} />
            Manage Students
          </Link>
          <Link
            to="/admin/subjects"
            className="btn-accent text-xl py-6 flex items-center justify-center gap-3"
          >
            <BookOpen size={24} />
            Update Knowledge
          </Link>
          <Link
            to="/admin/teachers"
            className="btn-primary bg-accent-black text-accent-gold text-xl py-6 flex items-center justify-center gap-3"
          >
            <UserCircle size={24} />
            Manage Educators
          </Link>
          <Link
            to="/broadsheet"
            className="btn-accent bg-accent-gold text-xl py-6 flex items-center justify-center gap-3 border border-brand-700/50 shadow-md"
          >
            <FileSpreadsheet size={24} />
            Class Broadsheet
          </Link>
        </div>
      </div>
    </div>
  );
};

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [message, setMessage] = useState("");
  const [parentCreds, setParentCreds] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    id: null,
    type: "",
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    registrationNumber: "",
    studentClass: "",
    section: "",
    dateOfBirth: "",
    parentEmail: "",
    subjectIds: [],
    profileImage: null,
  });

  const classes = [
    "Pre-Nursery",
    "Nursery 1",
    "Nursery 2",
    "Primary 1",
    "Primary 2",
    "Primary 3",
    "Primary 4",
    "Primary 5",
    "Primary 6",
    "JSS 1",
    "JSS 2",
    "JSS 3",
    "SSS 1",
    "SSS 2",
    "SSS 3",
  ];

  useEffect(() => {
    fetchStudents();
    fetchSubjects();
  }, []);

  const fetchStudents = () => {
    api.get("/students").then((res) => setStudents(res.data));
  };

  const fetchSubjects = () => {
    api.get("/students/subjects").then((res) => setSubjects(res.data));
  };

  const getSubjectsForClass = () => {
    if (!formData.studentClass) return subjects;
    
    const classToLevel = {
      "Pre-Nursery": { level: "General", category: "Primary" },
      "Nursery 1": { level: "General", category: "Primary" },
      "Nursery 2": { level: "General", category: "Primary" },
      "Primary 1": { level: "General", category: "Primary" },
      "Primary 2": { level: "General", category: "Primary" },
      "Primary 3": { level: "General", category: "Primary" },
      "Primary 4": { level: "General", category: "Primary" },
      "Primary 5": { level: "General", category: "Primary" },
      "Primary 6": { level: "General", category: "Primary" },
      "JSS 1": { level: "Junior", category: "Secondary" },
      "JSS 2": { level: "Junior", category: "Secondary" },
      "JSS 3": { level: "Junior", category: "Secondary" },
      "SSS 1": { level: "Senior", category: "Secondary" },
      "SSS 2": { level: "Senior", category: "Secondary" },
      "SSS 3": { level: "Senior", category: "Secondary" },
    };

    const classInfo = classToLevel[formData.studentClass];
    if (!classInfo) return subjects;

    let filtered = subjects.filter(
      (s) => s.category === classInfo.category && s.level === classInfo.level
    );

    // For Senior Secondary, show all senior subjects regardless of section
    if (["SSS 1", "SSS 2", "SSS 3"].includes(formData.studentClass)) {
      filtered = subjects.filter((s) => s.category === "Secondary" && s.level === "Senior");
    }

    return filtered;
  };

  const getGroupedSubjects = (subjectList) => {
    const grouped = {};
    subjectList.forEach((sub) => {
      const key = sub.section || "General";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(sub);
    });
    return grouped;
  };

  const getSectionAndGeneralSubjects = (subjectList) => {
    const sectionSubjects = subjectList.filter(sub => sub.section);
    const generalSubjects = subjectList.filter(sub => !sub.section);
    return { sectionSubjects, generalSubjects };
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingStudent({ ...editingStudent, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubjectToggle = (id) => {
    setFormData((prev) => ({
      ...prev,
      subjectIds: prev.subjectIds.includes(id)
        ? prev.subjectIds.filter((sid) => sid !== id)
        : [...prev.subjectIds, id],
    }));
  };

  const handleEditSubjectToggle = (id) => {
    const currentSubjectIds = editingStudent.Subjects
      ? editingStudent.Subjects.map((s) => s.id)
      : [];
    const newSubjectIds = currentSubjectIds.includes(id)
      ? currentSubjectIds.filter((sid) => sid !== id)
      : [...currentSubjectIds, id];

    // Update local state for UI
    const updatedSubjects = newSubjectIds
      .map((sid) => subjects.find((s) => s.id === sid))
      .filter(Boolean);
    setEditingStudent({
      ...editingStudent,
      Subjects: updatedSubjects,
      subjectIds: newSubjectIds,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/students", formData);
      setMessage("New Legend Added! ⭐");
      setParentCreds(res.data.parentCredentials);
      setFormData({
        firstName: "",
        lastName: "",
        registrationNumber: "",
        studentClass: "",
        section: "",
        dateOfBirth: "",
        parentEmail: "",
        subjectIds: [],
        profileImage: null,
      });
      fetchStudents();
      setTimeout(() => {
        if (!res.data.parentCredentials) setMessage("");
      }, 3000);
    } catch (err) {
      setMessage("Error adding student ❌");
    }
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      // Ensure subjectIds is passed correctly
      const updateData = {
        ...editingStudent,
        subjectIds:
          editingStudent.subjectIds ||
          (editingStudent.Subjects
            ? editingStudent.Subjects.map((s) => s.id)
            : []),
      };
      await api.patch(`/students/${editingStudent.id}`, updateData);
      setMessage("Legend profile updated! ✨");
      setEditingStudent(null);
      fetchStudents();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error updating student ❌");
    }
  };

  const handleDeleteStudent = (id) => {
    setConfirmDelete({ show: true, id, type: "student" });
  };

  const executeDeleteStudent = async (id) => {
    try {
      await api.delete(`/students/${id}`);
      setMessage("Legend removed! 👋");
      fetchStudents();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error deleting student");
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch = `${s.firstName} ${s.lastName} ${s.registrationNumber}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === "" || s.studentClass === filterClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="professional-card p-6 bg-brand-50 dark:bg-brand-900">
      {/* Confirm Delete Modal */}
      {confirmDelete.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-950/60 backdrop-blur-sm">
          <div className="professional-card bg-brand-50 dark:bg-brand-900 border border-brand-700/50 shadow-xl p-6 w-full max-w-sm mx-4 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-accent-red border border-brand-700/50 rounded-lg flex items-center justify-center shadow-md">
                <Trash2 size={22} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white uppercase  tracking-tight text-gradient">
                Are you sure?
              </h3>
            </div>
            <p className="text-sm font-bold text-brand-500 dark:text-brand-400 mb-6 leading-relaxed">
              This will permanently remove the legend from the squad. There's no
              undo! 💥
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  executeDeleteStudent(confirmDelete.id);
                  setConfirmDelete({ show: false, id: null, type: "" });
                }}
                className="flex-1 py-3 bg-accent-red border border-brand-700/50 rounded-lg font-bold text-white uppercase tracking-tight shadow-md hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={16} /> Confirm
              </button>
              <button
                onClick={() =>
                  setConfirmDelete({ show: false, id: null, type: "" })
                }
                className="flex-1 py-3 bg-brand-50 dark:bg-brand-800 border border-brand-700/50 rounded-lg font-bold text-black dark:text-white uppercase tracking-tight shadow-md hover:-translate-y-1 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b-4 border-brand-900 pb-8 gap-6">
        <div>
          <h2 className="text-4xl font-bold text-black dark:text-white uppercase  tracking-tight text-gradient mb-2">
            Students Roster 📜
          </h2>
          <p className="text-xl font-bold text-accent-red uppercase tracking-tight">
            Behold the future legends!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary px-6 py-3 flex items-center justify-center gap-2"
          >
            <UserPlus size={20} />
            Add Legend
          </button>
          <div className="relative flex-1 sm:w-64">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search name or ID..."
              className="input-field pl-12 py-3 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="input-field py-3 text-sm sm:w-48 appearance-none"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
          >
            <option value="">All Classes</option>
            {classes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {message && (
        <div
          className={`p-6 mb-8 border border-brand-700/50 rounded-lg flex items-center gap-4 ${message.includes("Error") ? "bg-accent-red/20" : "bg-accent-gold/20"}`}
        >
          <div
            className={`w-4 h-4 rounded-full border border-brand-700/50 ${message.includes("Error") ? "bg-accent-red" : "bg-accent-gold"}`}
          ></div>
          <span className="font-bold uppercase tracking-tight text-black dark:text-white">
            {message}
          </span>
          {parentCreds && (
            <button
              onClick={() => {
                setParentCreds(null);
                setMessage("");
              }}
              className="ml-auto"
            >
              <X size={20} className="text-black dark:text-white" />
            </button>
          )}
        </div>
      )}

      {parentCreds && (
        <div className="p-8 mb-10 bg-accent-gold border border-brand-700/50 rounded-xl shadow-xl animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-3 mb-6 text-black font-bold uppercase  tracking-tight text-xl text-gradient">
            <CheckCircle size={24} />
            <span>Parent Access Keys Generated! 🔑</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-accent-black p-4 rounded-lg border border-brand-700/50 shadow-md">
              <p className="text-xs text-accent-gold/60 uppercase font-bold tracking-widest mb-2">
                Username
              </p>
              <p className="font-mono font-bold text-xl text-accent-gold select-all">
                {parentCreds.username}
              </p>
            </div>
            <div className="bg-accent-black p-4 rounded-lg border border-brand-700/50 shadow-md">
              <p className="text-xs text-accent-gold/60 uppercase font-bold tracking-widest mb-2">
                Password
              </p>
              <p className="font-mono font-bold text-xl text-accent-gold select-all">
                {parentCreds.password}
              </p>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-brand-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="professional-card bg-brand-50 dark:bg-brand-900 p-4 md:p-6 w-full max-w-6xl relative border border-brand-700/50 shadow-xl my-2 md:my-4 max-h-[98vh] md:max-h-[95vh] flex flex-col">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-2 right-2 md:top-4 md:right-4 text-black dark:text-brand-100 hover:rotate-90 transition-transform z-10 p-1 bg-white/10 rounded-full"
            >
              <X size={20} className="md:w-6 md:h-6" />
            </button>
            <h3 className="text-xl md:text-2xl font-bold text-black dark:text-brand-100 uppercase tracking-tight mb-3 md:mb-4 text-gradient">
              Enroll New Legend ⭐
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-2 overflow-y-auto flex-1 pr-1 md:pr-2 scrollbar-thin">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                {/* Profile Image Section */}
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 dark:bg-brand-800 border-2 border-gray-300 dark:border-brand-700 rounded-lg overflow-hidden shadow-sm relative group">
                    {formData.profileImage ? (
                      <img
                        src={formData.profileImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-0.5">
                        <UserPlus size={20} className="sm:w-6 sm:h-6" />
                        <span className="text-[7px] sm:text-[9px] font-semibold uppercase tracking-tight">
                          Add Photo
                        </span>
                      </div>
                    )}
                    <label className="absolute inset-0 bg-brand-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer gap-0.5">
                      <Upload size={18} className="text-white sm:w-5 sm:h-5" />
                      <span className="text-white font-semibold text-[7px] sm:text-[9px] uppercase tracking-tight">
                        {formData.profileImage
                          ? "Change"
                          : "Upload"}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-gray-500">
                    Avatar
                  </p>
                  {formData.profileImage && (
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, profileImage: null })
                      }
                      className="text-[8px] font-bold uppercase tracking-widest text-accent-red hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
                  <div>
                    <label className="text-[9px] font-semibold text-black dark:text-brand-300 uppercase tracking-tight block mb-0.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      className="input-field w-full text-xs py-1"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-semibold text-black dark:text-brand-300 uppercase tracking-tight block mb-0.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      className="input-field w-full text-xs py-1"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-semibold text-black dark:text-brand-300 uppercase tracking-tight block mb-0.5">
                      ID Number
                    </label>
                    <input
                      type="text"
                      required
                      className="input-field w-full text-xs py-1"
                      placeholder="LEGEND-001"
                      value={formData.registrationNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          registrationNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-semibold text-black dark:text-brand-300 uppercase tracking-tight block mb-0.5">
                      Class
                    </label>
                    <select
                      className="input-field w-full text-xs py-1"
                      required
                      value={formData.studentClass}
                      onChange={(e) => {
                        const selectedClass = e.target.value;
                        const classToLevel = {
                          "Pre-Nursery": { level: "Beginner", category: "Nursery" },
                          "Nursery 1": { level: "Beginner", category: "Nursery" },
                          "Nursery 2": { level: "Beginner", category: "Nursery" },
                          "Primary 1": { level: "General", category: "Primary" },
                          "Primary 2": { level: "General", category: "Primary" },
                          "Primary 3": { level: "General", category: "Primary" },
                          "Primary 4": { level: "General", category: "Primary" },
                          "Primary 5": { level: "General", category: "Primary" },
                          "Primary 6": { level: "General", category: "Primary" },
                          "JSS 1": { level: "Junior", category: "Secondary" },
                          "JSS 2": { level: "Junior", category: "Secondary" },
                          "JSS 3": { level: "Junior", category: "Secondary" },
                          "SSS 1": { level: "Senior", category: "Secondary" },
                          "SSS 2": { level: "Senior", category: "Secondary" },
                          "SSS 3": { level: "Senior", category: "Secondary" },
                        };

                        const classInfo = classToLevel[selectedClass];
                        let autoSubjectIds = [];

                        // Auto-select for Nursery, Primary and Junior Secondary
                        if (classInfo && (selectedClass.includes("Nursery") || selectedClass.includes("Primary") || selectedClass.includes("JSS") || selectedClass.includes("Pre-Nursery"))) {
                          autoSubjectIds = subjects
                            .filter(s => s.category === classInfo.category && s.level === classInfo.level)
                            .map(s => s.id);
                        }

                        setFormData({
                          ...formData,
                          studentClass: selectedClass,
                          subjectIds: autoSubjectIds
                        });
                      }}
                    >
                      <option value="">Pick a Class...</option>
                      {classes.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  {formData.studentClass && ["SSS 1", "SSS 2", "SSS 3"].includes(formData.studentClass) && (
                    <div>
                      <label className="text-[9px] font-semibold text-black dark:text-brand-300 uppercase tracking-tight block mb-0.5">
                        Section 📚
                      </label>
                      <select
                        className="input-field w-full text-xs py-1"
                        value={formData.section || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            section: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Section...</option>
                        <option value="Science">Science</option>
                        <option value="Art">Art</option>
                        <option value="Commercial">Commercial</option>
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="text-[9px] font-semibold text-black dark:text-brand-300 uppercase tracking-tight block mb-0.5">
                      Date of Birth 🎂
                    </label>
                    <input
                      type="date"
                      className="input-field w-full text-xs py-1"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dateOfBirth: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-semibold text-black dark:text-brand-300 uppercase tracking-tight block mb-0.5">
                      Parent Email 📧
                    </label>
                    <input
                      type="email"
                      className="input-field w-full text-xs py-1"
                      placeholder="parent@example.com"
                      value={formData.parentEmail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          parentEmail: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-[9px] font-semibold text-black dark:text-brand-300 uppercase tracking-tight block mb-0.5">
                    Subjects
                  </label>
                  <div className="space-y-2 p-1.5 border-2 border-gray-300 dark:border-brand-700 rounded-lg bg-gray-50 dark:bg-brand-800 max-h-40 overflow-y-auto">
                    {formData.studentClass && ["SSS 1", "SSS 2", "SSS 3"].includes(formData.studentClass)
                      ? (() => {
                          const { sectionSubjects, generalSubjects } = getSectionAndGeneralSubjects(getSubjectsForClass());
                          const grouped = getGroupedSubjects(sectionSubjects);
                          return (
                            <>
                              {Object.entries(grouped).map(([section, subs]) => (
                                <div key={section} className="space-y-1">
                                  <h4 className="text-[8px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                                    {section} Section
                                  </h4>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                                    {subs.map((sub) => (
                                      <button
                                        key={sub.id}
                                        type="button"
                                        onClick={() => handleSubjectToggle(sub.id)}
                                        className={`p-1 rounded-lg border text-[8px] sm:text-[9px] font-semibold uppercase tracking-tight transition-all ${
                                          formData.subjectIds.includes(sub.id)
                                            ? "bg-blue-500 border-blue-600 shadow-sm text-white"
                                            : "bg-white dark:bg-brand-700 border-gray-200 dark:border-brand-600 text-gray-700 dark:text-brand-300 hover:border-blue-400"
                                        }`}
                                      >
                                        {sub.name}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                              {generalSubjects.length > 0 && (
                                <div className="space-y-1 pt-1 border-t border-gray-300 dark:border-brand-600">
                                  <h4 className="text-[8px] font-bold text-green-600 dark:text-green-400 uppercase">
                                    Other Subjects
                                  </h4>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                                    {generalSubjects.map((sub) => (
                                      <button
                                        key={sub.id}
                                        type="button"
                                        onClick={() => handleSubjectToggle(sub.id)}
                                        className={`p-1 rounded-lg border text-[8px] sm:text-[9px] font-semibold uppercase tracking-tight transition-all ${
                                          formData.subjectIds.includes(sub.id)
                                            ? "bg-green-500 border-green-600 shadow-sm text-white"
                                            : "bg-white dark:bg-brand-700 border-gray-200 dark:border-brand-600 text-gray-700 dark:text-brand-300 hover:border-green-400"
                                        }`}
                                      >
                                        {sub.name}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </>
                          );
                        })()
                      : (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                            {getSubjectsForClass().map((sub) => (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={() => handleSubjectToggle(sub.id)}
                                className={`p-1 rounded-lg border text-[8px] sm:text-[9px] font-semibold uppercase tracking-tight transition-all ${
                                  formData.subjectIds.includes(sub.id)
                                    ? "bg-blue-500 border-blue-600 shadow-sm text-white"
                                    : "bg-white dark:bg-brand-700 border-gray-200 dark:border-brand-600 text-gray-700 dark:text-brand-300 hover:border-blue-400"
                                }`}
                              >
                                {sub.name}
                              </button>
                            ))}
                          </div>
                        )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-4 border-t border-brand-700/30 sticky bottom-0 bg-brand-50 dark:bg-brand-900">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary w-full py-2 text-sm border border-brand-700/50 bg-brand-200 dark:bg-brand-700 hover:bg-brand-300 dark:hover:bg-brand-600 text-black dark:text-white flex items-center justify-center gap-2 font-bold rounded-lg"
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary w-full py-2 text-sm bg-accent-gold flex items-center justify-center gap-2 rounded-lg hover:shadow-lg transition-shadow"
                >
                  <Sparkles size={16} />
                  Enroll Legend! 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-brand-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="professional-card bg-brand-50 dark:bg-brand-900 p-4 md:p-6 w-full max-w-5xl relative border border-brand-700/50 shadow-xl my-2 md:my-8 max-h-[98vh] md:max-h-[95vh] flex flex-col">
            <button
              onClick={() => setEditingStudent(null)}
              className="absolute top-2 right-2 md:top-4 md:right-4 text-black dark:text-brand-100 hover:rotate-90 transition-transform p-1 bg-white/10 rounded-full"
            >
              <X size={20} className="md:w-6 md:h-6" />
            </button>
            <h3 className="text-xl md:text-2xl font-bold text-black dark:text-brand-100 uppercase tracking-tight mb-4 md:mb-6 text-gradient">
              Modify Legend 🛠️
            </h3>

            <form onSubmit={handleUpdateStudent} className="space-y-3 md:space-y-4 overflow-y-auto flex-1 pr-1 md:pr-2 scrollbar-thin">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Profile Image Section */}
                <div className="md:row-span-2 flex flex-col items-center gap-2">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 dark:bg-brand-800 border-2 border-gray-300 dark:border-brand-700 rounded-lg overflow-hidden shadow-sm relative group">
                    {editingStudent.profileImage ? (
                      <img
                        src={editingStudent.profileImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-semibold text-2xl sm:text-3xl">
                        {editingStudent.firstName?.charAt(0)}
                      </div>
                    )}
                    <label className="absolute inset-0 bg-brand-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <Upload size={20} className="text-white sm:w-6 sm:h-6" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleEditImageChange}
                      />
                    </label>
                  </div>
                  <p className="text-[8px] sm:text-xs font-semibold uppercase tracking-tight text-gray-500">
                    Photo
                  </p>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-black dark:text-brand-300 uppercase tracking-tight">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      className="input-field w-full text-sm py-2"
                      value={editingStudent.firstName}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-black dark:text-brand-300 uppercase tracking-tight">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      className="input-field w-full text-sm py-2"
                      value={editingStudent.lastName}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-black dark:text-brand-300 uppercase tracking-tight">
                      ID Number
                    </label>
                    <input
                      type="text"
                      required
                      className="input-field w-full text-sm py-2"
                      value={editingStudent.registrationNumber}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          registrationNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-black dark:text-brand-300 uppercase tracking-tight">
                      Class
                    </label>
                    <select
                      className="input-field w-full text-sm py-2"
                      required
                      value={editingStudent.studentClass}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          studentClass: e.target.value,
                        })
                      }
                    >
                      {classes.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  {editingStudent.studentClass && ["SSS 1", "SSS 2", "SSS 3"].includes(editingStudent.studentClass) && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-black dark:text-brand-300 uppercase tracking-tight">
                        Section 📚
                      </label>
                      <select
                        className="input-field w-full text-sm py-2"
                        value={editingStudent.section || ""}
                        onChange={(e) =>
                          setEditingStudent({
                            ...editingStudent,
                            section: e.target.value || null,
                          })
                        }
                      >
                        <option value="">Select Section...</option>
                        <option value="Science">Science</option>
                        <option value="Art">Art</option>
                        <option value="Commercial">Commercial</option>
                      </select>
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-black dark:text-brand-300 uppercase tracking-tight">
                      Date of Birth 🎂
                    </label>
                    <input
                      type="date"
                      className="input-field w-full text-sm py-2"
                      value={editingStudent.dateOfBirth || ""}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          dateOfBirth: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-black dark:text-brand-300 uppercase tracking-tight">
                      Parent Email 📧
                    </label>
                    <input
                      type="email"
                      className="input-field w-full text-sm py-2"
                      placeholder="parent@example.com"
                      value={editingStudent.parentEmail || ""}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          parentEmail: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-semibold text-black dark:text-brand-300 uppercase tracking-tight">
                    Subjects
                  </label>
                  <div className="space-y-3 p-3 border-2 border-gray-300 dark:border-brand-700 rounded-lg bg-gray-50 dark:bg-brand-800 max-h-48 overflow-y-auto">
                    {editingStudent.studentClass && ["SSS 1", "SSS 2", "SSS 3"].includes(editingStudent.studentClass)
                      ? (() => {
                          const filteredSubjects = subjects.filter(s => s.category === "Secondary" && s.level === "Senior");
                          const { sectionSubjects, generalSubjects } = getSectionAndGeneralSubjects(filteredSubjects);
                          const grouped = getGroupedSubjects(sectionSubjects);
                          return (
                            <>
                              {Object.entries(grouped).map(([section, subs]) => (
                                <div key={section} className="space-y-2">
                                  <h4 className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                                    {section} Section
                                  </h4>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {subs.map((sub) => (
                                      <button
                                        key={sub.id}
                                        type="button"
                                        onClick={() => handleEditSubjectToggle(sub.id)}
                                        className={`p-2 rounded-lg border text-[9px] sm:text-[10px] font-semibold uppercase tracking-tight transition-all ${
                                          (editingStudent.Subjects || []).some(
                                            (s) => s.id === sub.id,
                                          )
                                            ? "bg-blue-500 border-blue-600 shadow-sm text-white"
                                            : "bg-white dark:bg-brand-700 border-gray-200 dark:border-brand-600 text-gray-700 dark:text-brand-300 hover:border-blue-400"
                                        }`}
                                      >
                                        {sub.name}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                              {generalSubjects.length > 0 && (
                                <div className="space-y-2 pt-2 border-t border-gray-300 dark:border-brand-600">
                                  <h4 className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase">
                                    Other Subjects
                                  </h4>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {generalSubjects.map((sub) => (
                                      <button
                                        key={sub.id}
                                        type="button"
                                        onClick={() => handleEditSubjectToggle(sub.id)}
                                        className={`p-2 rounded-lg border text-[9px] sm:text-[10px] font-semibold uppercase tracking-tight transition-all ${
                                          (editingStudent.Subjects || []).some(
                                            (s) => s.id === sub.id,
                                          )
                                            ? "bg-green-500 border-green-600 shadow-sm text-white"
                                            : "bg-white dark:bg-brand-700 border-gray-200 dark:border-brand-600 text-gray-700 dark:text-brand-300 hover:border-green-400"
                                        }`}
                                      >
                                        {sub.name}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </>
                          );
                        })()
                      : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {subjects.map((sub) => (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={() => handleEditSubjectToggle(sub.id)}
                                className={`p-2 rounded-lg border text-[9px] sm:text-[10px] font-semibold uppercase tracking-tight transition-all ${
                                  (editingStudent.Subjects || []).some(
                                    (s) => s.id === sub.id,
                                  )
                                    ? "bg-blue-500 border-blue-600 shadow-sm text-white"
                                    : "bg-white dark:bg-brand-700 border-gray-200 dark:border-brand-600 text-gray-700 dark:text-brand-300 hover:border-blue-400"
                                }`}
                              >
                                {sub.name}
                              </button>
                            ))}
                          </div>
                        )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="btn-secondary w-full py-4 text-lg border border-brand-700/50 bg-brand-200 dark:bg-brand-700 hover:bg-brand-300 dark:hover:bg-brand-600 text-black dark:text-white flex items-center justify-center gap-2 font-bold"
                >
                  <X size={20} />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary w-full py-6 text-2xl bg-accent-gold flex items-center justify-center gap-3"
                >
                  <Save size={24} />
                  Save Changes! ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b-4 border-brand-900">
              <th className="py-6 font-bold text-black dark:text-brand-300 uppercase tracking-widest text-sm">
                Superstar
              </th>
              <th className="py-6 font-bold text-black dark:text-brand-300 uppercase tracking-widest text-sm">
                ID Card
              </th>
              <th className="py-6 font-bold text-black dark:text-brand-300 uppercase tracking-widest text-sm">
                Class
              </th>
              <th className="py-6 font-bold text-black dark:text-brand-300 uppercase tracking-widest text-sm text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black/10">
            {filteredStudents.map((s) => (
              <tr
                key={s.id}
                className="group hover:bg-accent-gold/5 transition-colors"
              >
                <td className="py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-50 dark:bg-brand-800 border border-brand-700/50 rounded-lg flex items-center justify-center overflow-hidden shadow-md group-hover:rotate-3 transition-transform">
                      {s.profileImage ? (
                        <img
                          src={s.profileImage}
                          alt={s.firstName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-bold text-2xl text-black dark:text-white">
                          {s.firstName.charAt(0)}
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-xl text-black dark:text-white uppercase tracking-tight">
                      {s.firstName} {s.lastName}
                    </span>
                  </div>
                </td>
                <td className="py-6">
                  <span className="font-mono font-bold text-gray-500 dark:text-brand-400">
                    #{s.registrationNumber}
                  </span>
                </td>
                <td className="py-6">
                  <span className="bg-accent-gold border border-brand-700/50 px-3 py-1 rounded-lg font-bold uppercase text-xs tracking-widest text-black shadow-xl-xs">
                    {s.studentClass}
                  </span>
                </td>
                <td className="py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingStudent(s)}
                      className="p-3 bg-brand-50 dark:bg-brand-800 border border-brand-700/50 rounded-xl hover:bg-accent-gold transition-all shadow-xl-xs"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(s.id)}
                      className="p-3 bg-accent-red text-white border border-brand-700/50 rounded-xl hover:scale-110 transition-all shadow-xl-xs"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredStudents.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-2xl font-bold text-gray-300 uppercase  tracking-widest">
              No legends found matching your quest! 🔍
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: "",
    category: "Primary",
    level: "General",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = () => {
    api.get("/students/subjects").then((res) => setSubjects(res.data));
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    try {
      await api.post("/students/subjects", newSubject);
      setMessage("Subject added to the vault! 📚");
      setNewSubject({ name: "", category: "Primary", level: "General" });
      setShowAddModal(false);
      fetchSubjects();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error adding subject");
    }
  };

  return (
    <div className="professional-card p-6 bg-brand-50 dark:bg-brand-900">
      <div className="flex justify-between items-end mb-10 border-b-4 border-brand-900 pb-8">
        <div>
          <h2 className="text-4xl font-bold text-black dark:text-white uppercase  tracking-tight text-gradient mb-2">
            Knowledge Vault 📚
          </h2>
          <p className="text-xl font-bold text-accent-gold uppercase tracking-tight">
            The secret formulas of wisdom!
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="w-16 h-16 bg-accent-gold border border-brand-700/50 rounded-lg flex items-center justify-center shadow-md hover:-translate-y-1 transition-all group"
          >
            <Plus
              size={32}
              className="text-black group-hover:scale-110 transition-transform"
            />
          </button>
          <div className="w-16 h-16 bg-accent-red border border-brand-700/50 rounded-lg flex items-center justify-center shadow-md">
            <BookOpen size={32} className="text-black" />
          </div>
        </div>
      </div>

      {message && (
        <div className="p-4 mb-8 bg-accent-gold/20 border border-brand-700/50 rounded-lg font-bold uppercase tracking-tight text-black dark:text-white flex items-center gap-3">
          <Sparkles size={20} className="text-accent-gold" />
          {message}
        </div>
      )}

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-950/50 backdrop-blur-sm">
          <div className="professional-card bg-brand-50 dark:bg-brand-900 p-6 w-full max-w-md relative border border-brand-700/50 shadow-xl">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-black dark:text-white hover:rotate-90 transition-transform"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold text-black dark:text-white uppercase  tracking-tight mb-6">
              New Wisdom Cube 🧪
            </h3>
            <form onSubmit={handleAddSubject} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-black dark:text-brand-300 uppercase tracking-widest">
                  Subject Name
                </label>
                <input
                  type="text"
                  required
                  className="input-field w-full"
                  placeholder="e.g. Quantum Physics"
                  value={newSubject.name}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-black dark:text-brand-300 uppercase tracking-widest">
                  Category
                </label>
                <select
                  className="input-field w-full"
                  value={newSubject.category}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, category: e.target.value })
                  }
                >
                  <option value="Nursery">Nursery</option>
                  <option value="Primary">Primary</option>
                  <option value="Secondary">Secondary</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-black dark:text-brand-300 uppercase tracking-widest">
                  Level
                </label>
                <select
                  className="input-field w-full"
                  value={newSubject.level}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, level: e.target.value })
                  }
                >
                  <option value="Beginner">Beginner</option>
                  <option value="General">General</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>
              <button
                type="submit"
                className="btn-primary w-full py-4 text-lg"
              >
                Add to Vault! 🚀
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {subjects.map((sub) => (
          <div
            key={sub.id}
            className="professional-card p-6 bg-brand-50 dark:bg-brand-800 border border-brand-700/50 shadow-md hover:-translate-y-2 transition-transform group cursor-pointer"
          >
            <div className="w-12 h-12 bg-accent-gold/10 dark:bg-accent-gold/5 border border-brand-700/50 rounded-lg mb-6 flex items-center justify-center group-hover:bg-accent-gold transition-colors">
              <BookOpen size={24} className="text-black dark:text-white" />
            </div>
            <h4 className="text-2xl font-bold text-black dark:text-white uppercase  tracking-tight text-gradient mb-4">
              {sub.name}
            </h4>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-brand-950 text-white px-3 py-1 rounded-lg font-bold uppercase text-[10px] tracking-widest border border-white/20">
                {sub.category}
              </span>
              <span className="bg-accent-gold border border-brand-700/50 px-3 py-1 rounded-lg font-bold uppercase text-[10px] tracking-widest">
                {sub.level}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    id: null,
    type: "",
  });
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    isFormTeacher: false,
    isSubjectTeacher: true,
    assignedClass: "",
    assignedSubject: [], // Changed to array
    profileImage: null,
  });
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [message, setMessage] = useState("");
  const [creds, setCreds] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const classes = [
    "Pre-Nursery",
    "Nursery 1",
    "Nursery 2",
    "Primary 1",
    "Primary 2",
    "Primary 3",
    "Primary 4",
    "Primary 5",
    "Primary 6",
    "JSS 1",
    "JSS 2",
    "JSS 3",
    "SSS 1",
    "SSS 2",
    "SSS 3",
  ];

  useEffect(() => {
    fetchTeachers();
    fetchSubjects();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await api.get("/teachers");
      setTeachers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/students/subjects");
      setSubjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingTeacher({ ...editingTeacher, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubjectToggle = (subjectName) => {
    setFormData((prev) => ({
      ...prev,
      assignedSubject: prev.assignedSubject.includes(subjectName)
        ? prev.assignedSubject.filter((s) => s !== subjectName)
        : [...prev.assignedSubject, subjectName],
    }));
  };

  const handleEditSubjectToggle = (subjectName) => {
    const currentSubjects = editingTeacher.assignedSubject
      ? typeof editingTeacher.assignedSubject === "string"
        ? editingTeacher.assignedSubject.split(", ").filter((s) => s !== "")
        : editingTeacher.assignedSubject
      : [];

    const newSubjects = currentSubjects.includes(subjectName)
      ? currentSubjects.filter((s) => s !== subjectName)
      : [...currentSubjects, subjectName];

    setEditingTeacher({
      ...editingTeacher,
      assignedSubject: newSubjects.join(", "),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.isFormTeacher && !formData.isSubjectTeacher) {
      setMessage(
        "Error: Teacher must be at least a Form Teacher or Subject Teacher!",
      );
      return;
    }
    try {
      const res = await api.post("/teachers/register", formData);
      setMessage("Teacher registered successfully!");
      setCreds(res.data.credentials);
      setFormData({
        fullName: "",
        email: "",
        isFormTeacher: false,
        isSubjectTeacher: true,
        assignedClass: "",
        assignedSubject: [],
        profileImage: null,
      });
      fetchTeachers();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Error registering teacher";
      setMessage(errorMsg);
    }
  };

  const handleDelete = (id) => {
    setConfirmDelete({ show: true, id, type: "teacher" });
  };

  const executeDeleteTeacher = async (id) => {
    try {
      await api.delete(`/teachers/${id}`);
      setMessage("Educator ejected successfully! 👋");
      fetchTeachers();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error deleting teacher");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/teachers/${editingTeacher.id}`, editingTeacher);
      setMessage("Educator profile updated! ✨");
      setEditingTeacher(null);
      fetchTeachers();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error updating teacher");
    }
  };

  return (
    <div className="space-y-10">
      {/* Confirm Delete Modal */}
      {confirmDelete.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-950/60 backdrop-blur-sm">
          <div className="professional-card bg-brand-50 dark:bg-brand-900 border border-brand-700/50 shadow-xl p-6 w-full max-w-sm mx-4 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-accent-red border border-brand-700/50 rounded-lg flex items-center justify-center shadow-md">
                <Trash2 size={22} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white uppercase  tracking-tight text-gradient">
                Are you sure?
              </h3>
            </div>
            <p className="text-sm font-bold text-brand-500 dark:text-brand-400 mb-6 leading-relaxed">
              This will permanently eject this educator from the academy. No
              take-backs! 🚀
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  executeDeleteTeacher(confirmDelete.id);
                  setConfirmDelete({ show: false, id: null, type: "" });
                }}
                className="flex-1 py-3 bg-accent-red border border-brand-700/50 rounded-lg font-bold text-white uppercase tracking-tight shadow-md hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={16} /> Confirm
              </button>
              <button
                onClick={() =>
                  setConfirmDelete({ show: false, id: null, type: "" })
                }
                className="flex-1 py-3 bg-brand-50 dark:bg-brand-800 border border-brand-700/50 rounded-lg font-bold text-black dark:text-white uppercase tracking-tight shadow-md hover:-translate-y-1 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Count Banner */}
      <div className="flex items-center gap-4 px-6 py-4 bg-accent-gold/20 border border-brand-700/50 rounded-lg shadow-md">
        <div className="w-10 h-10 bg-accent-gold border border-brand-700/50 rounded-xl flex items-center justify-center shadow-md">
          <UserCircle size={20} className="text-black" />
        </div>
        <div>
          <p className="text-xs font-bold text-brand-500 dark:text-brand-400 uppercase tracking-widest">
            Total Educators on Roster
          </p>
          <p className="text-2xl font-bold text-black dark:text-white tracking-tight text-gradient">
            {teachers.length}{" "}
            <span className="text-base font-bold text-accent-red uppercase tracking-tight">
              Teacher{teachers.length !== 1 ? "s" : ""}
            </span>
          </p>
        </div>
      </div>

      <div className="professional-card p-6 bg-brand-50 dark:bg-brand-900">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-black dark:text-white uppercase  tracking-tight text-gradient">
            Hire New Educator! 🍎
          </h2>
          <button
            onClick={() => setShowTeacherForm(true)}
            className="btn-primary text-black py-3 px-6 flex items-center gap-2 font-bold uppercase tracking-tight"
          >
            <Plus size={20} />
            Add Teacher
          </button>
        </div>
      </div>

      {showTeacherForm && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-brand-950/50 backdrop-blur-sm overflow-y-auto">
        <div className="professional-card bg-brand-50 dark:bg-brand-900 p-4 md:p-6 w-full max-w-2xl max-h-[98vh] md:max-h-[90vh] overflow-y-auto border border-brand-700/50 shadow-xl relative my-2">
          <button
            onClick={() => {
              setFormData({
                fullName: "",
                email: "",
                isFormTeacher: false,
                isSubjectTeacher: true,
                assignedClass: "",
                assignedSubject: [],
                profileImage: null,
              });
              setMessage("");
              setCreds(null);
              setShowTeacherForm(false);
            }}
            className="absolute top-2 right-2 md:top-4 md:right-4 text-black dark:text-white hover:rotate-90 transition-transform p-1 bg-white/10 rounded-full"
          >
            <X size={20} className="md:w-6 md:h-6" />
          </button>

          <h2 className="text-xl md:text-3xl font-bold text-black dark:text-white mb-6 md:mb-8 uppercase tracking-tight text-gradient pr-8">
            Hire New Educator! 🍎
          </h2>

          {message && (
            <div
              className={`p-6 mb-8 border border-brand-700/50 rounded-lg flex items-center gap-4 ${message.includes("Error") ? "bg-accent-red/20" : "bg-accent-gold/20"}`}
            >
              <div
                className={`w-4 h-4 rounded-full border border-brand-700/50 flex-shrink-0 ${message.includes("Error") ? "bg-accent-red" : "bg-accent-gold"}`}
              ></div>
              <span className="font-bold uppercase tracking-tight text-black dark:text-white text-sm">
                {message}
              </span>
            </div>
          )}

          {creds && (
            <div className="p-8 mb-10 bg-accent-gold border border-brand-700/50 rounded-xl shadow-xl">
              <div className="flex items-center gap-3 mb-6 text-black font-bold uppercase  tracking-tight text-lg text-gradient">
                <CheckCircle size={24} />
                <span>Teacher Keys Generated! 🔑</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-brand-950 p-4 rounded-lg border border-brand-700/50 shadow-md">
                  <p className="text-xs text-accent-gold/60 uppercase font-bold tracking-widest mb-2">
                    Login Username
                  </p>
                  <p className="font-mono font-bold text-sm text-accent-gold select-all break-all">
                    {creds.username}
                  </p>
                </div>
                <div className="bg-brand-950 p-4 rounded-lg border border-brand-700/50 shadow-md relative">
                  <p className="text-xs text-accent-gold/60 uppercase font-bold tracking-widest mb-2">
                    Login Password
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="font-mono font-bold text-sm text-accent-gold select-all break-all">
                      {showPassword ? creds.password : "••••••••"}
                    </p>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-accent-gold hover:text-white transition-colors p-1 flex-shrink-0"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-sm mt-6 text-black font-bold ">
                🚀 Mission: Share these keys with the new educator immediately!
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="md:col-span-2 flex flex-col items-center gap-3 mb-4">
            <div className="w-24 h-24 bg-gray-100 dark:bg-brand-800 border border-brand-700/50 rounded-lg overflow-hidden shadow-md relative group">
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                  <UserPlus size={24} />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Add Photo
                  </span>
                </div>
              )}
              <label className="absolute inset-0 bg-brand-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer gap-2">
                <Upload size={24} className="text-white" />
                <span className="text-white font-bold text-xs uppercase tracking-widest">
                  {formData.profileImage ? "Change" : "Upload"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Avatar (Optional)
            </p>
            {formData.profileImage && (
              <button
                type="button"
                onClick={() => setFormData({ ...formData, profileImage: null })}
                className="text-xs font-bold uppercase tracking-widest text-accent-red hover:underline"
              >
                Remove Photo
              </button>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-base font-bold text-black dark:text-brand-300 uppercase tracking-tight text-gradient">
              Full Name
            </label>
            <input
              type="text"
              className="input-field w-full"
              placeholder="e.g. Professor X"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-base font-bold text-black dark:text-brand-300 uppercase tracking-tight text-gradient">
              Email Address
            </label>
            <input
              type="email"
              className="input-field w-full"
              placeholder="e.g. pro@academy.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-base font-bold text-black dark:text-brand-300 uppercase tracking-tight text-gradient">
              Assign Class (Optional)
            </label>
            <select
              className="input-field w-full"
              value={formData.assignedClass}
              onChange={(e) =>
                setFormData({ ...formData, assignedClass: e.target.value })
              }
            >
              <option value="">Select a Class</option>
              {classes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-base font-bold text-black dark:text-brand-300 uppercase tracking-tight text-gradient">
              Assign Subjects (Select Multiple)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4 border border-brand-700/50 rounded-lg bg-gray-50 dark:bg-brand-800 shadow-inner max-h-56 overflow-y-auto">
              {subjects.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSubjectToggle(s.name)}
                  className={`p-3 rounded-xl border-2 font-bold text-[10px] uppercase tracking-tight transition-all ${
                    formData.assignedSubject.includes(s.name)
                      ? "bg-accent-gold border-brand-900 shadow-xl-xs -translate-y-1 text-black"
                      : "bg-brand-50 dark:bg-brand-700 border-gray-200 dark:border-brand-600 text-gray-400 dark:text-brand-500 hover:border-brand-900"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-6 mt-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.isFormTeacher}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isFormTeacher: e.target.checked,
                    })
                  }
                />
                <div className="w-14 h-8 bg-gray-200 border border-brand-700/50 rounded-full peer peer-checked:bg-accent-gold transition-all"></div>
                <div className="absolute left-1 top-1 w-6 h-6 bg-brand-50 border border-brand-700/50 rounded-full transition-all peer-checked:translate-x-6"></div>
              </div>
              <span className="font-bold uppercase tracking-tight text-black dark:text-brand-300 text-sm group-hover:text-accent-red transition-colors">
                Form Teacher
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.isSubjectTeacher}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isSubjectTeacher: e.target.checked,
                    })
                  }
                />
                <div className="w-14 h-8 bg-gray-200 border border-brand-700/50 rounded-full peer peer-checked:bg-accent-red transition-all"></div>
                <div className="absolute left-1 top-1 w-6 h-6 bg-brand-50 border border-brand-700/50 rounded-full transition-all peer-checked:translate-x-6"></div>
              </div>
              <span className="font-bold uppercase tracking-tight text-black dark:text-brand-300 text-sm group-hover:text-accent-gold transition-colors">
                Subject Teacher
              </span>
            </label>
          </div>

          <div className="md:col-span-2 flex gap-4">
            <button
              type="submit"
              className="flex-1 btn-primary text-accent-black py-4 text-lg flex items-center justify-center gap-3"
            >
              <UserPlus size={24} />
              Onboard Teacher! 🚀
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  fullName: "",
                  email: "",
                  isFormTeacher: false,
                  isSubjectTeacher: true,
                  assignedClass: "",
                  assignedSubject: [],
                  profileImage: null,
                });
                setMessage("");
                setCreds(null);
                setShowTeacherForm(false);
              }}
              className="flex-1 btn-primary bg-brand-300 dark:bg-brand-700 text-black dark:text-white py-4 text-lg flex items-center justify-center gap-3 border border-brand-700/50"
            >
              <X size={24} />
              Cancel
            </button>
          </div>
        </form>
        </div>
      </div>
      )}

      <div className="professional-card p-6 bg-brand-50 dark:bg-brand-900">
        <h2 className="text-3xl font-bold text-black dark:text-white mb-8 uppercase  tracking-tight text-gradient">
          The Educators Squad 🎓
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b-4 border-brand-900">
                <th className="py-6 font-bold text-black dark:text-brand-300 uppercase tracking-widest text-sm">
                  Full Name
                </th>
                <th className="py-6 font-bold text-black dark:text-brand-300 uppercase tracking-widest text-sm">
                  Username
                </th>
                <th className="py-6 font-bold text-black dark:text-brand-300 uppercase tracking-widest text-sm text-center">
                  Roles
                </th>
                <th className="py-6 font-bold text-black dark:text-brand-300 uppercase tracking-widest text-sm text-center">
                  Assignment
                </th>
                <th className="py-6 font-bold text-black dark:text-brand-300 uppercase tracking-widest text-sm text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black/10">
              {teachers.map((t) => (
                <tr
                  key={t.id}
                  className="group hover:bg-accent-gold/5 transition-colors"
                >
                  <td className="py-6 font-bold text-lg text-black dark:text-white uppercase tracking-tight ">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-brand-50 dark:bg-brand-800 border border-brand-700/50 rounded-xl flex items-center justify-center overflow-hidden shadow-md group-hover:rotate-3 transition-transform">
                        {t.profileImage ? (
                          <img
                            src={t.profileImage}
                            alt={t.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-bold text-xl text-black dark:text-white">
                            {t.fullName?.charAt(0)}
                          </span>
                        )}
                      </div>
                      {t.fullName}
                    </div>
                  </td>
                  <td className="py-6 font-mono font-bold text-accent-red text-sm uppercase">
                    {t.username}
                  </td>
                  <td className="py-6">
                    <div className="flex flex-wrap justify-center gap-2">
                      {t.isFormTeacher && (
                        <span className="bg-accent-gold text-black border border-brand-700/50 px-2 py-1 rounded-lg font-bold uppercase text-[10px] tracking-tight">
                          Form
                        </span>
                      )}
                      {t.isSubjectTeacher && (
                        <span className="bg-accent-red text-white border border-brand-700/50 px-2 py-1 rounded-lg font-bold uppercase text-[10px] tracking-tight">
                          Subject
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-6 text-center">
                    <div className="flex flex-col items-center gap-2">
                      {t.assignedClass && (
                        <span className="bg-brand-950 text-accent-gold px-2 py-1 rounded-md font-bold uppercase text-[10px] tracking-widest border border-accent-gold shadow-xl-xs">
                          {t.assignedClass}
                        </span>
                      )}
                      <div className="flex flex-wrap justify-center gap-1 max-w-[150px]">
                        {t.assignedSubject &&
                          t.assignedSubject.split(", ").map((sub, idx) => (
                            <span
                              key={idx}
                              className="bg-brand-50 dark:bg-brand-800 text-black dark:text-white px-2 py-0.5 rounded-md font-bold uppercase text-[8px] tracking-widest border border-brand-900 whitespace-nowrap"
                            >
                              {sub}
                            </span>
                          ))}
                      </div>
                      {!t.assignedClass && !t.assignedSubject && (
                        <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest ">
                          Not Assigned
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingTeacher(t)}
                        className="p-2 bg-accent-gold border border-brand-700/50 rounded-xl hover:-translate-y-1 transition-all"
                      >
                        <Edit3 size={18} className="text-black" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-2 bg-accent-red border border-brand-700/50 rounded-xl hover:-translate-y-1 transition-all"
                      >
                        <Trash2 size={18} className="text-white" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Teacher Modal */}
      {editingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-950/50 backdrop-blur-sm overflow-y-auto">
          <div className="professional-card bg-brand-50 dark:bg-brand-900 p-6 w-full max-w-2xl relative border border-brand-700/50 shadow-xl my-8">
            <button
              onClick={() => setEditingTeacher(null)}
              className="absolute top-4 right-4 text-black dark:text-white hover:rotate-90 transition-transform"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold text-black dark:text-white uppercase  tracking-tight mb-6">
              Modify Educator 🛠️
            </h3>
            <form
              onSubmit={handleUpdate}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="md:col-span-2 flex flex-col items-center gap-4 mb-2">
                <div className="w-24 h-24 bg-gray-100 dark:bg-brand-800 border border-brand-700/50 rounded-lg overflow-hidden shadow-md relative group">
                  {editingTeacher.profileImage ? (
                    <img
                      src={editingTeacher.profileImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-2xl">
                      {editingTeacher.fullName?.charAt(0)}
                    </div>
                  )}
                  <label className="absolute inset-0 bg-brand-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Upload size={20} className="text-white" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleEditImageChange}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-black dark:text-brand-300 uppercase tracking-widest">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  className="input-field w-full"
                  value={editingTeacher.fullName}
                  onChange={(e) =>
                    setEditingTeacher({
                      ...editingTeacher,
                      fullName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-black dark:text-brand-300 uppercase tracking-widest">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="input-field w-full"
                  value={editingTeacher.email}
                  onChange={(e) =>
                    setEditingTeacher({
                      ...editingTeacher,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-black dark:text-brand-300 uppercase tracking-widest">
                  Assign Class
                </label>
                <select
                  className="input-field w-full"
                  value={editingTeacher.assignedClass || ""}
                  onChange={(e) =>
                    setEditingTeacher({
                      ...editingTeacher,
                      assignedClass: e.target.value,
                    })
                  }
                >
                  <option value="">None</option>
                  {classes.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-black dark:text-brand-300 uppercase tracking-widest">
                  Assign Subjects (Select Multiple)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 border border-brand-700/50 rounded-lg bg-gray-50 dark:bg-brand-800 shadow-inner max-h-40 overflow-y-auto">
                  {subjects.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleEditSubjectToggle(s.name)}
                      className={`p-2 rounded-xl border-2 font-bold text-[10px] uppercase tracking-tight transition-all ${
                        (editingTeacher.assignedSubject || "")
                          .split(", ")
                          .includes(s.name)
                          ? "bg-accent-gold border-brand-900 shadow-xl-xs -translate-y-1 text-black"
                          : "bg-brand-50 dark:bg-brand-700 border-gray-200 dark:border-brand-600 text-gray-400 dark:text-brand-500 hover:border-brand-900"
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 flex gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-6 h-6 border border-brand-700/50 rounded-lg checked:bg-accent-gold"
                    checked={editingTeacher.isFormTeacher}
                    onChange={(e) =>
                      setEditingTeacher({
                        ...editingTeacher,
                        isFormTeacher: e.target.checked,
                      })
                    }
                  />
                  <span className="font-bold uppercase tracking-tight text-black dark:text-brand-300">
                    Form Teacher
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-6 h-6 border border-brand-700/50 rounded-lg checked:bg-accent-red"
                    checked={editingTeacher.isSubjectTeacher}
                    onChange={(e) =>
                      setEditingTeacher({
                        ...editingTeacher,
                        isSubjectTeacher: e.target.checked,
                      })
                    }
                  />
                  <span className="font-bold uppercase tracking-tight text-black dark:text-brand-300">
                    Subject Teacher
                  </span>
                </label>
              </div>
              <button
                type="submit"
                className="btn-primary md:col-span-2 py-4 text-lg"
              >
                Save Changes ✨
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
