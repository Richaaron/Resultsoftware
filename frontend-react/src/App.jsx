import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import api from "./api";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import Broadsheet from "./pages/Broadsheet";

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-brand-950 text-white gap-6">
    <div className="text-center">
      <h1 className="text-7xl font-bold text-accent-gold mb-2">404</h1>
      <p className="text-2xl font-semibold text-brand-200 mb-2">
        Page Not Found
      </p>
      <p className="text-brand-400 font-medium mb-8">
        Oops! This page doesn't exist or was moved.
      </p>
      <Link
        to="/"
        className="inline-block btn-primary"
      >
        ← Back to Home
      </Link>
    </div>
  </div>
);

const PrivateRoute = ({ children, roles }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const [settingsLoading, setSettingsLoading] = useState(true);

  // Initialize database on app load
  useEffect(() => {
    const initDB = async () => {
      try {
        await fetch('/api/init', { method: 'POST' });
      } catch (error) {
        console.warn('Database initialization check failed (may be normal):', error);
      }
    };
    initDB();
  }, []);

  useEffect(() => {
    const applySettings = async () => {
      try {
        const res = await api.get("/settings");
        const settings = res.data;
        if (settings) {
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
        }
      } catch (error) {
        console.error("Failed to load global settings:", error);
      } finally {
        setSettingsLoading(false);
      }
    };
    applySettings();
  }, []);

  if (settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-950">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-brand-600 border-t-accent-gold rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-300 font-semibold text-sm">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen w-full">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin/*"
            element={
              <PrivateRoute roles={["ADMIN"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/teacher/*"
            element={
              <PrivateRoute roles={["TEACHER"]}>
                <TeacherDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/parent/*"
            element={
              <PrivateRoute roles={["PARENT"]}>
                <ParentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/broadsheet"
            element={
              <PrivateRoute roles={["ADMIN", "TEACHER"]}>
                <Broadsheet />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
