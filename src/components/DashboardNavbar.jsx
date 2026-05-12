import React from 'react';
import { motion } from 'framer-motion';
import { FileText, LogOut, Settings } from 'lucide-react';

const DashboardNavbar = ({ user, onLogout, onSettings }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/40 px-4 md:px-8 py-3 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-3">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-10 h-10 bg-gradient-to-tr from-[#FF1493] to-[#FF69B4] rounded-xl flex items-center justify-center shadow-lg shadow-pink-200"
        >
          <FileText className="text-white" size={20} />
        </motion.div>
        <div>
          <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight leading-none">
            REBOUNCE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF1493] to-[#00B0FF]">DASHBOARD</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 hidden md:block">Admin Management Portal</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden sm:block text-right mr-2 border-r border-slate-100 pr-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Administrator</p>
          <p className="text-sm font-bold text-slate-800">{user?.full_name}</p>
        </div>
        
        <button 
          onClick={onSettings}
          className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-[#FF1493] hover:border-[#FF1493]/30 rounded-xl transition-all shadow-sm active:scale-95"
          title="Settings"
        >
          <Settings size={20} />
        </button>

        <button 
          onClick={onLogout}
          className="group flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-red-500 text-white rounded-xl transition-all duration-300 shadow-md active:scale-95 ml-1"
        >
          <span className="hidden md:inline text-xs font-bold uppercase tracking-wider">Logout</span>
          <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
