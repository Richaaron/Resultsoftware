import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { UserPlus, FileText, CheckCircle, LogOut, LayoutDashboard, Calendar, FileSpreadsheet } from 'lucide-react';
import AcademicBackground from '../components/AcademicBackground';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#fffbeb] relative overflow-hidden">
      <AcademicBackground />
      {/* Sidebar */}
      <div className="w-72 bg-white border-r-4 border-black p-8 flex flex-col shadow-cartoon relative z-10">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-accent-gold border-4 border-black rounded-2xl flex items-center justify-center shadow-cartoon-sm transform rotate-3">
            <LayoutDashboard size={24} className="text-black" />
          </div>
          <h2 className="text-2xl font-black tracking-tighter uppercase italic text-black text-3d">Teacher <span className="text-accent-red">Hub</span></h2>
        </div>
        <nav className="flex-1 space-y-4">
          <Link to="/teacher" className="flex items-center p-4 rounded-2xl border-4 border-transparent hover:border-black hover:bg-accent-gold/20 transition-all group font-black uppercase tracking-tight text-black">
            <LayoutDashboard className="mr-3" size={20} /> 
            <span>Dashboard</span>
          </Link>
          {user?.isFormTeacher && (
            <Link to="/teacher/register-student" className="flex items-center p-4 rounded-2xl border-4 border-transparent hover:border-black hover:bg-accent-red/10 transition-all group font-black uppercase tracking-tight text-black">
              <UserPlus className="mr-3" size={20} /> 
              <span>Register</span>
            </Link>
          )}
          <Link to="/teacher/record-results" className="flex items-center p-4 rounded-2xl border-4 border-transparent hover:border-black hover:bg-accent-gold/20 transition-all group font-black uppercase tracking-tight text-black">
            <FileText className="mr-3" size={20} /> 
            <span>Results</span>
          </Link>
          <Link to="/broadsheet" className="flex items-center p-4 rounded-2xl border-4 border-transparent hover:border-black hover:bg-accent-gold/20 transition-all group font-black uppercase tracking-tight text-black">
            <FileSpreadsheet className="mr-3" size={20} /> 
            <span>Broadsheet</span>
          </Link>
          {user?.isFormTeacher && (
            <Link to="/teacher/attendance" className="flex items-center p-4 rounded-2xl border-4 border-transparent hover:border-black hover:bg-accent-red/10 transition-all group font-black uppercase tracking-tight text-black">
              <CheckCircle className="mr-3" size={20} /> 
              <span>Attendance</span>
            </Link>
          )}
        </nav>
        <button 
          onClick={handleLogout} 
          className="flex items-center p-4 rounded-2xl border-4 border-transparent hover:border-black hover:bg-accent-red/10 text-black font-black uppercase tracking-tight transition-all mt-auto group"
        >
          <LogOut className="mr-3 transition-transform group-hover:-translate-x-1" size={20} /> 
          <span>Sign Out</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-black tracking-tighter uppercase italic underline decoration-4 decoration-accent-gold text-3d-lg">Hello, Teacher {user?.fullName?.split(' ')[0]}! 🍎</h1>
            <p className="text-gray-600 mt-2 font-bold text-lg">Ready to inspire some young minds today?</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xl font-black text-black uppercase tracking-tighter text-3d">{user?.fullName}</p>
              <p className="text-sm font-bold text-accent-red uppercase tracking-widest italic">Master Educator</p>
            </div>
            <div className="w-16 h-16 bg-white border-4 border-black rounded-3xl flex items-center justify-center font-black text-2xl shadow-cartoon transform -rotate-3">
              {user?.fullName?.charAt(0)}
            </div>
          </div>
        </header>

        <main className="max-w-6xl">
          <Routes>
            <Route path="/" element={<TeacherOverview />} />
            {user?.isFormTeacher && (
              <>
                <Route path="/register-student" element={<RegisterStudent />} />
                <Route path="/attendance" element={<AttendanceManager />} />
              </>
            )}
            <Route path="/record-results" element={<RecordResults />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const TeacherOverview = () => {
  return (
    <div className="cartoon-card p-10 bg-white">
      <h2 className="text-3xl font-black text-black mb-6 uppercase italic tracking-tighter text-3d">Classroom Command Center 🚀</h2>
      <p className="text-gray-700 font-bold text-xl leading-relaxed mb-10">
        Welcome to your digital classroom! This is where the magic happens. 
        Keep your students' progress sharp, their attendance perfect, and their results shining! ✨
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="p-8 bg-accent-gold/20 border-4 border-black rounded-3xl shadow-cartoon-sm hover:-translate-y-1 transition-all">
          <h4 className="font-black text-black text-xl mb-3 uppercase tracking-tight italic">Teacher's Tip 💡</h4>
          <p className="text-lg font-bold text-gray-800 italic">"The art of teaching is the art of assisting discovery." Keep exploring with your students!</p>
        </div>
        <div className="p-8 bg-accent-red/20 border-4 border-black rounded-3xl shadow-cartoon-sm hover:-translate-y-1 transition-all">
          <h4 className="font-black text-black text-xl mb-3 uppercase tracking-tight italic">Upcoming Goals 🎯</h4>
          <p className="text-lg font-bold text-gray-800 italic">Term end is coming! Time to get those final grades polished and ready for the little geniuses.</p>
        </div>
      </div>
    </div>
  );
};

const RegisterStudent = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    registrationNumber: '',
    studentClass: '',
    subjectIds: []
  });
  const [subjects, setSubjects] = useState([]);
  const [message, setMessage] = useState('');
  const [parentCreds, setParentCreds] = useState(null);

  useEffect(() => {
    api.get('/students/subjects').then(res => setSubjects(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/students', formData);
      setMessage('Student registered successfully!');
      setParentCreds(res.data.parentCredentials);
      setFormData({ firstName: '', lastName: '', registrationNumber: '', studentClass: '', subjectIds: [] });
    } catch (err) {
      setMessage('Error registering student');
    }
  };

  const handleSubjectToggle = (id) => {
    setFormData(prev => ({
      ...prev,
      subjectIds: prev.subjectIds.includes(id) 
        ? prev.subjectIds.filter(sid => sid !== id)
        : [...prev.subjectIds, id]
    }));
  };

  return (
    <div className="max-w-3xl cartoon-card p-10 bg-white">
      <h2 className="text-3xl font-black text-black mb-8 uppercase italic tracking-tighter text-3d">Register New Superstar! ⭐</h2>
      
      {message && (
        <div className={`p-6 mb-8 border-4 border-black rounded-2xl flex items-center gap-4 ${message.includes('Error') ? 'bg-accent-red/20' : 'bg-accent-gold/20'}`}>
          <div className={`w-4 h-4 rounded-full border-2 border-black ${message.includes('Error') ? 'bg-accent-red' : 'bg-accent-gold'}`}></div>
          <span className="font-black uppercase tracking-tight text-black">{message}</span>
        </div>
      )}
      
      {parentCreds && (
        <div className="p-8 mb-10 bg-accent-gold border-4 border-black rounded-3xl shadow-cartoon">
          <div className="flex items-center gap-3 mb-6 text-black font-black uppercase italic tracking-tight text-xl text-3d">
            <CheckCircle size={28} />
            <span>Parent Keys Ready! 🔑</span>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-accent-black p-4 rounded-2xl border-4 border-black shadow-cartoon-sm">
              <p className="text-xs text-accent-gold/60 uppercase font-black tracking-widest mb-2">Secret Username</p>
              <p className="font-mono font-black text-xl text-accent-gold select-all">{parentCreds.username}</p>
            </div>
            <div className="bg-accent-black p-4 rounded-2xl border-4 border-black shadow-cartoon-sm">
              <p className="text-xs text-accent-gold/60 uppercase font-black tracking-widest mb-2">Secret Password</p>
              <p className="font-mono font-black text-xl text-accent-gold select-all">{parentCreds.password}</p>
            </div>
          </div>
          <p className="text-sm mt-6 text-black font-bold italic leading-relaxed">
            🚀 Mission: Hand these secret keys to the parents so they can track their champion's progress!
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-lg font-black text-black uppercase tracking-tight text-3d">First Name</label>
            <input 
              type="text" 
              className="input-cartoon" 
              placeholder="e.g. John"
              value={formData.firstName}
              onChange={e => setFormData({...formData, firstName: e.target.value})}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-lg font-black text-black uppercase tracking-tight text-3d">Last Name</label>
            <input 
              type="text" 
              className="input-cartoon" 
              placeholder="e.g. Doe"
              value={formData.lastName}
              onChange={e => setFormData({...formData, lastName: e.target.value})}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-lg font-black text-black uppercase tracking-tight text-3d">Registration Number</label>
          <input 
            type="text" 
            className="input-cartoon" 
            placeholder="e.g. SCH-2024-001"
            value={formData.registrationNumber}
            onChange={e => setFormData({...formData, registrationNumber: e.target.value})}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-lg font-black text-black uppercase tracking-tight text-3d">Class</label>
          <select 
            className="input-cartoon appearance-none"
            value={formData.studentClass}
            onChange={e => setFormData({...formData, studentClass: e.target.value})}
            required
          >
            <option value="">Pick a Class...</option>
            <option value="Pre-Nursery">Pre-Nursery</option>
            <option value="Nursery 1">Nursery 1</option>
            <option value="Nursery 2">Nursery 2</option>
            <option value="Primary 1">Primary 1</option>
            <option value="Primary 2">Primary 2</option>
            <option value="Primary 3">Primary 3</option>
            <option value="Primary 4">Primary 4</option>
            <option value="Primary 5">Primary 5</option>
            <option value="Primary 6">Primary 6</option>
            <option value="JSS 1">JSS 1</option>
            <option value="JSS 2">JSS 2</option>
            <option value="JSS 3">JSS 3</option>
            <option value="SSS 1">SSS 1</option>
            <option value="SSS 2">SSS 2</option>
            <option value="SSS 3">SSS 3</option>
          </select>
        </div>

        <div className="space-y-4">
          <label className="text-lg font-black text-black uppercase tracking-tight block text-3d">Assign Subjects</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-60 overflow-y-auto p-4 border-4 border-black rounded-2xl bg-gray-50 shadow-inner">
            {subjects.map(subject => (
              <button
                key={subject.id}
                type="button"
                onClick={() => handleSubjectToggle(subject.id)}
                className={`p-3 rounded-xl border-2 font-bold text-xs transition-all ${
                  formData.subjectIds.includes(subject.id)
                    ? 'bg-accent-gold border-black shadow-cartoon-sm -translate-y-1 text-black'
                    : 'bg-white border-gray-200 text-gray-400 hover:border-black'
                }`}
              >
                {subject.name}
              </button>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full btn-cartoon-primary bg-accent-gold text-accent-black hover:bg-accent-black hover:text-accent-gold py-5 text-2xl flex items-center justify-center gap-3"
        >
          <UserPlus size={28} />
          Register Legend! 🚀
        </button>
      </form>
    </div>
  );
};

const RecordResults = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    subjectId: '',
    term: 'First',
    academicYear: '2025/2026',
    ca1Score: '',
    ca2Score: '',
    examScore: '',
    remark: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/students').then(res => setStudents(res.data));
  }, []);

  const handleStudentSelect = (id) => {
    const student = students.find(s => s.id === parseInt(id));
    setSelectedStudent(student);
    setSubjects(student?.Subjects || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/results', { ...formData, studentId: selectedStudent.id });
      setMessage('Result recorded successfully! 🏆');
      setFormData({ ...formData, ca1Score: '', ca2Score: '', examScore: '', remark: '' });
    } catch (err) {
      setMessage('Error recording result ❌');
    }
  };

  return (
    <div className="cartoon-card p-10 bg-white max-w-4xl">
      <h2 className="text-3xl font-black text-black mb-8 uppercase italic tracking-tighter text-3d">Record Achievement! 🏆</h2>
      
      {message && (
        <div className={`p-6 mb-8 border-4 border-black rounded-2xl flex items-center gap-4 ${message.includes('Error') ? 'bg-accent-pink/20' : 'bg-accent-green/20'}`}>
          <div className={`w-4 h-4 rounded-full border-2 border-black ${message.includes('Error') ? 'bg-accent-pink' : 'bg-accent-green'}`}></div>
          <span className="font-black uppercase tracking-tight text-black">{message}</span>
        </div>
      )}
      
      <div className="mb-10">
        <label className="text-lg font-black text-black uppercase tracking-tight block mb-3 text-3d">Select Champion</label>
        <select 
          className="input-cartoon appearance-none bg-accent-yellow/10"
          onChange={e => handleStudentSelect(e.target.value)}
        >
          <option value="">-- Who is the superstar? --</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.registrationNumber})</option>
          ))}
        </select>
      </div>

      {selectedStudent ? (
        <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="p-8 bg-accent-gold/10 border-4 border-black rounded-3xl flex items-center gap-6 shadow-cartoon-sm">
            <div className="w-20 h-20 bg-white border-4 border-black rounded-2xl flex items-center justify-center text-black font-black text-3xl shadow-cartoon-sm rotate-3">
              {selectedStudent.firstName.charAt(0)}
            </div>
            <div>
              <p className="text-3xl font-black text-black uppercase italic tracking-tighter text-3d mb-2">{selectedStudent.firstName} {selectedStudent.lastName}</p>
              <div className="flex items-center gap-3">
                <span className="bg-black text-white px-3 py-1 rounded-lg font-black uppercase text-xs tracking-widest">{selectedStudent.studentClass}</span>
                <span className="bg-white border-2 border-black text-black px-3 py-1 rounded-lg font-black uppercase text-xs tracking-widest">{selectedStudent.registrationNumber}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-lg font-black text-black uppercase tracking-tight text-3d">Subject</label>
              <select 
                className="input-cartoon appearance-none"
                value={formData.subjectId}
                onChange={e => setFormData({...formData, subjectId: e.target.value})}
                required
              >
                <option value="">Pick a Subject...</option>
                {subjects.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-lg font-black text-black uppercase tracking-tight text-3d">Term</label>
              <select 
                className="input-cartoon appearance-none"
                value={formData.term}
                onChange={e => setFormData({...formData, term: e.target.value})}
              >
                <option value="First">First Term</option>
                <option value="Second">Second Term</option>
                <option value="Third">Third Term</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-3">
              <label className="text-lg font-black text-black uppercase tracking-tight text-3d">1st CA (20)</label>
              <div className="relative">
                <input 
                  type="number" max="20"
                  className="input-cartoon text-2xl"
                  placeholder="0"
                  value={formData.ca1Score}
                  onChange={e => setFormData({...formData, ca1Score: parseFloat(e.target.value) || ''})}
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400 uppercase tracking-widest">Max 20</span>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-lg font-black text-black uppercase tracking-tight text-3d">2nd CA (20)</label>
              <div className="relative">
                <input 
                  type="number" max="20"
                  className="input-cartoon text-2xl"
                  placeholder="0"
                  value={formData.ca2Score}
                  onChange={e => setFormData({...formData, ca2Score: parseFloat(e.target.value) || ''})}
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400 uppercase tracking-widest">Max 20</span>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-lg font-black text-black uppercase tracking-tight text-3d">Exam (60)</label>
              <div className="relative">
                <input 
                  type="number" max="60"
                  className="input-cartoon text-2xl"
                  placeholder="0"
                  value={formData.examScore}
                  onChange={e => setFormData({...formData, examScore: parseFloat(e.target.value) || ''})}
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400 uppercase tracking-widest">Max 60</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-lg font-black text-black uppercase tracking-tight text-3d">Teacher's Note 📝</label>
            <textarea 
              className="input-cartoon h-32 resize-none py-4"
              placeholder="Write something awesome about their progress..."
              value={formData.remark}
              onChange={e => setFormData({...formData, remark: e.target.value})}
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full btn-cartoon-primary bg-accent-gold text-accent-black hover:bg-accent-black hover:text-accent-gold py-5 text-2xl flex items-center justify-center gap-3"
          >
            <CheckCircle size={28} />
            Lock in Results! 🏆
          </button>
        </form>
      ) : (
        <div className="py-20 border-4 border-dashed border-black rounded-3xl text-center bg-gray-50/50">
          <p className="font-black text-gray-400 uppercase tracking-widest text-xl">Select a superstar above to record their glory! ✨</p>
        </div>
      )}
    </div>
  );
};

