import React from 'react';
import { motion } from 'framer-motion';

const BotivateFooter = ({ variant = 'fixed' }) => {
  if (variant === 'simple') {
    return (
      <div className="mt-4 md:mt-8 text-center animate-bounce-in opacity-50">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
          Powered by <span className="text-[#FF1493] font-black">Botivate</span>
        </p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 left-0 w-full z-30 flex justify-center pointer-events-none">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-slate-900/90 backdrop-blur-md px-6 py-2.5 rounded-full shadow-2xl border border-white/10 pointer-events-auto"
      >
        <div className="flex items-center gap-4">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em]">Powered by</p>
          <a 
            href="https://botivate.in/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 group"
          >
            <div className="w-5 h-5 bg-[#FF1493] rounded-md flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-[10px] font-black text-white">B</span>
            </div>
            <span className="text-xs font-black text-white tracking-tighter uppercase">Botivate</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default BotivateFooter;
