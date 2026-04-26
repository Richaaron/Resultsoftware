import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { LogOut, User, FileText, Calendar, Star, Trophy, Target, Download } from 'lucide-react';
import AcademicBackground from '../components/AcademicBackground';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [results, setResults] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    api.get('/students/parent').then(res => {
      setChildren(res.data);
      if (res.data.length > 0) handleChildSelect(res.data[0]);
    });
  }, []);

  const handleChildSelect = async (child) => {
    setSelectedChild(child);
    const resultsRes = await api.get(`/results/student/${child.id}`);
    const attendanceRes = await api.get(`/attendance/student/${child.id}`);
    setResults(resultsRes.data);
    setAttendance(attendanceRes.data);
  };

  const generateReportCard = () => {
    if (!selectedChild || results.length === 0) return;

    const doc = new jsPDF();
    
    // Add School Header
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 0);
    doc.text("THE ACADEMY", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text("Inspiring Excellence, Discovery & Growth", 105, 28, { align: "center" });
    
    doc.setLineWidth(1);
    doc.line(20, 35, 190, 35);

    // Student Info
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Student: ${selectedChild.lastName} ${selectedChild.firstName}`, 20, 45);
    doc.text(`Reg No: ${selectedChild.registrationNumber}`, 20, 52);
    doc.text(`Class: ${selectedChild.studentClass}`, 140, 45);
    doc.text(`Academic Year: ${results[0]?.academicYear || '2025/2026'}`, 140, 52);

    // Results Table
    const tableRows = results.map(r => [
      r.Subject?.name,
      r.ca1Score,
      r.ca2Score,
      r.examScore,
      r.totalScore,
      r.grade,
      r.remark
    ]);

    doc.autoTable({
      startY: 60,
      head: [['Subject', 'CA 1 (20)', 'CA 2 (20)', 'Exam (60)', 'Total (100)', 'Grade', 'Remark']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 40 },
        4: { fontStyle: 'bold' },
        5: { fontStyle: 'bold' }
      }
    });

    // Summary
    const totalScore = results.reduce((acc, curr) => acc + curr.totalScore, 0);
    const avgScore = (totalScore / results.length).toFixed(2);
    const finalY = doc.lastAutoTable.finalY + 15;

    doc.setFontSize(11);
    doc.text(`Total Subjects: ${results.length}`, 20, finalY);
    doc.text(`Total Score: ${totalScore}`, 20, finalY + 7);
    doc.text(`Average Score: ${avgScore}%`, 140, finalY + 7);

    // Signature Area
    doc.line(20, finalY + 30, 80, finalY + 30);
    doc.text("Class Teacher", 40, finalY + 35, { align: "center" });
    
    doc.line(130, finalY + 30, 190, finalY + 30);
    doc.text("Principal", 160, finalY + 35, { align: "center" });

    doc.save(`${selectedChild.firstName}_Report_Card.pdf`);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
      <AcademicBackground />
      
      {/* Top Navigation */}
      <nav className="bg-slate-900 border-b-4 border-black sticky top-0 z-50">
        <div className="container mx-auto px-6 h-24 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-accent-gold border-4 border-black rounded-2xl flex items-center justify-center text-black shadow-cartoon-sm transform -rotate-3">
              <User size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic text-3d">Parent <span className="text-accent-red">Zone</span></h1>
              <p className="text-xs text-slate-400 uppercase font-black tracking-widest">Watching them grow! 🌱</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-xl font-black text-white uppercase tracking-tighter text-3d">{user?.fullName}</p>
              <p className="text-sm text-accent-red font-bold italic uppercase tracking-widest">Super Guardian</p>
            </div>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-slate-800 hover:bg-accent-red/10 text-white border-4 border-black px-6 py-3 rounded-2xl transition-all font-black uppercase tracking-tighter shadow-cartoon-sm hover:-translate-x-1 hover:-translate-y-1 hover:shadow-cartoon active:translate-x-0 active:translate-y-0 active:shadow-none"
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
            <div className="cartoon-card p-8 bg-slate-900">
              <h2 className="text-lg font-black text-white uppercase tracking-widest mb-6 italic border-b-4 border-black pb-2">My Superstars ⭐</h2>
              <div className="space-y-4">
                {children.map(child => (
                  <button
                    key={child.id}
                    onClick={() => handleChildSelect(child)}
                    className={`w-full group flex items-center gap-4 p-4 rounded-2xl border-4 transition-all ${selectedChild?.id === child.id 
                      ? 'bg-accent-gold border-black shadow-cartoon-sm -translate-y-1' 
                      : 'bg-slate-800 border-transparent hover:border-black hover:bg-accent-gold/10'}`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl border-4 ${selectedChild?.id === child.id ? 'bg-white border-black transform -rotate-6' : 'bg-slate-900 border-transparent text-accent-gold group-hover:border-black'}`}>
                      {child.firstName.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className={`text-lg font-black uppercase tracking-tighter ${selectedChild?.id === child.id ? 'text-black' : 'text-white'}`}>{child.firstName}</p>
                      <p className={`text-xs font-bold italic ${selectedChild?.id === child.id ? 'text-accent-red' : 'text-slate-400'}`}>{child.studentClass}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 bg-slate-900/50 border-4 border-black rounded-3xl shadow-cartoon-sm relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="font-black text-white text-xl mb-2 uppercase italic tracking-tighter text-3d">Need Help? 🆘</h4>
                <p className="text-sm font-bold text-slate-400 mb-6 leading-relaxed italic">The school team is here to help your champion succeed!</p>
                <button className="w-full bg-accent-gold border-4 border-black text-black text-xs font-black py-3 rounded-xl uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-cartoon-sm">
                  Ping Us! 📨
                </button>
              </div>
              <FileText className="absolute -bottom-6 -right-6 w-24 h-24 text-white/5 transform -rotate-12 group-hover:scale-110 transition-transform" />
            </div>
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-9 space-y-10">
            {selectedChild ? (
              <>
                <div className="cartoon-card p-10 bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-8 border-l-[12px] border-l-accent-gold">
                  <div>
                    <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter text-3d-lg mb-2">
                      {selectedChild.firstName} {selectedChild.lastName}
                    </h2>
                    <div className="flex items-center gap-4">
                      <span className="px-4 py-1.5 bg-black text-white rounded-full text-xs font-black uppercase tracking-widest">#{selectedChild.registrationNumber}</span>
                      <span className="text-xl font-black text-accent-red uppercase tracking-tight italic">{selectedChild.studentClass}</span>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="bg-slate-800 p-5 rounded-2xl text-center min-w-[120px] border-4 border-black shadow-cartoon-sm transform rotate-2">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1 opacity-50">Status</p>
                      <p className="text-xl font-black text-white uppercase">Active ✨</p>
                    </div>
                    <div className="bg-slate-800 p-5 rounded-2xl text-center min-w-[120px] border-4 border-black shadow-cartoon-sm transform -rotate-2">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1 opacity-50">Progress</p>
                      <p className="text-xl font-black text-white uppercase">Great! 🚀</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                  {/* Results Card */}
                  <div className="cartoon-card bg-white p-10">
                    <div className="flex items-center justify-between mb-8 border-b-4 border-black pb-4">
                      <h3 className="text-2xl font-black text-black uppercase italic tracking-tighter text-3d flex items-center gap-3">
                        <Trophy className="text-accent-gold" size={28} /> Achievement!
                      </h3>
                      <button 
                        onClick={generateReportCard}
                        disabled={results.length === 0}
                        className="text-xs font-black text-accent-red hover:underline uppercase tracking-widest flex items-center gap-1 disabled:opacity-30"
                      >
                        Download PDF 📥
                      </button>
                    </div>
                    <div className="space-y-6">
                      {results.length > 0 ? results.map(r => (
                        <div key={r.id} className="p-6 rounded-2xl border-4 border-black bg-accent-gold/5 hover:bg-accent-gold/10 transition-all group">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="text-xl font-black text-black uppercase tracking-tight italic">{r.Subject?.name}</p>
                              <p className="text-xs text-black/50 font-black uppercase tracking-widest">{r.term} Term</p>
                            </div>
                            <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border-4 border-black transition-transform group-hover:scale-110 duration-300 shadow-cartoon-sm ${
                              r.totalScore >= 70 ? 'bg-accent-gold text-black' : 
                              r.totalScore >= 50 ? 'bg-accent-red text-white' : 
                              'bg-black text-white'
                            }`}>
                              <span className="text-[10px] font-black opacity-50 leading-none mb-0.5">GRADE</span>
                              <span className="text-2xl font-black leading-none">{r.grade}</span>
                            </div>
                          </div>
                            <div className="flex-1 space-y-2">
                              <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-black/40">
                                <span>CA1: {r.ca1Score}</span>
                                <span>CA2: {r.ca2Score}</span>
                                <span>Exam: {r.examScore}</span>
                              </div>
                              <div className="h-4 bg-white border-2 border-black rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full border-r-2 border-black transition-all duration-1000 ${r.totalScore >= 50 ? 'bg-accent-gold' : 'bg-accent-red'}`}
                                  style={{ width: `${r.totalScore}%` }}
                                ></div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-black text-black/40 uppercase tracking-widest">Avg: {r.averageScore?.toFixed(1)}</span>
                                <span className="text-lg font-black text-black italic">Total: {r.totalScore}%</span>
                              </div>
                            </div>
                        </div>
                      )) : (
                        <div className="py-16 text-center">
                          <p className="text-xl font-black text-black/20 uppercase italic tracking-widest">No scores yet! 📝</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Attendance Card */}
                  <div className="cartoon-card bg-white p-10">
                    <div className="flex items-center justify-between mb-8 border-b-4 border-black pb-4">
                      <h3 className="text-2xl font-black text-black uppercase italic tracking-tighter text-3d flex items-center gap-3">
                        <Target className="text-accent-red" size={28} /> Daily Quests
                      </h3>
                      <span className="px-3 py-1 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest">On Time!</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {attendance.length > 0 ? attendance.slice(0, 8).map(a => (
                        <div key={a.id} className="p-4 bg-white border-4 border-black rounded-2xl text-center group hover:bg-accent-gold/10 transition-all shadow-cartoon-sm">
                          <p className="text-[10px] font-black text-black/40 uppercase tracking-widest mb-2">{new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                          <div className={`text-xs font-black py-1.5 px-4 rounded-xl border-2 border-black inline-block uppercase tracking-widest ${a.status === 'Present' ? 'bg-accent-gold' : a.status === 'Absent' ? 'bg-accent-red text-white' : 'bg-black text-white'}`}>
                            {a.status}
                          </div>
                        </div>
                      )) : (
                        <div className="col-span-2 py-16 text-center">
                          <p className="text-xl font-black text-black/20 uppercase italic tracking-widest">No roll calls! 🔔</p>
                        </div>
                      )}
                    </div>
                    {attendance.length > 0 && (
                      <div className="mt-10 p-6 bg-accent-gold border-4 border-black rounded-2xl flex items-center justify-between shadow-cartoon-sm">
                        <span className="text-sm font-black text-black uppercase tracking-widest">Success Rate:</span>
                        <span className="text-3xl font-black text-black italic text-3d">
                          {Math.round((attendance.filter(a => a.status === 'Present').length / attendance.length) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="cartoon-card p-24 bg-white text-center">
                <div className="w-24 h-24 bg-accent-gold/20 border-4 border-black rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-cartoon transform -rotate-6">
                  <User size={48} className="text-black" />
                </div>
                <h2 className="text-4xl font-black text-black mb-4 uppercase italic tracking-tighter text-3d">Pick a Superstar!</h2>
                <p className="text-xl font-bold text-gray-600 max-w-sm mx-auto italic">Choose one of your amazing kids from the list to see how they're doing! 🌟</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
