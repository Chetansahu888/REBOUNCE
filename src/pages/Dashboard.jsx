import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabase';
import AntiGravityBackground from '../components/AntiGravityBackground';
import toast from 'react-hot-toast';
import { isToday } from 'date-fns';
import { FileText, Search, Filter } from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';
import StatsGrid from '../components/StatsGrid';
import DashboardFilters from '../components/DashboardFilters';
import { SubmissionRow, SubmissionCard } from '../components/SubmissionItems';

const Dashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  const [filters, setFilters] = useState({
    name: 'ALL',
    mobile: 'ALL',
    email: 'ALL',
    gender: 'ALL',
    dateSort: 'newest'
  });

  const navigate = useNavigate();

  useEffect(() => {
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
        .or('is_admin.is.null,is_admin.eq.false')
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

  const stats = useMemo(() => {
    const total = submissions.length;
    const today = submissions.filter(s => isToday(new Date(s.submitted_at))).length;
    const male = submissions.filter(s => s.gender === 'Male').length;
    const female = submissions.filter(s => s.gender === 'Female').length;
    
    return { total, today, male, female };
  }, [submissions]);

  const uniqueValues = useMemo(() => ({
    names: [...new Set(submissions.map(s => s.full_name))].sort(),
    mobiles: [...new Set(submissions.map(s => s.mobile))].sort(),
    emails: [...new Set(submissions.map(s => s.email).filter(Boolean))].sort()
  }), [submissions]);

  const filteredSubmissions = useMemo(() => {
    return submissions
      .filter(s => {
        const matchesName = filters.name === 'ALL' || s.full_name === filters.name;
        const matchesMobile = filters.mobile === 'ALL' || s.mobile === filters.mobile;
        const matchesEmail = filters.email === 'ALL' || s.email === filters.email;
        const matchesGender = filters.gender === 'ALL' || s.gender === filters.gender;
        const matchesSearch = !searchTerm || 
          s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.mobile.includes(searchTerm) ||
          (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase()));
        
        return matchesName && matchesMobile && matchesEmail && matchesGender && matchesSearch;
      })
      .sort((a, b) => {
        const dateA = new Date(a.submitted_at);
        const dateB = new Date(b.submitted_at);
        return filters.dateSort === 'newest' ? dateB - dateA : dateA - dateB;
      });
  }, [submissions, filters, searchTerm]);

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
    <div className="h-screen h-[100dvh] w-full relative bg-[#F8FAFC] font-montserrat overflow-hidden">
      <AntiGravityBackground />
      
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full z-50">
        <DashboardNavbar 
          user={user} 
          onLogout={handleLogout} 
          onSettings={() => navigate('/settings')} 
        />
      </div>
      
      {/* Scrollable Content */}
      <main className="h-full pt-20 pb-24 px-4 md:px-8 max-w-7xl mx-auto w-full overflow-y-auto scrollbar-custom relative z-10">
        <div className="py-6">
          <StatsGrid stats={stats} />

          <DashboardFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
            onRefresh={fetchSubmissions}
            filters={filters}
            setFilters={setFilters}
            uniqueValues={uniqueValues}
          />
          
          <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-2xl overflow-hidden">
            <div className="p-5 md:p-6 border-b border-slate-100 bg-white/40 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                <FileText size={18} />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-base uppercase tracking-tight leading-none">Waiver Submissions</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Total Records: {filteredSubmissions.length}</p>
              </div>
            </div>
            {/* Desktop Table View */}
            <div className="p-4 md:p-6">
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <th className="px-4 py-2 text-left">Participant</th>
                      <th className="px-4 py-2 text-left">Mobile</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">DOB / Gender</th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="py-20 text-center">
                          <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading records...</p>
                        </td>
                      </tr>
                    ) : filteredSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                          No results found
                        </td>
                      </tr>
                    ) : (
                      filteredSubmissions.map((item, idx) => (
                        <SubmissionRow 
                          key={item.id} 
                          item={item} 
                          idx={idx} 
                          onDownload={downloadWaiver} 
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {loading ? (
                   <div className="py-20 text-center">
                     <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                   </div>
                ) : filteredSubmissions.length === 0 ? (
                   <div className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                     No results found
                   </div>
                ) : (
                  filteredSubmissions.map((item, idx) => (
                    <SubmissionCard 
                      key={item.id} 
                      item={item} 
                      idx={idx} 
                      onDownload={downloadWaiver} 
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Footer Section */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-t border-slate-100 py-5 px-4 flex justify-center items-center pb-[calc(env(safe-area-inset-bottom)+12px)] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)]">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
          Powered by <span className="text-[#FF1493]">Botivate</span>
        </p>
      </footer>

      <style jsx="true">{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');
        
        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }

        /* Custom Scrollbar */
        .scrollbar-custom::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .scrollbar-custom::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: rgba(255, 20, 147, 0.1);
          border-radius: 10px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 20, 147, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
