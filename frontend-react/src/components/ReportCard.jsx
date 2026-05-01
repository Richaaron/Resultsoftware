import React from "react";
import "./ReportCard.css";

const ReportCard = React.forwardRef(({ student, settings, attendanceStats }, ref) => {
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

  // Helper function to calculate performance metrics
  const getPerformanceMetrics = () => {
    const average = calculateAverage();
    const gradeDistribution = sortedResults.reduce((acc, curr) => {
      const { grade } = getGrade(curr.totalScore);
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {});

    const totalSubjects = sortedResults.length;
    return {
      average,
      gradeDistribution,
      aCount: gradeDistribution.A || 0,
      bCount: gradeDistribution.B || 0,
      cCount: gradeDistribution.C || 0,
      dCount: gradeDistribution.D || 0,
      fCount: gradeDistribution.F || 0,
      totalSubjects,
      attendance: attendanceStats?.percentage || 0,
    };
  };

  // Generate Form Teacher/Class Teacher's Remarks (focus on behavior, conduct, improvement)
  const generateClassTeacherRemark = () => {
    const metrics = getPerformanceMetrics();
    const { average, attendance, aCount, bCount, cCount, dCount, fCount } = metrics;
    let remark = "";

    if (average >= 85) {
      remark = `${student.fullName} demonstrates exemplary conduct and outstanding academic performance with an average score of ${average}%. The student exhibits discipline, active participation in class, and sets a positive example for peers. Continue to maintain these excellent standards.`;
    } else if (average >= 75) {
      remark = `${student.fullName} displays good behavior and solid academic performance with an average score of ${average}%. The student shows consistent effort and cooperation in class. Continued dedication will lead to further improvement.`;
    } else if (average >= 65) {
      remark = `${student.fullName} shows satisfactory conduct and reasonable academic performance with an average score of ${average}%. There is potential for improvement through increased focus and dedication. Encourage more active participation in class activities.`;
    } else if (average >= 55) {
      remark = `${student.fullName} is generally well-behaved but academic performance needs improvement (average: ${average}%). The student should focus on strengthening weaker areas and seeking help when needed.`;
    } else if (average >= 45) {
      remark = `${student.fullName} needs significant improvement in both academic work and classroom engagement (average: ${average}%). Close monitoring and parental involvement are advised to ensure progress.`;
    } else {
      remark = `${student.fullName} is struggling academically with an average score of ${average}%. Urgent intervention, including remedial classes and parental support, is strongly recommended.`;
    }

    // Add subject-specific insights
    if (aCount >= 4) {
      remark += ` Excellent performance across multiple subjects, particularly noted.`;
    } else if (fCount >= 2) {
      remark += ` Priority focus should be given to the subjects where the student scored lower grades.`;
    }

    // Add attendance note
    if (attendance < 75) {
      remark += ` Attendance at ${attendance}% is below acceptable standards; regular attendance is essential for academic success.`;
    } else if (attendance < 85) {
      remark += ` Attendance should be improved to strengthen learning outcomes.`;
    }

    return remark;
  };

  // Generate Principal's Remarks (focus on academic achievement and standards)
  const generatePrincipalRemark = () => {
    const metrics = getPerformanceMetrics();
    const { average, aCount, bCount, totalSubjects, attendance } = metrics;
    const excellentSubjectsCount = aCount + bCount;
    let remark = "";

    if (average >= 85) {
      remark = `${student.fullName} has achieved outstanding academic excellence with an average score of ${average}%. This exceptional performance reflects strong mastery of core concepts. The student is a credit to the school and exemplifies our academic standards.`;
    } else if (average >= 75) {
      remark = `${student.fullName} has demonstrated commendable academic achievement with an average score of ${average}%. Strong performance in ${excellentSubjectsCount} subjects indicates solid subject mastery. We encourage continued excellence.`;
    } else if (average >= 65) {
      remark = `${student.fullName} has achieved a respectable average score of ${average}%. While performance is satisfactory, there is room for significant improvement. Targeted effort in weaker subjects will yield better results.`;
    } else if (average >= 55) {
      remark = `${student.fullName} achieved an average score of ${average}%. Academic performance is average; focused revision and tutoring are recommended to reach higher achievement levels.`;
    } else if (average >= 45) {
      remark = `${student.fullName} scored an average of ${average}%, indicating performance below our expected academic standards. Remedial support and intensive tutoring are necessary.`;
    } else {
      remark = `${student.fullName} scored an average of ${average}%, significantly below school academic standards. A comprehensive intervention plan involving parents, teachers, and specialist support is urgently required.`;
    }

    // Add overall assessment
    if (excellentSubjectsCount === totalSubjects) {
      remark += ` Consistent high performance across all subjects is highly commendable.`;
    } else if (excellentSubjectsCount >= totalSubjects * 0.7) {
      remark += ` Strong performance across most subjects is noteworthy.`;
    }

    // Attendance note for principal
    if (attendance >= 90) {
      remark += ` The student's excellent attendance of ${attendance}% reflects strong commitment to academic pursuits.`;
    } else if (attendance < 80) {
      remark += ` Attendance of ${attendance}% must be improved for optimal academic achievement.`;
    }

    return remark;
  };

  // Generate Proprietress's Remarks (focus on overall school performance and achievement)
  const generateProprietressRemark = () => {
    const metrics = getPerformanceMetrics();
    const { average, aCount, fCount, totalSubjects, attendance } = metrics;
    let remark = "";

    if (average >= 85) {
      remark = `${student.fullName} represents the caliber of excellence our institution strives to achieve, with an outstanding average score of ${average}%. This student is a remarkable asset to our school community and embodies our values of academic and personal excellence.`;
    } else if (average >= 75) {
      remark = `${student.fullName} has maintained strong academic performance with an average score of ${average}%. The student contributes positively to our school community and upholds our institutional standards.`;
    } else if (average >= 65) {
      remark = `${student.fullName} has achieved a commendable average score of ${average}%. We believe in the student's potential and encourage continued dedication toward personal and academic development.`;
    } else if (average >= 55) {
      remark = `${student.fullName} achieved an average score of ${average}%. While the student is on the right path, we expect greater commitment to achieving our school's excellence standards in subsequent terms.`;
    } else if (average >= 45) {
      remark = `${student.fullName} scored an average of ${average}%, which is below our expected standards. We value this student's place in our school and recommend collaborative efforts between home and school to ensure improvement.`;
    } else {
      remark = `${student.fullName} achieved an average score of ${average}%. Our institution is committed to supporting this student's academic growth, and we seek active parental partnership in addressing the performance concerns.`;
    }

    // Add reference to school mission
    if (aCount >= 3) {
      remark += ` The student's exceptional performance aligns with our mission of academic excellence and holistic development.`;
    }

    if (fCount >= 2) {
      remark += ` We recommend a comprehensive support plan to enhance the student's learning outcomes.`;
    }

    return remark;
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
            {settings.schoolPhoneNumber && (
              <p className="school-phone">{settings.schoolPhoneNumber}</p>
            )}
            <h2 className="report-title">STUDENT TERMINAL REPORT</h2>
          </div>
          <div className="logo-container empty"></div>
        </div>

        {/* School Authority Details */}
        <div className="school-authority-section">
          <div className="authority-detail">
            <p className="authority-label">Principal:</p>
            <p className="authority-value" style={{ fontStyle: 'italic', fontFamily: 'cursive', fontSize: '16px', fontWeight: 'bold' }}>
              {settings.principalName || "Principal Name"}
            </p>
          </div>
          <div className="authority-detail">
            <p className="authority-label">Class Teacher/Form Teacher:</p>
            <p className="authority-value" style={{ fontStyle: 'italic', fontFamily: 'cursive', fontSize: '16px', fontWeight: 'bold' }}>
              {settings.headTeacherName || "Class Teacher/Form Teacher Name"}
            </p>
          </div>
          <div className="authority-detail">
            <p className="authority-label">Academic Year:</p>
            <p className="authority-value">{settings.currentAcademicYear || "Academic Year"}</p>
          </div>
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
                      <td className={`text-left  ${color}`}>{remarks}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400 ">
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
              <div className="summary-item col-span-3">
                <span className="label">Attendance:</span>
                <span className="value text-sm font-bold">
                  {attendanceStats ? `${attendanceStats.presentDays} days present out of ${attendanceStats.totalDays} total days (${attendanceStats.percentage}%)` : "N/A"}
                </span>
              </div>
              <div className="summary-item" style={{ gridColumn: '1 / -1' }}>
                <span className="label">Grade Key:</span>
                <span className="value text-xs">
                  A (70-100) | B (60-69) | C (50-59) | D (40-49) | F (0-39)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Automated Remarks Section */}
        <div className="remarks-section">
          <h4 className="remarks-title" style={{ backgroundColor: settings.primaryColor, color: "#fff" }}>
            PERFORMANCE REMARKS & COMMENTS
          </h4>
          <div className="remarks-content">
            <div className="remark-box">
              <p className="remark-label">Class Teacher / Form Teacher's Remarks:</p>
              <p className="remark-text">{generateClassTeacherRemark()}</p>
            </div>

            <div className="remark-box">
              <p className="remark-label">Principal's Remarks:</p>
              <p className="remark-text">{generatePrincipalRemark()}</p>
            </div>

            {settings.proprietressName && (
              <div className="remark-box">
                <p className="remark-label">Proprietress's Remarks:</p>
                <p className="remark-text">{generateProprietressRemark()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Signatures */}
        <div className="signatures-section">
          <div className="signature-box">
            <div className="signature-display">
              {settings.headTeacherSignature ? (
                <img src={settings.headTeacherSignature} alt="Teacher Sig" className="signature-img" />
              ) : (
                <div className="signature-name-styled">{settings.headTeacherName || "Class Teacher/Form Teacher"}</div>
              )}
            </div>
            <div className="signature-line"></div>
            <p className="signature-name">{settings.headTeacherName || "Class Teacher/Form Teacher"}</p>
            <p className="signature-title">Class Teacher / Form Teacher</p>
          </div>
          
          {/* Stamp/Seal Placeholder */}
          <div className="stamp-box">
            <div className="official-stamp" style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}>
              OFFICIAL SEAL
            </div>
          </div>

          <div className="signature-box">
            <div className="signature-display">
              {settings.principalSignature ? (
                <img src={settings.principalSignature} alt="Principal Sig" className="signature-img" />
              ) : (
                <div className="signature-name-styled">{settings.principalName || "Principal"}</div>
              )}
            </div>
            <div className="signature-line"></div>
            <p className="signature-name">{settings.principalName || "Principal"}</p>
            <p className="signature-title">Principal / Administrator</p>
          </div>
        </div>

        {/* Proprietress Details Section */}
        {settings.proprietressName && (
          <div className="proprietress-section">
            <div className="proprietress-container">
              <div className="signature-box proprietress-box">
                <div className="signature-display">
                  {settings.proprietressSignature ? (
                    <img src={settings.proprietressSignature} alt="Proprietress Sig" className="signature-img" />
                  ) : (
                    <div className="signature-name-styled">{settings.proprietressName || "Proprietress"}</div>
                  )}
                </div>
                <div className="signature-line"></div>
                <p className="signature-name">{settings.proprietressName || "Proprietress"}</p>
                <p className="signature-title">School Proprietress</p>
              </div>
            </div>
          </div>
        )}

        {/* School Details Footer */}
        <div className="school-details-footer">
          <div className="footer-section">
            <p className="footer-label">School Address:</p>
            <p className="footer-value">{settings.schoolAddress || "N/A"}</p>
          </div>
          {settings.schoolPhoneNumber && (
            <div className="footer-section">
              <p className="footer-label">Contact:</p>
              <p className="footer-value">{settings.schoolPhoneNumber}</p>
            </div>
          )}
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