const AttendanceManager = () => {
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/students').then(res => setStudents(res.data));
  }, []);

  const handleAttendance = async (studentId, status) => {
    try {
      await api.post('/attendance', {
        studentId,
        date: new Date().toISOString().split('T')[0],
        status
      });
      setMessage(`Marked ${status}! 📝`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error! ❌');
    }
  };

  return (
    <div className="cartoon-card p-10 bg-white">
      <div className="flex justify-between items-end mb-10 border-b-4 border-black pb-8">
        <div>
          <h2 className="text-4xl font-black text-black uppercase italic tracking-tighter text-3d mb-2">Daily Roll Call 📢</h2>
          <p className="text-xl font-black text-accent-red uppercase tracking-tight">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="w-16 h-16 bg-accent-gold border-4 border-black rounded-2xl flex items-center justify-center shadow-cartoon-sm -rotate-6">
          <Calendar size={32} className="text-black" />
        </div>
      </div>

      {message && (
        <div className="p-6 mb-8 bg-accent-gold/20 border-4 border-black rounded-2xl flex items-center gap-4 animate-in fade-in duration-300">
          <div className="w-4 h-4 bg-accent-gold border-2 border-black rounded-full animate-pulse"></div>
          <span className="font-black uppercase tracking-tight text-black">{message}</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b-4 border-black">
              <th className="py-6 font-black text-black uppercase tracking-widest text-sm">Superstar</th>
              <th className="py-6 font-black text-black uppercase tracking-widest text-sm">Class</th>
              <th className="py-6 font-black text-black uppercase tracking-widest text-sm text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black/10">
            {students.map(s => (
              <tr key={s.id} className="group hover:bg-accent-gold/5 transition-colors">
                <td className="py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white border-2 border-black rounded-xl flex items-center justify-center font-black text-black shadow-cartoon-sm group-hover:rotate-3 transition-transform">
                      {s.firstName.charAt(0)}
                    </div>
                    <span className="font-black text-xl text-black uppercase tracking-tight">{s.firstName} {s.lastName}</span>
                  </div>
                </td>
                <td className="py-6">
                  <span className="bg-black text-white px-3 py-1 rounded-lg font-black uppercase text-xs tracking-widest border-2 border-accent-gold">{s.studentClass}</span>
                </td>
                <td className="py-6">
                  <div className="flex items-center justify-center gap-3">
                    <button 
                      onClick={() => handleAttendance(s.id, 'Present')} 
                      className="px-6 py-2 bg-accent-gold border-2 border-black rounded-xl text-xs font-black uppercase tracking-widest text-black hover:shadow-cartoon-sm hover:-translate-y-1 active:translate-y-0 transition-all"
                    >
                      Here! 👋
                    </button>
                    <button 
                      onClick={() => handleAttendance(s.id, 'Absent')} 
                      className="px-6 py-2 bg-accent-red border-2 border-black rounded-xl text-xs font-black uppercase tracking-widest text-white hover:shadow-cartoon-sm hover:-translate-y-1 active:translate-y-0 transition-all"
                    >
                      Away 🛸
                    </button>
                    <button 
                      onClick={() => handleAttendance(s.id, 'Late')} 
                      className="px-6 py-2 bg-black border-2 border-accent-gold rounded-xl text-xs font-black uppercase tracking-widest text-accent-gold hover:shadow-cartoon-sm hover:-translate-y-1 active:translate-y-0 transition-all"
                    >
                      Tardy 🐢
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherDashboard;
