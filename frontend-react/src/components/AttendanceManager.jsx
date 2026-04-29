import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Save, AlertCircle } from "lucide-react";
import api from "../api";

const AttendanceManager = ({ user }) => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.assignedClass) {
      fetchStudentsAndAttendance();
    }
  }, [user?.assignedClass, date]);

  const fetchStudentsAndAttendance = async () => {
    try {
      setLoading(true);
      // Fetch students for the form teacher's class
      const studentsRes = await api.get("/students", {
        params: { studentClass: user.assignedClass },
      });
      const classStudents = studentsRes.data;
      setStudents(classStudents);

      // Fetch attendance for this date
      const attendanceRes = await api.get(`/attendance/class/${user.assignedClass}`, {
        params: { date },
      });

      // Map existing records
      const initialRecords = {};
      classStudents.forEach(student => {
        // Default to 'PRESENT' if no record exists, so it's easier to mark
        initialRecords[student.id] = "PRESENT";
      });

      attendanceRes.data.forEach(record => {
        initialRecords[record.StudentId] = record.status;
      });

      setAttendanceRecords(initialRecords);
    } catch (err) {
      console.error("Error fetching attendance data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAttendance = async () => {
    try {
      setLoading(true);
      const recordsToSave = Object.entries(attendanceRecords).map(([studentId, status]) => ({
        studentId,
        status,
      }));

      await api.post("/attendance/batch", {
        date,
        records: recordsToSave,
      });

      setMessage("Attendance saved successfully! ✅");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Failed to save attendance", err);
      setMessage("Failed to save attendance ❌");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (!user?.assignedClass) {
    return (
      <div className="cartoon-card p-10 bg-slate-50 text-center">
        <h2 className="text-2xl font-black uppercase text-slate-400">
          No Class Assigned
        </h2>
        <p className="text-gray-500 font-bold">You need to be assigned as a form teacher to mark attendance.</p>
      </div>
    );
  }

  return (
    <div className="cartoon-card p-6 md:p-10 bg-slate-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-black uppercase italic tracking-tighter text-3d">
            Attendance Book 📋
          </h2>
          <p className="text-gray-600 font-bold uppercase tracking-widest text-sm mt-1">
            Class: {user.assignedClass}
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <label className="font-black uppercase tracking-tight">Date:</label>
          <input
            type="date"
            className="input-cartoon flex-1 md:w-48"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {message && (
        <div className={`p-4 mb-6 border-4 border-black rounded-xl font-black uppercase tracking-tight text-white ${message.includes('✅') ? 'bg-green-500' : 'bg-red-500'}`}>
          {message}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <p className="text-xl font-black uppercase tracking-widest text-gray-400 animate-pulse">Loading Roll Call...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl font-black uppercase tracking-widest text-gray-400">No students found in this class.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto mb-8 border-4 border-black rounded-3xl bg-white">
            <table className="w-full text-left">
              <thead className="bg-slate-900 border-b-4 border-black">
                <tr>
                  <th className="p-4 font-black uppercase text-white tracking-widest">Student Name</th>
                  <th className="p-4 font-black uppercase text-white tracking-widest text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/10">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-lg">
                      {student.lastName} {student.firstName}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleStatusChange(student.id, "PRESENT")}
                          className={`flex-1 py-2 px-3 rounded-xl border-2 font-black text-xs uppercase flex items-center justify-center gap-1 transition-all ${
                            attendanceRecords[student.id] === "PRESENT"
                              ? "bg-green-500 border-black text-white shadow-cartoon-sm -translate-y-1"
                              : "bg-white border-gray-300 text-gray-500 hover:border-black hover:bg-green-100"
                          }`}
                        >
                          <CheckCircle size={16} /> Present
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.id, "LATE")}
                          className={`flex-1 py-2 px-3 rounded-xl border-2 font-black text-xs uppercase flex items-center justify-center gap-1 transition-all ${
                            attendanceRecords[student.id] === "LATE"
                              ? "bg-yellow-400 border-black text-black shadow-cartoon-sm -translate-y-1"
                              : "bg-white border-gray-300 text-gray-500 hover:border-black hover:bg-yellow-100"
                          }`}
                        >
                          <Clock size={16} /> Late
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.id, "ABSENT")}
                          className={`flex-1 py-2 px-3 rounded-xl border-2 font-black text-xs uppercase flex items-center justify-center gap-1 transition-all ${
                            attendanceRecords[student.id] === "ABSENT"
                              ? "bg-red-500 border-black text-white shadow-cartoon-sm -translate-y-1"
                              : "bg-white border-gray-300 text-gray-500 hover:border-black hover:bg-red-100"
                          }`}
                        >
                          <XCircle size={16} /> Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleSaveAttendance}
            disabled={loading}
            className="w-full btn-cartoon-primary bg-accent-gold py-5 text-xl flex items-center justify-center gap-3"
          >
            <Save size={24} />
            Save Today's Attendance!
          </button>
        </>
      )}
    </div>
  );
};

export default AttendanceManager;
