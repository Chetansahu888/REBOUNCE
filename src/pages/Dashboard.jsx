import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabase';
import AntiGravityBackground from '../components/AntiGravityBackground';
import toast from 'react-hot-toast';
import { startOfDay, endOfDay, format } from 'date-fns';
import { FileText, Search, Filter, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import DashboardNavbar from '../components/DashboardNavbar';
import StatsGrid from '../components/StatsGrid';
import DashboardFilters from '../components/DashboardFilters';
import { SubmissionRow, SubmissionCard } from '../components/SubmissionItems';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const Dashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [stats, setStats] = useState({ total: 0, today: 0, male: 0, female: 0 });
  const [uniqueValues, setUniqueValues] = useState({ names: [], mobiles: [], emails: [] });

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
    fetchStats();
  }, [navigate]);

  // Re-fetch filter dropdown options whenever the gender filter changes
  useEffect(() => {
    fetchFilterOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.gender]);

  // Debounce the search box so every keystroke doesn't hit the database
  useEffect(() => {
    const timer = setTimeout(() => setSearchTerm(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Any change to filters/search/page size should jump back to page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchTerm, itemsPerPage]);

  useEffect(() => {
    fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, searchTerm, currentPage, itemsPerPage]);

  const buildFilteredQuery = (query) => {
    if (filters.name !== 'ALL') query = query.eq('full_name', filters.name);
    if (filters.mobile !== 'ALL') query = query.eq('mobile', filters.mobile);
    if (filters.email !== 'ALL') query = query.eq('email', filters.email);
    if (filters.gender !== 'ALL') query = query.eq('gender', filters.gender);

    const term = searchTerm.trim().replace(/[,()%]/g, '');
    if (term) {
      query = query.or(`full_name.ilike.%${term}%,mobile.ilike.%${term}%,email.ilike.%${term}%`);
    }

    return query;
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let query = supabase.from('submissions').select('*', { count: 'exact' });
      query = buildFilteredQuery(query);
      query = query.order('submitted_at', { ascending: filters.dateSort === 'oldest' }).range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;
      setSubmissions(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const todayStart = startOfDay(new Date()).toISOString();
      const todayEnd = endOfDay(new Date()).toISOString();

      const [totalRes, todayRes, maleRes, femaleRes] = await Promise.all([
        supabase.from('submissions').select('id', { count: 'exact', head: true }),
        supabase.from('submissions').select('id', { count: 'exact', head: true })
          .gte('submitted_at', todayStart).lte('submitted_at', todayEnd),
        supabase.from('submissions').select('id', { count: 'exact', head: true }).eq('gender', 'Male'),
        supabase.from('submissions').select('id', { count: 'exact', head: true }).eq('gender', 'Female'),
      ]);

      setStats({
        total: totalRes.count || 0,
        today: todayRes.count || 0,
        male: maleRes.count || 0,
        female: femaleRes.count || 0,
      });
    } catch (error) {
      console.error('Stats fetch error:', error);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      let query = supabase.from('submissions').select('full_name, mobile, email');
      
      // If a gender is selected, only fetch names/mobiles/emails for that gender
      if (filters.gender !== 'ALL') {
        query = query.eq('gender', filters.gender);
      }
      
      const { data, error } = await query;
      if (error) throw error;

      setUniqueValues({
        names: [...new Set((data || []).map(s => s.full_name))].sort(),
        mobiles: [...new Set((data || []).map(s => s.mobile))].sort(),
        emails: [...new Set((data || []).map(s => s.email).filter(Boolean))].sort()
      });
    } catch (error) {
      console.error('Filter options fetch error:', error);
    }
  };

  const handleRefresh = () => {
    fetchSubmissions();
    fetchStats();
    fetchFilterOptions();
  };

  const exportToExcel = async () => {
    try {
      setIsExporting(true);
      toast.loading('Preparing Excel file...', { id: 'export-toast' });
      
      let allData = [];
      let page = 0;
      const pageSize = 1000;
      let hasMore = true;

      while (hasMore) {
        let query = supabase.from('submissions').select('*');
        query = buildFilteredQuery(query);
        query = query.order('submitted_at', { ascending: filters.dateSort === 'oldest' })
                     .range(page * pageSize, (page + 1) * pageSize - 1);
        
        const { data, error } = await query;
        if (error) throw error;
        
        if (data && data.length > 0) {
          allData = [...allData, ...data];
          if (data.length < pageSize) {
            hasMore = false;
          } else {
            page++;
          }
        } else {
          hasMore = false;
        }
      }
      
      if (allData.length === 0) {
         toast.error('No data to export', { id: 'export-toast' });
         return;
      }
      
      // Format data for Excel
      const exportData = allData.map(item => ({
        'Full Name': item.full_name || '',
        'Mobile': item.mobile || '',
        'Email': item.email || '',
        'Gender': item.gender || '',
        'DOB': item.dob ? format(new Date(item.dob), 'dd/MM/yyyy') : '',
        'Date Submitted': item.submitted_at ? format(new Date(item.submitted_at), 'dd/MM/yyyy HH:mm:ss') : '',
        'Has Signature': item.signature ? 'Yes' : 'No'
      }));
      
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions');
      
      XLSX.writeFile(workbook, `Waiver_Submissions_${format(new Date(), 'dd_MM_yyyy')}.xlsx`);
      toast.success('Exported successfully!', { id: 'export-toast' });
      
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data', { id: 'export-toast' });
    } finally {
      setIsExporting(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

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
    <div className="h-screen h-[100dvh] w-full relative bg-[#F8FAFC] font-montserrat overflow-hidden flex flex-col">
      <AntiGravityBackground />

      {/* Header */}
      <div className="shrink-0 w-full z-50 relative">
        <DashboardNavbar
          user={user}
          onLogout={handleLogout}
          onSettings={() => navigate('/settings')}
        />
      </div>

      {/* Content — scrollable main area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 scrollbar-custom">
        <div className="flex flex-col px-4 md:px-8 max-w-7xl mx-auto w-full py-6 min-h-full space-y-6">
          <div>
            <StatsGrid stats={stats} />
          </div>

          <div className="sticky top-0 z-30 pt-2 pb-4 bg-[#F8FAFC] -mt-2">
            <DashboardFilters
              searchTerm={searchInput}
              setSearchTerm={setSearchInput}
              isFilterOpen={isFilterOpen}
              setIsFilterOpen={setIsFilterOpen}
              onRefresh={handleRefresh}
              filters={filters}
              setFilters={setFilters}
              uniqueValues={uniqueValues}
            />
          </div>

          <div className="flex flex-col bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-2xl overflow-hidden sticky top-[90px] h-[calc(100dvh-250px)]">
            <div className="shrink-0 p-5 md:p-6 border-b border-slate-100 bg-white/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-base uppercase tracking-tight leading-none">Waiver Submissions</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Total Records: {totalCount}</p>
                </div>
              </div>
              <button
                onClick={exportToExcel}
                disabled={isExporting || totalCount === 0}
                className="flex items-center gap-2 bg-green-500/10 text-green-600 border border-green-500/20 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <div className="w-3.5 h-3.5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Download size={14} />
                )}
                <span className="hidden sm:inline">Export Excel</span>
              </button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block flex-1 min-h-0 overflow-auto px-4 md:px-6 scrollbar-custom">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-[#F8FAFC] border-b border-slate-200">
                    <th className="px-4 py-3 text-left">Participant</th>
                    <th className="px-4 py-3 text-left">Mobile</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Gender</th>
                    <th className="px-4 py-3 text-left">DOB</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-center">Sign</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="py-20 text-center">
                        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading records...</p>
                      </td>
                    </tr>
                  ) : submissions.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                        No results found
                      </td>
                    </tr>
                  ) : (
                    submissions.map((item, idx) => (
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
            <div className="lg:hidden flex-1 min-h-0 overflow-y-auto px-4 md:px-6 space-y-4 scrollbar-custom">
              {loading ? (
                 <div className="py-20 text-center">
                   <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                 </div>
              ) : submissions.length === 0 ? (
                 <div className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                   No results found
                 </div>
              ) : (
                submissions.map((item, idx) => (
                  <SubmissionCard
                    key={item.id}
                    item={item}
                    idx={idx}
                    onDownload={downloadWaiver}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            {!loading && totalCount > 0 && (
              <div className="shrink-0 flex items-center justify-between gap-4 px-4 md:px-6 py-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-black text-slate-600 outline-none focus:border-[#FF1493] transition-all"
                  >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {(currentPage - 1) * itemsPerPage + 1}
                    {'–'}
                    {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:border-[#FF1493] hover:text-[#FF1493] transition-all disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-500 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <p className="text-[11px] font-black text-slate-600 min-w-[3rem] text-center">
                    {currentPage}/{totalPages}
                  </p>
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:border-[#FF1493] hover:text-[#FF1493] transition-all disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-500 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="shrink-0 w-full z-50 relative bg-white/95 backdrop-blur-md border-t border-slate-100 py-5 px-4 flex justify-center items-center pb-[calc(env(safe-area-inset-bottom)+12px)] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)]">
        <a
          href="https://botivate.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity"
        >
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            Powered by <span className="text-[#FF1493]">Botivate</span>
          </p>
        </a>
      </footer>

      <style jsx="true">{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');

        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }

        /* Custom Scrollbar */
        .scrollbar-custom {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 20, 147, 0.45) rgba(148, 163, 184, 0.12);
        }
        .scrollbar-custom::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .scrollbar-custom::-webkit-scrollbar-track {
          background: rgba(148, 163, 184, 0.12);
          border-radius: 10px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: rgba(255, 20, 147, 0.45);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 20, 147, 0.7);
          background-clip: padding-box;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
