import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import {
  LogOut,
  User,
  FileText,
  Calendar,
  Star,
  Trophy,
  Target,
  Download,
  ChevronDown,
  Mail,
  Lock,
} from "lucide-react";
import AcademicBackground from "../components/AcademicBackground";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ReportCard from "../components/ReportCard";

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [results, setResults] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [settings, setSettings] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [showAllAttendance, setShowAllAttendance] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  // HOISTED: defined before the useEffect that calls it
  async function handleChildSelect(child) {
    setSelectedChild(child);
    setSelectedTerm("All");
    setSelectedYear("All");
    setShowAllAttendance(false);
    const resultsRes = await api.get(`/results/student/${child.id}`);
    const attendanceRes = await api.get(`/attendance/student/${child.id}`);
    const attendanceStatsRes = await api.get(`/attendance/student/${child.id}/percentage`);
    setResults(resultsRes.data);
    setAttendance(attendanceRes.data);
    setAttendanceStats(attendanceStatsRes.data);
  }

  useEffect(() => {
    api.get("/settings").then((res) => setSettings(res.data));
    api.get("/students/parent").then((res) => {
      setChildren(res.data);
      if (res.data.length > 0) handleChildSelect(res.data[0]);
    });
  }, []);

  // Derived filter options from loaded results
  const availableTerms = [
    "All",
    ...Array.from(new Set(results.map((r) => r.term).filter(Boolean))),
  ];
  const availableYears = [
    "All",
    ...Array.from(new Set(results.map((r) => r.academicYear).filter(Boolean))),
  ];

  const filteredResults = results.filter((r) => {
    const termMatch = selectedTerm === "All" || r.term === selectedTerm;
    const yearMatch = selectedYear === "All" || r.academicYear === selectedYear;
    return termMatch && yearMatch;
  });

  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  const generateReportCard = () => {
    if (!selectedChild || filteredResults.length === 0) return;
    // We use the browser's native print engine and ReportCard.css handles the styling
    window.print();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handlePingUs = () => {
    if (settings?.schoolEmail) {
      window.location.href = `mailto:${settings.schoolEmail}?subject=Parent Enquiry - ${user?.fullName || ""}`;
    } else {
      setShowContactModal(true);
    }
  };

  const attendanceToShow = showAllAttendance
    ? attendance
    : attendance.slice(0, 8);

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      <AcademicBackground />
      
      {/* Hidden Print Component */}
      {selectedChild && (
        <ReportCard 
          student={{
            ...selectedChild,
            fullName: `${selectedChild.lastName} ${selectedChild.firstName}`,
            admissionNumber: selectedChild.registrationNumber,
            currentClass: selectedChild.studentClass,
            results: filteredResults
          }}
          settings={settings}
          attendanceStats={attendanceStats}
        />
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div
          className="fixed inset-0 bg-brand-950/70 z-[100] flex items-center justify-center p-4"
          onClick={() => setShowContactModal(false)}
        >
          <div
            className="professional-card bg-brand-50 p-6 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-black/40 hover:text-black font-bold text-xl"
            >
              ✕
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-accent-gold border border-brand-700/50 rounded-lg flex items-center justify-center shadow-md">
                <Mail size={28} className="text-black" />
              </div>
              <div>
                <h3 className="text-2xl font-bold uppercase  tracking-tight text-gradient">
                  Contact Us
                </h3>
                <p className="text-xs font-bold text-black/40 uppercase tracking-widest">
                  We're here to help!
                </p>
              </div>
            </div>
            <div className="space-y-3 text-sm font-bold text-black/70 border border-brand-700/50 rounded-lg p-6 bg-accent-gold/5">
              {settings?.schoolName && (
                <p className="text-lg font-bold text-black uppercase  tracking-tight">
                  {settings.schoolName}
                </p>
              )}
              {settings?.schoolAddress && <p>📍 {settings.schoolAddress}</p>}
              {settings?.schoolPhone && <p>📞 {settings.schoolPhone}</p>}
              {settings?.schoolEmail && (
                <a
                  href={`mailto:${settings.schoolEmail}`}
                  className="block text-accent-red hover:underline"
                >
                  ✉️ {settings.schoolEmail}
                </a>
              )}
              {!settings?.schoolAddress &&
                !settings?.schoolPhone &&
                !settings?.schoolEmail && (
                  <p className="text-black/40 ">
                    Contact details not configured yet. Please reach out to
                    school staff directly.
                  </p>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <nav className="bg-brand-900 border-b-4 border-brand-900 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-24 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-accent-gold border border-brand-700/50 rounded-lg flex items-center justify-center text-black shadow-md transform">
              <User size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight uppercase  text-gradient">
                Parent <span className="text-accent-red">Zone</span>
              </h1>
              <p className="text-xs text-brand-400 uppercase font-bold tracking-widest">
                Watching them grow! 🌱
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-xl font-bold text-white uppercase tracking-tight text-gradient">
                {user?.fullName}
              </p>
              <p className="text-sm text-accent-red font-bold  uppercase tracking-widest">
                Super Guardian
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-brand-800 hover:bg-accent-red/10 text-white border border-brand-700/50 px-6 py-3 rounded-lg transition-all font-bold uppercase tracking-tight shadow-md hover:-translate-x-1 hover:-translate-y-1 hover:shadow-xl active:translate-x-0 active:translate-y-0 active:shadow-none"
            >
              <LogOut size={20} />
              <span>Bye! 🚀</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-8 lg:p-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Children Selection */}
          <div className="lg:col-span-3 space-y-8">
            <div className="professional-card p-6 bg-brand-900">
              <h2 className="text-lg font-bold text-white uppercase tracking-widest mb-6  border-b-4 border-brand-900 pb-2">
                My Superstars ⭐
              </h2>
              <div className="space-y-4">
                {children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => handleChildSelect(child)}
                    className={`w-full group flex items-center gap-4 p-4 rounded-lg border-4 transition-all ${
                      selectedChild?.id === child.id
                        ? "bg-accent-gold border-brand-900 shadow-md -translate-y-1"
                        : "bg-brand-800 border-transparent hover:border-brand-900 hover:bg-accent-gold/10"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl border-4 ${
                        selectedChild?.id === child.id
                          ? "bg-brand-50 border-brand-900 transform"
                          : "bg-brand-900 border-transparent text-accent-gold group-hover:border-brand-900"
                      }`}
                    >
                      {child.firstName.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p
                        className={`text-lg font-bold uppercase tracking-tight ${
                          selectedChild?.id === child.id
                            ? "text-black"
                            : "text-white"
                        }`}
                      >
                        {child.firstName}
                      </p>
                      <p
                        className={`text-xs font-bold  ${
                          selectedChild?.id === child.id
                            ? "text-accent-red"
                            : "text-brand-400"
                        }`}
                      >
                        {child.studentClass}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Ping Us card */}
            <div className="p-8 bg-brand-900/50 border border-brand-700/50 rounded-xl shadow-md relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="font-bold text-white text-xl mb-2 uppercase  tracking-tight text-gradient">
                  Need Help? 🆘
                </h4>
                <p className="text-sm font-bold text-brand-400 mb-6 leading-relaxed ">
                  The school team is here to help your champion succeed!
                </p>
                <button
                  onClick={handlePingUs}
                  className="w-full bg-accent-gold border border-brand-700/50 text-black text-xs font-bold py-3 rounded-xl uppercase tracking-widest hover:bg-brand-950 hover:text-white transition-all shadow-md"
                >
                  Ping Us! 📨
                </button>
              </div>
              <FileText className="absolute -bottom-6 -right-6 w-24 h-24 text-white/5 transform group-hover:scale-110 transition-transform" />
            </div>
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-9 space-y-10">
            {selectedChild ? (
              <>
                {/* Student Header */}
                <div className="professional-card p-6 bg-brand-900 flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-[12px] border-l-accent-gold">
                  <div>
                    <h2 className="text-4xl font-bold text-white uppercase  tracking-tight text-gradient mb-2">
                      {selectedChild.firstName} {selectedChild.lastName}
                    </h2>
                    <div className="flex items-center gap-4">
                      <span className="px-4 py-1.5 bg-brand-950 text-white rounded-full text-xs font-bold uppercase tracking-widest">
                        #{selectedChild.registrationNumber}
                      </span>
                      <span className="text-xl font-bold text-accent-red uppercase tracking-tight ">
                        {selectedChild.studentClass}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="bg-brand-800 p-5 rounded-lg text-center min-w-[120px] border border-brand-700/50 shadow-md transform rotate-2">
                      <p className="text-[10px] text-brand-400 font-bold uppercase tracking-widest mb-1 opacity-50">
                        Status
                      </p>
                      <p className="text-xl font-bold text-white uppercase">
                        Active ✨
                      </p>
                    </div>
                    <div className="bg-brand-800 p-5 rounded-lg text-center min-w-[120px] border border-brand-700/50 shadow-md transform -rotate-2">
                      <p className="text-[10px] text-brand-400 font-bold uppercase tracking-widest mb-1 opacity-50">
                        Progress
                      </p>
                      <p className="text-xl font-bold text-white uppercase">
                        Great! 🚀
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fee Blocking Logic */}
                {!selectedChild.feesPaid ? (
                  <div className="professional-card p-16 bg-accent-red/10 border border-brand-700/50 text-center shadow-xl transform rotate-1">
                    <div className="w-24 h-24 bg-accent-red border border-brand-700/50 rounded-xl flex items-center justify-center mx-auto mb-8 shadow-md transform">
                      <Lock size={48} className="text-white" />
                    </div>
                    <h2 className="text-4xl font-bold text-black dark:text-white mb-4 uppercase  tracking-tight text-gradient">
                      Access Denied ❌
                    </h2>
                    <p className="text-xl font-bold text-black/60 dark:text-brand-400 max-w-md mx-auto ">
                      Please clear outstanding school fees to view {selectedChild.firstName}'s results and attendance records. Contact the admin for assistance.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Term / Year Filters */}
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-white uppercase tracking-widest opacity-60">
                          Term:
                        </label>
                        <div className="relative">
                          <select
                            value={selectedTerm}
                            onChange={(e) => setSelectedTerm(e.target.value)}
                            className="appearance-none bg-brand-800 border border-brand-700/50 text-white font-bold text-xs uppercase tracking-widest px-4 py-2 pr-8 rounded-xl shadow-md focus:outline-none focus:border-accent-gold cursor-pointer"
                          >
                            {availableTerms.map((t) => (
                              <option key={t} value={t}>
                                {t === "All" ? "All Terms" : `${t} Term`}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={14}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-white uppercase tracking-widest opacity-60">
                          Year:
                        </label>
                        <div className="relative">
                          <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="appearance-none bg-brand-800 border border-brand-700/50 text-white font-bold text-xs uppercase tracking-widest px-4 py-2 pr-8 rounded-xl shadow-md focus:outline-none focus:border-accent-gold cursor-pointer"
                          >
                            {availableYears.map((y) => (
                              <option key={y} value={y}>
                                {y === "All" ? "All Years" : y}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={14}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"
                          />
                        </div>
                      </div>

                      {(selectedTerm !== "All" || selectedYear !== "All") && (
                        <button
                          onClick={() => {
                            setSelectedTerm("All");
                            setSelectedYear("All");
                          }}
                          className="text-xs font-bold text-accent-red uppercase tracking-widest hover:underline"
                        >
                          Clear Filters ✕
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                      {/* Results Card */}
                      <div className="professional-card bg-brand-50 p-6">
                        <div className="flex items-center justify-between mb-8 border-b-4 border-brand-900 pb-4">
                          <h3 className="text-2xl font-bold text-black uppercase  tracking-tight text-gradient flex items-center gap-3">
                            <Trophy className="text-accent-gold" size={28} />{" "}
                            Achievement!
                          </h3>
                          <button
                            onClick={generateReportCard}
                            disabled={filteredResults.length === 0}
                            className="text-xs font-bold text-accent-red hover:underline uppercase tracking-widest flex items-center gap-1 disabled:opacity-30"
                          >
                            Download PDF 📥
                          </button>
                        </div>
                        <div className="space-y-6">
                          {filteredResults.length > 0 ? (
                            filteredResults.map((r) => (
                              <div
                                key={r.id}
                                className="p-6 rounded-lg border border-brand-700/50 bg-accent-gold/5 hover:bg-accent-gold/10 transition-all group"
                              >
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <p className="text-xl font-bold text-black uppercase tracking-tight ">
                                      {r.Subject?.name}
                                    </p>
                                    <p className="text-xs text-black/50 font-bold uppercase tracking-widest">
                                      {r.term} Term
                                      {r.academicYear ? ` · ${r.academicYear}` : ""}
                                    </p>
                                  </div>
                                  <div
                                    className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center border border-brand-700/50 transition-transform group-hover:scale-110 duration-300 shadow-md ${
                                      r.totalScore >= 70
                                        ? "bg-accent-gold text-black"
                                        : r.totalScore >= 50
                                          ? "bg-accent-red text-white"
                                          : "bg-brand-950 text-white"
                                    }`}
                                  >
                                    <span className="text-[10px] font-bold opacity-50 leading-none mb-0.5">
                                      GRADE
                                    </span>
                                    <span className="text-2xl font-bold leading-none">
                                      {r.grade}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-1 space-y-2">
                                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-black/40">
                                    <span>CA1: {r.ca1Score}</span>
                                    <span>CA2: {r.ca2Score}</span>
                                    <span>Exam: {r.examScore}</span>
                                  </div>
                                  <div className="h-4 bg-brand-50 border border-brand-700/50 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full border-r-2 border-brand-900 transition-all duration-1000 ${
                                        r.totalScore >= 50
                                          ? "bg-accent-gold"
                                          : "bg-accent-red"
                                      }`}
                                      style={{ width: `${r.totalScore}%` }}
                                    ></div>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-black/40 uppercase tracking-widest">
                                      Avg: {r.averageScore?.toFixed(1)}
                                    </span>
                                    <span className="text-lg font-bold text-black ">
                                      Total: {r.totalScore}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="py-16 text-center">
                              <p className="text-xl font-bold text-black/20 uppercase  tracking-widest">
                                No scores yet! 📝
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Attendance Card */}
                      <div className="professional-card bg-brand-50 p-6">
                        <div className="flex items-center justify-between mb-8 border-b-4 border-brand-900 pb-4">
                          <h3 className="text-2xl font-bold text-black uppercase  tracking-tight text-gradient flex items-center gap-3">
                            <Target className="text-accent-red" size={28} /> Daily
                            Quests
                          </h3>
                          <span className="px-3 py-1 bg-brand-950 text-white rounded-full text-[10px] font-bold uppercase tracking-widest">
                            On Time!
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {attendance.length > 0 ? (
                            attendanceToShow.map((a) => (
                              <div
                                key={a.id}
                                className="p-4 bg-brand-50 border border-brand-700/50 rounded-lg text-center group hover:bg-accent-gold/10 transition-all shadow-md"
                              >
                                <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-2">
                                  {new Date(a.date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </p>
                                <div
                                  className={`text-xs font-bold py-1.5 px-4 rounded-xl border border-brand-700/50 inline-block uppercase tracking-widest ${
                                    a.status === "Present"
                                      ? "bg-accent-gold"
                                      : a.status === "Absent"
                                        ? "bg-accent-red text-white"
                                        : "bg-brand-950 text-white"
                                  }`}
                                >
                                  {a.status}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-2 py-16 text-center">
                              <p className="text-xl font-bold text-black/20 uppercase  tracking-widest">
                                No roll calls! 🔔
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Show All / Show Less toggle */}
                        {attendance.length > 8 && (
                          <div className="mt-6 text-center">
                            <button
                              onClick={() => setShowAllAttendance((prev) => !prev)}
                              className="text-xs font-bold uppercase tracking-widest border border-brand-700/50 px-6 py-2 rounded-xl bg-brand-50 hover:bg-accent-gold transition-all shadow-md"
                            >
                              {showAllAttendance
                                ? `Show Less ▲`
                                : `Show All (${attendance.length}) ▼`}
                            </button>
                          </div>
                        )}

                        {attendance.length > 0 && (
                          <div className="mt-10 p-6 bg-accent-gold border border-brand-700/50 rounded-lg flex items-center justify-between shadow-md">
                            <span className="text-sm font-bold text-black uppercase tracking-widest">
                              Success Rate:
                            </span>
                            <span className="text-3xl font-bold text-black  text-gradient">
                              {Math.round(
                                (attendance.filter((a) => a.status === "Present")
                                  .length /
                                  attendance.length) *
                                  100,
                              )}
                              %
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="professional-card p-24 bg-brand-50 text-center">
                <div className="w-24 h-24 bg-accent-gold/20 border border-brand-700/50 rounded-xl flex items-center justify-center mx-auto mb-8 shadow-xl transform">
                  <User size={48} className="text-black" />
                </div>
                <h2 className="text-4xl font-bold text-black mb-4 uppercase  tracking-tight text-gradient">
                  Pick a Superstar!
                </h2>
                <p className="text-xl font-bold text-gray-600 max-w-sm mx-auto ">
                  Choose one of your amazing kids from the list to see how
                  they're doing! 🌟
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
