import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Calendar, Download, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';

export const SubmissionRow = ({ item, idx, onDownload }) => {
  return (
    <motion.tr 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.02 }}
      className="group hover:bg-white/60 transition-colors"
    >
      <td className="px-8 py-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
            {item.full_name?.charAt(0)}
          </div>
          <div>
            <p className="font-black text-slate-900 text-sm leading-tight">{item.full_name}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2 text-slate-700">
          <Phone size={12} className="text-blue-500" />
          <span className="text-[11px] font-bold">{item.mobile}</span>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2 text-slate-500">
          <Mail size={12} className="text-pink-500" />
          <span className="text-[11px] font-medium truncate max-w-[150px]">{item.email || 'No Email'}</span>
        </div>
      </td>
      <td className="px-6 py-5">
        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] ${
          item.gender === 'Male' ? 'bg-blue-100 text-blue-600' : 
          item.gender === 'Female' ? 'bg-pink-100 text-pink-600' : 
          'bg-slate-100 text-slate-500'
        }`}>
          {item.gender || 'N/A'}
        </span>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2 text-slate-600 font-bold text-[11px]">
          <Calendar size={12} className="text-slate-400" />
          {item.dob ? format(new Date(item.dob), 'MMM d, yyyy') : 'N/A'}
        </div>
      </td>
      <td className="px-6 py-5">
        <p className="text-[11px] font-black text-slate-800">{format(new Date(item.submitted_at), 'dd/MM/yyyy')}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{format(new Date(item.submitted_at), 'HH:mm a')}</p>
      </td>
      <td className="px-8 py-5 text-right">
        <div className="flex items-center justify-end gap-4 transition-opacity">
          {item.signature && (
            <div className="flex flex-col items-center">
              <img 
                src={item.signature} 
                alt="Signature" 
                className="h-10 w-20 object-contain bg-slate-50 rounded-lg p-1 border border-slate-100"
              />
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter mt-1">Verified Sign</span>
            </div>
          )}
          {item.pdf_url && (
            <button 
              onClick={() => onDownload(item.pdf_url, item.full_name)}
              className="p-2.5 bg-white border border-slate-200 text-pink-500 rounded-xl hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-all shadow-sm"
              title="Download PDF"
            >
              <Download size={16} />
            </button>
          )}
        </div>
      </td>
    </motion.tr>
  );
};

export const SubmissionCard = ({ item, idx, onDownload }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="bg-white rounded-2xl p-4 border border-white shadow-sm"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-black text-xs">
            {item.full_name?.charAt(0)}
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-xs">{item.full_name}</h4>
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">{format(new Date(item.submitted_at), 'dd MMM yyyy • HH:mm')}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`px-1.5 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest ${
            item.gender === 'Male' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'
          }`}>
            {item.gender}
          </span>
          {item.signature && (
            <img 
              src={item.signature} 
              alt="Sign" 
              className="h-6 w-12 object-contain bg-slate-50 rounded p-0.5 border border-slate-100"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="space-y-0.5">
          <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Contact</p>
          <p className="text-[10px] font-bold text-slate-700 flex items-center gap-1">
            <Phone size={8} className="text-blue-400" /> {item.mobile}
          </p>
        </div>
        <div className="space-y-0.5">
          <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Email</p>
          <p className="text-[10px] font-bold text-slate-700 truncate flex items-center gap-1">
            <Mail size={8} className="text-pink-400" /> {item.email || 'N/A'}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {item.pdf_url && (
          <button 
            onClick={() => onDownload(item.pdf_url, item.full_name)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-pink-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-pink-100 active:scale-95 transition-all"
          >
            <Download size={12} />
            Download
          </button>
        )}
      </div>
    </motion.div>
  );
};
