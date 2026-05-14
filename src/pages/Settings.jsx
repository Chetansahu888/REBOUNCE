import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, UserPlus, Shield, User, 
  Trash2, Key, Save, Search, Filter 
} from 'lucide-react';
import { supabase } from '../supabase';
import toast from 'react-hot-toast';
import AntiGravityBackground from '../components/AntiGravityBackground';
import DashboardNavbar from '../components/DashboardNavbar';
import BotivateFooter from '../components/BotivateFooter';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('manage'); // Default to manage for full page
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    password: '',
    isAdmin: false
  });

  useEffect(() => {
    const loggedUser = sessionStorage.getItem('user');
    if (!loggedUser) {
      navigate('/login');
      return;
    }
    setCurrentUser(JSON.parse(loggedUser));
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .not('user_name', 'is', null)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.userName || !formData.password) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('submissions')
        .insert([{
          full_name: formData.fullName,
          user_name: formData.userName,
          password: formData.password,
          is_admin: formData.isAdmin,
          mobile: '0000000000',
          submitted_at: new Date().toISOString()
        }]);

      if (error) {
        if (error.code === '23505') throw new Error('Username already exists');
        throw error;
      }

      toast.success('User created successfully!');
      setFormData({ fullName: '', userName: '', password: '', isAdmin: false });
      fetchUsers();
      setActiveTab('manage');
    } catch (err) {
      toast.error(err.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const { error } = await supabase
        .from('submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen h-[100dvh] w-full relative bg-[#F8FAFC] font-montserrat overflow-hidden">
      <AntiGravityBackground />
      
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full z-50">
        <DashboardNavbar 
          user={currentUser} 
          onLogout={handleLogout} 
          onSettings={() => navigate('/settings')} 
        />
      </div>

      {/* Scrollable Content */}
      <main className="h-full pt-20 pb-28 px-4 md:px-8 max-w-6xl mx-auto w-full overflow-y-auto scrollbar-custom relative z-10">
        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-[#FF1493] hover:border-[#FF1493]/30 rounded-2xl transition-all shadow-sm active:scale-95"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                Account <span className="text-[#FF1493]">Settings</span>
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Administrator Control Panel</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 pb-10">
          {/* Left Column: Management List */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
              <div className="p-6 border-b border-slate-100 bg-white/40 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                    <Shield size={16} />
                  </div>
                  <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Active Accounts ({users.length})</span>
                </div>
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users..."
                    className="w-full bg-white/60 border border-slate-100 rounded-xl pl-9 pr-4 py-2 text-[11px] font-bold outline-none focus:border-[#FF1493]/30 focus:ring-4 focus:ring-[#FF1493]/5 transition-all"
                  />
                </div>
              </div>

              <div className="p-6 space-y-4">
                {loading ? (
                  <div className="py-20 text-center">
                    <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fetching Accounts...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                    No matching accounts found
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {filteredUsers.map((u) => (
                      <motion.div 
                        key={u.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group bg-white/60 hover:bg-white border border-white p-4 rounded-[1.5rem] hover:shadow-xl hover:shadow-slate-100 transition-all flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${u.is_admin ? 'bg-pink-50 text-[#FF1493]' : 'bg-blue-50 text-blue-500'}`}>
                            {u.is_admin ? <Shield size={24} /> : <User size={24} />}
                          </div>
                          <div>
                            <h4 className="font-black text-slate-800 text-sm">{u.full_name}</h4>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">@{u.user_name}</span>
                              <div className="h-1 w-1 rounded-full bg-slate-200" />
                              <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${u.is_admin ? 'bg-pink-100 text-pink-600' : 'bg-slate-100 text-slate-500'}`}>
                                {u.is_admin ? 'Admin' : 'User'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter mr-2 hidden md:block">
                            Joined {new Date(u.submitted_at).toLocaleDateString()}
                          </p>
                          <button 
                            onClick={() => deleteUser(u.id)}
                            className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Creation Form */}
          <div className="lg:col-span-4 order-1 lg:order-2">
            <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/80 shadow-2xl p-8 sticky top-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#FF1493] flex items-center justify-center text-white shadow-lg shadow-pink-100">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight leading-none">New Account</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Register access credentials</p>
                </div>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full bg-white border border-slate-100 rounded-xl px-11 py-3 text-[11px] font-bold outline-none focus:border-[#FF1493] focus:ring-4 focus:ring-[#FF1493]/5 transition-all text-slate-700"
                      placeholder="Ex: John Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Username</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text"
                      value={formData.userName}
                      onChange={(e) => setFormData({...formData, userName: e.target.value})}
                      className="w-full bg-white border border-slate-100 rounded-xl px-11 py-3 text-[11px] font-bold outline-none focus:border-[#FF1493] focus:ring-4 focus:ring-[#FF1493]/5 transition-all text-slate-700"
                      placeholder="johndoe123"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Password</label>
                  <div className="relative">
                    <Save className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-white border border-slate-100 rounded-xl px-11 py-3 text-[11px] font-bold outline-none focus:border-[#FF1493] focus:ring-4 focus:ring-[#FF1493]/5 transition-all text-slate-700"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/80 rounded-2xl border border-slate-50">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, isAdmin: !formData.isAdmin})}
                    className={`w-10 h-5 rounded-full transition-colors relative ${formData.isAdmin ? 'bg-[#FF1493]' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${formData.isAdmin ? 'left-5.5' : 'left-0.5'}`} />
                  </button>
                  <div>
                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Admin Access</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Can access this dashboard</p>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 text-white font-black py-4 rounded-xl shadow-lg shadow-slate-100 hover:bg-[#FF1493] hover:shadow-[#FF1493]/20 transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-2 mt-4 text-[11px]"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <UserPlus size={16} />
                      Save Account
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-t border-slate-100 py-5 px-4 flex justify-center items-center pb-[calc(env(safe-area-inset-bottom)+12px)] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)]">
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
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
        .scrollbar-custom::-webkit-scrollbar { width: 6px; }
        .scrollbar-custom::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-custom::-webkit-scrollbar-thumb { background: rgba(255, 20, 147, 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Settings;
