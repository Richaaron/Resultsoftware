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

// Generate academic years from 2024/2025 to 2027/2028
const generateAcademicYears = () => {
  const years = [];
  for (let start = 2024; start <= 2027; start++) {
    years.push(`${start}/${start + 1}`);
  }
  return years;
};

const ACADEMIC_YEARS = generateAcademicYears();

const getRankLabel = (rank) => {
  if (rank === 1) return "1st";
  if (rank === 2) return "2nd";
  if (rank === 3) return "3rd";
  return `${rank}th`;
};

const RankBadge = ({ rank }) => {
  let badgeClass = "";
  if (rank === 1) {
    badgeClass = "bg-yellow-400 text-black border border-brand-700/50";
  } else if (rank === 2) {
    badgeClass = "bg-gray-300 text-black border border-brand-700/50";
  } else if (rank === 3) {
    badgeClass = "bg-amber-600 text-white border border-brand-700/50";
  } else {
    badgeClass = "bg-brand-700 text-white border border-brand-700/50/30";
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
  .professional-card { border: 1px solid #ccc !important; box-shadow: none !important; background: white !important; }
  table { width: 100% !important; }
  th, td { color: black !important; background: white !important; border: 1px solid #ccc !important; }
}
`;

const Broadsheet = () => {
  const navigate = useNavigate();
  const [studentClass, setStudentClass] = useState("");
  const [term, setTerm] = useState("First");
  const [academicYear, setAcademicYear] = useState("2025/2026");
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);
  const [broadsheetData, setBroadsheetData] = useState([]);

  // Fix #5: sort state
  const [sortBy, setSortBy] = useState("rank"); // 'rank' | 'name' | 'avg'
  const [sortDir, setSortDir] = useState("asc"); // 'asc' | 'desc'

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

  // Fix #3: inject print styles once
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = PRINT_STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    api.get("/settings").then((res) => setSettings(res.data));
  }, []);

  // Fix #7: reset table when class changes
  const handleClassChange = (e) => {
    setStudentClass(e.target.value);
    setBroadsheetData([]);
    setStudents([]);
    setSubjects([]);
  };

  const fetchBroadsheet = async () => {
    if (!studentClass) return;
    setLoading(true);
    try {
      const res = await api.get("/results/broadsheet", {
        params: { studentClass, term, academicYear },
      });
      setStudents(res.data);

      // Extract unique subjects from all student results
      const allSubjects = new Set();
      res.data.forEach((student) => {
        student.Results.forEach((result) => {
          if (result.Subject) {
            allSubjects.add(
              JSON.stringify({
                id: result.Subject.id,
                name: result.Subject.name,
              }),
            );
          }
        });
      });
      const sortedSubjects = Array.from(allSubjects)
        .map((s) => JSON.parse(s))
        .sort((a, b) => a.name.localeCompare(b.name));
      setSubjects(sortedSubjects);

      // Fix #2: compute totals, averages, and ranks
      const withStats = res.data.map((student) => {
        const totalScore = student.Results.reduce(
          (acc, curr) => acc + (curr.totalScore || 0),
          0,
        );
        const avgScore =
          student.Results.length > 0 ? totalScore / student.Results.length : 0;
        return { ...student, totalScore, avgScore };
      });

      // Sort by avgScore descending to assign rank
      const sorted = [...withStats].sort((a, b) => b.avgScore - a.avgScore);
      const ranked = sorted.map((student, idx) => ({
        ...student,
        rank: idx + 1,
      }));

      setBroadsheetData(ranked);
    } catch (err) {
      console.error("Error fetching broadsheet", err);
    } finally {
      setLoading(false);
    }
  };

  const getScore = (student, subjectId) => {
    const result = student.Results.find((r) => r.SubjectId === subjectId);
    return result ? result.totalScore : "-";
  };

  const getGrade = (student, subjectId) => {
    const result = student.Results.find((r) => r.SubjectId === subjectId);
    return result ? result.grade : "";
  };

  const getResultDetails = (student, subjectId) => {
    const result = student.Results.find((r) => r.SubjectId === subjectId);
    return result
      ? {
          ca1: result.ca1Score || 0,
          ca2: result.ca2Score || 0,
          exam: result.examScore || 0,
          total: result.totalScore || 0,
          average: result.averageScore || 0,
        }
      : null;
  };

  const getSubjectPositions = (subjectId) => {
    // Calculate position for each student in this subject
    const results = broadsheetData
      .map((student) => ({
        studentId: student.id,
        score: getScore(student, subjectId),
      }))
      .filter((r) => r.score !== "-")
      .sort((a, b) => b.score - a.score);

    const positions = {};
    results.forEach((r, idx) => {
      positions[r.studentId] = idx + 1;
    });
    return positions;
  };

  // Fix #5: sorting logic
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDir(column === "name" ? "asc" : "asc");
    }
  };

  const sortedData = [...broadsheetData].sort((a, b) => {
    let cmp = 0;
    if (sortBy === "rank") {
      cmp = a.rank - b.rank;
    } else if (sortBy === "name") {
      const nameA = `${a.lastName} ${a.firstName}`.toLowerCase();
      const nameB = `${b.lastName} ${b.firstName}`.toLowerCase();
      cmp = nameA.localeCompare(nameB);
    } else if (sortBy === "avg") {
      cmp = b.avgScore - a.avgScore;
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

  // Fix #3: print handler
  const handlePrint = () => {
    window.print();
  };

  // Fix #4: CSV download
  const downloadCSV = () => {
    if (!broadsheetData.length) return;

    const headers = [
      "Rank",
      "Student Name",
      "Reg Number",
      ...subjects.flatMap((s) => [
        `${s.name} - 1st CA`,
        `${s.name} - 2nd CA`,
        `${s.name} - Exam`,
        `${s.name} - Total`,
        `${s.name} - Average`,
        `${s.name} - Position`,
      ]),
      "Total",
      "Average",
    ];

    const rows = sortedData.map((student) => {
      const positions = {};
      subjects.forEach((subject) => {
        const subjectResults = broadsheetData
          .map((s) => ({
            studentId: s.id,
            score: getScore(s, subject.id),
          }))
          .filter((r) => r.score !== "-")
          .sort((a, b) => b.score - a.score);
        subjectResults.forEach((r, idx) => {
          positions[`${subject.id}-${r.studentId}`] = idx + 1;
        });
      });

      const subjectDetails = subjects.flatMap((subject) => {
        const details = getResultDetails(student, subject.id);
        const position = details ? positions[`${subject.id}-${student.id}`] || "-" : "-";
        return details
          ? [
              details.ca1,
              details.ca2,
              details.exam,
              details.total,
              details.average.toFixed(1),
              position,
            ]
          : ["", "", "", "", "", ""];
      });

      return [
        getRankLabel(student.rank),
        `${student.lastName} ${student.firstName}`,
        student.regNumber || student.registrationNumber || "",
        ...subjectDetails,
        student.totalScore.toFixed(0),
        `${student.avgScore.toFixed(1)}%`,
      ];
    });

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
    link.download = `Broadsheet_${studentClass}_${term}_${academicYear.replace("/", "-")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden p-6 lg:p-10">
      <AcademicBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Fix #3: Back button gets no-print */}
        <button
          onClick={() => navigate(-1)}
          className="no-print mb-8 flex items-center gap-2 font-bold uppercase tracking-tight text-white hover:text-accent-red transition-colors"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        {/* Fix #3: Filter controls get no-print */}
        <div className="no-print professional-card bg-brand-900 p-6 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-brand-400">
                  Select Class
                </label>
                <select
                  className="input-field"
                  value={studentClass}
                  onChange={handleClassChange}
                >
                  <option value="">-- Choose Class --</option>
                  {classes.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-brand-400">
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
              {/* Fix #6: dynamic academic years */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-brand-400">
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
              disabled={!studentClass || loading}
              className="btn-primary px-10 py-4 flex items-center gap-3 disabled:opacity-50"
            >
              <Search size={24} />
              {loading ? "Searching..." : "Generate!"}
            </button>
          </div>
        </div>

        {broadsheetData.length > 0 ? (
          <div className="professional-card bg-brand-900 p-6 overflow-hidden print-full">
            <div className="flex justify-between items-center mb-8 border-b-4 border-brand-900 pb-6">
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
                  Class Broadsheet: {studentClass}
                </h3>
                <p className="text-brand-400 font-bold uppercase tracking-tight text-xs">
                  {term} Term | {academicYear}
                </p>
              </div>
              {/* Fix #3 & #4: action buttons with no-print, onClick handlers */}
              <div className="no-print flex gap-4">
                <button
                  onClick={handlePrint}
                  className="p-4 bg-brand-800 border border-brand-700/50 rounded-lg shadow-md hover:-translate-y-1 transition-all text-white"
                  title="Print Broadsheet"
                >
                  <Printer size={24} />
                </button>
                <button
                  onClick={downloadCSV}
                  className="p-4 bg-accent-gold border border-brand-700/50 rounded-lg shadow-md hover:-translate-y-1 transition-all text-black"
                  title="Download CSV"
                >
                  <Download size={24} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto print-full">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-4 border-brand-900">
                    {/* Fix #2: Rank column header */}
                    <th className="p-4 text-center font-bold uppercase tracking-widest text-xs bg-brand-800 text-white border-r-2 border-brand-900 min-w-[60px]">
                      Rank
                    </th>
                    {/* Fix #5: sortable Student Name header */}
                    <th
                      className="p-4 text-left font-bold uppercase tracking-widest text-xs bg-brand-800 text-white border-r-2 border-brand-900 sticky left-0 z-20 cursor-pointer select-none hover:bg-brand-700 transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      Student Name <SortIcon column="name" />
                    </th>
                    {subjects.map((subject) => (
                      <th
                        key={subject.id}
                        colSpan="6"
                        className="p-4 text-center font-bold uppercase tracking-widest text-[10px] border-r-2 border-brand-900/10 text-brand-300 border-b-2"
                      >
                        {subject.name}
                      </th>
                    ))}
                  </tr>
                  <tr className="border-b-4 border-brand-900">
                    {/* Empty header for Rank and Student Name */}
                    <th></th>
                    <th></th>
                    {/* Sub-headers for each subject */}
                    {subjects.map((subject) => (
                      <React.Fragment key={subject.id}>
                        <th className="p-2 text-center font-bold uppercase tracking-widest text-[9px] bg-brand-800 text-white border-r-2 border-brand-900/10 text-accent-gold">
                          1st CA
                        </th>
                        <th className="p-2 text-center font-bold uppercase tracking-widest text-[9px] bg-brand-800 text-white border-r-2 border-brand-900/10 text-accent-gold">
                          2nd CA
                        </th>
                        <th className="p-2 text-center font-bold uppercase tracking-widest text-[9px] bg-brand-800 text-white border-r-2 border-brand-900/10 text-accent-gold">
                          Exam
                        </th>
                        <th className="p-2 text-center font-bold uppercase tracking-widest text-[9px] bg-brand-800 text-white border-r-2 border-brand-900/10 text-accent-gold">
                          Total
                        </th>
                        <th className="p-2 text-center font-bold uppercase tracking-widest text-[9px] bg-brand-800 text-white border-r-2 border-brand-900/10 text-accent-gold">
                          Avg
                        </th>
                        <th className="p-2 text-center font-bold uppercase tracking-widest text-[9px] bg-brand-800 text-white border-r-2 border-brand-900/10 text-accent-red">
                          Pos
                        </th>
                      </React.Fragment>
                    ))}
                    <th
                      className="p-4 text-center font-bold uppercase tracking-widest text-xs border-r-2 border-brand-900/10"
                      style={{
                        backgroundColor: settings?.primaryColor
                          ? `${settings.primaryColor}20`
                          : "rgba(255, 215, 0, 0.1)",
                        color:
                          settings?.primaryColor || "var(--color-accent-gold)",
                      }}
                    >
                      Total
                    </th>
                    {/* Fix #5: sortable Avg header */}
                    <th
                      className="p-4 text-center font-bold uppercase tracking-widest text-xs cursor-pointer select-none hover:opacity-80 transition-opacity"
                      style={{
                        backgroundColor: settings?.primaryColor
                          ? `${settings.primaryColor}20`
                          : "rgba(255, 215, 0, 0.1)",
                        color:
                          settings?.primaryColor || "var(--color-accent-gold)",
                      }}
                      onClick={() => handleSort("avg")}
                    >
                      Avg <SortIcon column="avg" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((student) => {
                    return (
                      // Fix #1: removed invalid style={{ hover: ... }}, use Tailwind hover class
                      <tr
                        key={student.id}
                        className="border-b-2 border-brand-900/5 transition-colors group hover:bg-accent-gold/5"
                      >
                        {/* Fix #2: Rank badge cell */}
                        <td className="p-4 text-center border-r-2 border-brand-900/10">
                          <RankBadge rank={student.rank} />
                        </td>
                        <td className="p-4 font-bold text-white uppercase tracking-tight sticky left-0 bg-brand-900 group-hover:bg-brand-800 border-r-2 border-brand-900 z-10">
                          {student.lastName} {student.firstName}
                        </td>
                        {subjects.map((subject) => {
                          const details = getResultDetails(student, subject.id);
                          const positions = getSubjectPositions(subject.id);
                          const position = details ? positions[student.id] || "-" : "-";

                          if (!details) {
                            return (
                              <React.Fragment key={subject.id}>
                                <td className="p-2 text-center text-gray-500 border-r-2 border-brand-900/5 text-xs">-</td>
                                <td className="p-2 text-center text-gray-500 border-r-2 border-brand-900/5 text-xs">-</td>
                                <td className="p-2 text-center text-gray-500 border-r-2 border-brand-900/5 text-xs">-</td>
                                <td className="p-2 text-center text-gray-500 border-r-2 border-brand-900/5 text-xs">-</td>
                                <td className="p-2 text-center text-gray-500 border-r-2 border-brand-900/5 text-xs">-</td>
                                <td className="p-2 text-center text-gray-500 border-r-2 border-brand-900/5 text-xs">-</td>
                              </React.Fragment>
                            );
                          }

                          return (
                            <React.Fragment key={subject.id}>
                              <td className="p-2 text-center font-bold text-white text-sm border-r-2 border-brand-900/5 bg-brand-800/30">
                                {details.ca1}
                              </td>
                              <td className="p-2 text-center font-bold text-white text-sm border-r-2 border-brand-900/5 bg-brand-800/30">
                                {details.ca2}
                              </td>
                              <td className="p-2 text-center font-bold text-white text-sm border-r-2 border-brand-900/5 bg-brand-800/30">
                                {details.exam}
                              </td>
                              <td className="p-2 text-center font-bold text-accent-gold text-sm border-r-2 border-brand-900/5 bg-brand-700/50">
                                {details.total}
                              </td>
                              <td className="p-2 text-center font-bold text-accent-gold text-sm border-r-2 border-brand-900/5 bg-brand-700/50">
                                {details.average.toFixed(1)}
                              </td>
                              <td className="p-2 text-center font-bold text-accent-red text-sm border-r-2 border-brand-900/5 bg-accent-red/10">
                                {position}
                              </td>
                            </React.Fragment>
                          );
                        })}
                        <td
                          className="p-4 text-center font-bold text-lg border-r-2 border-brand-900/5 text-white"
                          style={{
                            backgroundColor: settings?.primaryColor
                              ? `${settings.primaryColor}10`
                              : "rgba(255,215,0,0.06)",
                          }}
                        >
                          {student.totalScore.toFixed(0)}
                        </td>
                        <td
                          className="p-4 text-center font-bold text-lg text-white"
                          style={{
                            backgroundColor: settings?.primaryColor
                              ? `${settings.primaryColor}10`
                              : "rgba(255,215,0,0.06)",
                          }}
                        >
                          {student.avgScore.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Signatures Section */}
            <div className="mt-16 pt-12 border-t-4 border-brand-900">
              <p className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-12">
                Authorized Signatures
              </p>
              <div className="grid grid-cols-2 gap-12">
                {/* Principal Signature */}
                <div className="text-center">
                  <div className="h-24 border-b-2 border-brand-900 mb-2"></div>
                  <p className="text-xs font-bold text-white uppercase tracking-widest">
                    {settings?.principalName || "Principal"}
                  </p>
                  <p className="text-[10px] text-brand-400 font-bold uppercase tracking-widest mt-1">
                    Principal's Signature
                  </p>
                </div>

                {/* Head Teacher Signature */}
                <div className="text-center">
                  <div className="h-24 border-b-2 border-brand-900 mb-2"></div>
                  <p className="text-xs font-bold text-white uppercase tracking-widest">
                    {settings?.headTeacherName || "Head Teacher"}
                  </p>
                  <p className="text-[10px] text-brand-400 font-bold uppercase tracking-widest mt-1">
                    Head Teacher's Signature
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : !loading && studentClass ? (
          <div className="professional-card bg-brand-900 p-20 text-center border-4 border-dashed border-brand-900/20">
            <FileSpreadsheet
              size={64}
              className="mx-auto text-white/10 mb-6"
            />
            <p className="text-2xl font-bold text-white/20 uppercase  tracking-widest">
              No results found for this selection!
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Broadsheet;
