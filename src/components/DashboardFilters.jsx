import React from 'react';
import { Search, Filter, RotateCcw, FilterX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardFilters = ({ 
  searchTerm, setSearchTerm, 
  isFilterOpen, setIsFilterOpen, 
  onRefresh, 
  filters, setFilters,
  uniqueValues
}) => {
  return (
    <div className="w-full mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search by name, mobile or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:ring-2 focus:ring-pink-200 transition-all outline-none"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border transition-all font-bold text-xs uppercase tracking-widest ${isFilterOpen ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-white'}`}
          >
            <Filter size={18} />
            Filters
          </button>
          <button 
            onClick={onRefresh}
            className="p-4 bg-white text-[#FF1493] rounded-2xl border border-white hover:bg-pink-50 transition-all active:scale-95"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/60 shadow-inner grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Name Filter</p>
                <select 
                  value={filters.name}
                  onChange={(e) => setFilters({...filters, name: e.target.value})}
                  className="w-full bg-white/60 border border-white/80 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none"
                >
                  <option value="ALL">ALL NAMES</option>
                  {uniqueValues.names.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Mobile Filter</p>
                <select 
                  value={filters.mobile}
                  onChange={(e) => setFilters({...filters, mobile: e.target.value})}
                  className="w-full bg-white/60 border border-white/80 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none"
                >
                  <option value="ALL">ALL MOBILES</option>
                  {uniqueValues.mobiles.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Filter</p>
                <select 
                  value={filters.email}
                  onChange={(e) => setFilters({...filters, email: e.target.value})}
                  className="w-full bg-white/60 border border-white/80 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none"
                >
                  <option value="ALL">ALL EMAILS</option>
                  {uniqueValues.emails.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Sort Date</p>
                  <select 
                    value={filters.dateSort}
                    onChange={(e) => setFilters({...filters, dateSort: e.target.value})}
                    className="w-full bg-white/60 border border-white/80 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none"
                  >
                    <option value="newest">NEWEST FIRST</option>
                    <option value="oldest">OLDEST FIRST</option>
                  </select>
                </div>
                <button 
                  onClick={() => {
                    setFilters({
                      name: 'ALL',
                      mobile: 'ALL',
                      email: 'ALL',
                      gender: 'ALL',
                      dateSort: 'newest'
                    });
                    setSearchTerm('');
                  }}
                  className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                  title="Clear All"
                >
                  <FilterX size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardFilters;
