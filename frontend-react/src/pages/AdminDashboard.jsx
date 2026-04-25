import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { Users, BookOpen, LogOut, LayoutDashboard, Sparkles, GraduationCap, ClipboardCheck, UserCircle, UserPlus, CheckCircle, Eye, EyeOff, ChevronUp, Trash2, Edit3, Plus, X } from 'lucide-react';
import AcademicBackground from '../components/AcademicBackground';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeTab, setActiveTab] = useState('overview');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#fffbeb] dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
      <AcademicBackground />
      {/* Sidebar */}
      <div className="w-72 bg-white dark:bg-slate-900 border-r-4 border-black p-8 flex flex-col shadow-cartoon relative z-10 transition-colors">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-accent-gold border-4 border-black rounded-2xl flex items-center justify-center shadow-cartoon-sm transform -rotate-3">
            <LayoutDashboard size={24} className="text-black" />
          </div>
          <h2 className="text-2xl font-black tracking-tighter uppercase italic text-black dark:text-white text-3d">Admin <span className="text-accent-red">Hub</span></h2>
        </div>
        <nav className="flex-1 space-y-4">
          <Link to="/admin" className="flex items-center p-4 rounded-2xl border-4 border-transparent hover:border-black hover:bg-accent-gold/20 dark:hover:bg-accent-gold/10 transition-all group font-black uppercase tracking-tight dark:text-slate-300 dark:hover:text-white">
            <LayoutDashboard className="mr-3 text-black dark:text-slate-300" size={20} /> 
            <span>Control Room</span>
          </Link>
          <Link to="/admin/students" className="flex items-center p-4 rounded-2xl border-4 border-transparent hover:border-black hover:bg-accent-red/10 transition-all group font-black uppercase tracking-tight dark:text-slate-300 dark:hover:text-white">
            <Users className="mr-3 text-black dark:text-slate-300" size={20} /> 
            <span>The Squad</span>
          </Link>
          <Link to="/admin/subjects" className="flex items-center p-4 rounded-2xl border-4 border-transparent hover:border-black hover:bg-accent-gold/20 transition-all group font-black uppercase tracking-tight dark:text-slate-300 dark:hover:text-white">
            <BookOpen className="mr-3 text-black dark:text-slate-300" size={20} /> 
            <span>Knowledge</span>
          </Link>
          <Link to="/admin/teachers" className="flex items-center p-4 rounded-2xl border-4 border-transparent hover:border-black hover:bg-accent-red/10 transition-all group font-black uppercase tracking-tight dark:text-slate-300 dark:hover:text-white">
            <UserCircle className="mr-3 text-black dark:text-slate-300" size={20} /> 
            <span>Educators</span>
          </Link>
        </nav>
        
        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="flex items-center p-4 rounded-2xl border-4 border-black bg-accent-red shadow-cartoon-sm hover:-translate-y-1 transition-all group mt-auto"
        >
          <LogOut size={20} className="mr-3 text-white group-hover:rotate-12 transition-transform" />
          <span className="font-black text-white uppercase tracking-tight">Sign Out! 🚪</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-black dark:text-white tracking-tighter uppercase italic text-3d-lg">Hi, {user?.fullName?.split(' ')[0]}! 👋</h1>
            <p className="text-gray-600 dark:text-slate-400 mt-2 font-bold text-lg underline decoration-4 decoration-accent-gold">Ready to rule the academy today?</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xl font-black text-black dark:text-white uppercase tracking-tighter text-3d">{user?.fullName}</p>
              <p className="text-sm font-bold text-accent-red uppercase tracking-widest">{user?.role} Mode</p>
            </div>
            <div className="w-16 h-16 bg-white dark:bg-slate-800 border-4 border-black rounded-3xl flex items-center justify-center font-black text-2xl shadow-cartoon transform rotate-3 dark:text-white">
              {user?.fullName?.charAt(0)}
            </div>
          </div>
        </header>

        <main className="max-w-6xl">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/subjects" element={<SubjectList />} />
            <Route path="/teachers" element={<TeacherManagement />} />
          </Routes>
        </main>
      </div>

      {/* Scroller Button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 w-16 h-16 bg-accent-gold border-4 border-black rounded-2xl flex items-center justify-center shadow-cartoon hover:-translate-y-2 transition-all z-50 group"
        >
          <ChevronUp size={32} className="text-black group-hover:scale-125 transition-transform" />
        </button>
      )}
    </div>
  );
};

const AdminOverview = () => {
  const [stats, setStats] = useState({ studentCount: 0, teacherCount: 0, subjectCount: 0 });

  useEffect(() => {
    api.get('/stats').then(res => setStats(res.data)).catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="cartoon-card p-8 cartoon-card-hover group bg-accent-gold/20 dark:bg-accent-gold/10">
          <div className="w-14 h-14 bg-white dark:bg-slate-800 border-4 border-black rounded-2xl flex items-center justify-center mb-6 shadow-cartoon-sm group-hover:scale-110 transition-transform">
            <Users size={28} className="text-black dark:text-white" />
          </div>
          <h3 className="text-black dark:text-slate-300 uppercase text-sm font-black tracking-widest mb-2 italic">Total Legends</h3>
          <p className="text-6xl font-black text-black dark:text-white tracking-tighter text-3d-lg">{stats.studentCount}</p>
          <div className="mt-4 inline-flex items-center px-3 py-1 bg-white dark:bg-slate-800 border-2 border-black rounded-full text-xs font-black uppercase tracking-tighter dark:text-slate-300">
            Students ⚡
          </div>
        </div>

        <div className="cartoon-card p-8 cartoon-card-hover group bg-accent-red/20 dark:bg-accent-red/10">
          <div className="w-14 h-14 bg-white dark:bg-slate-800 border-4 border-black rounded-2xl flex items-center justify-center mb-6 shadow-cartoon-sm group-hover:scale-110 transition-transform">
            <BookOpen size={28} className="text-black dark:text-white" />
          </div>
          <h3 className="text-black dark:text-slate-300 uppercase text-sm font-black tracking-widest mb-2 italic">Knowledge Cubes</h3>
          <p className="text-6xl font-black text-black dark:text-white tracking-tighter text-3d-lg">{stats.subjectCount}</p>
          <div className="mt-4 inline-flex items-center px-3 py-1 bg-white dark:bg-slate-800 border-2 border-black rounded-full text-xs font-black uppercase tracking-tighter dark:text-slate-300">
            Subjects 📚
          </div>
        </div>

        <div className="cartoon-card p-8 cartoon-card-hover group bg-accent-gold/10 dark:bg-accent-gold/5">
          <div className="w-14 h-14 bg-white dark:bg-slate-800 border-4 border-black rounded-2xl flex items-center justify-center mb-6 shadow-cartoon-sm group-hover:scale-110 transition-transform">
            <Sparkles size={28} className="text-black dark:text-white" />
          </div>
          <h3 className="text-black dark:text-slate-300 uppercase text-sm font-black tracking-widest mb-2 italic">System Health</h3>
          <p className="text-6xl font-black text-black dark:text-white tracking-tighter text-3d-lg">100%</p>
          <div className="mt-4 inline-flex items-center px-3 py-1 bg-white dark:bg-slate-800 border-2 border-black rounded-full text-xs font-black uppercase tracking-tighter dark:text-slate-300">
            All Systems Go! 🚀
          </div>
        </div>
      </div>

      <div className="cartoon-card p-10 bg-white dark:bg-slate-900 border-4 border-black shadow-cartoon">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-accent-gold border-4 border-black rounded-2xl flex items-center justify-center shadow-cartoon-sm rotate-6">
            <ClipboardCheck size={24} className="text-black" />
          </div>
          <h3 className="text-3xl font-black text-black dark:text-white uppercase italic tracking-tighter text-3d">Quick Actions ⚡</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/admin/students" className="btn-cartoon-primary bg-accent-gold text-xl py-6 flex items-center justify-center gap-3">
            <Users size={24} />
            Manage the Squad
          </Link>
          <Link to="/admin/subjects" className="btn-cartoon-accent bg-accent-red text-xl py-6 flex items-center justify-center gap-3">
            <BookOpen size={24} />
            Update Knowledge
          </Link>
          <Link to="/admin/teachers" className="btn-cartoon-primary bg-accent-black text-accent-gold text-xl py-6 flex items-center justify-center gap-3">
            <UserCircle size={24} />
            Manage Educators
          </Link>
        </div>
      </div>
    </div>
  );
};

const StudentList = () => {
  const [students, setStudents] = useState([]);
  useEffect(() => {
    api.get('/students').then(res => setStudents(res.data));
  }, []);

  return (
    <div className="cartoon-card p-10 bg-white dark:bg-slate-900">
      <div className="flex justify-between items-end mb-10 border-b-4 border-black pb-8">
        <div>
          <h2 className="text-4xl font-black text-black dark:text-white uppercase italic tracking-tighter text-3d mb-2">The Squad Roster 📜</h2>
          <p className="text-xl font-black text-accent-red uppercase tracking-tight">Behold the future legends!</p>
        </div>
        <div className="w-16 h-16 bg-accent-gold border-4 border-black rounded-2xl flex items-center justify-center shadow-cartoon-sm -rotate-6">
          <GraduationCap size={32} className="text-black" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b-4 border-black">
              <th className="py-6 font-black text-black dark:text-slate-300 uppercase tracking-widest text-sm">ID Card</th>
              <th className="py-6 font-black text-black dark:text-slate-300 uppercase tracking-widest text-sm">Legend Name</th>
              <th className="py-6 font-black text-black dark:text-slate-300 uppercase tracking-widest text-sm">Squad/Class</th>
              <th className="py-6 font-black text-black dark:text-slate-300 uppercase tracking-widest text-sm text-right">Magic</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black/10">
            {students.map(s => (
              <tr key={s.id} className="group hover:bg-accent-red/5 transition-colors">
                <td className="py-6 font-mono font-black text-accent-red text-sm uppercase tracking-tighter">{s.registrationNumber}</td>
                <td className="py-6 font-black text-xl text-black dark:text-white uppercase tracking-tight">{s.firstName} {s.lastName}</td>
                <td className="py-6">
                  <span className="bg-black text-accent-gold px-3 py-1 rounded-lg font-black uppercase text-xs tracking-widest border-2 border-accent-gold">
                    {s.studentClass}
                  </span>
                </td>
                <td className="py-6 text-right">
                  <button className="bg-white dark:bg-slate-800 dark:text-white border-2 border-black px-4 py-2 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-accent-gold hover:text-black hover:shadow-cartoon-sm transition-all">
                    Edit ✨
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', category: 'Primary', level: 'General' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = () => {
    api.get('/students/subjects').then(res => setSubjects(res.data));
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/students/subjects', newSubject);
      setMessage('Subject added to the vault! 📚');
      setNewSubject({ name: '', category: 'Primary', level: 'General' });
      setShowAddModal(false);
      fetchSubjects();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error adding subject');
    }
  };

  return (
    <div className="cartoon-card p-10 bg-white dark:bg-slate-900">
      <div className="flex justify-between items-end mb-10 border-b-4 border-black pb-8">
        <div>
          <h2 className="text-4xl font-black text-black dark:text-white uppercase italic tracking-tighter text-3d mb-2">Knowledge Vault 📚</h2>
          <p className="text-xl font-black text-accent-gold uppercase tracking-tight">The secret formulas of wisdom!</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-16 h-16 bg-accent-gold border-4 border-black rounded-2xl flex items-center justify-center shadow-cartoon-sm hover:-translate-y-1 transition-all group"
          >
            <Plus size={32} className="text-black group-hover:scale-110 transition-transform" />
          </button>
          <div className="w-16 h-16 bg-accent-red border-4 border-black rounded-2xl flex items-center justify-center shadow-cartoon-sm rotate-6">
            <BookOpen size={32} className="text-black" />
          </div>
        </div>
      </div>

      {message && (
        <div className="p-4 mb-8 bg-accent-gold/20 border-4 border-black rounded-2xl font-black uppercase tracking-tight text-black dark:text-white flex items-center gap-3">
          <Sparkles size={20} className="text-accent-gold" />
          {message}
        </div>
      )}

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="cartoon-card bg-white dark:bg-slate-900 p-8 w-full max-w-md relative border-4 border-black shadow-cartoon">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-black dark:text-white hover:rotate-90 transition-transform"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-black text-black dark:text-white uppercase italic tracking-tighter mb-6">New Wisdom Cube 🧪</h3>
            <form onSubmit={handleAddSubject} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-black dark:text-slate-300 uppercase tracking-widest">Subject Name</label>
                <input 
                  type="text"
                  required
                  className="input-cartoon w-full"
                  placeholder="e.g. Quantum Physics"
                  value={newSubject.name}
                  onChange={e => setNewSubject({...newSubject, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-black dark:text-slate-300 uppercase tracking-widest">Category</label>
                <select 
                  className="input-cartoon w-full"
                  value={newSubject.category}
                  onChange={e => setNewSubject({...newSubject, category: e.target.value})}
                >
                  <option value="Nursery">Nursery</option>
                  <option value="Primary">Primary</option>
                  <option value="Secondary">Secondary</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-black dark:text-slate-300 uppercase tracking-widest">Level</label>
                <select 
                  className="input-cartoon w-full"
                  value={newSubject.level}
                  onChange={e => setNewSubject({...newSubject, level: e.target.value})}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="General">General</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>
              <button type="submit" className="btn-cartoon-primary w-full py-4 text-lg">
                Add to Vault! 🚀
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {subjects.map(sub => (
          <div key={sub.id} className="cartoon-card p-8 bg-white dark:bg-slate-800 border-4 border-black shadow-cartoon-sm hover:-translate-y-2 transition-transform group cursor-pointer">
            <div className="w-14 h-14 bg-accent-gold/10 dark:bg-accent-gold/5 border-4 border-black rounded-2xl mb-6 flex items-center justify-center group-hover:bg-accent-gold transition-colors">
              <BookOpen size={28} className="text-black dark:text-white" />
            </div>
            <h4 className="text-2xl font-black text-black dark:text-white uppercase italic tracking-tighter text-3d mb-4">{sub.name}</h4>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-black text-white px-3 py-1 rounded-lg font-black uppercase text-[10px] tracking-widest border border-white/20">{sub.category}</span>
              <span className="bg-accent-gold border-2 border-black px-3 py-1 rounded-lg font-black uppercase text-[10px] tracking-widest">{sub.level}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    isFormTeacher: false, 
    isSubjectTeacher: true,
    assignedClass: '',
    assignedSubject: ''
  });
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [message, setMessage] = useState('');
  const [creds, setCreds] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const classes = [
    'Pre-Nursery', 'Nursery 1', 'Nursery 2', 
    'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
    'JSS 1', 'JSS 2', 'JSS 3',
    'SSS 1', 'SSS 2', 'SSS 3'
  ];

  useEffect(() => {
    fetchTeachers();
    fetchSubjects();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await api.get('/teachers');
      setTeachers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/students/subjects');
      setSubjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.isFormTeacher && !formData.isSubjectTeacher) {
      setMessage('Error: Teacher must be at least a Form Teacher or Subject Teacher!');
      return;
    }
    try {
      const res = await api.post('/teachers/register', formData);
      setMessage('Teacher registered successfully!');
      setCreds(res.data.credentials);
      setFormData({ 
        fullName: '', 
        email: '', 
        isFormTeacher: false, 
        isSubjectTeacher: true,
        assignedClass: '',
        assignedSubject: ''
      });
      fetchTeachers();
    } catch (err) {
      setMessage('Error registering teacher');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to eject this educator from the academy? 🚀')) return;
    try {
      await api.delete(`/teachers/${id}`);
      setMessage('Educator ejected successfully! 👋');
      fetchTeachers();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error deleting teacher');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/teachers/${editingTeacher.id}`, editingTeacher);
      setMessage('Educator profile updated! ✨');
      setEditingTeacher(null);
      fetchTeachers();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error updating teacher');
    }
  };

  return (
    <div className="space-y-10">
      <div className="cartoon-card p-10 bg-white dark:bg-slate-900">
        <h2 className="text-3xl font-black text-black dark:text-white mb-8 uppercase italic tracking-tighter text-3d">Hire New Educator! 🍎</h2>
        
        {message && (
          <div className={`p-6 mb-8 border-4 border-black rounded-2xl flex items-center gap-4 ${message.includes('Error') ? 'bg-accent-red/20' : 'bg-accent-gold/20'}`}>
            <div className={`w-4 h-4 rounded-full border-2 border-black ${message.includes('Error') ? 'bg-accent-red' : 'bg-accent-gold'}`}></div>
            <span className="font-black uppercase tracking-tight text-black dark:text-white">{message}</span>
          </div>
        )}

        {creds && (
          <div className="p-8 mb-10 bg-accent-gold border-4 border-black rounded-3xl shadow-cartoon">
            <div className="flex items-center gap-3 mb-6 text-black font-black uppercase italic tracking-tight text-xl text-3d">
              <CheckCircle size={28} />
              <span>Teacher Keys Generated! 🔑</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black p-4 rounded-2xl border-4 border-black shadow-cartoon-sm">
                <p className="text-xs text-accent-gold/60 uppercase font-black tracking-widest mb-2">Login Username</p>
                <p className="font-mono font-black text-xl text-accent-gold select-all">{creds.username}</p>
              </div>
              <div className="bg-black p-4 rounded-2xl border-4 border-black shadow-cartoon-sm relative">
                <p className="text-xs text-accent-gold/60 uppercase font-black tracking-widest mb-2">Login Password</p>
                <div className="flex items-center justify-between">
                  <p className="font-mono font-black text-xl text-accent-gold select-all">
                    {showPassword ? creds.password : '••••••••'}
                  </p>
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-accent-gold hover:text-white transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>
            <p className="text-sm mt-6 text-black font-bold italic">🚀 Mission: Share these keys with the new educator immediately!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-lg font-black text-black dark:text-slate-300 uppercase tracking-tight text-3d">Full Name</label>
            <input 
              type="text" 
              className="input-cartoon w-full" 
              placeholder="e.g. Professor X"
              value={formData.fullName}
              onChange={e => setFormData({...formData, fullName: e.target.value})}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-lg font-black text-black dark:text-slate-300 uppercase tracking-tight text-3d">Email Address</label>
            <input 
              type="email" 
              className="input-cartoon w-full" 
              placeholder="e.g. pro@academy.com"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-lg font-black text-black dark:text-slate-300 uppercase tracking-tight text-3d">Assign Class (Optional)</label>
            <select 
              className="input-cartoon w-full"
              value={formData.assignedClass}
              onChange={e => setFormData({...formData, assignedClass: e.target.value})}
            >
              <option value="">Select a Class</option>
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-lg font-black text-black dark:text-slate-300 uppercase tracking-tight text-3d">Assign Subject (Optional)</label>
            <select 
              className="input-cartoon w-full"
              value={formData.assignedSubject}
              onChange={e => setFormData({...formData, assignedSubject: e.target.value})}
            >
              <option value="">Select a Subject</option>
              {subjects.map(s => <option key={s.id} value={s.name}>{s.name} ({s.level})</option>)}
            </select>
          </div>
          
          <div className="md:col-span-2 flex flex-wrap gap-6 mt-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={formData.isFormTeacher}
                  onChange={e => setFormData({...formData, isFormTeacher: e.target.checked})}
                />
                <div className="w-14 h-8 bg-gray-200 border-4 border-black rounded-full peer peer-checked:bg-accent-gold transition-all"></div>
                <div className="absolute left-1 top-1 w-6 h-6 bg-white border-2 border-black rounded-full transition-all peer-checked:translate-x-6"></div>
              </div>
              <span className="font-black uppercase tracking-tight text-black dark:text-slate-300 text-sm group-hover:text-accent-red transition-colors">Form Teacher</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={formData.isSubjectTeacher}
                  onChange={e => setFormData({...formData, isSubjectTeacher: e.target.checked})}
                />
                <div className="w-14 h-8 bg-gray-200 border-4 border-black rounded-full peer peer-checked:bg-accent-red transition-all"></div>
                <div className="absolute left-1 top-1 w-6 h-6 bg-white border-2 border-black rounded-full transition-all peer-checked:translate-x-6"></div>
              </div>
              <span className="font-black uppercase tracking-tight text-black dark:text-slate-300 text-sm group-hover:text-accent-gold transition-colors">Subject Teacher</span>
            </label>
          </div>

          <button 
            type="submit" 
            className="md:col-span-2 btn-cartoon-primary bg-accent-gold text-accent-black py-5 text-2xl flex items-center justify-center gap-3"
          >
            <UserPlus size={28} />
            Onboard Teacher! 🚀
          </button>
        </form>
      </div>

      <div className="cartoon-card p-10 bg-white dark:bg-slate-900">
        <h2 className="text-3xl font-black text-black dark:text-white mb-8 uppercase italic tracking-tighter text-3d">The Educators Squad 🎓</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b-4 border-black">
                  <th className="py-6 font-black text-black dark:text-slate-300 uppercase tracking-widest text-sm">Full Name</th>
                  <th className="py-6 font-black text-black dark:text-slate-300 uppercase tracking-widest text-sm">Username</th>
                  <th className="py-6 font-black text-black dark:text-slate-300 uppercase tracking-widest text-sm text-center">Roles</th>
                  <th className="py-6 font-black text-black dark:text-slate-300 uppercase tracking-widest text-sm text-center">Assignment</th>
                  <th className="py-6 font-black text-black dark:text-slate-300 uppercase tracking-widest text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/10">
                {teachers.map(t => (
                  <tr key={t.id} className="group hover:bg-accent-gold/5 transition-colors">
                    <td className="py-6 font-black text-lg text-black dark:text-white uppercase tracking-tight italic">{t.fullName}</td>
                    <td className="py-6 font-mono font-black text-accent-red text-sm uppercase">{t.username}</td>
                    <td className="py-6">
                      <div className="flex flex-wrap justify-center gap-2">
                        {t.isFormTeacher && (
                          <span className="bg-accent-gold text-black border-2 border-black px-2 py-1 rounded-lg font-black uppercase text-[10px] tracking-tighter">Form</span>
                        )}
                        {t.isSubjectTeacher && (
                          <span className="bg-accent-red text-white border-2 border-black px-2 py-1 rounded-lg font-black uppercase text-[10px] tracking-tighter">Subject</span>
                        )}
                      </div>
                    </td>
                    <td className="py-6 text-center">
                      <div className="flex flex-col items-center gap-1">
                        {t.assignedClass && (
                          <span className="bg-black text-accent-gold px-2 py-0.5 rounded-md font-black uppercase text-[10px] tracking-widest border border-accent-gold">
                            {t.assignedClass}
                          </span>
                        )}
                        {t.assignedSubject && (
                          <span className="bg-white dark:bg-slate-800 text-black dark:text-white px-2 py-0.5 rounded-md font-black uppercase text-[10px] tracking-widest border border-black">
                            {t.assignedSubject}
                          </span>
                        )}
                        {!t.assignedClass && !t.assignedSubject && (
                          <span className="text-gray-400 font-black uppercase text-[10px] tracking-widest italic">Not Assigned</span>
                        )}
                      </div>
                    </td>
                    <td className="py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setEditingTeacher(t)}
                          className="p-2 bg-accent-gold border-2 border-black rounded-xl hover:-translate-y-1 transition-all"
                        >
                          <Edit3 size={18} className="text-black" />
                        </button>
                        <button 
                          onClick={() => handleDelete(t.id)}
                          className="p-2 bg-accent-red border-2 border-black rounded-xl hover:-translate-y-1 transition-all"
                        >
                          <Trash2 size={18} className="text-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
          </table>
        </div>
      </div>

      {/* Edit Teacher Modal */}
      {editingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="cartoon-card bg-white dark:bg-slate-900 p-8 w-full max-w-2xl relative border-4 border-black shadow-cartoon">
            <button 
              onClick={() => setEditingTeacher(null)}
              className="absolute top-4 right-4 text-black dark:text-white hover:rotate-90 transition-transform"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-black text-black dark:text-white uppercase italic tracking-tighter mb-6">Modify Educator 🛠️</h3>
            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-black dark:text-slate-300 uppercase tracking-widest">Full Name</label>
                <input 
                  type="text"
                  required
                  className="input-cartoon w-full"
                  value={editingTeacher.fullName}
                  onChange={e => setEditingTeacher({...editingTeacher, fullName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-black dark:text-slate-300 uppercase tracking-widest">Email Address</label>
                <input 
                  type="email"
                  required
                  className="input-cartoon w-full"
                  value={editingTeacher.email}
                  onChange={e => setEditingTeacher({...editingTeacher, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-black dark:text-slate-300 uppercase tracking-widest">Assign Class</label>
                <select 
                  className="input-cartoon w-full"
                  value={editingTeacher.assignedClass || ''}
                  onChange={e => setEditingTeacher({...editingTeacher, assignedClass: e.target.value})}
                >
                  <option value="">None</option>
                  {classes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-black dark:text-slate-300 uppercase tracking-widest">Assign Subject</label>
                <select 
                  className="input-cartoon w-full"
                  value={editingTeacher.assignedSubject || ''}
                  onChange={e => setEditingTeacher({...editingTeacher, assignedSubject: e.target.value})}
                >
                  <option value="">None</option>
                  {subjects.map(s => <option key={s.id} value={s.name}>{s.name} ({s.level})</option>)}
                </select>
              </div>
              <div className="md:col-span-2 flex gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-6 h-6 border-4 border-black rounded-lg checked:bg-accent-gold"
                    checked={editingTeacher.isFormTeacher}
                    onChange={e => setEditingTeacher({...editingTeacher, isFormTeacher: e.target.checked})}
                  />
                  <span className="font-black uppercase tracking-tight text-black dark:text-slate-300">Form Teacher</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-6 h-6 border-4 border-black rounded-lg checked:bg-accent-red"
                    checked={editingTeacher.isSubjectTeacher}
                    onChange={e => setEditingTeacher({...editingTeacher, isSubjectTeacher: e.target.checked})}
                  />
                  <span className="font-black uppercase tracking-tight text-black dark:text-slate-300">Subject Teacher</span>
                </label>
              </div>
              <button type="submit" className="btn-cartoon-primary md:col-span-2 py-4 text-lg">
                Save Changes ✨
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
