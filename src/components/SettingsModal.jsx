import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Shield, User, Trash2, Key, Save } from 'lucide-react';
import { supabase } from '../supabase';
import toast from 'react-hot-toast';

const SettingsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'manage'
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    password: '',
    isAdmin: false
  });

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('id, full_name, user_name, is_admin, submitted_at')
        .not('user_name', 'is', null)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Fetch users error:', err);
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
          mobile: '0000000000', // Default mobile for admin accounts
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                  Account <span className="text-[#FF1493]">Settings</span>
                </h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage Admins & Users</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex px-8 border-b border-slate-100">
              <button 
                onClick={() => setActiveTab('create')}
                className={`py-4 px-6 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'create' ? 'border-[#FF1493] text-[#FF1493]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Create User
              </button>
              <button 
                onClick={() => setActiveTab('manage')}
                className={`py-4 px-6 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'manage' ? 'border-[#FF1493] text-[#FF1493]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Manage Accounts
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 scrollbar-custom">
              {activeTab === 'create' ? (
                <form onSubmit={handleCreateUser} className="space-y-6 max-w-md mx-auto">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-12 py-3.5 outline-none focus:border-[#FF1493] focus:ring-4 focus:ring-[#FF1493]/10 transition-all font-bold text-slate-700"
                        placeholder="Ex: John Doe"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Username</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text"
                        value={formData.userName}
                        onChange={(e) => setFormData({...formData, userName: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-12 py-3.5 outline-none focus:border-[#FF1493] focus:ring-4 focus:ring-[#FF1493]/10 transition-all font-bold text-slate-700"
                        placeholder="johndoe123"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Password</label>
                    <div className="relative">
                      <Save className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-12 py-3.5 outline-none focus:border-[#FF1493] focus:ring-4 focus:ring-[#FF1493]/10 transition-all font-bold text-slate-700"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, isAdmin: !formData.isAdmin})}
                      className={`w-12 h-6 rounded-full transition-colors relative ${formData.isAdmin ? 'bg-[#FF1493]' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.isAdmin ? 'left-7' : 'left-1'}`} />
                    </button>
                    <div>
                      <p className="text-xs font-black text-slate-700 uppercase tracking-wider">Admin Privileges</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Grant access to this dashboard</p>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-200 hover:bg-[#FF1493] hover:shadow-[#FF1493]/30 transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <UserPlus size={20} />
                        Create Account
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  {users.length === 0 ? (
                    <div className="text-center py-20">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No accounts found</p>
                    </div>
                  ) : (
                    users.map((u) => (
                      <div key={u.id} className="group bg-white border border-slate-100 p-4 rounded-2xl hover:border-[#FF1493]/30 hover:shadow-lg hover:shadow-slate-100 transition-all flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${u.is_admin ? 'bg-pink-50 text-[#FF1493]' : 'bg-blue-50 text-blue-500'}`}>
                            {u.is_admin ? <Shield size={20} /> : <User size={20} />}
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-800">{u.full_name}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">@{u.user_name}</span>
                              <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${u.is_admin ? 'bg-pink-100 text-pink-600' : 'bg-slate-100 text-slate-500'}`}>
                                {u.is_admin ? 'Admin' : 'User'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => deleteUser(u.id)}
                          className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
