import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { LogOut, FileText, Download, User, Calendar, Phone, Mail, RotateCcw, FilterX } from 'lucide-react';
import AntiGravityBackground from '../components/AntiGravityBackground';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Dashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nameFilter, setNameFilter] = useState('ALL');
  const [mobileFilter, setMobileFilter] = useState('ALL');
  const [emailFilter, setEmailFilter] = useState('ALL');
  const [genderFilter, setGenderFilter] = useState('ALL');
  const [dateSort, setDateSort] = useState('newest');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const loggedUser = sessionStorage.getItem('user');
    if (!loggedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(loggedUser));
    fetchSubmissions();
  }, [navigate]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  // Get unique values for dropdowns
  const uniqueNames = [...new Set(submissions.map(s => s.full_name))].sort();
  const uniqueMobiles = [...new Set(submissions.map(s => s.mobile))].sort();
  const uniqueEmails = [...new Set(submissions.map(s => s.email).filter(Boolean))].sort();
  const uniqueGenders = [...new Set(submissions.map(s => s.gender).filter(Boolean))].sort();

  const filteredSubmissions = submissions
    .filter(s => {
      const matchesName = nameFilter === 'ALL' || s.full_name === nameFilter;
      const matchesMobile = mobileFilter === 'ALL' || s.mobile === mobileFilter;
      const matchesEmail = emailFilter === 'ALL' || s.email === emailFilter;
      const matchesGender = genderFilter === 'ALL' || s.gender === genderFilter;
      
      return matchesName && matchesMobile && matchesEmail && matchesGender;
    })
    .sort((a, b) => {
      const dateA = new Date(a.submitted_at);
      const dateB = new Date(b.submitted_at);
      return dateSort === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const downloadWaiver = async (url, name) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${name.replace(/\s+/g, '_')}_Waiver.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-slate-50">
      <AntiGravityBackground />
      
      {/* Navigation Header */}
      <nav className="relative z-20 bg-white/40 backdrop-blur-md border-b border-white/60 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF1493] rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase">
            Rebounce <span className="text-[#FF1493]">Dashboard</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Logged in as</p>
            <p className="text-sm font-black text-slate-800">{user?.full_name}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-3 bg-white/60 hover:bg-red-50 text-red-500 rounded-2xl transition-all border border-white/60 shadow-sm hover:shadow-md active:scale-95"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="relative z-10 p-6 max-w-7xl mx-auto pb-24">
        {/* Filters Summary */}
        <div className="glass-card p-6 rounded-[2.5rem] border border-white/60 shadow-xl mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Filter by Name</p>
              <select 
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="w-full bg-white/40 border border-white/60 rounded-xl px-4 py-3 outline-none focus:border-[#FF1493] text-[11px] font-bold uppercase tracking-wider text-slate-700 appearance-none cursor-pointer shadow-inner backdrop-blur-sm"
              >
                <option value="ALL">ALL NAMES</option>
                {uniqueNames.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
            </div>

            <div className="flex-1 min-w-[150px]">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Filter by Mobile</p>
              <select 
                value={mobileFilter}
                onChange={(e) => setMobileFilter(e.target.value)}
                className="w-full bg-white/40 border border-white/60 rounded-xl px-4 py-3 outline-none focus:border-[#FF1493] text-[11px] font-bold uppercase tracking-wider text-slate-700 appearance-none cursor-pointer shadow-inner backdrop-blur-sm"
              >
                <option value="ALL">ALL MOBILES</option>
                {uniqueMobiles.map(mob => <option key={mob} value={mob}>{mob}</option>)}
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Filter by Email</p>
              <select 
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
                className="w-full bg-white/40 border border-white/60 rounded-xl px-4 py-3 outline-none focus:border-[#FF1493] text-[11px] font-bold uppercase tracking-wider text-slate-700 appearance-none cursor-pointer shadow-inner backdrop-blur-sm"
              >
                <option value="ALL">ALL EMAILS</option>
                {uniqueEmails.map(email => <option key={email} value={email}>{email}</option>)}
              </select>
            </div>

            <div className="flex-1 min-w-[120px]">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Gender</p>
              <select 
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="w-full bg-white/40 border border-white/60 rounded-xl px-4 py-3 outline-none focus:border-[#FF1493] text-[11px] font-bold uppercase tracking-wider text-slate-700 appearance-none cursor-pointer shadow-inner backdrop-blur-sm"
              >
                <option value="ALL">ALL GENDERS</option>
                {uniqueGenders.map(g => <option key={g} value={g}>{g.toUpperCase()}</option>)}
              </select>
            </div>

            <div className="flex items-end h-full">
              <button 
                onClick={() => {
                  setNameFilter('ALL');
                  setMobileFilter('ALL');
                  setEmailFilter('ALL');
                  setGenderFilter('ALL');
                }}
                className="p-3 bg-slate-800 text-white rounded-xl hover:bg-[#FF1493] transition-all shadow-lg active:scale-95 flex items-center justify-center"
                title="Reset Filters"
              >
                <FilterX size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="glass-card rounded-[2.5rem] border border-white/60 shadow-2xl overflow-hidden backdrop-blur-xl">
          <div className="p-6 border-b border-white/60 bg-white/20 flex justify-between items-center">
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Recent Submissions</h3>
            <button 
              onClick={fetchSubmissions}
              className="text-xs font-bold text-[#FF1493] uppercase tracking-widest hover:underline"
            >
              Refresh Data
            </button>
          </div>
          
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/5 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
                  <th className="px-6 py-4">Participant</th>
                  <th className="px-6 py-4">Mobile</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Gender</th>
                  <th className="px-6 py-4">DOB</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-center">Waiver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/40">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-20 text-center">
                      <div className="inline-block w-8 h-8 border-4 border-[#FF1493] border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-4 text-slate-500 font-bold uppercase text-xs tracking-widest">Loading Submissions...</p>
                    </td>
                  </tr>
                ) : filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-20 text-center text-slate-400">
                      No results matching these filters.
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((item) => (
                    <tr key={item.id} className="hover:bg-white/30 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF1493]/20 to-[#00B0FF]/20 flex items-center justify-center text-[#FF1493] font-black text-xs border border-white">
                            {item.full_name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-slate-800 text-sm">{item.full_name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone size={14} className="text-[#00B0FF]" />
                          <span className="text-xs font-bold text-slate-800">{item.mobile}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail size={14} className="text-[#FF1493]" />
                          <span className="text-xs font-medium text-slate-600 truncate max-w-[180px]">{item.email || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          item.gender === 'Male' ? 'bg-blue-50 text-blue-500 border-blue-100' :
                          item.gender === 'Female' ? 'bg-pink-50 text-pink-500 border-pink-100' :
                          'bg-slate-50 text-slate-500 border-slate-100'
                        }`}>
                          {item.gender || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar size={12} />
                          <span className="text-xs font-medium">
                            {item.dob ? format(new Date(item.dob), 'MMM d, yyyy') : 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-xs font-bold text-slate-800">
                          {format(new Date(item.submitted_at), 'dd/MM/yyyy')}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {format(new Date(item.submitted_at), 'HH:mm a')}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-2">
                          {item.pdf_url && (
                            <button 
                              onClick={() => downloadWaiver(item.pdf_url, item.full_name)}
                              className="p-2 bg-white/60 hover:bg-[#FF1493] hover:text-white text-[#FF1493] rounded-xl transition-all border border-white/60 shadow-sm"
                              title="Download Waiver"
                            >
                              <Download size={16} />
                            </button>
                          )}
                          {item.signature && (
                            <div className="p-1 bg-white/60 rounded-lg border border-white/60 shadow-sm h-10 w-16 flex items-center justify-center overflow-hidden">
                               <img src={item.signature} alt="Sig" className="max-h-full max-w-full object-contain opacity-70" />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-6 left-0 w-full z-30 pointer-events-none">
        <div className="max-w-7xl mx-auto px-6 flex justify-center">
          <div className="bg-white/40 backdrop-blur-md border border-white/60 px-6 py-2 rounded-full shadow-lg pointer-events-auto">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
              Powered by <span className="text-[#FF1493] font-black">Botivate</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
