import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Link, NavLink, useNavigate } from "react-router-dom";
import api from "../api";
import {
  UserPlus,
  FileText,
  CheckCircle,
  LogOut,
  LayoutDashboard,
  Calendar,
  FileSpreadsheet,
  Lock,
  Unlock,
  Search,
  Settings,
  Upload,
  Save,
  UserCircle,
  ChevronUp,
  Menu,
  X,
  MessageCircle,
} from "lucide-react";
import AcademicBackground from "../components/AcademicBackground";
import TeacherMessages from "../components/TeacherMessages";
import SubjectTeacherBroadsheet from "../components/SubjectTeacherBroadsheet";
import FormTeacherResultEntry from "../components/FormTeacherResultEntry";
import AttendanceManager from "../components/AttendanceManager";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
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

  useEffect(() => {
    // Refresh user data on mount to ensure we have latest roles/assignments
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile"); // Assuming we have this, if not we'll use the login data
        const updatedUser = { ...user, ...res.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      } catch (err) {
        console.error("Failed to refresh profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-transparent relative overflow-hidden">
      <AcademicBackground />

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-brand-900 border-b-4 border-brand-900 p-4 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <LayoutDashboard size={24} className="text-accent-gold" />
          <h1 className="text-lg font-bold text-brand-100 uppercase">Teacher Hub</h1>
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
          <h2 className="text-xl md:text-2xl font-bold tracking-tight uppercase  text-brand-100 text-gradient">
            Teacher <span className="text-accent-red">Hub</span>
          </h2>
        </div>
        <nav className="space-y-3 md:space-y-4">
          <NavLink
            to="/teacher"
            end
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center p-3 md:p-4 rounded-lg border-4 transition-all group font-bold uppercase tracking-tight text-white text-sm md:text-base ${isActive ? "border-brand-900 bg-accent-gold/30" : "border-transparent hover:border-brand-900 hover:bg-accent-gold/20"}`
            }
          >
            <LayoutDashboard className="mr-2 md:mr-3" size={18} />
            <span>Dashboard</span>
          </NavLink>
          {user?.isFormTeacher && (
            <NavLink
              to="/teacher/register-student"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center p-3 md:p-4 rounded-lg border-4 transition-all group font-bold uppercase tracking-tight text-white text-sm md:text-base ${isActive ? "border-brand-900 bg-accent-red/20" : "border-transparent hover:border-brand-900 hover:bg-accent-red/10"}`
              }
            >
              <UserPlus className="mr-2 md:mr-3" size={18} />
              <span>Register</span>
            </NavLink>
          )}
          <NavLink
            to="/teacher/record-results"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center p-3 md:p-4 rounded-lg border-4 transition-all group font-bold uppercase tracking-tight text-white text-sm md:text-base ${isActive ? "border-brand-900 bg-accent-gold/30" : "border-transparent hover:border-brand-900 hover:bg-accent-gold/20"}`
            }
          >
            <FileText className="mr-2 md:mr-3" size={18} />
            <span>Results</span>
          </NavLink>
          <NavLink
            to="/teacher/release-results"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center p-3 md:p-4 rounded-lg border-4 transition-all group font-bold uppercase tracking-tight text-white text-sm md:text-base ${isActive ? "border-brand-900 bg-accent-gold/30" : "border-transparent hover:border-brand-900 hover:bg-accent-gold/20"}`
            }
          >
            <Unlock className="mr-2 md:mr-3" size={18} />
            <span>Release</span>
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
          {user?.isSubjectTeacher && (
            <NavLink
              to="/teacher/subject-broadsheet"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center p-3 md:p-4 rounded-lg border-4 transition-all group font-bold uppercase tracking-tight text-white text-sm md:text-base ${isActive ? "border-brand-900 bg-accent-gold/30" : "border-transparent hover:border-brand-900 hover:bg-accent-gold/20"}`
              }
            >
              <FileSpreadsheet className="mr-2 md:mr-3" size={18} />
              <span>Subject Results</span>
            </NavLink>
          )}
          {user?.isFormTeacher && (
            <NavLink
              to="/teacher/enter-results"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center p-3 md:p-4 rounded-lg border-4 transition-all group font-bold uppercase tracking-tight text-white text-sm md:text-base ${isActive ? "border-brand-900 bg-accent-red/20" : "border-transparent hover:border-brand-900 hover:bg-accent-red/10"}`
              }
            >
              <FileText className="mr-2 md:mr-3" size={18} />
              <span>Enter Results 📝</span>
            </NavLink>
          )}
          {user?.isFormTeacher && (
            <NavLink
              to="/teacher/attendance"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center p-3 md:p-4 rounded-lg border-4 transition-all group font-bold uppercase tracking-tight text-white text-sm md:text-base ${isActive ? "border-brand-900 bg-accent-red/20" : "border-transparent hover:border-brand-900 hover:bg-accent-red/10"}`
              }
            >
              <CheckCircle className="mr-2 md:mr-3" size={18} />
              <span>Attendance</span>
            </NavLink>
          )}
          <NavLink
            to="/teacher/settings"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center p-3 md:p-4 rounded-lg border-4 transition-all group font-bold uppercase tracking-tight text-white text-sm md:text-base ${isActive ? "border-brand-900 bg-accent-gold/30" : "border-transparent hover:border-brand-900 hover:bg-accent-gold/20"}`
            }
          >
            <Settings className="mr-2 md:mr-3" size={18} />
            <span>Settings</span>
          </NavLink>

          {/* Messages Button */}
          <button
            onClick={() => {
              setShowMessages(true);
              setSidebarOpen(false);
            }}
            className="w-full flex items-center p-3 md:p-4 rounded-lg border border-transparent hover:border-brand-900 hover:bg-accent-red/10 transition-all group font-bold uppercase tracking-tight text-white text-sm md:text-base"
          >
            <MessageCircle className="mr-2 md:mr-3" size={18} />
            <span>Messages 💬</span>
          </button>
        </nav>
        {/* Scroll to Top Button in Sidebar */}
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

      {/* Messages Modal */}
      {showMessages && <TeacherMessages onClose={() => setShowMessages(false)} />}

      {/* Main Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight uppercase  text-gradient">
              Welcome, {user?.fullName?.split(" ")[0]}
            </h1>
            <p className="text-sm md:text-lg text-brand-400 mt-2 font-bold underline decoration-4 decoration-accent-gold">
              Ready to teach and inspire?
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
            <Route path="/" element={<TeacherOverview user={user} />} />
            {user?.isFormTeacher && (
              <Route path="/register-student" element={<RegisterStudent />} />
            )}
            <Route path="/record-results" element={<RecordResults />} />
            <Route path="/release-results" element={<ResultReleaseManager user={user} />} />
            {user?.isSubjectTeacher && (
              <Route path="/subject-broadsheet" element={<SubjectTeacherBroadsheet />} />
            )}
            {user?.isFormTeacher && (
              <Route path="/enter-results" element={<FormTeacherResultEntry user={user} />} />
            )}
            <Route path="/attendance" element={<AttendanceManager user={user} />} />
            <Route path="/settings" element={<TeacherSettings user={user} setUser={setUser} />} />
          </Routes>
        </main>

        {/* Floating Scroll Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 flex items-center p-4 rounded-lg border border-brand-700/50 bg-accent-gold shadow-md hover:-translate-y-1 transition-all group"
          >
            <ChevronUp
              className="mr-3 text-black group-hover:scale-125 transition-transform"
              size={20}
            />
            <span className="font-bold text-black uppercase tracking-tight">
              Scroll Top
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

const TeacherOverview = ({ user }) => {
  const [classStudentCount, setClassStudentCount] = useState(null);
  const [totalStudentCount, setTotalStudentCount] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user?.assignedClass) {
          const classRes = await api.get("/students", {
            params: { studentClass: user.assignedClass },
          });
          setClassStudentCount(classRes.data.length);
        }
        const totalRes = await api.get("/students");
        setTotalStudentCount(totalRes.data.length);
      } catch (err) {
        console.error("Failed to fetch overview stats", err);
      }
    };
    fetchStats();
  }, [user?.assignedClass]);

  const subjectList = user?.assignedSubject
    ? typeof user.assignedSubject === "string"
      ? user.assignedSubject.split(", ").filter((s) => s !== "")
      : user.assignedSubject
    : [];

  return (
    <div className="professional-card p-6 bg-brand-50">
      <h2 className="text-3xl font-bold text-black mb-6 uppercase  tracking-tight text-gradient">
        Classroom Command Center 🚀
      </h2>
      <p className="text-gray-700 font-bold text-xl leading-relaxed mb-10">
        Welcome to your digital classroom! This is where the magic happens. Keep
        your students' progress sharp, their attendance perfect, and their
        results shining! ✨
      </p>

      {/* Live Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {user?.assignedClass && (
          <div className="p-6 bg-accent-gold/20 border border-brand-700/50 rounded-xl shadow-md hover:-translate-y-1 transition-all flex flex-col items-center text-center">
            <span className="text-5xl font-bold text-black text-gradient mb-2">
              {classStudentCount !== null ? classStudentCount : "—"}
            </span>
            <h4 className="font-bold text-black text-sm uppercase tracking-widest ">
              Students in Your Class 🏫
            </h4>
            <p className="text-xs font-bold text-gray-600 mt-1 uppercase tracking-wider">
              {user.assignedClass}
            </p>
          </div>
        )}
        <div className="p-6 bg-accent-red/10 border border-brand-700/50 rounded-xl shadow-md hover:-translate-y-1 transition-all flex flex-col items-center text-center">
          <span className="text-5xl font-bold text-black text-gradient mb-2">
            {subjectList.length > 0 ? subjectList.length : "—"}
          </span>
          <h4 className="font-bold text-black text-sm uppercase tracking-widest ">
            Your Subjects
          </h4>
          <p className="text-xs font-bold text-gray-600 mt-1 uppercase tracking-wider truncate max-w-full">
            {subjectList.length > 0 ? subjectList.join(", ") : "None assigned"}
          </p>
        </div>
        <div className="p-6 bg-brand-100 border border-brand-700/50 rounded-xl shadow-md hover:-translate-y-1 transition-all flex flex-col items-center text-center">
          <span className="text-5xl font-bold text-black text-gradient mb-2">
            {totalStudentCount !== null ? totalStudentCount : "—"}
          </span>
          <h4 className="font-bold text-black text-sm uppercase tracking-widest ">
            Total Students 🌟
          </h4>
          <p className="text-xs font-bold text-gray-600 mt-1 uppercase tracking-wider">
            School-wide
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="p-8 bg-accent-gold/20 border border-brand-700/50 rounded-xl shadow-md hover:-translate-y-1 transition-all">
          <h4 className="font-bold text-black text-xl mb-3 uppercase tracking-tight ">
            Teacher's Tip 💡
          </h4>
          <p className="text-lg font-bold text-gray-800 ">
            "The art of teaching is the art of assisting discovery." Keep
            exploring with your students!
          </p>
        </div>
        <div className="p-8 bg-accent-red/20 border border-brand-700/50 rounded-xl shadow-md hover:-translate-y-1 transition-all">
          <h4 className="font-bold text-black text-xl mb-3 uppercase tracking-tight ">
            Upcoming Goals 🎯
          </h4>
          <p className="text-lg font-bold text-gray-800 ">
            Term end is coming! Time to get those final grades polished and
            ready for the little geniuses.
          </p>
        </div>
      </div>
    </div>
  );
};

const RegisterStudent = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    registrationNumber: "",
    studentClass: "",
    section: "",
    dateOfBirth: "",
    subjectIds: [],
    profileImage: null,
    feesPaid: false,
  });
  const [subjects, setSubjects] = useState([]);
  const [message, setMessage] = useState("");
  const [parentCreds, setParentCreds] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    api.get("/students/subjects").then((res) => setSubjects(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/students", formData);
      setMessage("Student registered successfully!");
      setParentCreds(res.data.parentCredentials);
      setFormData({
        firstName: "",
        lastName: "",
        registrationNumber: "",
        studentClass: "",
        section: "",
        dateOfBirth: "",
        subjectIds: [],
        profileImage: null,
        feesPaid: false,
      });
    } catch (err) {
      setMessage("Error registering student");
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

  return (
    <div className="max-w-3xl professional-card p-6 bg-brand-50">
      <h2 className="text-3xl font-bold text-black mb-8 uppercase  tracking-tight text-gradient">
        Register New Superstar! ⭐
      </h2>

      {message && (
        <div
          className={`p-6 mb-8 border border-brand-700/50 rounded-lg flex items-center gap-4 ${message.includes("Error") ? "bg-accent-red/20" : "bg-accent-gold/20"}`}
        >
          <div
            className={`w-4 h-4 rounded-full border border-brand-700/50 ${message.includes("Error") ? "bg-accent-red" : "bg-accent-gold"}`}
          ></div>
          <span className="font-bold uppercase tracking-tight text-black">
            {message}
          </span>
        </div>
      )}

      {parentCreds && (
        <div className="p-8 mb-10 bg-accent-gold border border-brand-700/50 rounded-xl shadow-xl">
          <div className="flex items-center gap-3 mb-6 text-black font-bold uppercase  tracking-tight text-xl text-gradient">
            <CheckCircle size={28} />
            <span>Parent Keys Ready! 🔑</span>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-accent-black p-4 rounded-lg border border-brand-700/50 shadow-md">
              <p className="text-xs text-accent-gold/60 uppercase font-bold tracking-widest mb-2">
                Secret Username
              </p>
              <p className="font-mono font-bold text-xl text-accent-gold select-all">
                {parentCreds.username}
              </p>
            </div>
            <div className="bg-accent-black p-4 rounded-lg border border-brand-700/50 shadow-md">
              <p className="text-xs text-accent-gold/60 uppercase font-bold tracking-widest mb-2">
                Secret Password
              </p>
              <p className="font-mono font-bold text-xl text-accent-gold select-all">
                {parentCreds.password}
              </p>
            </div>
          </div>
          <p className="text-sm mt-6 text-black font-bold  leading-relaxed">
            🚀 Mission: Hand these secret keys to the parents so they can track
            their champion's progress!
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center gap-4">
          <label className="text-lg font-bold text-black uppercase tracking-tight text-gradient">
            Student Photo
          </label>
          <div className="relative w-36 h-36 bg-gray-100 border border-brand-700/50 rounded-xl overflow-hidden shadow-md group cursor-pointer">
            {formData.profileImage ? (
              <img
                src={formData.profileImage}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                <UserPlus size={40} />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Add Photo
                </span>
              </div>
            )}
            <label className="absolute inset-0 bg-brand-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer gap-2">
              <Upload size={28} className="text-white" />
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
          {formData.profileImage && (
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, profileImage: null }))
              }
              className="text-xs font-bold uppercase tracking-widest text-accent-red hover:underline"
            >
              Remove Photo
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-lg font-bold text-black uppercase tracking-tight text-gradient">
              First Name
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. John"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-lg font-bold text-black uppercase tracking-tight text-gradient">
              Last Name
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Doe"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-lg font-bold text-black uppercase tracking-tight text-gradient">
            Date of Birth 🎂
          </label>
          <input
            type="date"
            className="input-field"
            value={formData.dateOfBirth}
            onChange={(e) =>
              setFormData({ ...formData, dateOfBirth: e.target.value })
            }
          />
        </div>

        <div className="space-y-2 flex items-center">
          <input
            type="checkbox"
            id="feesPaid"
            className="w-6 h-6 border border-brand-700/50 rounded-md accent-accent-gold cursor-pointer mt-8"
            checked={formData.feesPaid}
            onChange={(e) =>
              setFormData({ ...formData, feesPaid: e.target.checked })
            }
          />
          <label htmlFor="feesPaid" className="ml-3 text-lg font-bold text-black uppercase tracking-tight text-gradient cursor-pointer mt-8">
            School Fees Paid? 💰
          </label>
        </div>

        <div className="space-y-2">
          <label className="text-lg font-bold text-black uppercase tracking-tight text-gradient">
            Registration Number
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. SCH-2024-001"
            value={formData.registrationNumber}
            onChange={(e) =>
              setFormData({ ...formData, registrationNumber: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-lg font-bold text-black uppercase tracking-tight text-gradient">
            Class
          </label>
          <select
            className="input-field appearance-none bg-white border-2 border-gray-400"
            value={formData.studentClass}
            onChange={(e) =>
              setFormData({ ...formData, studentClass: e.target.value })
            }
            required
          >
            <option value="">Pick a Class...</option>
            <option value="Pre-Nursery">Pre-Nursery</option>
            <option value="Nursery 1">Nursery 1</option>
            <option value="Nursery 2">Nursery 2</option>
            <option value="Primary 1">Primary 1</option>
            <option value="Primary 2">Primary 2</option>
            <option value="Primary 3">Primary 3</option>
            <option value="Primary 4">Primary 4</option>
            <option value="Primary 5">Primary 5</option>
            <option value="Primary 6">Primary 6</option>
            <option value="JSS 1">JSS 1</option>
            <option value="JSS 2">JSS 2</option>
            <option value="JSS 3">JSS 3</option>
            <option value="SSS 1">SSS 1</option>
            <option value="SSS 2">SSS 2</option>
            <option value="SSS 3">SSS 3</option>
          </select>
        </div>

        {formData.studentClass && ["SSS 1", "SSS 2", "SSS 3"].includes(formData.studentClass) && (
          <div className="space-y-2">
            <label className="text-lg font-bold text-black uppercase tracking-tight text-gradient">
              Section 📚
            </label>
            <select
              className="input-field appearance-none bg-white border-2 border-gray-400"
              value={formData.section}
              onChange={(e) =>
                setFormData({ ...formData, section: e.target.value })
              }
            >
              <option value="">Select Section...</option>
              <option value="Science">Science</option>
              <option value="Art">Art</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>
        )}

        <div className="space-y-4">
          <label className="text-lg font-bold text-black uppercase tracking-tight block text-gradient">
            Assign Subjects
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-60 overflow-y-auto p-4 border border-brand-700/50 rounded-lg bg-gray-50 shadow-inner">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                type="button"
                onClick={() => handleSubjectToggle(subject.id)}
                className={`p-3 rounded-xl border-2 font-bold text-xs transition-all ${
                  formData.subjectIds.includes(subject.id)
                    ? "bg-accent-gold border-brand-900 shadow-md -translate-y-1 text-black"
                    : "bg-brand-50 border-gray-300 text-gray-600 hover:border-brand-900"
                }`}
              >
                {subject.name}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full btn-primary text-accent-black hover:bg-accent-black hover:text-accent-gold py-5 text-2xl flex items-center justify-center gap-3"
        >
          <UserPlus size={28} />
          Register Legend! 🚀
        </button>
      </form>
    </div>
  );
};

const RecordResults = ({ user }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [recordingMode, setRecordingMode] = useState(
    user?.isFormTeacher ? "class" : "subject",
  );
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [existingResults, setExistingResults] = useState([]);
  const [editingResult, setEditingResult] = useState(null);

  // Set initial mode based on user roles when user data changes
  // But only if the user hasn't manually changed the mode yet
  const [hasManuallyToggled, setHasManuallyToggled] = useState(false);

  useEffect(() => {
    if (user && !hasManuallyToggled) {
      setRecordingMode(user.isFormTeacher ? "class" : "subject");
    }
  }, [user?.id, user?.isFormTeacher, hasManuallyToggled]);

  const [formData, setFormData] = useState({
    subjectId: "",
    term: "First",
    academicYear: "2025/2026",
    ca1Score: "",
    ca2Score: "",
    examScore: "",
    remark: "",
  });
  const [message, setMessage] = useState("");

  // Reset student selection and subjects when mode changes
  useEffect(() => {
    setSelectedStudent(null);
    setSubjects([]);
    if (recordingMode === "class") {
      setSelectedSubjectFilter("");
    }
  }, [recordingMode]);

  // Get subjects assigned to this teacher
  const teacherSubjects = user?.assignedSubject
    ? typeof user.assignedSubject === "string"
      ? user.assignedSubject.split(", ").filter((s) => s !== "")
      : user.assignedSubject
    : [];

  useEffect(() => {
    fetchFilteredStudents();
  }, [recordingMode, selectedSubjectFilter]);

  const fetchFilteredStudents = async () => {
    try {
      let params = {};
      if (recordingMode === "class") {
        if (user?.assignedClass) {
          params.studentClass = user.assignedClass;
        } else {
          // If in class mode but no class assigned, show nothing
          setStudents([]);
          return;
        }
      } else if (recordingMode === "subject" && selectedSubjectFilter) {
        params.subjectName = selectedSubjectFilter;
      } else if (recordingMode === "subject" && !selectedSubjectFilter) {
        setStudents([]);
        return;
      }

      const res = await api.get("/students", { params });
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students", err);
    }
  };

  const handleStudentSelect = async (id) => {
    if (!id) {
      setSelectedStudent(null);
      setSubjects([]);
      setExistingResults([]);
      setEditMode(false);
      setEditingResult(null);
      return;
    }
    const student = students.find((s) => s.id === parseInt(id));
    setSelectedStudent(student);
    setEditMode(false);
    setEditingResult(null);

    // In subject mode, we might want to automatically select the subject we're filtering by
    if (recordingMode === "subject" && selectedSubjectFilter) {
      const subject = student?.Subjects?.find(
        (s) => s.name === selectedSubjectFilter,
      );
      if (subject) {
        setFormData((prev) => ({ ...prev, subjectId: subject.id }));
      }
    }
    setSubjects(student?.Subjects || []);

    // Fetch existing results for this student
    try {
      const res = await api.get(`/results/student/${id}`);
      setExistingResults(res.data || []);
    } catch (err) {
      console.error("Failed to fetch existing results", err);
      setExistingResults([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode && editingResult) {
        await api.patch(`/results/${editingResult.id}`, {
          ...formData,
          studentId: selectedStudent.id,
        });
        setMessage("Result updated successfully! ✏️");
        setEditMode(false);
        setEditingResult(null);
      } else {
        await api.post("/results", {
          ...formData,
          studentId: selectedStudent.id,
        });
        setMessage("Result recorded successfully! 🏆");
      }
      // Refresh existing results
      const res = await api.get(`/results/student/${selectedStudent.id}`);
      setExistingResults(res.data || []);
      setFormData({
        ...formData,
        ca1Score: "",
        ca2Score: "",
        examScore: "",
        remark: "",
      });
    } catch (err) {
      setMessage(
        editMode ? "Error updating result ❌" : "Error recording result ❌",
      );
    }
  };

  const handleEditResult = (result) => {
    setEditMode(true);
    setEditingResult(result);
    setFormData({
      subjectId: result.subjectId || result.Subject?.id || "",
      term: result.term || "First",
      academicYear: result.academicYear || "2025/2026",
      ca1Score: result.ca1Score ?? "",
      ca2Score: result.ca2Score ?? "",
      examScore: result.examScore ?? "",
      remark: result.remark || "",
    });
    // Make sure subjects list is available for the select
    if (selectedStudent?.Subjects) {
      setSubjects(selectedStudent.Subjects);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditingResult(null);
    setFormData({
      subjectId: "",
      term: "First",
      academicYear: "2025/2026",
      ca1Score: "",
      ca2Score: "",
      examScore: "",
      remark: "",
    });
  };

  return (
    <div className="professional-card p-6 bg-brand-700 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <h2 className="text-3xl font-bold text-white uppercase  tracking-tight text-gradient">
          Record Achievement! 🏆
        </h2>

        {/* Mode Toggles */}
        <div className="flex bg-brand-600 p-2 rounded-lg border-4 border-white shadow-inner">
          {user?.isFormTeacher && (
            <button
              onClick={() => {
                setRecordingMode("class");
                setSelectedStudent(null);
                setHasManuallyToggled(true);
              }}
              className={`px-6 py-2 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${
                recordingMode === "class"
                  ? "bg-accent-gold text-black border border-brand-700/50 shadow-xl-xs -translate-y-1"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Class Mode
            </button>
          )}
          {user?.isSubjectTeacher && (
            <button
              onClick={() => {
                setRecordingMode("subject");
                setSelectedStudent(null);
                setHasManuallyToggled(true);
              }}
              className={`px-6 py-2 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${
                recordingMode === "subject"
                  ? "bg-accent-red text-white border border-brand-700/50 shadow-xl-xs -translate-y-1"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Subject Mode
            </button>
          )}
        </div>
      </div>

      {message && (
        <div
          className={`p-6 mb-8 border border-brand-700/50 rounded-lg flex items-center gap-4 ${message.includes("Error") ? "bg-accent-pink/20" : "bg-accent-green/20"}`}
        >
          <div
            className={`w-4 h-4 rounded-full border border-brand-700/50 ${message.includes("Error") ? "bg-accent-pink" : "bg-accent-green"}`}
          ></div>
          <span className="font-bold uppercase tracking-tight text-black">
            {message}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {recordingMode === "subject" && (
          <div className="space-y-3">
            <label className="text-lg font-bold text-white uppercase tracking-tight block text-gradient">
              Choose Subject
            </label>
            <select
              className="input-field appearance-none bg-white border-2 border-gray-400"
              value={selectedSubjectFilter}
              onChange={(e) => {
                setSelectedSubjectFilter(e.target.value);
                setSelectedStudent(null);
              }}
            >
              <option value="">-- Which subject? --</option>
              {teacherSubjects.map((s, idx) => (
                <option key={idx} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

        <div
          className={
            recordingMode === "subject"
              ? "space-y-3"
              : "md:col-span-2 space-y-3"
          }
        >
          <label className="text-lg font-bold text-white uppercase tracking-tight block text-gradient">
            Select Champion
          </label>
          <select
            className="input-field appearance-none bg-white border-2 border-gray-400"
            onChange={(e) => handleStudentSelect(e.target.value)}
            value={selectedStudent?.id || ""}
          >
            <option value="">-- Who is the superstar? --</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.firstName} {s.lastName} ({s.registrationNumber})
              </option>
            ))}
          </select>
          {students.length === 0 &&
            (recordingMode === "class" || selectedSubjectFilter) && (
              <p className="text-xs font-bold text-accent-red uppercase tracking-widest mt-2 animate-pulse">
                {recordingMode === "class" && !user?.assignedClass
                  ? "You haven't been assigned a class yet! 🛸"
                  : `No superstars found in this ${recordingMode}! 🛸`}
              </p>
            )}
        </div>
      </div>

      {selectedStudent ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-500"
        >
          <div className="p-8 bg-accent-gold/10 border border-brand-700/50 rounded-xl flex items-center gap-6 shadow-md">
            <div className="w-20 h-20 bg-white border border-brand-700/50 rounded-lg flex items-center justify-center text-black font-bold text-3xl shadow-md overflow-hidden">
              {selectedStudent.profileImage ? (
                <img
                  src={selectedStudent.profileImage}
                  alt="Student"
                  className="w-full h-full object-cover"
                />
              ) : (
                selectedStudent.firstName.charAt(0)
              )}
            </div>
            <div>
              <p className="text-3xl font-bold text-black uppercase  tracking-tight text-gradient mb-2">
                {selectedStudent.firstName} {selectedStudent.lastName}
              </p>
              <div className="flex items-center gap-3">
                <span className="bg-brand-950 text-white px-3 py-1 rounded-lg font-bold uppercase text-xs tracking-widest">
                  {selectedStudent.studentClass}
                </span>
                <span className="bg-white border border-brand-700/50 text-black px-3 py-1 rounded-lg font-bold uppercase text-xs tracking-widest">
                  {selectedStudent.registrationNumber}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-lg font-bold text-black uppercase tracking-tight text-gradient">
                Subject{" "}
                {recordingMode === "subject" && (
                  <span className="text-accent-red">
                    (Locked to {selectedSubjectFilter})
                  </span>
                )}
              </label>
              <select
                className="input-field appearance-none bg-white border-2 border-gray-400"
                value={formData.subjectId}
                onChange={(e) =>
                  setFormData({ ...formData, subjectId: e.target.value })
                }
                required
                disabled={
                  recordingMode === "subject" && !!selectedSubjectFilter
                }
              >
                <option value="">Pick a Subject...</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-lg font-bold text-black uppercase tracking-tight text-gradient">
                Term
              </label>
              <select
                className="input-field appearance-none bg-white border-2 border-gray-400"
                value={formData.term}
                onChange={(e) =>
                  setFormData({ ...formData, term: e.target.value })
                }
              >
                <option value="First">First Term</option>
                <option value="Second">Second Term</option>
                <option value="Third">Third Term</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-3">
              <label className="text-lg font-bold text-black uppercase tracking-tight text-gradient">
                1st CA (20)
              </label>
              <div className="relative">
                <input
                  type="number"
                  max="20"
                  className="input-field text-2xl"
                  placeholder="0"
                  value={formData.ca1Score}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ca1Score: parseFloat(e.target.value) || "",
                    })
                  }
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Max 20
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-lg font-bold text-black uppercase tracking-tight text-gradient">
                2nd CA (20)
              </label>
              <div className="relative">
                <input
                  type="number"
                  max="20"
                  className="input-field text-2xl"
                  placeholder="0"
                  value={formData.ca2Score}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ca2Score: parseFloat(e.target.value) || "",
                    })
                  }
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Max 20
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-lg font-bold text-black uppercase tracking-tight text-gradient">
                Exam (60)
              </label>
              <div className="relative">
                <input
                  type="number"
                  max="60"
                  className="input-field text-2xl"
                  placeholder="0"
                  value={formData.examScore}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      examScore: parseFloat(e.target.value) || "",
                    })
                  }
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Max 60
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-lg font-bold text-black uppercase tracking-tight text-gradient">
              Teacher's Note 📝
            </label>
            <textarea
              className="input-field h-32 resize-none py-4"
              placeholder="Write something awesome about their progress..."
              value={formData.remark}
              onChange={(e) =>
                setFormData({ ...formData, remark: e.target.value })
              }
            ></textarea>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className={`flex-1 btn-primary py-5 text-2xl flex items-center justify-center gap-3 ${editMode ? "bg-accent-red text-white hover:bg-brand-950 hover:text-accent-red" : "bg-accent-gold text-accent-black hover:bg-accent-black hover:text-accent-gold"}`}
            >
              <CheckCircle size={28} />
              {editMode ? "Update Result ✏️" : "Lock in Results! 🏆"}
            </button>
            {editMode && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-8 py-5 border border-brand-700/50 rounded-lg font-bold uppercase tracking-tight text-black bg-gray-100 hover:bg-gray-200 transition-all shadow-md hover:-translate-y-1"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="py-20 border-4 border-dashed border-gray-400 rounded-xl text-center bg-brand-600">
          <p className="font-bold text-gray-300 uppercase tracking-widest text-xl">
            Select a superstar above to record their glory! ✨
          </p>
        </div>
      )}

      {/* Existing Results Table */}
      {selectedStudent && existingResults.length > 0 && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-black uppercase  tracking-tight text-gradient mb-6 border-t-4 border-brand-900 pt-8">
            Past Results for {selectedStudent.firstName} 📋
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-brand-700/50 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-brand-950 text-white">
                  <th className="py-4 px-4 text-left font-bold uppercase tracking-widest text-xs">
                    Subject
                  </th>
                  <th className="py-4 px-4 text-center font-bold uppercase tracking-widest text-xs">
                    Term
                  </th>
                  <th className="py-4 px-4 text-center font-bold uppercase tracking-widest text-xs">
                    CA1
                  </th>
                  <th className="py-4 px-4 text-center font-bold uppercase tracking-widest text-xs">
                    CA2
                  </th>
                  <th className="py-4 px-4 text-center font-bold uppercase tracking-widest text-xs">
                    Exam
                  </th>
                  <th className="py-4 px-4 text-center font-bold uppercase tracking-widest text-xs">
                    Total
                  </th>
                  <th className="py-4 px-4 text-center font-bold uppercase tracking-widest text-xs">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/10">
                {existingResults.map((result) => {
                  const total =
                    (result.ca1Score || 0) +
                    (result.ca2Score || 0) +
                    (result.examScore || 0);
                  const isEditing = editingResult?.id === result.id;
                  return (
                    <tr
                      key={result.id}
                      className={`transition-colors ${isEditing ? "bg-accent-gold/20 border-l-4 border-accent-gold" : "hover:bg-gray-50"}`}
                    >
                      <td className="py-4 px-4 font-bold text-black text-sm uppercase tracking-tight">
                        {result.Subject?.name || result.subjectName || "—"}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="bg-brand-950 text-white px-2 py-1 rounded-lg font-bold uppercase text-xs tracking-widest">
                          {result.term}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-black">
                        {result.ca1Score ?? "—"}
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-black">
                        {result.ca2Score ?? "—"}
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-black">
                        {result.examScore ?? "—"}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`font-bold text-lg ${total >= 50 ? "text-accent-green" : "text-accent-red"}`}
                        >
                          {total}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleEditResult(result)}
                          className="px-4 py-2 bg-accent-gold border border-brand-700/50 rounded-xl text-xs font-bold uppercase tracking-widest text-black hover:shadow-md hover:-translate-y-1 active:translate-y-0 transition-all"
                        >
                          Edit ✏️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};


const ResultReleaseManager = ({ user }) => {
  const [students, setStudents] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterClass, setFilterClass] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");

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
  }, []);

  const fetchStudents = async () => {
    const params = user?.assignedClass
      ? { studentClass: user.assignedClass }
      : {};
    const res = await api.get("/students", { params });
    setStudents(res.data);
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map((s) => s.id));
    }
  };

  const handleBulkAction = async (released) => {
    if (selectedIds.length === 0) return;
    try {
      await api.patch("/students/release-results", {
        studentIds: selectedIds,
        released,
      });
      setMessage(`Results ${released ? "released" : "held"} successfully! 🚀`);
      fetchStudents();
      setSelectedIds([]);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error updating status ❌");
    }
  };

  const handleToggleFeeStatus = async (student) => {
    try {
      // Create FormData to pass to the update endpoint (which expects form data because of profile images)
      const updateData = new FormData();
      updateData.append("firstName", student.firstName);
      updateData.append("lastName", student.lastName);
      updateData.append("studentClass", student.studentClass);
      updateData.append("feesPaid", (!student.feesPaid).toString());
      
      await api.put(`/students/${student.id}`, updateData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(`Fee status updated for ${student.firstName} 💰`);
      fetchStudents();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error updating fee status ❌");
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
    <div className="professional-card p-6 bg-brand-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b-4 border-brand-900 pb-8 gap-6">
        <div>
          <h2 className="text-4xl font-bold text-black uppercase  tracking-tight text-gradient mb-2">
            Result Release Gate 🛡️
          </h2>
          <p className="text-xl font-bold text-accent-red uppercase tracking-tight">
            Control who sees their glory!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search legends..."
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
        <div className="p-6 mb-8 bg-accent-gold/20 border border-brand-700/50 rounded-lg flex items-center gap-4 animate-in fade-in duration-300">
          <div className="w-4 h-4 bg-accent-gold border border-brand-700/50 rounded-full animate-pulse"></div>
          <span className="font-bold uppercase tracking-tight text-black">
            {message}
          </span>
        </div>
      )}

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => handleBulkAction(true)}
          disabled={selectedIds.length === 0}
          className="btn-primary px-8 py-3 text-sm flex items-center gap-2 disabled:opacity-50"
        >
          <Unlock size={18} /> Release Selected
        </button>
        <button
          onClick={() => handleBulkAction(false)}
          disabled={selectedIds.length === 0}
          className="btn-primary bg-accent-red text-white px-8 py-3 text-sm flex items-center gap-2 disabled:opacity-50"
        >
          <Lock size={18} /> Hold Selected
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b-4 border-brand-900">
              <th className="py-6 px-4">
                <input
                  type="checkbox"
                  className="w-6 h-6 border border-brand-700/50 rounded cursor-pointer accent-accent-gold"
                  checked={
                    selectedIds.length === filteredStudents.length &&
                    filteredStudents.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th className="py-6 font-bold text-black uppercase tracking-widest text-sm">
                Superstar
              </th>
              <th className="py-6 font-bold text-black uppercase tracking-widest text-sm text-center">
                Status
              </th>
              <th className="py-6 font-bold text-black uppercase tracking-widest text-sm text-center">
                Fees
              </th>
              <th className="py-6 font-bold text-black uppercase tracking-widest text-sm text-right">
                Class
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black/10">
            {filteredStudents.map((s) => (
              <tr
                key={s.id}
                className={`group transition-colors ${selectedIds.includes(s.id) ? "bg-accent-gold/10" : "hover:bg-gray-50"}`}
              >
                <td className="py-6 px-4">
                  <input
                    type="checkbox"
                    className="w-6 h-6 border border-brand-700/50 rounded cursor-pointer accent-accent-gold"
                    checked={selectedIds.includes(s.id)}
                    onChange={() => handleToggleSelect(s.id)}
                  />
                </td>
                <td className="py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-50 border border-brand-700/50 rounded-xl flex items-center justify-center font-bold text-black shadow-xl-xs group-hover:rotate-3 transition-transform overflow-hidden">
                      {s.profileImage ? (
                        <img
                          src={s.profileImage}
                          alt="Student"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        s.firstName.charAt(0)
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-lg text-black uppercase tracking-tight block">
                        {s.firstName} {s.lastName}
                      </span>
                      <span className="text-xs font-bold text-gray-400">
                        #{s.registrationNumber}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-6">
                  <div className="flex justify-center">
                    {s.resultsReleased ? (
                      <span className="bg-accent-gold/20 text-accent-black border-2 border-accent-gold px-4 py-1 rounded-full font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                        <Unlock size={12} /> Released
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-400 border-2 border-gray-200 px-4 py-1 rounded-full font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                        <Lock size={12} /> Held
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-6">
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleToggleFeeStatus(s)}
                      className={`px-3 py-1 rounded-lg font-bold uppercase text-xs tracking-widest transition-all shadow-md hover:-translate-y-1 active:translate-y-0 ${
                        s.feesPaid
                          ? "bg-accent-green text-white border border-brand-700/50"
                          : "bg-accent-red text-white border border-brand-700/50"
                      }`}
                    >
                      {s.feesPaid ? "Paid 💰" : "Unpaid ❌"}
                    </button>
                  </div>
                </td>
                <td className="py-6 text-right">
                  <span className="bg-brand-950 text-white px-3 py-1 rounded-lg font-bold uppercase text-xs tracking-widest">
                    {s.studentClass}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TeacherSettings = ({ user, setUser }) => {
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch(`/teachers/profile`, { profileImage });
      const updatedUser = { ...user, profileImage: res.data.profileImage };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setMessage("Profile image updated successfully! 📸");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError("Failed to update profile image");
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
      await api.put("/settings/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setMessage("Password changed successfully! 🔐 Redirecting to login...");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      // Auto logout and redirect to login after 2 seconds
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error changing password");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex justify-between items-end mb-10 border-b-4 border-brand-900 pb-8">
        <div>
          <h2 className="text-4xl font-bold text-white uppercase  tracking-tight text-gradient mb-2">
            My Profile 👤
          </h2>
          <p className="text-xl font-bold text-accent-gold uppercase tracking-tight">
            Customize your educator presence!
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
          <Unlock size={24} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Profile Avatar */}
        <div className="professional-card p-6 bg-brand-900">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-accent-gold border border-brand-700/50 rounded-lg flex items-center justify-center shadow-md">
              <UserCircle size={24} className="text-black" />
            </div>
            <h3 className="text-2xl font-bold text-white uppercase  tracking-tight text-gradient">
              Avatar & Identity
            </h3>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-8">
            <div className="flex flex-col items-center gap-6">
              <div className="w-48 h-48 bg-brand-800 border border-brand-700/50 rounded-xl overflow-hidden shadow-xl relative group transform -rotate-2">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-6xl">
                    {user?.fullName?.charAt(0)}
                  </div>
                )}
                <label className="absolute inset-0 bg-brand-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer gap-2">
                  <Upload size={32} className="text-white" />
                  <span className="text-white font-bold text-xs uppercase tracking-widest">
                    Upload New
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white uppercase tracking-tight">
                  {user?.fullName}
                </p>
                <p className="text-accent-red font-bold uppercase tracking-widest text-xs ">
                  Master Educator
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-4 flex items-center justify-center gap-3 text-lg"
            >
              <Save size={24} />
              Save Profile Image
            </button>
          </form>
        </div>

        {/* Security */}
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
              <Lock size={24} />
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
