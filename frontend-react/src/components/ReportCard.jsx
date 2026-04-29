import React from "react";
import "./ReportCard.css";

const ReportCard = React.forwardRef(({ student, settings }, ref) => {
  if (!student || !settings) return null;

  // Group results by term if needed, or just display the current term's results
  // We assume student.results is an array of Result objects populated with Subject data
  const results = student.results || [];

  // Sort results alphabetically by subject name
  const sortedResults = [...results].sort((a, b) => {
    const nameA = a.Subject?.name || "";
    const nameB = b.Subject?.name || "";
    return nameA.localeCompare(nameB);
  });

  const getGrade = (score) => {
    if (score >= 70) return { grade: "A", remarks: "Excellent", color: "text-green-600" };
    if (score >= 60) return { grade: "B", remarks: "Very Good", color: "text-blue-600" };
    if (score >= 50) return { grade: "C", remarks: "Good", color: "text-yellow-600" };
    if (score >= 40) return { grade: "D", remarks: "Fair", color: "text-orange-500" };
    return { grade: "F", remarks: "Poor", color: "text-red-600" };
  };

  const calculateTotalScore = () => {
    return sortedResults.reduce((acc, curr) => acc + (curr.totalScore || 0), 0);
  };

  const calculateAverage = () => {
    if (sortedResults.length === 0) return 0;
    return (calculateTotalScore() / sortedResults.length).toFixed(2);
  };

  return (
    <div className="report-card-container print-only" ref={ref}>
      <div className="report-card-wrapper">
        {/* Header Section */}
        <div className="report-header">
          <div className="logo-container">
            {settings.logo ? (
              <img src={settings.logo} alt="School Logo" className="school-logo" />
            ) : (
              <div className="logo-placeholder">LOGO</div>
            )}
          </div>
          <div className="school-info">
            <h1 className="school-name" style={{ color: settings.primaryColor }}>
              {settings.schoolName || "The Academy"}
            </h1>
            <p className="school-address">{settings.schoolAddress}</p>
            <h2 className="report-title">STUDENT TERMINAL REPORT</h2>
          </div>
          <div className="logo-container empty"></div>
        </div>

        {/* Student Details */}
        <div className="student-details-grid">
          <div className="detail-item">
            <span className="detail-label">Name:</span>
            <span className="detail-value font-bold uppercase">{student.fullName}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Admission No:</span>
            <span className="detail-value">{student.admissionNumber}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Class:</span>
            <span className="detail-value">{student.currentClass}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Term:</span>
            <span className="detail-value">{settings.currentTerm}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Academic Year:</span>
            <span className="detail-value">{settings.currentAcademicYear}</span>
          </div>
        </div>

        {/* Grades Table */}
        <div className="grades-section">
          <table className="grades-table">
            <thead>
              <tr style={{ backgroundColor: settings.primaryColor, color: "#fff" }}>
                <th className="text-left w-1/3">SUBJECT</th>
                <th className="text-center w-16">TEST (40)</th>
                <th className="text-center w-16">EXAM (60)</th>
                <th className="text-center w-16">TOTAL (100)</th>
                <th className="text-center w-16">GRADE</th>
                <th className="text-left w-1/4">REMARKS</th>
              </tr>
            </thead>
            <tbody>
              {sortedResults.length > 0 ? (
                sortedResults.map((result, index) => {
                  const { grade, remarks, color } = getGrade(result.totalScore);
                  return (
                    <tr key={index}>
                      <td className="font-bold">{result.Subject?.name || "Unknown Subject"}</td>
                      <td className="text-center">{result.testScore || 0}</td>
                      <td className="text-center">{result.examScore || 0}</td>
                      <td className="text-center font-bold">{result.totalScore || 0}</td>
                      <td className={`text-center font-bold ${color}`}>{grade}</td>
                      <td className={`text-left italic ${color}`}>{remarks}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400 italic">
                    No results found for this term.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary & Metrics */}
        <div className="summary-section">
          <div className="summary-box">
            <h4 className="summary-title" style={{ backgroundColor: settings.secondaryColor }}>PERFORMANCE SUMMARY</h4>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="label">Total Score:</span>
                <span className="value">{calculateTotalScore()}</span>
              </div>
              <div className="summary-item">
                <span className="label">Average:</span>
                <span className="value">{calculateAverage()}%</span>
              </div>
              <div className="summary-item">
                <span className="label">Grade Key:</span>
                <span className="value text-xs">
                  A (70-100) | B (60-69) | C (50-59) | D (40-49) | F (0-39)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="signatures-section">
          <div className="signature-box">
            {settings.headTeacherSignature ? (
              <img src={settings.headTeacherSignature} alt="Teacher Sig" className="signature-img" />
            ) : (
              <div className="signature-line"></div>
            )}
            <p className="signature-name">{settings.headTeacherName || "Head Teacher"}</p>
            <p className="signature-title">Form Teacher</p>
          </div>
          
          {/* Stamp/Seal Placeholder */}
          <div className="stamp-box">
            <div className="official-stamp" style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}>
              OFFICIAL SEAL
            </div>
          </div>

          <div className="signature-box">
            {settings.principalSignature ? (
              <img src={settings.principalSignature} alt="Principal Sig" className="signature-img" />
            ) : (
              <div className="signature-line"></div>
            )}
            <p className="signature-name">{settings.principalName || "Principal"}</p>
            <p className="signature-title">Principal / Administrator</p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="report-footer">
          This document is computer generated. Any unauthorized alteration renders it invalid.
        </div>
      </div>
    </div>
  );
});

export default ReportCard;
