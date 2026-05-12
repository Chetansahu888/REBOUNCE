import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import AntiGravityBackground from '../components/AntiGravityBackground';
import { supabase } from '../supabase';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .maybeSingle();

   
      
      if (error || !data) {
        throw new Error('Invalid email or password');
      }

      // Store user info in sessionStorage (disappears when tab is closed)
      sessionStorage.setItem('user', JSON.stringify(data));

      toast.success(`Welcome back, ${data.full_name}!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Error signing in');
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full box-border text-left bg-white/40 border border-white/60 rounded-2xl px-12 py-3 outline-none focus:border-[#FF1493] focus:ring-2 focus:ring-[#FF1493]/20 transition-all text-slate-800 placeholder:text-slate-400 backdrop-blur-md shadow-inner text-base md:text-sm";
  const labelStyles = "block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase tracking-wider";

  return (
    <div className="h-full w-full flex items-center justify-center p-4 relative overflow-hidden">
      <AntiGravityBackground />

      <div className="w-full max-w-md relative z-10 animate-bounce-in flex flex-col justify-center max-h-full py-4">
        <div className="glass-card w-full box-border rounded-[2rem] md:rounded-[2.5rem] p-8 flex flex-col relative overflow-y-auto overflow-x-hidden max-h-[85vh] scrollbar-hide">

          <button
            onClick={() => navigate('/')}
            className="absolute top-6 left-6 p-2 rounded-full hover:bg-white/40 transition-colors text-slate-600"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="mt-6 mb-8 text-center">
            <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight uppercase">
              Welcome <span className="text-[#FF1493]">Back</span>
            </h2>
            <p className="text-slate-500 font-medium">Log in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <label className={labelStyles}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF1493]" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputStyles}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="relative">
              <label className={labelStyles}>Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00B0FF]" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputStyles}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(255,20,147,0.3)' }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF1493] text-white font-black py-4 rounded-2xl shadow-lg transition-all uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-xs tracking-widest uppercase">
              Powered by <span className="text-[#FF1493] font-black">Botivate</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
