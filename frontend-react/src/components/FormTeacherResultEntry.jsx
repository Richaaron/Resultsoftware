import React, { useState, useEffect } from "react";
import api from "../api";
import {
  Plus,
  Save,
  X,
  Edit3,
  Trash2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const FormTeacherResultEntry = ({ user }) => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [term, setTerm] = useState("First");
  const [academicYear, setAcademicYear] = useState("2025/2026");
  const [results, setResults] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);

  const ACADEMIC_YEARS = ["2024/2025", "2025/2026", "2026/2027"];

  useEffect(() => {
    if (user?.isFormTeacher && user?.assignedClass) {
      fetchData();
    }
  }, [user, term, academicYear]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch students in assigned class
      const studentsRes = await api.get(`/students?studentClass=${user.assignedClass}`);
      setStudents(studentsRes.data);

      // Fetch all subjects
      const subjectsRes = await api.get("/students/subjects");
      setSubjects(subjectsRes.data);

      // Fetch existing results
      const resultsRes = await api.get("/results", {
        params: {
          studentClass: user.assignedClass,
          term,
          academicYear,
        },
      });

      const resultsMap = {};
      resultsRes.data.forEach((result) => {
        if (!resultsMap[result.StudentId]) {
          resultsMap[result.StudentId] = {};
        }
        resultsMap[result.StudentId][result.SubjectId] = {
          id: result.id,
          ca1Score: result.ca1Score || 0,
          ca2Score: result.ca2Score || 0,
          examScore: result.examScore || 0,
          remark: result.remark || "",
        };
      });
      setResults(resultsMap);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (studentId, subjectId, field, value) => {
    setResults((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subjectId]: {
          ...prev[studentId]?.[subjectId],
          [field]: parseFloat(value) || 0,
        },
      },
    }));
  };

  const handleSaveResult = async (studentId, subjectId) => {
    try {
      const resultData = results[studentId]?.[subjectId];
      if (!resultData) return;

      await api.post("/results", {
        studentId,
        subjectId,
        term,
        academicYear,
        ca1Score: resultData.ca1Score,
        ca2Score: resultData.ca2Score,
        examScore: resultData.examScore,
        remark: resultData.remark,
      });

      setMessage("Result saved successfully! ✅");
      setTimeout(() => setMessage(""), 3000);
      setEditingStudentId(null);
    } catch (error) {
      console.error("Error saving result:", error);
      setMessage("Error saving result ❌");
    }
  };

  const getScoreColor = (score) => {
    if (!score) return "text-gray-500";
    if (score >= 70) return "text-accent-green";
    if (score >= 50) return "text-accent-gold";
    return "text-accent-red";
  };

  return (
    <div className="space-y-8">
      {message && (
        <div
          className={`p-6 border-4 border-black rounded-2xl flex items-center gap-4 ${
            message.includes("Error") ? "bg-accent-red/20" : "bg-accent-green/20"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full border-2 border-black ${
              message.includes("Error") ? "bg-accent-red" : "bg-accent-green"
            }`}
          ></div>
          <span className="font-black uppercase tracking-tight text-black">
            {message}
          </span>
        </div>
      )}

      {/* Filters */}
      <div className="cartoon-card bg-slate-700 p-6 space-y-4">
        <h3 className="text-lg font-black text-white uppercase tracking-tighter">
          📝 Result Entry for {user?.assignedClass}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-black text-white uppercase">
              Term
            </label>
            <select
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="input-cartoon"
            >
              <option value="First">First Term</option>
              <option value="Second">Second Term</option>
              <option value="Third">Third Term</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-black text-white uppercase">
              Academic Year
            </label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="input-cartoon"
            >
              {ACADEMIC_YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchData}
              disabled={loading}
              className="w-full btn-cartoon-primary bg-accent-gold disabled:opacity-50 py-3"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      {/* Results Entry Tables */}
      <div className="space-y-8">
        {students.map((student) => (
          <div key={student.id} className="cartoon-card bg-slate-800 p-6">
            {/* Student Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-slate-600">
              <div>
                <p className="text-lg font-black text-white uppercase tracking-tighter">
                  {student.firstName} {student.lastName}
                </p>
                <p className="text-sm text-gray-400">
                  📋 {student.registrationNumber}
                </p>
              </div>
              <button
                onClick={() =>
                  setEditingStudentId(
                    editingStudentId === student.id ? null : student.id
                  )
                }
                className="p-3 bg-accent-gold border-2 border-black rounded-lg font-black hover:bg-black hover:text-accent-gold transition"
              >
                {editingStudentId === student.id ? <X size={20} /> : <Edit3 size={20} />}
              </button>
            </div>

            {/* Subjects Results */}
            {editingStudentId === student.id ? (
              <div className="space-y-6">
                {subjects.map((subject) => {
                  const resultData = results[student.id]?.[subject.id] || {
                    ca1Score: 0,
                    ca2Score: 0,
                    examScore: 0,
                    remark: "",
                  };

                  const total =
                    (resultData.ca1Score || 0) +
                    (resultData.ca2Score || 0) +
                    (resultData.examScore || 0);

                  return (
                    <div
                      key={subject.id}
                      className="p-5 bg-slate-700 rounded-lg border-2 border-slate-600 space-y-4"
                    >
                      <h4 className="font-black text-white uppercase tracking-tight">
                        {subject.name}
                      </h4>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-gray-300 uppercase">
                            1st CA (20)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="20"
                            value={resultData.ca1Score}
                            onChange={(e) =>
                              handleScoreChange(
                                student.id,
                                subject.id,
                                "ca1Score",
                                e.target.value
                              )
                            }
                            className="input-cartoon text-center"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-black text-gray-300 uppercase">
                            2nd CA (20)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="20"
                            value={resultData.ca2Score}
                            onChange={(e) =>
                              handleScoreChange(
                                student.id,
                                subject.id,
                                "ca2Score",
                                e.target.value
                              )
                            }
                            className="input-cartoon text-center"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-black text-gray-300 uppercase">
                            Exam (60)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="60"
                            value={resultData.examScore}
                            onChange={(e) =>
                              handleScoreChange(
                                student.id,
                                subject.id,
                                "examScore",
                                e.target.value
                              )
                            }
                            className="input-cartoon text-center"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-black text-accent-gold uppercase">
                            Total
                          </label>
                          <div className="p-3 bg-slate-600 rounded-lg font-black text-white text-center border-2 border-accent-gold">
                            {total}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-black text-gray-300 uppercase">
                            Remark
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., Excellent"
                            value={resultData.remark}
                            onChange={(e) =>
                              handleScoreChange(
                                student.id,
                                subject.id,
                                "remark",
                                e.target.value
                              )
                            }
                            className="input-cartoon text-center text-xs"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => handleSaveResult(student.id, subject.id)}
                        className="w-full mt-4 py-2 bg-accent-gold border-2 border-black rounded-lg font-black text-black hover:bg-black hover:text-accent-gold transition flex items-center justify-center gap-2"
                      >
                        <Save size={18} />
                        Save Result
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              // View Mode
              <div className="space-y-3">
                {subjects.map((subject) => {
                  const resultData = results[student.id]?.[subject.id];
                  const total =
                    (resultData?.ca1Score || 0) +
                    (resultData?.ca2Score || 0) +
                    (resultData?.examScore || 0);

                  return (
                    <div
                      key={subject.id}
                      className="p-4 bg-slate-700 rounded-lg border-2 border-slate-600 flex items-center justify-between"
                    >
                      <span className="font-black text-white">{subject.name}</span>
                      {resultData ? (
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-xs text-gray-400 uppercase">
                              CA1 | CA2 | Exam
                            </p>
                            <p
                              className={`font-black text-lg ${getScoreColor(total)}`}
                            >
                              {resultData.ca1Score} | {resultData.ca2Score} |{" "}
                              {resultData.examScore}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400 uppercase">Total</p>
                            <p
                              className={`font-black text-2xl ${getScoreColor(total)}`}
                            >
                              {total}
                            </p>
                          </div>
                          <CheckCircle
                            size={24}
                            className="text-accent-green"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <AlertCircle size={20} className="text-accent-red" />
                          <span className="font-black text-accent-red uppercase text-sm">
                            No Data
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {students.length === 0 && !loading && (
        <div className="cartoon-card bg-slate-800 p-12 text-center border-4 border-dashed border-black/20">
          <p className="text-xl font-black text-white/50 uppercase italic tracking-widest">
            No students in your class
          </p>
        </div>
      )}
    </div>
  );
};

export default FormTeacherResultEntry;
