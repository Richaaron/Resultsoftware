import React, { useState, useEffect } from "react";
import api from "../api";
import {
  FileSpreadsheet,
  Download,
  Printer,
  Search,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AcademicBackground from "../components/AcademicBackground";

const SubjectTeacherBroadsheet = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [term, setTerm] = useState("First");
  const [academicYear, setAcademicYear] = useState("2025/2026");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);
  const [broadsheetData, setBroadsheetData] = useState([]);
  const [sortBy, setSortBy] = useState("rank");
  const [sortDir, setSortDir] = useState("asc");

  const ACADEMIC_YEARS = ["2024/2025", "2025/2026", "2026/2027"];

  const getRankLabel = (rank) => {
    if (rank === 1) return "1st";
    if (rank === 2) return "2nd";
    if (rank === 3) return "3rd";
    return `${rank}th`;
  };

  const RankBadge = ({ rank }) => {
    let badgeClass = "";
    if (rank === 1) {
      badgeClass = "bg-yellow-400 text-black border border-slate-700/50";
    } else if (rank === 2) {
      badgeClass = "bg-gray-300 text-black border border-slate-700/50";
    } else if (rank === 3) {
      badgeClass = "bg-amber-600 text-white border border-slate-700/50";
    } else {
      badgeClass = "bg-slate-700 text-white border border-slate-700/50/30";
    }
    return (
      <span
        className={`inline-flex items-center justify-center px-2 py-1 rounded-lg font-bold text-xs min-w-[40px] ${badgeClass}`}
      >
        {getRankLabel(rank)}
      </span>
    );
  };

  const PRINT_STYLES = `
@media print {
  .no-print { display: none !important; }
  .print-full { width: 100% !important; }
  body { background: white !important; color: black !important; }
  table { width: 100% !important; }
  th, td { color: black !important; background: white !important; border: 1px solid #ccc !important; }
}
`;

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = PRINT_STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    api.get("/settings").then((res) => setSettings(res.data));
  }, []);

  const fetchBroadsheet = async () => {
    setLoading(true);
    try {
      const res = await api.get("/results/by-subject", {
        params: { term, academicYear },
      });

      // Group by class
      const grouped = {};
      res.data.forEach((student) => {
        if (!grouped[student.studentClass]) {
          grouped[student.studentClass] = [];
        }
        grouped[student.studentClass].push(student);
      });

      // Calculate stats for each student
      const withStats = Object.entries(grouped).flatMap(([className, classStudents]) =>
        classStudents.map((student) => {
          const result = student.Results[0] || {};
          return {
            ...student,
            className,
            ca1: result.ca1Score || 0,
            ca2: result.ca2Score || 0,
            exam: result.examScore || 0,
            total: result.totalScore || 0,
            average: result.averageScore || 0,
            grade: result.grade || "-",
          };
        })
      );

      // Calculate positions per class
      Object.keys(grouped).forEach((className) => {
        const classStudents = withStats.filter((s) => s.className === className);
        const sorted = [...classStudents].sort((a, b) => b.total - a.total);
        sorted.forEach((student, idx) => {
          const idx2 = withStats.findIndex((s) => s.id === student.id);
          if (idx2 >= 0) {
            withStats[idx2].position = idx + 1;
          }
        });
      });

      setBroadsheetData(withStats);
    } catch (err) {
      console.error("Error fetching broadsheet", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
  };

  const sortedData = [...broadsheetData].sort((a, b) => {
    let cmp = 0;
    if (sortBy === "rank") {
      cmp = a.position - b.position;
    } else if (sortBy === "name") {
      const nameA = `${a.lastName} ${a.firstName}`.toLowerCase();
      const nameB = `${b.lastName} ${b.firstName}`.toLowerCase();
      cmp = nameA.localeCompare(nameB);
    } else if (sortBy === "total") {
      cmp = b.total - a.total;
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  const SortIcon = ({ column }) => {
    if (sortBy !== column)
      return <ArrowDown size={12} className="opacity-30 inline ml-1" />;
    return sortDir === "asc" ? (
      <ArrowUp size={12} className="text-accent-gold inline ml-1" />
    ) : (
      <ArrowDown size={12} className="text-accent-gold inline ml-1" />
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadCSV = () => {
    if (!broadsheetData.length) return;

    const headers = [
      "Class",
      "Rank",
      "Student Name",
      "Reg Number",
      "1st CA",
      "2nd CA",
      "Exam",
      "Total",
      "Average",
      "Grade",
    ];

    const rows = sortedData.map((student) => [
      student.className,
      getRankLabel(student.position),
      `${student.lastName} ${student.firstName}`,
      student.registrationNumber || "",
      student.ca1,
      student.ca2,
      student.exam,
      student.total,
      student.average.toFixed(1),
      student.grade,
    ]);

    const escape = (val) => {
      const str = String(val ?? "");
      return str.includes(",") || str.includes('"') || str.includes("\n")
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    };

    const csvContent = [headers, ...rows]
      .map((row) => row.map(escape).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Subject_Results_${user.assignedSubject}_${term}_${academicYear.replace("/", "-")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const groupedByClass = Object.groupBy(sortedData, (s) => s.className);

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden p-6 lg:p-10">
      <AcademicBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="no-print mb-8 flex items-center gap-2 font-bold uppercase tracking-tight text-white hover:text-accent-red transition-colors"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <div className="no-print professional-card bg-slate-900 p-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-slate-400">
                  Select Term
                </label>
                <select
                  className="input-field"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                >
                  <option value="First">First Term</option>
                  <option value="Second">Second Term</option>
                  <option value="Third">Third Term</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-slate-400">
                  Academic Year
                </label>
                <select
                  className="input-field"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                >
                  {ACADEMIC_YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={fetchBroadsheet}
              disabled={loading}
              className="btn-primary px-10 py-4 flex items-center gap-3 disabled:opacity-50"
            >
              <Search size={24} />
              {loading ? "Loading..." : "View Results"}
            </button>
          </div>
        </div>

        {broadsheetData.length > 0 ? (
          <div className="space-y-10">
            {Object.entries(groupedByClass).map(([className, classStudents]) => (
              <div key={className} className="professional-card bg-slate-900 p-8">
                <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white uppercase  tracking-tight text-gradient mb-2">
                      {settings?.schoolName || "The Academy"}
                    </h2>
                    <h3
                      className="text-xl font-bold uppercase tracking-tight "
                      style={{
                        color: settings?.primaryColor || "var(--color-accent-gold)",
                      }}
                    >
                      {user.assignedSubject} - {className}
                    </h3>
                    <p className="text-slate-400 font-bold uppercase tracking-tight text-xs">
                      {term} Term | {academicYear}
                    </p>
                  </div>
                  <div className="no-print flex gap-4">
                    <button
                      onClick={handlePrint}
                      className="p-4 bg-slate-800 border border-slate-700/50 rounded-lg shadow-md hover:-translate-y-1 transition-all text-white"
                      title="Print Results"
                    >
                      <Printer size={24} />
                    </button>
                    <button
                      onClick={downloadCSV}
                      className="p-4 bg-accent-gold border border-slate-700/50 rounded-lg shadow-md hover:-translate-y-1 transition-all text-black"
                      title="Download CSV"
                    >
                      <Download size={24} />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto print-full">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-4 border-black">
                        <th
                          className="p-4 text-center font-bold uppercase tracking-widest text-xs bg-slate-800 text-white border-r-2 border-black min-w-[60px]"
                        >
                          Rank
                        </th>
                        <th
                          className="p-4 text-left font-bold uppercase tracking-widest text-xs bg-slate-800 text-white border-r-2 border-black sticky left-0 z-20 cursor-pointer select-none hover:bg-slate-700"
                          onClick={() => handleSort("name")}
                        >
                          Student Name <SortIcon column="name" />
                        </th>
                        <th className="p-4 text-center font-bold uppercase tracking-widest text-xs bg-slate-800 text-white border-r-2 border-black">
                          1st CA
                        </th>
                        <th className="p-4 text-center font-bold uppercase tracking-widest text-xs bg-slate-800 text-white border-r-2 border-black">
                          2nd CA
                        </th>
                        <th className="p-4 text-center font-bold uppercase tracking-widest text-xs bg-slate-800 text-white border-r-2 border-black">
                          Exam
                        </th>
                        <th
                          className="p-4 text-center font-bold uppercase tracking-widest text-xs border-r-2 border-black/10 cursor-pointer select-none hover:opacity-80"
                          style={{
                            backgroundColor: settings?.primaryColor ? `${settings.primaryColor}20` : "rgba(255, 215, 0, 0.1)",
                            color: settings?.primaryColor || "var(--color-accent-gold)",
                          }}
                          onClick={() => handleSort("total")}
                        >
                          Total <SortIcon column="total" />
                        </th>
                        <th
                          className="p-4 text-center font-bold uppercase tracking-widest text-xs"
                          style={{
                            backgroundColor: settings?.primaryColor ? `${settings.primaryColor}20` : "rgba(255, 215, 0, 0.1)",
                            color: settings?.primaryColor || "var(--color-accent-gold)",
                          }}
                        >
                          Grade
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {classStudents.map((student) => (
                        <tr
                          key={student.id}
                          className="border-b-2 border-black/5 transition-colors group hover:bg-accent-gold/5"
                        >
                          <td className="p-4 text-center border-r-2 border-black/10">
                            <RankBadge rank={student.position} />
                          </td>
                          <td className="p-4 font-bold text-white uppercase tracking-tight sticky left-0 bg-slate-900 group-hover:bg-slate-800 border-r-2 border-black z-10">
                            {student.lastName} {student.firstName}
                          </td>
                          <td className="p-4 text-center font-bold text-white text-sm border-r-2 border-black/5 bg-slate-800/30">
                            {student.ca1}
                          </td>
                          <td className="p-4 text-center font-bold text-white text-sm border-r-2 border-black/5 bg-slate-800/30">
                            {student.ca2}
                          </td>
                          <td className="p-4 text-center font-bold text-white text-sm border-r-2 border-black/5 bg-slate-800/30">
                            {student.exam}
                          </td>
                          <td
                            className="p-4 text-center font-bold text-lg border-r-2 border-black/5 text-white"
                            style={{
                              backgroundColor: settings?.primaryColor ? `${settings.primaryColor}10` : "rgba(255,215,0,0.06)",
                            }}
                          >
                            {student.total}
                          </td>
                          <td
                            className="p-4 text-center font-bold text-lg text-white"
                            style={{
                              backgroundColor: settings?.primaryColor ? `${settings.primaryColor}10` : "rgba(255,215,0,0.06)",
                            }}
                          >
                            {student.grade}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="professional-card bg-slate-900 p-20 text-center border-4 border-dashed border-black/20">
              <FileSpreadsheet size={64} className="mx-auto text-white/10 mb-6" />
              <p className="text-2xl font-bold text-white/20 uppercase  tracking-widest">
                No results found!
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SubjectTeacherBroadsheet;
