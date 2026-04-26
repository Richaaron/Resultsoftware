import React, { useState, useEffect } from 'react';
import api from '../api';
import { FileSpreadsheet, Download, Printer, Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AcademicBackground from '../components/AcademicBackground';

const Broadsheet = () => {
  const navigate = useNavigate();
  const [studentClass, setStudentClass] = useState('');
  const [term, setTerm] = useState('First');
  const [academicYear, setAcademicYear] = useState('2025/2026');
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const classes = [
    'Pre-Nursery', 'Nursery 1', 'Nursery 2',
    'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
    'JSS 1', 'JSS 2', 'JSS 3',
    'SSS 1', 'SSS 2', 'SSS 3'
  ];

  const fetchBroadsheet = async () => {
    if (!studentClass) return;
    setLoading(true);
    try {
      const res = await api.get('/results/broadsheet', {
        params: { studentClass, term, academicYear }
      });
      setStudents(res.data);
      
      // Extract unique subjects from all student results
      const allSubjects = new Set();
      res.data.forEach(student => {
        student.Results.forEach(result => {
          if (result.Subject) {
            allSubjects.add(JSON.stringify({ id: result.Subject.id, name: result.Subject.name }));
          }
        });
      });
      setSubjects(Array.from(allSubjects).map(s => JSON.parse(s)).sort((a, b) => a.name.localeCompare(b.name)));
    } catch (err) {
      console.error('Error fetching broadsheet', err);
    } finally {
      setLoading(false);
    }
  };

  const getScore = (student, subjectId) => {
    const result = student.Results.find(r => r.SubjectId === subjectId);
    return result ? result.totalScore : '-';
  };

  const getGrade = (student, subjectId) => {
    const result = student.Results.find(r => r.SubjectId === subjectId);
    return result ? result.grade : '';
  };

  return (
    <div className="min-h-screen bg-[#fffbeb] relative overflow-hidden p-6 lg:p-10">
      <AcademicBackground />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 font-black uppercase tracking-tight text-black hover:text-accent-red transition-colors"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <div className="cartoon-card bg-white p-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-black/50">Select Class</label>
                <select 
                  className="input-cartoon"
                  value={studentClass}
                  onChange={e => setStudentClass(e.target.value)}
                >
                  <option value="">-- Choose Class --</option>
                  {classes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-black/50">Select Term</label>
                <select 
                  className="input-cartoon"
                  value={term}
                  onChange={e => setTerm(e.target.value)}
                >
                  <option value="First">First Term</option>
                  <option value="Second">Second Term</option>
                  <option value="Third">Third Term</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-black/50">Academic Year</label>
                <select 
                  className="input-cartoon"
                  value={academicYear}
                  onChange={e => setAcademicYear(e.target.value)}
                >
                  <option value="2025/2026">2025/2026</option>
                  <option value="2026/2027">2026/2027</option>
                </select>
              </div>
            </div>
            <button 
              onClick={fetchBroadsheet}
              disabled={!studentClass || loading}
              className="btn-cartoon-primary bg-accent-gold px-10 py-4 flex items-center gap-3 disabled:opacity-50"
            >
              <Search size={24} />
              {loading ? 'Searching...' : 'Generate!'}
            </button>
          </div>
        </div>

        {students.length > 0 ? (
          <div className="cartoon-card bg-white p-8 overflow-hidden">
            <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-6">
              <div>
                <h2 className="text-3xl font-black text-black uppercase italic tracking-tighter text-3d">
                  Class Broadsheet: {studentClass}
                </h2>
                <p className="text-accent-red font-black uppercase tracking-tight">{term} Term | {academicYear}</p>
              </div>
              <div className="flex gap-4">
                <button className="p-4 bg-white border-4 border-black rounded-2xl shadow-cartoon-sm hover:-translate-y-1 transition-all">
                  <Printer size={24} />
                </button>
                <button className="p-4 bg-accent-gold border-4 border-black rounded-2xl shadow-cartoon-sm hover:-translate-y-1 transition-all">
                  <Download size={24} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-4 border-black">
                    <th className="p-4 text-left font-black uppercase tracking-widest text-xs bg-gray-50 border-r-2 border-black sticky left-0 z-20">Student Name</th>
                    {subjects.map(subject => (
                      <th key={subject.id} className="p-4 text-center font-black uppercase tracking-widest text-[10px] min-w-[100px] border-r-2 border-black/10">
                        {subject.name}
                      </th>
                    ))}
                    <th className="p-4 text-center font-black uppercase tracking-widest text-xs bg-accent-gold/10">Total</th>
                    <th className="p-4 text-center font-black uppercase tracking-widest text-xs bg-accent-gold/10">Avg</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => {
                    const totalScore = student.Results.reduce((acc, curr) => acc + curr.totalScore, 0);
                    const avgScore = student.Results.length > 0 ? totalScore / student.Results.length : 0;
                    
                    return (
                      <tr key={student.id} className="border-b-2 border-black/5 hover:bg-accent-gold/5 transition-colors group">
                        <td className="p-4 font-bold text-black uppercase tracking-tight sticky left-0 bg-white group-hover:bg-inherit border-r-2 border-black z-10">
                          {student.lastName} {student.firstName}
                        </td>
                        {subjects.map(subject => {
                          const score = getScore(student, subject.id);
                          const grade = getGrade(student, subject.id);
                          return (
                            <td key={subject.id} className="p-4 text-center border-r-2 border-black/5">
                              <div className="flex flex-col items-center">
                                <span className="font-black text-lg">{score}</span>
                                {grade && <span className="text-[10px] font-black text-accent-red">{grade}</span>}
                              </div>
                            </td>
                          );
                        })}
                        <td className="p-4 text-center font-black text-lg bg-accent-gold/5 border-r-2 border-black/5">
                          {totalScore.toFixed(0)}
                        </td>
                        <td className="p-4 text-center font-black text-lg bg-accent-gold/5">
                          {avgScore.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : !loading && studentClass && (
          <div className="cartoon-card bg-white p-20 text-center border-4 border-dashed border-black/20">
            <FileSpreadsheet size={64} className="mx-auto text-black/10 mb-6" />
            <p className="text-2xl font-black text-black/20 uppercase italic tracking-widest">No results found for this selection!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Broadsheet;
