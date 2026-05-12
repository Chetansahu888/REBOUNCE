import React from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, User } from 'lucide-react';

const StatsGrid = ({ stats }) => {
  const statItems = [
    { label: 'Total Waivers', value: stats.total, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Today', value: stats.today, icon: Clock, color: 'text-pink-500', bg: 'bg-pink-50' },
    { label: 'Male', value: stats.male, icon: User, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Female', value: stats.female, icon: User, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
    >
      {statItems.map((stat, idx) => (
        <div key={idx} className="bg-white/60 backdrop-blur-md p-3 md:p-4 rounded-2xl md:rounded-3xl border border-white/80 shadow-sm hover:shadow-md transition-shadow">
          <div className={`w-8 h-8 md:w-10 md:h-10 ${stat.bg} ${stat.color} rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-3`}>
            <stat.icon size={16} className="md:w-5 md:h-5" />
          </div>
          <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
          <h4 className="text-xl md:text-2xl font-black text-slate-800 leading-none">{stat.value}</h4>
        </div>
      ))}
    </motion.div>
  );
};

export default StatsGrid;
