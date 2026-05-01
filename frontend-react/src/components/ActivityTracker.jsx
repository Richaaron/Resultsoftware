import React, { useState, useEffect } from "react";
import api from "../api";
import { Activity, AlertTriangle, Clock, User, X } from "lucide-react";

const ActivityTracker = ({ onClose }) => {
  const [activities, setActivities] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterBySeverity, setFilterBySeverity] = useState("ALL");

  useEffect(() => {
    fetchTeachers();
    fetchSummary();
  }, []);

  useEffect(() => {
    if (selectedTeacher) {
      fetchTeacherActivities();
    }
  }, [selectedTeacher]);

  const fetchTeachers = async () => {
    try {
      const res = await api.get("/teachers");
      setTeachers(res.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await api.get("/activities/summary/dashboard");
      // Display summary data
      console.log("Activity Summary:", res.data);
    } catch (error) {
      console.error("Error fetching activity summary:", error);
    }
  };

  const fetchTeacherActivities = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/activities/teacher/${selectedTeacher.id}`, {
        params: { limit: 100 },
      });
      let filtered = res.data.activities || [];
      if (filterBySeverity !== "ALL") {
        filtered = filtered.filter((a) => a.severity === filterBySeverity);
      }
      setActivities(filtered);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityColor = (severity) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-100 border-red-400 text-red-900";
      case "HIGH":
        return "bg-orange-100 border-orange-400 text-orange-900";
      case "MEDIUM":
        return "bg-yellow-100 border-yellow-400 text-yellow-900";
      case "LOW":
        return "bg-green-100 border-green-400 text-green-900";
      default:
        return "bg-gray-100 border-gray-400 text-gray-900";
    }
  };

  const getSeverityIcon = (severity) => {
    if (severity === "HIGH" || severity === "CRITICAL") {
      return <AlertTriangle size={20} className="text-red-600" />;
    }
    return <Activity size={20} className="text-gray-600" />;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border border-slate-700/50 shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-4 border-black bg-slate-800">
          <div className="flex items-center gap-3">
            <Activity size={28} className="text-accent-gold" />
            <h2 className="text-2xl font-bold text-white uppercase tracking-tight">
              Teacher Activity Tracker 📊
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Teachers List */}
          <div className="w-64 border-r-4 border-black bg-slate-50 overflow-y-auto">
            <div className="p-4">
              <p className="text-xs font-bold text-gray-600 uppercase mb-4">
                Select Teacher
              </p>
              <div className="space-y-2">
                {teachers.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-8">
                    No teachers found
                  </p>
                ) : (
                  teachers.map((teacher) => (
                    <button
                      key={teacher.id}
                      onClick={() => setSelectedTeacher(teacher)}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        selectedTeacher?.id === teacher.id
                          ? "bg-accent-red text-white border-black shadow-md"
                          : "bg-white border-gray-300 hover:border-black"
                      }`}
                    >
                      <p className="font-bold text-sm uppercase tracking-tight">
                        {teacher.fullName.split(" ")[0]}
                      </p>
                      <p className="text-xs opacity-75 mt-1">
                        {teacher.email ? teacher.email.substring(0, 15) + "..." : "No email"}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Activities Area */}
          <div className="flex-1 flex flex-col">
            {selectedTeacher ? (
              <>
                {/* Teacher Info & Filter */}
                <div className="p-6 border-b-4 border-black bg-slate-100 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-black uppercase tracking-tight">
                      {selectedTeacher.fullName}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      📧 {selectedTeacher.email || "No email"}
                    </p>
                  </div>

                  {/* Severity Filter */}
                  <div className="flex gap-2 flex-wrap">
                    {["ALL", "LOW", "MEDIUM", "HIGH", "CRITICAL"].map(
                      (severity) => (
                        <button
                          key={severity}
                          onClick={() => {
                            setFilterBySeverity(severity);
                          }}
                          className={`px-4 py-2 rounded-lg border-2 font-bold text-xs uppercase transition ${
                            filterBySeverity === severity
                              ? "bg-black text-white border-black"
                              : "bg-white border-gray-300 text-gray-700 hover:border-black"
                          }`}
                        >
                          {severity}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Activities List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
                  {loading ? (
                    <div className="text-center text-gray-500 py-8">Loading...</div>
                  ) : activities.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      No activities recorded
                    </div>
                  ) : (
                    activities.map((activity) => (
                      <div
                        key={activity.id}
                        className={`p-4 rounded-xl border-2 ${getActivityColor(
                          activity.severity
                        )}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-1">
                            {getSeverityIcon(activity.severity)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-4">
                              <p className="font-bold uppercase text-sm tracking-tight">
                                {activity.activityType}
                              </p>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border-2 border-current`}>
                                {activity.severity}
                              </span>
                            </div>
                            {activity.description && (
                              <p className="text-sm mt-2 opacity-90">
                                {activity.description}
                              </p>
                            )}
                            {activity.affectedResource && (
                              <p className="text-xs mt-2 opacity-75">
                                📄 Resource: {activity.affectedResource}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-3 text-xs opacity-75">
                              <Clock size={14} />
                              {new Date(activity.createdAt).toLocaleString()}
                            </div>
                            {activity.ipAddress && (
                              <p className="text-xs mt-2 opacity-75">
                                🌐 IP: {activity.ipAddress}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <p className="font-bold text-lg uppercase tracking-tight">
                  Select a teacher to view activities 👈
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityTracker;
